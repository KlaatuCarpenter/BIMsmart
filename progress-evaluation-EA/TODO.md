1) User provides initial data files to fleek host - run script - provide initial data.
    This script schould encode files.
    This script should put the hashes of provided files into blockchain.
2) User provides as-build model - script takes automated solution from ipfs, decodes it and runs it to calculate the progress evaluation.
    New progress evaluation with data used to compute it is encoded and provided to ipfs.
    Next the provided progress evaluation with the value of work done is provided to blockchain with ipfshashes of files used in process.
    Smart contract makes a transaction to subcontractor.

First payment:
$data = @{data = @{
    paymentID=1;
    CID_scheduleOfValues="bafybeicnte25pfv73l2eqmbmpfod3s4fll3gmjq7stungyv7755i6uddsm";
    CID_listOfElementsAndGUIDs="CID_listOfElementsAndGUIDs";
    CID_asBuiltBIM="CID_asBuiltBIM";
    CID_rawProgressData="CID_rawProgressData";
    CID_previousPaymentProgress=""
    }
}
$data | ConvertTo-Json -Compress | curl.exe -X POST -H "Content-Type: application/json" -d "@-" http://localhost:8081/

Second payment:
$data = @{data = @{
    paymentID=2;
    CID_scheduleOfValues="bafybeicnte25pfv73l2eqmbmpfod3s4fll3gmjq7stungyv7755i6uddsm";
    CID_listOfElementsAndGUIDs="CID_listOfElementsAndGUIDs";
    CID_asBuiltBIM="CID_asBuiltBIM";
    CID_rawProgressData="CID_rawProgressData";
    CID_previousPaymentProgress="bafybeif6el6gbcmvuty7etuqdvqcrr6jzsb7vctpsx3ixlkvqgnpqr2zxi"
    }
}

### output form first payment
{
  "CID_asBuiltBIM": "bafybeicoglxdlgkd5jhwo3ydwbkkdnfm5sfhobumozmw24ethkdxpeborq",
  "CID_currentPaymentProgress": "bafybeicoglxdlgkd5jhwo3ydwbkkdnfm5sfhobumozmw24ethkdxpeborq",
  "CID_listOfElementsAndGUIDs": "CID_listOfElementsAndGUIDs",
  "CID_rawProgressData": "CID_rawProgressData",
  "CID_scheduleOfValues": "bafybeicnte25pfv73l2eqmbmpfod3s4fll3gmjq7stungyv7755i6uddsm",
  "CID_solutionUsedForProgressEvaluation": "bafybeih77n5qevwt4b4dox5vb54ck2gas22lidvn2aomjgudhinp4ftkta",
  "paymentID": "1",
  "statusCode": 200,
  "value": 620982
}


https://ipfs.fleek.co/ipfs/bafybeif6el6gbcmvuty7etuqdvqcrr6jzsb7vctpsx3ixlkvqgnpqr2zxi
https://ipfs.fleek.co/ipfs/QmSQxKure7qPjwZkvVFKNMiaqMqhXUikbXkAwVzdqzt3r9


# "CID_solutionUsedForProgressEvaluation": "bafybeihrlaneadhrlgwykrtda7olpk4leqpk2vbmtz5w34fmi2bdns67s4",
# "CID_currentPaymentProgress": "bafybeiaa7aqz5xoksly73l5axzsx3mgerffshk7n7v26xxfwwqt4cweag4", payment 1
# "CID_currentPaymentProgress": "bafybeif6wrrlta6642objttsrmtbuq3xpgyc4g23l2la2f3ykksuxautum", payment 2

# # structure of response
# resource_fields = {
#     'paymentID': fields.Integer,
#     'CID_listOfElementsAndGUIDs': fields.String,
#     'CID_asBuiltBIM': fields.String,
#     'CID_scheduleOfValues': fields.String,
#     'CID_rawProgressData': fields.String,
#     'CID_solutionUsedForProgressEvaluation': fields.String,
#     'value': fields.Integer,
#     'CID_previousPaymentProgress': fields.String    
# }