import random


def payment_evaluation(inputFile, dict):
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

    return inputFile