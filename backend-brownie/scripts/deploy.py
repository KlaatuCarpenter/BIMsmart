from brownie import AutonomousPayment, accounts, network, config
from scripts.helpful_scripts import get_account

def deploy_autonomous_payment():
    # declare initial data
    # for now we hardcode this. Later it should be taken from project creator
    deployer = get_account(0) # accounts.add(config["wallets"]["from_key"])
    subcontractor = get_account(1) # accounts.add(config["wallets"]["from_key"])
    projectName = "Panorama"
    projectNameShorthand = "PAN"

    # deploy contract
    return AutonomousPayment.deploy(
        projectName, 
        projectNameShorthand, 
        subcontractor, 
        {'from': deployer}, 
        publish_source=config["networks"][network.show_active()]["verify"]
    )

def main():
    deploy_autonomous_payment()