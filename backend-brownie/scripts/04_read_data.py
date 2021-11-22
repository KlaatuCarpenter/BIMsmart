from brownie import AutonomousPayment, config, network
from scripts.helpful_scripts import fund_with_link, get_account, get_account_subcontractor

def main():
    smartContract = AutonomousPayment[-1]
    contractor = get_account()
    subcontractor = get_account_subcontractor()
    print(smartContract.getPaymentInfo(0))
    print(smartContract.getPaymentInfo(1))
    print(smartContract.getPaymentInfo(2))
    print(smartContract.getPaymentInfo(3))
    print(contractor.balance())
    print(subcontractor.balance())

    firstpayment = smartContract.payments(1)
    print(firstpayment)