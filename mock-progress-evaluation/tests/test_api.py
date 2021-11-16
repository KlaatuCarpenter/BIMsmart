import pytest
import resources.api

CID_scheduleOfValues = "bafybeicnte25pfv73l2eqmbmpfod3s4fll3gmjq7stungyv7755i6uddsm"
CID_listOfElementsAndGUIDs = "CID_listOfElementsAndGUIDs"

def api_setup_initial(test_data):
    a = resources.api.Initial(test_data)
    return a.result

def api_setup_update(test_data):
    a = resources.api.Update(test_data)
    return a.result

@pytest.mark.parametrize('test_data', [
    {
    "paymentID": 0,
    "CID_scheduleOfValues": CID_scheduleOfValues,
    "CID_listOfElementsAndGUIDs": CID_listOfElementsAndGUIDs,
    "CID_asBuiltBIM": "",
    "CID_rawProgressData": "",
    "CID_previousPaymentProgress": ""
    }
])
def test_request_create_initial_docs_success(test_data):
    """ Request for create initial payment progress"""
    pass


""" TODO """