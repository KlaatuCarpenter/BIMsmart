data = {
  "paymentID": 0,
  "CID_listOfElementsAndGUIDs": "", 
  "CID_scheduleOfValues": "",
  "CID_solutionUsedForProgressEvaluation": "",
  "CID_rawProgressData": "",
  "CID_asBuiltBIM": "",
  "CID_previousPaymentProgress": "",
  "CID_currentPaymentProgress": "",
  "value": 0,
  "total_contract_progress": 0,

}

First payment:
$data = @{data = @{
    paymentID=1;
    CID_scheduleOfValues="bafybeicnte25pfv73l2eqmbmpfod3s4fll3gmjq7stungyv7755i6uddsm";
    CID_listOfElementsAndGUIDs="CID_listOfElementsAndGUIDs";
    CID_asBuiltBIM="CID_asBuiltBIM";
    CID_rawProgressData="CID_rawProgressData";
    CID_previousPaymentProgress="";
    name="Panorama"
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
    CID_previousPaymentProgress="bafybeif6el6gbcmvuty7etuqdvqcrr6jzsb7vctpsx3ixlkvqgnpqr2zxi";
    name="Panorama"
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
