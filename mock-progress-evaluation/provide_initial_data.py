from cryptography.fernet import Fernet
import boto3
import os
from os.path import join, dirname
from dotenv import load_dotenv

dotenv_path = join(dirname(__file__), '.env.ea')
load_dotenv(dotenv_path)

ACCESS_KEY_ID = os.environ.get("ACCESS_KEY_ID")
SECRET_ACCESS_KEY = os.environ.get("SECRET_ACCESS_KEY")
REGION_NAME = os.environ.get("REGION_NAME")
PROJECT_BUCKET = os.environ.get("PROJECT_BUCKET")
PROJECT_CRYPTOGRAPHIC_KEY = os.environ.get("PROJECT_CRYPTOGRAPHIC_KEY")

initial_data = [
    'list_of_elements_and_GUID.xlsx',
    'schedule_of_values.xlsx',
    'automated_solution_used_for_progress_evaluation.py'
]

initial_data_IPFS_hashes = []
paymentID = 0

s3 = boto3.client(
    service_name='s3',
    endpoint_url='https://storageapi.fleek.co',
    aws_access_key_id = ACCESS_KEY_ID,
    aws_secret_access_key = SECRET_ACCESS_KEY,
    region_name = REGION_NAME
)

# Encrypt files and store on IPFS via fleek storage
fernet = Fernet(PROJECT_CRYPTOGRAPHIC_KEY)
for file in initial_data: 
    with open(f'../input_data_used_for_valuation/{file}', 'rb') as f:
        original = f.read()
        
    encrypted = fernet.encrypt(original)
    
    try:
        request = s3.put_object(
            Bucket = PROJECT_BUCKET,
            Key = f'{paymentID}_{file}',
            ContentType = file,
            Body = encrypted,
            ACL = 'private'
        )
    except Exception as e:
        print(e)
    initial_data_IPFS_hashes.append((file, request['ResponseMetadata']['HTTPHeaders']['x-fleek-ipfs-hash']))









