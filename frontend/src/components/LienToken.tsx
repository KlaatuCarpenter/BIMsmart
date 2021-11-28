import {
    MDBCard,
    MDBCardBody,
    MDBCardTitle,
    MDBCardText,
    MDBCardImage,
    MDBRow,
    MDBCol,
    MDBContainer,
} from "mdb-react-ui-kit";
import { LoadingButton } from "@mui/lab";
import React, { useState } from "react";
import { useEthers } from "@usedapp/core";
import { useProjectInfo } from "../hooks"
import { initTransaction } from "../helpers"

export const LienToken = () => {

    const projectInfo = useProjectInfo();
    const numberOfPaymentsDone = projectInfo[6]?.toString()
    const numberOfTokens = parseInt(numberOfPaymentsDone);
    const lienTokens: number[] = [];
    for (let i = 1; i <= numberOfTokens; i++) {
        lienTokens.push(i);
    }

    /// Call metadata
    const { chainId } = useEthers();
    const [callingMetadata, setCallingMetadata] = useState<boolean>(false);
    const [metadata, setMetadata] = useState<string[]>([]);
    const [tokensOwners, setTokenOwner] = useState<string[]>([]);

    const showMetadata = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setCallingMetadata(true);

        const tokenId = event.currentTarget.id;

        const autonomousPaymentContract = await initTransaction(chainId)
        const tokenUri = await autonomousPaymentContract.tokenURI(tokenId);
        const tokenOwner = await autonomousPaymentContract.ownerOf(tokenId);
        setCallingMetadata(false);
        setMetadata([...metadata, tokenUri]);
        setTokenOwner([...tokensOwners, tokenOwner]);

    }

    return (
        <MDBContainer>
            <MDBRow className='row-cols-3 row-cols-md-3'>
                {
                    lienTokens.map(tokenId => {
                        return (
                            <MDBCol>
                                <MDBCard className="mt-3 mb-3">
                                    <MDBCardImage
                                        src="https://mdbcdn.b-cdn.net/img/new/standard/nature/184.jpg"
                                        position="top"
                                        alt="..."
                                    />
                                    <MDBCardBody>
                                        <MDBCardTitle>Lien Token {tokenId}</MDBCardTitle>
                                        <MDBCardText>
                                            {
                                                metadata[tokenId - 1] ? (
                                                    <>
                                                        <p>Owner: {tokensOwners[tokenId - 1]}</p>
                                                        <a href={'http://ipfs.io/ipfs/' + metadata[tokenId - 1]} target="_blank">
                                                            {metadata[tokenId - 1]}
                                                        </a>
                                                    </>
                                                ) : (
                                                    <LoadingButton
                                                        fullWidth
                                                        onClick={showMetadata}
                                                        loading={callingMetadata}
                                                        variant="contained"
                                                        id={tokenId.toString()}>
                                                        Show token metadata
                                                    </LoadingButton>
                                                )
                                            }


                                        </MDBCardText>
                                    </MDBCardBody>
                                </MDBCard>
                            </MDBCol>
                        )
                    })
                }



            </MDBRow>
        </MDBContainer>
    )

}