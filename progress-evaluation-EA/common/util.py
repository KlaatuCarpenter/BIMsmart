import boto3
from dotenv import load_dotenv
import os
from os.path import join, dirname
from cryptography.fernet import Fernet

dotenv_path = join(dirname(__file__),'.env.mock-progress')
load_dotenv(dotenv_path)

ACCESS_KEY_ID = os.getenv("ACCESS_KEY_ID")
SECRET_ACCESS_KEY = os.getenv("SECRET_ACCESS_KEY")
REGION_NAME = os.getenv("REGION_NAME")
PROJECT_BUCKET = os.getenv("PROJECT_BUCKET")
PROJECT_CRYPTOGRAPHIC_KEY = os.getenv("PROJECT_CRYPTOGRAPHIC_KEY")

def save_file_in_ipfs(unique_key, unique_file_path):
    s3 = boto3.client(
        service_name='s3',
        endpoint_url='https://storageapi.fleek.co',
        aws_access_key_id = ACCESS_KEY_ID,
        aws_secret_access_key = SECRET_ACCESS_KEY,
        region_name = REGION_NAME
        )
    res = s3.put_object(
        Bucket = PROJECT_BUCKET,
        Key = unique_key,
        ContentType = 'file',
        Body = open(unique_file_path, 'rb'),
        ACL = 'private'
        )
    return res

# fernet = Fernet(PROJECT_CRYPTOGRAPHIC_KEY)