import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBListGroup,
  MDBListGroupItem, MDBContainer
} from "mdb-react-ui-kit";
import { useProjectInfo } from "../hooks";
import { useEthers, useEtherBalance } from "@usedapp/core";
import networkMapping from "../build/deployments/map.json";
import { constants, ethers } from "ethers";

export const ProjectInfo = () => {
  const { chainId } = useEthers();
  const autonomousPaymentAddress = chainId ? networkMapping[String(chainId)]["AutonomousPayment"][0] : constants.AddressZero;

  const projectInfo = useProjectInfo();
  const myProjectName = projectInfo[0];
  const myProjectSymbol = projectInfo[1];
  const myProjectContractor = projectInfo[2];
  const myProjectSubcontractor = projectInfo[3];
  const myProjectState = projectInfo[4];
  const myProjectNumberOfPaymentsDone = projectInfo[6]?.toString()

  const contractBalance = useEtherBalance(autonomousPaymentAddress)?.toString()

  return (
    <MDBContainer>
      <MDBCard className="mt-3 mb-3">
        <MDBCardBody>
          {myProjectName && (
            <MDBCardTitle>Project Info</MDBCardTitle>
          )}
          <MDBCardText>
            {projectInfo && (
              <MDBListGroup flush>
                <MDBListGroupItem>
                  Project name: {myProjectName}
                </MDBListGroupItem>
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
                <MDBListGroupItem>
                  Contract balance: {contractBalance ? (ethers.utils.formatEther(contractBalance)) : ('0')} ETH
                </MDBListGroupItem>
                <MDBListGroupItem>
                  Number of payments processed: {myProjectNumberOfPaymentsDone}
                </MDBListGroupItem>
              </MDBListGroup>
            )}
          </MDBCardText>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};
