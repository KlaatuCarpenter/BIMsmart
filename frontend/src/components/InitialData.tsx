import {
    MDBCard,
    MDBCardBody,
    MDBCardText,
    MDBCardTitle,
    MDBContainer,
    MDBListGroup,
    MDBListGroupItem
} from "mdb-react-ui-kit";
import { LoadingButton } from "@mui/lab";
import Button from '@mui/material/Button';
import { useProjectInfo } from "../hooks";
import { submitToIpfs } from "../helpers";
import { initTransaction } from "../helpers"
import React, { useState } from "react";
import { useEthers } from "@usedapp/core";
import { UploadButton } from "./uploadButtons/UploadButton"

export const InitialData = () => {
    /// reading from blockchain
    const myProjectInfo = useProjectInfo()

    const CID_listOfElementsAndGUIDs = myProjectInfo[5][0]
    const CID_scheduleOfValues = myProjectInfo[5][1]
    const CID_solutionUsedForProgressEvaluation = myProjectInfo[5][2]
    console.log(CID_listOfElementsAndGUIDs)

    /// state variables used with input files
    const [listOfElementsAndGUIDs_CID, setListOfElementsAndGUIDs_CID] = useState<string | undefined>();
    const [scheduleOfValues_CID, setScheduleOfValues_CID] = useState<string | undefined>();
    const [solutionUsedForProgressEvaluation_CID, setSolutionUsedForProgressEvaluation_CID,] = useState<string | undefined>();
    const [listOfElementsAndGUIDs, setListOfElementsAndGUIDs] = useState<File | undefined>();
    const [scheduleOfValues, setScheduleOfValues] = useState<File | undefined>();
    const [solutionUsedForProgressEvaluation, setSolutionUsedForProgressEvaluation,] = useState<File | undefined>();

    const [loading, setLoading] = useState<boolean>(false);
    const [initialDataReadyToSend, setInitialDataReadyToSend] = useState<boolean>(false);

    const changeListOfElementsAndGUIDs = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files;
        if (file && file.length === 1) { setListOfElementsAndGUIDs(file[0]); }
        console.log(listOfElementsAndGUIDs)
    };

    const changeScheduleOfValues = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = (event.target as HTMLInputElement).files;
        if (file && file.length === 1) { setScheduleOfValues(file[0]); }
        console.log(scheduleOfValues)
    };

    const changeSolutionUsedForProgressEvaluation = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = (event.target as HTMLInputElement).files;
        if (file && file.length === 1) { setSolutionUsedForProgressEvaluation(file[0]); }
        console.log(solutionUsedForProgressEvaluation)
    };

    const uploadButtons = [
        {
            file: listOfElementsAndGUIDs,
            label: "Upload list of elements and GUIDs",
            changeHandler: changeListOfElementsAndGUIDs,
        },
        {
            file: scheduleOfValues,
            label: "Upload schedule of values",
            changeHandler: changeScheduleOfValues,
        },
        {
            file: solutionUsedForProgressEvaluation,
            label: "Upload solution used for progress evaluation",
            changeHandler: changeSolutionUsedForProgressEvaluation,
        },
    ]

    ///   Writing to IPFS
    const handleSaveToIpfs = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();

        if (
            listOfElementsAndGUIDs &&
            scheduleOfValues &&
            solutionUsedForProgressEvaluation
        ) {
            setLoading(true);

            const request1 = submitToIpfs(listOfElementsAndGUIDs, listOfElementsAndGUIDs.name);
            const request2 = submitToIpfs(scheduleOfValues, scheduleOfValues.name);
            const request3 = submitToIpfs(solutionUsedForProgressEvaluation, solutionUsedForProgressEvaluation.name);

            request1
                .on("httpHeaders", (statusCode, headers) => {
                    const ipfsHashV0 = headers["x-fleek-ipfs-hash-v0"];
                    setListOfElementsAndGUIDs_CID(ipfsHashV0);
                    console.log('listOfElementsAndGUIDs_CID' + listOfElementsAndGUIDs_CID);
                })
                .send();

            request2
                .on("httpHeaders", (statusCode, headers) => {
                    const ipfsHashV0 = headers["x-fleek-ipfs-hash-v0"];
                    setScheduleOfValues_CID(ipfsHashV0);
                    console.log('scheduleOfValues_CID' + scheduleOfValues_CID);
                })
                .send();

            request3
                .on("httpHeaders", (statusCode, headers) => {
                    const ipfsHashV0 = headers["x-fleek-ipfs-hash-v0"];
                    setSolutionUsedForProgressEvaluation_CID(ipfsHashV0);
                    setLoading(false);
                    statusCode === 200 ? setInitialDataReadyToSend(true) : console.log(statusCode);
                    console.log('solutionUsedForProgressEvaluation_CID' + solutionUsedForProgressEvaluation_CID);
                })
                .send();
        } else {
            alert("No files!");
        }
    }

    /// Provide initial data transaction to smart contract 
    const { chainId } = useEthers();
    const [miningTransaction, setMiningTransaction] = useState<boolean>(false);

    const handleInitialDataTransaction = async (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        if (listOfElementsAndGUIDs_CID && scheduleOfValues_CID && solutionUsedForProgressEvaluation_CID) {
            setMiningTransaction(true);
            const autonomousPaymentContract = await initTransaction(chainId)
            await autonomousPaymentContract.provideInitialData(
                listOfElementsAndGUIDs_CID,
                scheduleOfValues_CID,
                solutionUsedForProgressEvaluation_CID
            );
            setMiningTransaction(false);
        } else {
            alert("Provide files before sending transaction!");
        }

    }



    return (
        <MDBContainer>
            <MDBCard className="mt-3 mb-3">
                <MDBCardBody>
                    <MDBCardTitle>{CID_listOfElementsAndGUIDs ? 'Initial Contract Data' : 'Provide Initial Contract Data'}</MDBCardTitle>
                    <MDBCardText>
                        {
                            (CID_listOfElementsAndGUIDs && CID_scheduleOfValues && CID_solutionUsedForProgressEvaluation) ? (
                                <MDBListGroup flush>
                                    <MDBListGroupItem tag="a" href={CID_listOfElementsAndGUIDs}>
                                        CID_listOfElementsAndGUIDs: {CID_listOfElementsAndGUIDs}
                                    </MDBListGroupItem>
                                    <MDBListGroupItem tag="a" href={CID_scheduleOfValues}>
                                        CID_scheduleOfValues: {CID_scheduleOfValues}
                                    </MDBListGroupItem>
                                    <MDBListGroupItem tag="a" href={CID_solutionUsedForProgressEvaluation}>
                                        CID_solutionUsedForProgressEvaluation: {CID_solutionUsedForProgressEvaluation}
                                    </MDBListGroupItem>
                                </MDBListGroup>
                            ) : (
                                <div>
                                    {
                                        uploadButtons.map(item => {
                                            return (
                                                <UploadButton file={item.file}
                                                    label={item.label}
                                                    changeHandler={item.changeHandler} />

                                            )
                                        })
                                    }
                                    {
                                        (listOfElementsAndGUIDs && scheduleOfValues && solutionUsedForProgressEvaluation) ? (
                                            <LoadingButton
                                                fullWidth
                                                onClick={handleSaveToIpfs}
                                                loading={loading}
                                                variant="contained"
                                                className="mt-2 mb-2"
                                            >
                                                Save initial data files to IPFS
                                            </LoadingButton>
                                        )
                                            : (
                                                <Button disabled fullWidth variant="contained" className="mt-2 mb-2">
                                                    Save initial data files to IPFS
                                                </Button>
                                            )
                                    }

                                    {initialDataReadyToSend ? (
                                        <LoadingButton
                                            fullWidth
                                            onClick={handleInitialDataTransaction}
                                            loading={miningTransaction}
                                            variant="contained"
                                            className="mt-2 mb-2">
                                            Save ipfs hashes of initial data to blockchain
                                        </LoadingButton>
                                    )
                                        : (
                                            <Button disabled fullWidth variant="contained" className="mt-2 mb-2">
                                                Save ipfs hashes of initial data to blockchain
                                            </Button>
                                        )}
                                </div>



                            )
                        }
                    </MDBCardText>
                </MDBCardBody>
            </MDBCard>
        </MDBContainer>
    );
};

