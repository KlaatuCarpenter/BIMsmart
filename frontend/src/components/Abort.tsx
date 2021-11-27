import { useEthers } from "@usedapp/core";
import { initTransaction } from "../helpers";
import { MDBContainer, MDBCard, MDBCardBody, MDBCardText } from "mdb-react-ui-kit";
import { LoadingButton } from "@mui/lab";
import React, { useState } from "react";


export const Abort = () => {
    const { chainId } = useEthers();
    const [miningTransaction, setMiningTransaction] = useState<boolean>(false)

    const abortContract = async (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        setMiningTransaction(true);

        const autonomousPaymentContract = await initTransaction(chainId);
        await autonomousPaymentContract.abort();
        setMiningTransaction(false);
    }


    return (
        <MDBContainer>
            <MDBCard className="mt-3 mb-3">
                <MDBCardBody>
                    <MDBCardText>
                        <LoadingButton
                            type="submit"
                            fullWidth
                            loading={miningTransaction}
                            variant="contained"
                            onClick={abortContract}
                            color="error">
                            Abort contract
                        </LoadingButton>
                    </MDBCardText>
                </MDBCardBody>
            </MDBCard>
        </MDBContainer >

    )
}