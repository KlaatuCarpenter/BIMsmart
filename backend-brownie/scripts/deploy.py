from brownie import AutonomousPayment, network, config
from scripts.helpful_scripts import get_account, get_contract, get_account_subcontractor
from web3 import Web3

def deploy_autonomous_payment():
   
    deployer = get_account() # accounts.add(config["wallets"]["from_key"])
    subcontractor = get_account_subcontractor() # accounts.add(config["wallets"]["from_key"])
    # declare initial data
    # for now we hardcode this. Later it should be taken from project creator
    projectName = "Panorama"
    projectNameShorthand = "PAN"
    
    jobId = config["networks"][network.show_active()]["jobId"]
    fee = config["networks"][network.show_active()]["fee"]
    oracle = get_contract("oracle").address
    link_token = get_contract("link_token").address

    # deploy contract
    return AutonomousPayment.deploy(
        projectName, 
        projectNameShorthand, 
        subcontractor,
        oracle,
        Web3.toHex(text=jobId),
        fee,
        link_token,
        {'from': deployer}, 
        publish_source=config["networks"][network.show_active()]["verify"]
    )

def main():
    deploy_autonomous_payment()