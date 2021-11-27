
import { ProjectInfo } from "./ProjectInfo"
import { LienToken } from "./LienToken"
import { RequestPayment } from "./RequestPayment"
import { Header } from "./Header";
import { InitialData } from "./InitialData"
import { Deposit } from "./Deposit"
import { Confirm } from "./Confirm"
import { Abort } from "./Abort"
import { useProjectInfo } from "../hooks"
import { useEthers } from "@usedapp/core";

export const Main = () => {
  const states = [
    "Created",
    "InitialDataProvided",
    "Agreed",
    "Aborted",
  ];
  const { account } = useEthers();

  const projectInfo = useProjectInfo();
  const contractor = String(projectInfo[2]);
  const subcontractor = String(projectInfo[3]);
  const state = projectInfo[4];


  /** 
    # Logic of rendering:
    Everyone can see <ProjectInfo />
    Constracotr and subcontractor see components with available to them functions in current state.
    
    ## Contractor:
    in states 'Created' and 'InitialDataProvided' sees components <InitialData /> <Deposit /> <Abort />
    In other states constractor sees <InitialData /> <LienToken /> <RequestPayment />
    
    ## Subcontractor
    in state 'Created' and 'InitialDataProvided' sees components <InitialData />
    in state 'InitialDataProvided' he can confirm contract 
    In other states constractor sees <InitialData /> <LienToken /> <RequestPayment />
  */

  return (
    <div>
      <Header />
      <ProjectInfo />
      {(account === contractor || account === subcontractor) ?
        <>
          <LienToken />
          {(account === subcontractor && state === states[0]) ? <></> : <InitialData />}
        </>
        : <></>}

      {(account === contractor) ? <Deposit /> : <></>}
      {((account === subcontractor) && (state === states[1])) ? <Confirm /> : <></>}
      {((account === contractor) && (state === states[1])) ? <Abort /> : <></>}
      {((account === contractor || account === subcontractor) && (state === states[2])) ? <RequestPayment /> : <></> }
    </div>
  );
};
