import metadata.sample_metadata
import common.util
import json
from datetime import datetime


# This class creates metadata file for NFT token
class Metadata:

    def __init__(self, meta):
        lien_token_metadata = metadata.sample_metadata.metadata_template
        metadata_file_name = (
            "metadata/kovan/"
            + meta['name']
            + "_payment_"
            + str(meta["paymentID"])
            + ".json"
        )

        print(f"Creating Metadata file: {metadata_file_name}")
        lien_token_metadata["name"] = f'{meta["name"]} Lien Token'
        lien_token_metadata["description"] = f"Lien token in project {meta['name']}. Each lien right is unique and corresponds to a particular scope of work, as documented in the off-chain product flow records. This non-fungible “LIEN” token represents the lien rights to a property; the ownership of the token, and hence the right to underlying physical asset, is managed by the smart contract and recorded on the blockchain. The payment metadata, including references to the building elements and the payment value, are incorporated into this lien token"
        image_to_upload = "panorama.jpg"
        image_to_upload_path = f"metadata/img/{image_to_upload}"
        base_url = "https://ipfs.io/ipfs/"
        try:
            res = common.util.save_file_in_ipfs(image_to_upload, image_to_upload_path)
            lien_token_metadata["image"] = f"{base_url}{res['ResponseMetadata']['HTTPHeaders']['x-fleek-ipfs-hash-v0']}"
        except Exception as e:
            raise e
        lien_token_metadata["attributes"][0]["paymentID"] = meta["paymentID"]
        lien_token_metadata["attributes"][0]["CID_listOfElementsAndGUIDs"] = f'{base_url}{meta["CID_listOfElementsAndGUIDs"]}'
        lien_token_metadata["attributes"][0]["CID_scheduleOfValues"] = f'{base_url}{meta["CID_scheduleOfValues"]}'
        lien_token_metadata["attributes"][0]["CID_solutionUsedForProgressEvaluation"] = f'{base_url}{meta["CID_solutionUsedForProgressEvaluation"]}'
        lien_token_metadata["attributes"][0]["CID_rawProgressData"] = f'{base_url}{meta["CID_rawProgressData"]}'
        lien_token_metadata["attributes"][0]["CID_asBuiltBIM"] = f'{base_url}{meta["CID_asBuiltBIM"]}'
        lien_token_metadata["attributes"][0]["CID_previousPaymentProgress"] = f'{base_url}{meta["CID_previousPaymentProgress"]}'
        lien_token_metadata["attributes"][0]["CID_currentPaymentProgress"] = f'{base_url}{meta["CID_currentPaymentProgress"]}'
        lien_token_metadata["attributes"][0]["value"] = meta["value"]
        lien_token_metadata["attributes"][0]["total_contract_progress"] = meta["total_contract_progress"]
        now = datetime.now()
        lien_token_metadata["attributes"][0]["date_and_time"] = now.strftime("Date: %d.%m.%Y, time: %H:%M")

        with open(metadata_file_name, "w") as file:
            json.dump(lien_token_metadata, file)
        
        try:
            res = common.util.save_file_in_ipfs(metadata_file_name, metadata_file_name)
            token_metadata_CID = res['ResponseMetadata']['HTTPHeaders']['x-fleek-ipfs-hash-v0']
            self.result_success(token_metadata_CID)
        except Exception as e:
            self.result_error(e)
    
    def result_success(self, _token_metadata_CID):
        self.CID = _token_metadata_CID 
    
    def result_error(self, error):
        self.error = error 

