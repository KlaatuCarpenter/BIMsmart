import {
  useEtherBalance,
  useEthers,
  useContractCall,
  useContractCalls,
} from "@usedapp/core";
import helperConfig from "../helper-config.json";
import networkMapping from "../build/deployments/map.json";
import { BigNumberish, constants, utils } from "ethers";
import AutonomousPayment from "../build/contracts/AutonomousPayment.json";
import { Contract } from "@ethersproject/contracts";
import { formatEther } from "@ethersproject/units";
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBListGroup,
  MDBListGroupItem,
} from "mdb-react-ui-kit";

export const Main = () => {
  const { chainId } = useEthers();
  const { abi } = AutonomousPayment;
  const networkName = chainId ? helperConfig[chainId] : "ganache";
  console.log(typeof chainId);
  console.log(chainId);
  console.log(networkName);

  const autonomousPaymentAddress = chainId
    ? networkMapping[String(chainId)]["AutonomousPayment"][0]
    : constants.AddressZero;

  const autonomousPaymentInterface = new utils.Interface(abi);

  const autonomousPaymentContract = new Contract(
    autonomousPaymentAddress,
    autonomousPaymentInterface
  );

  function useProjectInfo(contractAddress: string | Falsy) {
    const [
      projectName,
      projectSymbol,
      contractor,
      subcontractor,
      contractState,
      initialData,
    ] =
      useContractCalls([
        contractAddress && {
          abi: autonomousPaymentInterface,
          address: contractAddress,
          method: "name",
          args: [],
        },

        contractAddress && {
          abi: autonomousPaymentInterface,
          address: contractAddress,
          method: "symbol",
          args: [],
        },

        contractAddress && {
          abi: autonomousPaymentInterface,
          address: contractAddress,
          method: "owner",
          args: [],
        },

        contractAddress && {
          abi: autonomousPaymentInterface,
          address: contractAddress,
          method: "subcontractor",
          args: [],
        },

        contractAddress && {
          abi: autonomousPaymentInterface,
          address: contractAddress,
          method: "state",
          args: [],
        },

        contractAddress && {
          abi: autonomousPaymentInterface,
          address: contractAddress,
          method: "getInitialData",
          args: [],
        },
      ]) ?? [];
    return [
      projectName,
      projectSymbol,
      contractor,
      subcontractor,
      contractState,
      initialData,
    ];
  }

  const myProjectInfo = useProjectInfo(autonomousPaymentAddress);
  const myProjectName = myProjectInfo[0];
  const myProjectSymbol = myProjectInfo[1];
  const myProjectContractor = myProjectInfo[2];
  const myProjectSubcontractor = myProjectInfo[3];
  const myProjectState = myProjectInfo[4];
  const myProjectInitialData = myProjectInfo[5];

  const contractStates = [
    "Created",
    "InitialDataProvided",
    "Agreed",
    "Aborted",
  ];

  return (
    <div>
      <MDBCard>
        <MDBCardBody>
          {myProjectName && (
            <MDBCardTitle>Project name: {myProjectName}</MDBCardTitle>
          )}
          <MDBCardText>
            {myProjectInfo && (
              <MDBListGroup>
                <MDBListGroupItem>
                  Autonomous Contract Address: {autonomousPaymentAddress}
                </MDBListGroupItem>
                <MDBListGroupItem>
                  Project symbol: {myProjectSymbol}
                </MDBListGroupItem>
                <MDBListGroupItem>
                  Contractor: {myProjectContractor}
                </MDBListGroupItem>
                <MDBListGroupItem>
                  Subcontractor: {myProjectSubcontractor}
                </MDBListGroupItem>
                <MDBListGroupItem>
                  Contract state: {myProjectState}
                </MDBListGroupItem>
              </MDBListGroup>
            )}
            {myProjectInitialData && (
              <MDBListGroup>
                <MDBListGroupItem>
                  <b>Initial data:</b>
                </MDBListGroupItem>
                <MDBListGroupItem tag="a" href="#">
                  CID_listOfElementsAndGUIDs: {myProjectInitialData[0]}
                </MDBListGroupItem>
                <MDBListGroupItem tag="a" href="#">
                  CID_scheduleOfValues: https://ipfs.io/ipfs/
                  {myProjectInitialData[1]}
                </MDBListGroupItem>
                <MDBListGroupItem tag="a" href="#">
                  CID_solutionUsedForProgressEvaluation: https://ipfs.io/ipfs/
                  {myProjectInitialData[2]}
                </MDBListGroupItem>
              </MDBListGroup>
            )}
          </MDBCardText>
        </MDBCardBody>
      </MDBCard>
    </div>
  );
};
