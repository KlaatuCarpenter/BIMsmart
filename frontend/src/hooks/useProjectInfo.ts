import { useContractCalls, useEthers } from "@usedapp/core";
import AutonomousPayment from "../build/contracts/AutonomousPayment.json";
import { constants, utils } from "ethers";
import networkMapping from "../build/deployments/map.json";

export const useProjectInfo = (): any[] => {
  const { chainId } = useEthers();
  const { abi } = AutonomousPayment;

  const autonomousPaymentAddress = chainId
    ? networkMapping[String(chainId)]["AutonomousPayment"][0]
    : constants.AddressZero;

  const autonomousPaymentInterface = new utils.Interface(abi);

  const [
    projectName,
    projectSymbol,
    contractor,
    subcontractor,
    state,
    initialData,
    numberOfPaymentsDone,
  ] =
    useContractCalls([
      autonomousPaymentAddress && {
        abi: autonomousPaymentInterface,
        address: autonomousPaymentAddress,
        method: "name",
        args: [],
      },

      autonomousPaymentAddress && {
        abi: autonomousPaymentInterface,
        address: autonomousPaymentAddress,
        method: "symbol",
        args: [],
      },

      autonomousPaymentAddress && {
        abi: autonomousPaymentInterface,
        address: autonomousPaymentAddress,
        method: "owner",
        args: [],
      },

      autonomousPaymentAddress && {
        abi: autonomousPaymentInterface,
        address: autonomousPaymentAddress,
        method: "subcontractor",
        args: [],
      },

      autonomousPaymentAddress && {
        abi: autonomousPaymentInterface,
        address: autonomousPaymentAddress,
        method: "state",
        args: [],
      },

      autonomousPaymentAddress && {
        abi: autonomousPaymentInterface,
        address: autonomousPaymentAddress,
        method: "getInitialData",
        args: [],
      },

      autonomousPaymentAddress && {
        abi: autonomousPaymentInterface,
        address: autonomousPaymentAddress,
        method: "getNumberOfPaymentsDone",
        args: [],
      },
    ]) ?? [];

  const contractStates = [
      "Created",
      "InitialDataProvided",
      "Agreed",
      "Aborted",
      ];

  const contractState = contractStates[parseInt(String(state))]

  let initialDataIpfs: string[] = [];
  initialData?.map((CID) => {
    initialDataIpfs.push(`https://ipfs.io/ipfs/${CID}`);
    return initialDataIpfs;
  });

  return [
    projectName,
    projectSymbol,
    contractor,
    subcontractor,
    contractState,
    initialDataIpfs,
    numberOfPaymentsDone,
  ];
};
