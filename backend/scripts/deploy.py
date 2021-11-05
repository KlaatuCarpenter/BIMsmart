from brownie import AutonomousPayment, accounts, network, config
from scripts.helpful_scripts import get_account

def deploy_autonomous_payment():
    deployer = get_account(0)
    subcontractor = get_account(1)
    autonomous_payment = AutonomousPayment.deploy(
        subcontractor, 
        {'from': deployer}, 
        publish_source=config["networks"][network.show_active()]["verify"]
    )

def main():
    deploy_autonomous_payment()