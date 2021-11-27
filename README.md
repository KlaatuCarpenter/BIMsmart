# BIMsmart
## About 
Autonomous payment solution in construction project supported with building information modeling and blockchain.
[Idea schema of the project](img/idea-schema.jpg)
[Project schema](img/project-schema.jpg)
[IPFS role schema](img/ipfs-role-schema.jpg)

## Environment
This project has a couple of parts, which are in seperate folders:
1) Smart contract
2) External adapter with job for chainlink node 
3) Frontend

To run this project it is neccesary to run firstly:
1) Chainlink node with [job specification](progress-evaluation-EA/chainlink-job.toml) and Operator.sol smart contract deployed.
2) Provide schedule of values which has the same table schema as [this schedule](progress-evaluation-EA/tests/schedule_of_values_for_testing.xlsx)
3) Create .env files and provide essential keys according to .env.example

### Running chainlink node 
Specific tutorial how to run chainlink node here:
[a link]https://docs.chain.link/docs/running-a-chainlink-node/

To run a node in Docker created with the tutorial above:
cd ~/.chainlink-kovan && docker run -p 6688:6688 -v ~/.chainlink-kovan:/chainlink -it --env-file=.env smartcontract/chainlink:<version> local n

Latest <version> can be found here: [a link]https://github.com/smartcontractkit/chainlink

In this case we used external provider for network: Alchemy. Websockets are in .env file in .chainlink-kovan.
Database running with postgresql: pgAdmin4.

It is neccessary for this project to set higher than default (5000000) gas limit.
For testing purpouses on Kovan ETH_GAS_LIMIT_DEFAULT=10000000 works. I didn't try less.

### Job specification
In file [link]progress-evaluation-EA/chainlink-job.toml

### Bridge in chainlink node specification:
Name	bimsmart
URL:	<progress-evaluation-EA_url>

### Running external adapter
On localhost just command "py app.py"

### Running frontend
Before running frontend it is neccessary to provide ABI in folder frontend.
This script [link]backend-brownie/scripts/update_frontend.py does it for you.
[Readme](frontend/README.md)

