import { useEthers } from "@usedapp/core";
import { initTransaction } from "../helpers";
import { MDBContainer, MDBCard, MDBCardBody, MDBCardText, MDBListGroup, MDBListGroupItem } from "mdb-react-ui-kit";
import { LoadingButton } from "@mui/lab";
import React, { useState } from "react";


export const Confirm = () => {
    const { chainId } = useEthers();
    const [miningTransaction, setMiningTransaction] = useState<boolean>(false)

    const confirmContract = async (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        setMiningTransaction(true);

        const autonomousPaymentContract = await initTransaction(chainId);
        await autonomousPaymentContract.confirmContract();
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
                            onClick={confirmContract}
                            color="success">
                            Confirm contract
                        </LoadingButton>
                    </MDBCardText>
                </MDBCardBody>
            </MDBCard>
        </MDBContainer>

    )
}