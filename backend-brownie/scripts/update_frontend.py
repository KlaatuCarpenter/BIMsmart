import yaml
import json
import os
import shutil


def copy_brownie_config():
    with open("brownie-config.yaml", "r") as brownie_config:
        config_dict = yaml.load(brownie_config, Loader=yaml.FullLoader)
    with open(
        "../frontend/src/brownie-config-json.json", "w"
    ) as brownie_config_json:
        json.dump(config_dict, brownie_config_json)
    print("Front end updated!")

def copy_folders_to_front_end(src, dest):
    if os.path.exists(dest):
        shutil.rmtree(dest)
    shutil.copytree(src, dest)

def main():
    copy_brownie_config()
    copy_folders_to_front_end("./build", "../frontend/src/build")

  