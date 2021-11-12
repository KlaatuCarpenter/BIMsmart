1) User provides initial data files to fleek host - run script - provide initial data.
    This script schould encode files.
    This script should put the hashes of provided files into blockchain.
2) User provides as-build model - script takes automated solution from ipfs, decodes it and runs it to calculate the progress evaluation.
    New progress evaluation with data used to compute it is encoded and provided to ipfs.
    Next the provided progress evaluation with the value of work done is provided to blockchain with ipfshashes of files used in process.
    Smart contract makes a transaction to subcontractor.