import networkMapping from "../build/deployments/map.json";
import { constants, ethers } from "ethers";
import AutonomousPayment from "../build/contracts/AutonomousPayment.json";
import { ChainId } from "@usedapp/core";

declare let window: any;

export const initTransaction = async (chainId: ChainId | undefined) => {
  
  const { abi } = AutonomousPayment;
  const autonomousPaymentAddress = chainId
    ? networkMapping[String(chainId)]["AutonomousPayment"][0]
    : constants.AddressZero;

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  const autonomousPaymentContract = new ethers.Contract(
    autonomousPaymentAddress,
    abi,
    signer
  );

  return autonomousPaymentContract;
};
