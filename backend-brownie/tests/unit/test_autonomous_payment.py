import brownie
import pytest

contractValue = 1000000000000000000

@pytest.fixture
def test_deploy_autonomous_payment(AutonomousPayment, accounts):
    return accounts[0].deploy(AutonomousPayment, "Panorama", "PAN", accounts[1])

@pytest.fixture
def test_deploy_autonomous_payment_with_initial_data(test_deploy_autonomous_payment):
    smartContract = test_deploy_autonomous_payment
    depositTransaction = smartContract.deposit(
        { 
            "from": smartContract.owner(), 
            "value": contractValue
        })
    depositTransaction.wait(1)
    provideData = smartContract.provideInitialData(
        "CID_listOfElementsAndGUIDs",
        "CID_scheduleOfValues", 
        "CID_solutionUsedForProgressEvaluation",
        { "from": smartContract.owner() })
    provideData.wait(1)
    return smartContract

@pytest.fixture
def test_deploy_autonomous_payment_confirmed(test_deploy_autonomous_payment_with_initial_data, accounts):
    smartContract = test_deploy_autonomous_payment_with_initial_data
    confirm = smartContract.confirmContract({"from": accounts[1]})
    confirm.wait(1)
    return smartContract



def test_deposit(test_deploy_autonomous_payment): 
    """ Testing if deposit function is working """
    smartContract = test_deploy_autonomous_payment
    expected = 100000000000000000
    depositTransaction = smartContract.deposit(
        { 
            "from": smartContract.owner(), 
            "value": expected 
        })
    depositTransaction.wait(1)
    contract_balance = smartContract.getContractBalance()
    assert contract_balance == expected

def test_providing_initial_data_to_contract(test_deploy_autonomous_payment):
    """ Providing initial data to the contract """
    smartContract = test_deploy_autonomous_payment
    provideData = smartContract.provideInitialData(
        "CID_listOfElementsAndGUIDs",
        "CID_scheduleOfValues", 
        "CID_solutionUsedForProgressEvaluation",
        { "from": smartContract.owner() })
    provideData.wait(1)
    initialData = smartContract.getPaymentInfo(0)

    assert initialData[0] == "CID_listOfElementsAndGUIDs"
    assert initialData[1] == ""
    assert initialData[2] == "CID_scheduleOfValues"
    assert initialData[3] == ""
    assert initialData[4] == "CID_solutionUsedForProgressEvaluation"
    assert initialData[5] == 0
    assert smartContract.state() == 1

def test_confirm_contract(test_deploy_autonomous_payment_with_initial_data, accounts):
    """ Confirm contract by the subcontractor """
    smartContract = test_deploy_autonomous_payment_with_initial_data
    confirm = smartContract.confirmContract({"from": accounts[1]})
    confirm.wait(1)
    
    assert smartContract.state() == 2

def test_unauthorized_confirm_contract(test_deploy_autonomous_payment_with_initial_data):
    """ Confirm contract by unauthorized """
    smartContract = test_deploy_autonomous_payment_with_initial_data
    with brownie.reverts():
        smartContract.confirmContract({"from": smartContract.owner()})
    
    assert smartContract.state() != 2

def test_confirm_contract_in_state_created(test_deploy_autonomous_payment, accounts):
    """ Try to confirm contract without initial data """
    smartContract = test_deploy_autonomous_payment
    with brownie.reverts():
        smartContract.confirmContract({"from": accounts[1]})
    
    assert smartContract.state() != 2

def test_abort(test_deploy_autonomous_payment_with_initial_data):
    """ Try to abort contract by the owner before confirming """
    smartContract = test_deploy_autonomous_payment_with_initial_data
    abort = smartContract.abort({"from": smartContract.owner()})
    abort.wait(1)

    assert smartContract.state() == 3
    assert smartContract.getContractBalance() == 0

def test_abort_in_state_confirmed(test_deploy_autonomous_payment_with_initial_data, accounts):
    """ Try to abort after the contract is confirmed by subcontractor """
    smartContract = test_deploy_autonomous_payment_with_initial_data
    confirm = smartContract.confirmContract({"from": accounts[1]})
    confirm.wait(1)
    with brownie.reverts():
        abort = smartContract.abort({"from": smartContract.owner()})

    assert smartContract.state() == 2
    assert smartContract.getContractBalance() == contractValue

def test_receive_update(test_deploy_autonomous_payment_confirmed):
    """ 
        Testing receiving update and processing new payment
        Issue Lien Token needs more testing
    """
    smartContract = test_deploy_autonomous_payment_confirmed
    expectedValue = 10000000000000000
    update = smartContract.receiveUpdate(
        "CID_listOfElementsAndGUIDs",
        "CID_asBuiltBIM",
        "CID_scheduleOfValues",
        "CID_rawProgressData",
        "CID_solutionUsedForProgressEvaluation",
        expectedValue,
        { "from": smartContract.owner() }
    )
    update.wait(1)
    paymentData = smartContract.getPaymentInfo(1)

    assert paymentData[0] == "CID_listOfElementsAndGUIDs"
    assert paymentData[1] == "CID_asBuiltBIM"
    assert paymentData[2] == "CID_scheduleOfValues"
    assert paymentData[3] == "CID_rawProgressData"
    assert paymentData[4] == "CID_solutionUsedForProgressEvaluation"
    assert paymentData[5] == expectedValue
    assert paymentData[6] == True
    assert smartContract.state() == 2
    assert smartContract.getContractBalance() == contractValue - paymentData[5]
    

def test_receive_update_if_input_data_validation_fails(test_deploy_autonomous_payment_confirmed):
    """ Test a try to update and trigger payment with wrong data """
    smartContract = test_deploy_autonomous_payment_confirmed
    expectedValue = 10000000000000000
    with brownie.reverts():
        update = smartContract.receiveUpdate(
        "foo",
        "CID_asBuiltBIM",
        "CID_scheduleOfValues",
        "CID_rawProgressData",
        "CID_solutionUsedForProgressEvaluation",
        expectedValue,
        { "from": smartContract.owner() }
        )
    paymentData = smartContract.getPaymentInfo(1)

    assert paymentData[0] == ""
    assert paymentData[1] == ""
    assert paymentData[2] == ""
    assert paymentData[3] == ""
    assert paymentData[4] == ""
    assert paymentData[5] == 0
    assert paymentData[6] == False
    assert smartContract.state() == 2
    assert smartContract.getContractBalance() == contractValue

def test_issue_lien_token_if_contract_balance_is_insufficient(test_deploy_autonomous_payment_confirmed):
    """ Testing receiving update and processing Lien Token if contract balance is insufficient """
    smartContract = test_deploy_autonomous_payment_confirmed
    expectedValue = 1000000000000000000000000
    update = smartContract.receiveUpdate(
        "CID_listOfElementsAndGUIDs",
        "CID_asBuiltBIM",
        "CID_scheduleOfValues",
        "CID_rawProgressData",
        "CID_solutionUsedForProgressEvaluation",
        expectedValue,
        { "from": smartContract.owner() }
    )
    update.wait(1)
    paymentData = smartContract.getPaymentInfo(1)

    assert paymentData[0] == "CID_listOfElementsAndGUIDs"
    assert paymentData[1] == "CID_asBuiltBIM"
    assert paymentData[2] == "CID_scheduleOfValues"
    assert paymentData[3] == "CID_rawProgressData"
    assert paymentData[4] == "CID_solutionUsedForProgressEvaluation"
    assert paymentData[5] == expectedValue
    assert paymentData[6] == False
    assert smartContract.state() == 2
    assert smartContract.getContractBalance() == contractValue

def test_transfer_pay_value():
    pass 

def test_issue_lien_token():
    pass
    
    
