
from brownie import AutonomousPayment, config, network
from scripts.helpful_scripts import fund_with_link, get_account, get_account_subcontractor
from scripts.deploy import deploy_autonomous_payment


def main():
    deploy_autonomous_payment()
    account = get_account()
    smartContract = AutonomousPayment[-1]

    # provide initial data and deposit contract value
    depositTransaction = smartContract.deposit(
        { 
            "from": account, 
            "value": 2000000000000
        })
    depositTransaction.wait(1)
    provideData = smartContract.provideInitialData(
        "QmXgwK2R8wFJbVBnhumxbnxYLF8WYC9UDmZGMsMoKw5Wcc",
        "QmTZZbtDqBtyScyvDKaWEdo5wFr5tMnh1ju4a97BCndMkv", 
        "QmfZu5moSVwsEN3sh9qfWJpJhjcz6gv18Tzkg4G53HUwEP",
        { "from": account })
    provideData.wait(1)

    # confirm contract by subcontractor
    confirm = smartContract.confirmContract({"from": get_account_subcontractor()})
    confirm.wait(1)
    

