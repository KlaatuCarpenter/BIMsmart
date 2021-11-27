import React, { useState } from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBCardText,
  MDBCardTitle,
  MDBContainer,
} from "mdb-react-ui-kit";
import LoadingButton from "@mui/lab/LoadingButton";
import brownieConfig from "../brownie-config-json.json";
import helperConfig from "../helper-config.json";
import networkMapping from "../build/deployments/map.json";
import { constants, ethers } from "ethers";
import { useEthers, useTokenBalance } from "@usedapp/core";
import LinkTokenInterface from "../build/interfaces/LinkTokenInterface.json";
import { initTransaction } from "../helpers"
import { submitToIpfs } from "../helpers"
import { UploadButton } from "./uploadButtons/UploadButton"
import Button from '@mui/material/Button';

declare let window: any;

export const RequestPayment = () => {
  /// State variables used with input files
  const [asBuiltBimFile, setAsBuiltBimFile] = useState<File | undefined>();
  const [rawDataFile, setRawDataFile] = useState<File | undefined>();
  const [asBuiltBimFileCID, setAsBuiltBimFileCID] = useState<string>();
  const [rawDataFileCID, setRawDataFileCID] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const changeAsBuiltBimFile = (event: React.FormEvent) => {
    const file = (event.target as HTMLInputElement).files;
    if (file && file.length === 1) { setAsBuiltBimFile(file[0]); }
  };

  const changeRawDataFile = (event: React.FormEvent) => {
    const file = (event.target as HTMLInputElement).files;
    if (file && file.length === 1) { setRawDataFile(file[0]); }
  };

  const uploadButtons = [
    {
      file: asBuiltBimFile,
      label: "Upload as-built BIM model",
      changeHandler: changeAsBuiltBimFile,
    },
    {
      file: rawDataFile,
      label: "Upload raw data files used for generating as-built BIM model",
      changeHandler: changeRawDataFile,
    },
  ]

  /// Save files to IPFS
  function handleSaveToIpfs(event: React.FormEvent) {
    event.preventDefault();

    if (asBuiltBimFile && rawDataFile) {
      setLoading(true);

      const request1 = submitToIpfs(asBuiltBimFile, asBuiltBimFile.name);
      request1
        .on("httpHeaders", (statusCode, headers) => {
          const ipfsHashV0 = headers["x-fleek-ipfs-hash-v0"];
          setAsBuiltBimFileCID(ipfsHashV0);
        })
        .send();

      const request2 = submitToIpfs(rawDataFile, rawDataFile.name);
      request2
        .on("httpHeaders", (statusCode, headers) => {
          const ipfsHashV0 = headers["x-fleek-ipfs-hash-v0"];
          setRawDataFileCID(ipfsHashV0);
          setLoading(false);
        })
        .send();
    } else {
      alert("No files!");
    }
  }

  /// Fund contract with link
  
  const { chainId } = useEthers();
  const networkName = chainId ? helperConfig[chainId] : "ganache";
  const linkTokenAddress = chainId ? brownieConfig["networks"][networkName]["link_token"] : constants.AddressZero;
  const autonomousPaymentAddress = chainId ? networkMapping[String(chainId)]["AutonomousPayment"][0] : constants.AddressZero;
  const fee = chainId ? brownieConfig["networks"][networkName]["fee"].toString() : "0";
  const [fundLinkMining, setFundLinkMining] = useState<boolean>(false);
  const linkBalance = useTokenBalance(linkTokenAddress, autonomousPaymentAddress)?.toString()
  
  const fundLink = async (event: React.FormEvent) => {
    event.preventDefault();
    setFundLinkMining(true);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const linkTokenContract = new ethers.Contract(
      linkTokenAddress,
      LinkTokenInterface.abi,
      signer
    );
    await linkTokenContract.transfer(autonomousPaymentAddress, fee);
    setFundLinkMining(false);
  };

  /// Send payment request transaction
  const [miningRequestPayment, setMiningRequestPayment] = useState<boolean>(false);

  const requestPayment = async (event: React.FormEvent) => {
    event.preventDefault();
    if (asBuiltBimFileCID && rawDataFileCID) {
      setMiningRequestPayment(true);
      const autonomousPaymentContract = await initTransaction(chainId);
      await autonomousPaymentContract.requestPayment(
        asBuiltBimFileCID,
        rawDataFileCID
      );
      setMiningRequestPayment(false);
    } else {
      alert("Provide files before sending transaction!");
    }
  };

  return (
    <MDBContainer>
      <MDBCard tag="FundWithLink" className="mt-3 mb-3">
        <MDBCardBody>
          <MDBCardText>
            <p>Link balance of the contract: {linkBalance ? (ethers.utils.formatEther(linkBalance)) : ('0')} LINK</p>
            <LoadingButton
              fullWidth
              onClick={fundLink}
              loading={fundLinkMining}
              variant="contained">
              Fund contract with 1.0 link
            </LoadingButton>
          </MDBCardText>
        </MDBCardBody>
      </MDBCard>
      <MDBCard tag="RequestPayment" className="mt-3 mb-3">
        <MDBCardBody>
          <MDBCardTitle>Payment request</MDBCardTitle>
          <MDBCardText>
            {
              (asBuiltBimFileCID && rawDataFileCID) ? (
                <div>
                  <p>AsBuiltBimFileCID: {asBuiltBimFileCID}</p>
                  <p>RawDataFileCID: {rawDataFileCID}</p>
                  <LoadingButton
                    fullWidth
                    onClick={requestPayment}
                    loading={miningRequestPayment}
                    variant="contained"
                    className="mt-2 mb-2">
                    Request Payment
                  </LoadingButton>
                </div>
              ) : (
                <div>
                  {
                    uploadButtons.map(item => {
                      return <UploadButton file={item.file} label={item.label} changeHandler={item.changeHandler} />
                    })
                  }
                  {
                    (asBuiltBimFile && rawDataFile) ? (
                      <div>
                        <LoadingButton
                          fullWidth
                          onClick={handleSaveToIpfs}
                          loading={loading}
                          variant="contained"
                          className="mt-2 mb-2"
                        >
                          Save initial data files to IPFS
                        </LoadingButton>
                        <Button disabled fullWidth variant="contained" className="mt-2 mb-2">
                          Request Payment
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <Button disabled fullWidth variant="contained" className="mt-2 mb-2">
                          Save initial data files to IPFS
                        </Button>
                        <Button disabled fullWidth variant="contained" className="mt-2 mb-2">
                          Request Payment
                        </Button>
                      </div>
                    )
                  }
                </div>
              )
            }
          </MDBCardText>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};
