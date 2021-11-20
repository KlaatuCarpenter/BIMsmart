# BIMsmart
Construction payment automation using blockchain-enabled smart contracts and reality capture technologies.

## Environment
### Running chainlink node 
Specific tutorial how to run chainlink node here:
[a link]https://docs.chain.link/docs/running-a-chainlink-node/

To run a node in Docker created with the tutorial above:
cd ~/.chainlink-kovan && docker run -p 6688:6688 -v ~/.chainlink-kovan:/chainlink -it --env-file=.env smartcontract/chainlink:<version> local n

Latest <version> can be found here: [a link]https://github.com/smartcontractkit/chainlink

In this case we used external provider for network: Alchemy. Websockets are in .env file in .chainlink-kovan.
Database running with postgresql: pgAdmin4.

It is neccessary for this project to set higher than default (5000000) gas limit. For testing purpouses on Kovan ETH_GAS_LIMIT_DEFAULT=10000000 works. I didn't try less.

### Job specification
In file [link]progress-evaluation-EA/chainlink-job.toml

### Bridge in chainlink node specification:
Name	bimsmart
URL:	<progress-evaluation-EA_url>
Confirmations	0
Minimum Contract Payment	0

### Running external adapter
On localhost: "py app.py"

