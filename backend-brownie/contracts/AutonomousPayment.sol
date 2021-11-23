//SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

/// @title Smart contract for settlement a contract betweeen contractor and subcontractor
/// @author Damian Piorun @KlaatuCarpenter
/// @notice this contract is suitable just for two users: contractor and subcontractor
/// @custom:experimental This is experimental contract
contract AutonomousPayment is Ownable, ERC721URIStorage, ChainlinkClient {

  using Chainlink for Chainlink.Request;
  bytes32 private jobId;
  uint256 private fee;

  using Counters for Counters.Counter;
  Counters.Counter private paymentIDs;

  address payable public subcontractor;

  struct InitialData {
    string CID_listOfElementsAndGUIDs;
    string CID_scheduleOfValues;
    string CID_solutionUsedForProgressEvaluation;
  }

  InitialData initialData;

  struct PaymentData {
    string CID_asBuiltBIM;
    string CID_solutionUsedForProgressEvaluation;
    string CID_currentPaymentProgress;
    string lienTokenMetaData;
    bool paymentDone;
    uint256 value;
  }
  
  mapping (uint256 => PaymentData) public payments;   

  enum State { Created, InitialDataProvided, Agreed, Aborted }
  State public state;

  error OnlySubcontractor(string);
  error InvalidState(string);

  modifier onlySubcontractor() {
      if (msg.sender != subcontractor)
          revert OnlySubcontractor("Only the subcontractor can call this function");
      _;
  }

  modifier inState(State state_) {
      if (state != state_)
          revert InvalidState("The function cannot be called at the current state");
      _;
  }

  event Aborted();
  event PaymentDeposited();
  event ContractConfirmed();
  event PaymentRequested(uint256);
  event PaymentSent(uint256, uint256);
  event NotSufficientContractBalance();
  event InitialDataProvided();
  event issueLienTokenMintedToSubcontractor(uint256);
  event issueLienTokenMintedToOwner(uint256);

  constructor(
    string memory _projectName, 
    string memory _projectNameShorthandName, 
    address _subcontractor,
    address _oracle, 
    bytes32 _jobId, 
    uint256 _fee, 
    address _link
    ) ERC721(_projectName, _projectNameShorthandName) {
    subcontractor = payable(_subcontractor);
    if (_link == address(0)) {
          setPublicChainlinkToken();
      } else {
          setChainlinkToken(_link);
      }
    setChainlinkOracle(_oracle);
    // jobId = stringToBytes32(_jobId);
    jobId = _jobId;
    fee = _fee;
  }

  /// @notice Contractor (who should be also owner) deposits agreed value
  function deposit() external payable {
      emit PaymentDeposited();
  }

  /// @notice provide initial data for the contract
  function provideInitialData(
    string memory _CID_listOfElementsAndGUIDs,
    string memory _CID_scheduleOfValues,
    string memory _CID_solutionUsedForProgressEvaluation)
    external 
    onlyOwner 
    inState(State.Created) {
      initialData.CID_listOfElementsAndGUIDs = _CID_listOfElementsAndGUIDs;
      initialData.CID_scheduleOfValues = _CID_scheduleOfValues;
      initialData.CID_solutionUsedForProgressEvaluation = _CID_solutionUsedForProgressEvaluation;
      state = State.InitialDataProvided;
      emit InitialDataProvided();
 }

  /**  
    * @notice Abort the contract and reclaim the ether.
    * Can only be called by the contractor before
    * the contract is agreed.
  */

  function abort() external onlyOwner inState(State.InitialDataProvided)
    {
      state = State.Aborted;
      address payable contractor = payable(owner());
      contractor.transfer(address(this).balance);
      emit Aborted();
    }

  /// @notice Confirm the contract as subcontractor.
  /// It changes the state to Agreed.
  function confirmContract() external onlySubcontractor inState(State.InitialDataProvided) 
  {
      state = State.Agreed;
      emit ContractConfirmed();
  }

  /// @notice create a new payment request providing new as-built model and progress data
  /// @dev current paymentID is actually previous payment. 
  /// PaymentIDs increment proceed in receiveUpdate function which records Chainlink fulfillment.
  /// If it is a first payment CID_previousPaymentProgress is empty string.
  /// @dev in case of request failing paymentIDs increment is applied after require statement in receiveUpdate
  
  function requestPayment(string memory _CID_asBuiltBIM, string memory _CID_rawProgressData) public inState(State.Agreed)
  {
      Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.receiveUpdate.selector);
      
      request.add("CID_asBuiltBIM", _CID_asBuiltBIM);
      uint256 _paymentID = paymentIDs.current();
      request.add("CID_previousPaymentProgress", payments[_paymentID].CID_currentPaymentProgress);
      request.add("CID_scheduleOfValues", initialData.CID_scheduleOfValues);
      request.add("CID_listOfElementsAndGUIDs", initialData.CID_listOfElementsAndGUIDs);
      request.add("CID_rawProgressData", _CID_rawProgressData);
      request.add("name", name());
      _paymentID += 1;
      request.addUint("paymentID", _paymentID);
      
      requestOracleData(request, fee); 
  }

  /// @notice receiveUpdate ensures the information is correctly formatted 
  /// before it triggers internal funtions to initiate on-chain payment settlement
  function receiveUpdate(
    bytes32 _requestId, 
    uint256 _value, 
    string memory _CID_currentPaymentProgress,
    string memory _CID_asBuiltBIM,
    string memory _CID_solutionUsedForProgressEvaluation,
    string memory _lienTokenMetaData
    ) public recordChainlinkFulfillment(_requestId) {
      require(
        (keccak256(abi.encodePacked(_CID_solutionUsedForProgressEvaluation)) == keccak256(abi.encodePacked(initialData.CID_solutionUsedForProgressEvaluation))),
        "Data validation failed with receiveUpdate"
      );
      
      /// @notice payment settlement
      paymentIDs.increment();
      uint256 paymentID = paymentIDs.current();
      PaymentData storage payment = payments[paymentID];
      payment.CID_asBuiltBIM = _CID_asBuiltBIM;
      payment.CID_solutionUsedForProgressEvaluation = _CID_solutionUsedForProgressEvaluation;
      payment.CID_currentPaymentProgress = _CID_currentPaymentProgress;
      payment.lienTokenMetaData = _lienTokenMetaData;
      payment.value = _value; 
      payment.paymentDone = false;

      transferPayValue(paymentID);
      issueLienToken(paymentID);
  }

  function transferPayValue(uint256 _paymentID) internal {
    if (payments[_paymentID].value <= address(this).balance) {
      payments[_paymentID].paymentDone = true;
      subcontractor.transfer(payments[_paymentID].value);
      emit PaymentSent(_paymentID, payments[_paymentID].value);
    } else {
      emit NotSufficientContractBalance();
    }
    
  }

  /// @dev _paymentID is also the tokenID 
  function issueLienToken(uint256 _paymentID) internal {
    if (payments[_paymentID].paymentDone) {
      _safeMint(owner(), _paymentID);
      _setTokenURI(_paymentID, payments[_paymentID].lienTokenMetaData);
      emit issueLienTokenMintedToSubcontractor(_paymentID);
    } else {
      _safeMint(subcontractor, _paymentID);    
      _setTokenURI(_paymentID, payments[_paymentID].lienTokenMetaData);
      emit issueLienTokenMintedToOwner(_paymentID);
    }
    
  } 

  /**
    *  @notice get functions
    */
  
  function getContractBalance() public view returns(uint256) {
    return address(this).balance;
  }

  function getNumberOfPaymentsDone() public view returns(uint256) {
    return paymentIDs.current();
  }

  function getPaymentInfo(uint256 _paymentID) public view returns(
    string memory,
    string memory,
    string memory,
    string memory,
    uint256,
    bool
  ) {
    return (
      payments[_paymentID].CID_asBuiltBIM,
      payments[_paymentID].CID_solutionUsedForProgressEvaluation,
      payments[_paymentID].CID_currentPaymentProgress,
      payments[_paymentID].lienTokenMetaData,
      payments[_paymentID].value,
      payments[_paymentID].paymentDone
    );
  }

  function getInitialData() public view returns(
    string memory,
    string memory,
    string memory
  ) {
    return(
      initialData.CID_listOfElementsAndGUIDs,
      initialData.CID_scheduleOfValues,
      initialData.CID_solutionUsedForProgressEvaluation
    );
  }

}
