import { useContractCalls, useEthers } from "@usedapp/core";
import AutonomousPayment from "../build/contracts/AutonomousPayment.json";
import { constants, utils } from "ethers";
import networkMapping from "../build/deployments/map.json";

export const useInitialData = (): any[] => {
  const { chainId } = useEthers();
  const { abi } = AutonomousPayment;

  const autonomousPaymentAddress = chainId
    ? networkMapping[String(chainId)]["AutonomousPayment"][0]
    : constants.AddressZero;

  const autonomousPaymentInterface = new utils.Interface(abi);

  const [initialData] =
    useContractCalls([
      autonomousPaymentAddress && {
        abi: autonomousPaymentInterface,
        address: autonomousPaymentAddress,
        method: "getInitialData",
        args: [],
      },
    ]) ?? [];

  let initialDataIpfs: string[] = [];
  initialData?.map((CID) => {
    initialDataIpfs.push(`https://ipfs.io/ipfs/${CID}`);
    return initialDataIpfs;
  });

  return [initialDataIpfs];
};
