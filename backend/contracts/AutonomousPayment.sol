//SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Smart contract for settlement a contract betweeen contractor and subcontractor
/// @author Klaatu Carpenter
/// @notice this contract is suitable just for two users: contractor and subcontractor
/// @custom:experimental This is experimental contract
contract AutonomousPayment is Ownable {

  uint256 public contract_balance;
  uint256 public payment_done;
  address payable public contractor;
  address payable public subcontractor;

  /// @notice input data specific for the project
  struct InputData {
    bytes32 CID_listOfElementsAndGUIDs;
    bytes32 CID_asBuiltBIM;
    bytes32 CID_scheduleOfValues;
    bytes32 CID_rawProgressData;
    bytes32 CID_solutionUsedForProgressEvaluation;
    uint256 value;
  }

  uint256 numPayment;
  mapping (uint256 => InputData) payments; 

  enum State { Created, InitialDataProvided, Agreed, Aborted }
  // The state variable has a default value of the first member, `State.created`
  State public state;

  error OnlyContractor(string);
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
  event PaymentSent(uint256);
  event InitialDataProvided();

  constructor(address _subcontractor) {
    subcontractor = payable(_subcontractor);
    payment_done = 0;
    contract_balance = 0;
  }

  /// @notice Contractor deposits agreed value
  /// @dev it would be suitable to check if the contract_value is equal to the value in agreement (job for Chainlink?)
  function deposit() external payable {
      emit PaymentDeposited();
      contract_balance += msg.value;
  }

  /*  
    @notice Abort the contract and reclaim the ether.
    Can only be called by the contractor before
    the contract is agreed.
  */

  /// @notice provide initial data for the contract
 function provideInitialData(
    bytes32 _CID_listOfElementsAndGUIDs,
    bytes32 _CID_scheduleOfValues,
    bytes32 _CID_solutionUsedForProgressEvaluation)
    external 
    onlyOwner 
    inState(State.Created)
    returns (uint256 paymentID) {
      paymentID = 0;
      InputData storage initial = payments[paymentID];
      initial.CID_listOfElementsAndGUIDs = _CID_listOfElementsAndGUIDs;
      initial.CID_scheduleOfValues = _CID_scheduleOfValues;
      initial.CID_solutionUsedForProgressEvaluation = _CID_solutionUsedForProgressEvaluation;
      state = State.InitialDataProvided;
      emit InitialDataProvided();
 }

  function abort() external onlyOwner inState(State.Created && State.InitialDataProvided)
    {
      emit Aborted();
      state = State.Aborted;
      contract_balance -= address(this).balance;
      contractor.transfer(address(this).balance);
    }

  /// @notice Confirm the contract as subcontractor.
  /// It changes the state to Agreed.
  function confirmContract() external onlySubcontractor inState(State.InitialDataProvided) 
  {
      state = State.Agreed;
      emit ContractConfirmed();
  }

  /// @notice receiveUpdate ensures the information is correctly formatted 
  /// before it triggers internal funtions to initiate on-chain payment settlement
  function receiveUpdate(
    bytes32 _CID_listOfElementsAndGUIDs,
    bytes32 _CID_asBuiltBIM,
    bytes32 _CID_scheduleOfValues,
    bytes32 _CID_rawProgressData,
    bytes32 _CID_solutionUsedForProgressEvaluation,
    uint256 _value) 
    external 
    inState(State.Agreed) 
    returns (uint256 paymentID) {
      require(
        _value <= ETH.balanceof(this.address),
        "Not enough funds in the contract to proceed payment"
      );
      require(
        (_CID_listOfElementsAndGUIDs == payments[0].CID_listOfElementsAndGUIDs &&
        _CID_scheduleOfValues == payments[0].CID_scheduleOfValues && 
        _CID_solutionUsedForProgressEvaluation == payments[0].CID_solutionUsedForProgressEvaluation),
        "Input data validation failed"
      );
      paymentID = numPayment++;
      InputData storage payment = payments[paymentID];
      payment.CID_listOfElementsAndGUIDs = _CID_listOfElementsAndGUIDs;
      payment.CID_asBuiltBIM = _CID_asBuiltBIM;
      payment.CID_scheduleOfValues = _CID_scheduleOfValues;
      payment.CID_rawProgressData = _CID_rawProgressData;
      payment.CID_solutionUsedForProgressEvaluation = _CID_solutionUsedForProgressEvaluation;
      payment.value = _value; 
      // transferPayValue(payment.value);
      // issueLienToken(payments[paymentID]);
  }  

}
