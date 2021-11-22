from brownie import AutonomousPayment, config, network
from scripts.helpful_scripts import fund_with_link, get_account

def main():
    """ Providing payment request to contract """
    smartContract = AutonomousPayment[-1]
    tx = fund_with_link(
        smartContract.address, amount=config["networks"][network.show_active()]["fee"]
        )
    tx.wait(1)
    update_tx = smartContract.requestPayment(
        "QmRdtGrtVgrfbVRn6y71iWyYMyHASe5cimFkpeqQ3PwSqF",
        "QmdX7GbhKqTpzh1tqFfWUwkWUXxF4hR4kAR84LeELPtcpv",
        { "from": get_account(), "allow_revert": True }
        
    )
    update_tx.wait(1)