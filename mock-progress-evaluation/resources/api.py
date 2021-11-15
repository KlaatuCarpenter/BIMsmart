from openpyxl import load_workbook
import random
import pandas as pd
import requests
import common.util
import os
from resources.progress_evaluation import payment_evaluation

# # structure of response
# resource_fields = {
#     'paymentID': fields.Integer,
#     'CID_listOfElementsAndGUIDs': fields.String,
#     'CID_asBuiltBIM': fields.String,
#     'CID_scheduleOfValues': fields.String,
#     'CID_rawProgressData': fields.String,
#     'CID_solutionUsedForProgressEvaluation': fields.String,
#     'value': fields.Integer,
#     'CID_previousPaymentProgress': fields.String    
# }

# base url for Fleek's IPFS Gateway
base_url = 'https://ipfs.fleek.co/ipfs/'
dict = {
    'previous': 'Previous settlement period',
    'current': 'Current settlement period',
    'total': 'Total progress',
    'count_str': 'Count',
    'value_str': 'Value'    
}


class Initial:
 
    # @dev this should be proceeded if its the first payment
    # FIRST PAYMENT
    # This code adds additional columns nedded to proceed further transactions
    def __init__(self, input):
        self.request_data = input.get('data')
        self.id = self.request_data['paymentID']
        if self.validate_request_data():
            self.create_initial_docs()
        else:
            self.result_error('No data provided')

    def validate_request_data(self):
        if self.request_data is None:
            return False
        if self.request_data == {}:
            return False
        return True

    def create_initial_docs(self):
        req = requests.get(f"{base_url}{self.request_data['CID_scheduleOfValues']}")
        with open('schedule.xlsx', 'wb') as f:
            f.write(req.content)
        scheduleOfValues = load_workbook('schedule.xlsx', data_only=True)['Summary']
        os.remove('schedule.xlsx')

        if len(scheduleOfValues.tables.items()) > 1:
            self.result_error('Error during importing the schedule of value table. More than one table in worksheet.')
        
        data_boundary = scheduleOfValues.tables.items()[0][1]
        data = scheduleOfValues[data_boundary]
        # extract the data 
        # the inner list comprehension gets the values for each cell in the table
        content = [[cell.value for cell in ent] 
                for ent in data
            ]
            
        header = content[0]
        indexes = []
        for item in content:
            indexes.append(item[0])
            # to avoid redundancy in index and content:
            item.pop(0)
        # remove index which is in header
        indexes.pop(0)
        
        # the contents ... excluding the header            
        rest = content[1:]
        
        # create dataframe with the column names
        # and pair table name with dataframe
        schedule = pd.DataFrame(rest, columns = pd.MultiIndex.from_product( [['Contract'], header]), index = indexes)

        # crate table to measure progress in settlement period
        initialValues = []
        for i in range(len(indexes)):
            initialValues.append([0,0,0,0,0,0])
        
        aboveHeader = [[dict['previous'], dict['current'], dict['total']], [dict['count_str'], dict['value_str']] ]

        progress = pd.DataFrame(initialValues, columns = pd.MultiIndex.from_product(aboveHeader), index = indexes)

        paymentTable = pd.concat([schedule, progress], axis=1)

        # write to file 
        payment_progress_filename = f"{self.request_data['paymentID']}_payment_progress.xlsx"
        paymentTable.to_excel(payment_progress_filename)

        try:
            res = common.util.save_file_in_ipfs(payment_progress_filename, payment_progress_filename)
            self.result_success(res)
            os.remove(payment_progress_filename)
        except Exception as e:
            self.result_error(e)
            os.remove(payment_progress_filename)

        # upload to ipfs this file

    def result_success(self, data):
        self.result = {
            'paymentID': self.id,
            'CID_listOfElementsAndGUIDs': self.request_data['CID_listOfElementsAndGUIDs'],
            'CID_asBuiltBIM': '',
            'CID_scheduleOfValues': self.request_data['CID_scheduleOfValues'],
            'CID_rawProgressData': '',
            'CID_solutionUsedForProgressEvaluation': '',
            'value': 0,
            'CID_previousPaymentProgress': '',
            'statusCode': 200,
        }

    def result_error(self, error):
        self.result = {
            'jobRunID': self.id,
            'status': 'errored',
            'error': f'There was an error: {error}',
            'statusCode': 500,
        }
        
class Update:
    
    def __init__(self, input):
        self.request_data = input.get('data')
        self.id = self.request_data['paymentID']
        if self.validate_request_data():
            self.evaluate_progress_payment()
        else:
            self.result_error('No data provided')

    def validate_request_data(self):
        if self.request_data is None:
            return False
        if self.request_data == {}:
            return False
        return True

    def evaluate_progress_payment(self):
        req = requests.get(f"{base_url}{self.request_data['CID_previousPaymentProgress']}")
        with open('scheduleprogress.xlsx', 'wb') as f:
            f.write(req.content)
        # Proceess payment evaluation
        inputFile = pd.read_excel('scheduleprogress.xlsx', header = [0, 1], index_col = 0)
        

        # paymentEvaluation = payment_evaluation(paymentProgress, dict)
        
        # # calculate total progress value
        # currentProgressValue = paymentEvaluation[(dict['current'], dict['value_str'])].sum()
        # totalProgressValue = paymentEvaluation[(dict['current'], dict['value_str'])].sum()
        os.remove('scheduleprogress.xlsx')

        
        for item in inputFile.index:
            # put previous total progress from last payment to previous settlement period
            inputFile.loc[item,(dict['previous'], dict['count_str'])] = inputFile.loc[item,(dict['total'], dict['count_str'])]
            inputFile.loc[item,(dict['previous'], dict['value_str'])] = inputFile.loc[item,(dict['total'], dict['value_str'])]

            # for the example a complicated computations with AI and on site captured data is just random ...
            toDo = inputFile.loc[item,('Contract', dict['count_str'])] - inputFile.loc[item,(dict['previous'], dict['count_str'])]
            inputFile.loc[item,(dict['current'], dict['count_str'])] = random.randrange(toDo)
            inputFile.loc[item,(dict['current'], dict['value_str'])] = inputFile.loc[item,(dict['current'], dict['count_str'])] * inputFile.loc[item,('Contract', 'Unit price')]

            # calculate total progress
            inputFile.loc[item,(dict['total'], dict['count_str'])] = inputFile.loc[item,(dict['current'], dict['count_str'])] + inputFile.loc[item,(dict['previous'], dict['count_str'])]
            inputFile.loc[item,(dict['total'], dict['value_str'])] = inputFile.loc[item,(dict['current'], dict['value_str'])] + inputFile.loc[item,(dict['previous'], dict['value_str'])]


        # calculate total progress value
        self.currentProgressValue = int(inputFile[(dict['current'], dict['value_str'])].sum())
        totalProgressValue = inputFile[(dict['total'], dict['value_str'])].sum()
        
        # write to file 
        payment_progress_filename = f"{self.request_data['paymentID']}_payment_progress.xlsx"
        inputFile.to_excel(payment_progress_filename)

        # # check CID of solution used for progress evaluation

        try:
            res = common.util.save_file_in_ipfs(payment_progress_filename, payment_progress_filename)
            res_solution = common.util.save_file_in_ipfs('progress_evaluation.py', 'resources/progress_evaluation.py')
            self.result_success(res['ResponseMetadata']['HTTPHeaders']['x-fleek-ipfs-hash'], self.currentProgressValue, res_solution['ResponseMetadata']['HTTPHeaders']['x-fleek-ipfs-hash'])
            os.remove(payment_progress_filename)
        except Exception as e:
            self.result_error(e)
            os.remove(payment_progress_filename)

        


    def result_success(self, hash_payment, currentProgressValue, hash_solution):
        self.result = {
            'paymentID': self.id,
            'CID_listOfElementsAndGUIDs': self.request_data['CID_listOfElementsAndGUIDs'],
            'CID_asBuiltBIM': hash_payment,
            'CID_scheduleOfValues': self.request_data['CID_scheduleOfValues'],
            'CID_rawProgressData': self.request_data['CID_rawProgressData'],
            'CID_solutionUsedForProgressEvaluation': hash_solution,
            'value': currentProgressValue,
            'CID_currentPaymentProgress': hash_payment,
            'statusCode': 200
        }

    def result_error(self, error):
        self.result = {
            'paymentID': self.id,
            'status': 'errored',
            'error': f'There was an error: {error}',
            'statusCode': 500,
        }








    
     

