import { initTransaction } from "../helpers";
import { MDBContainer, MDBCard, MDBCardBody, MDBCardText } from "mdb-react-ui-kit";
import { LoadingButton } from "@mui/lab";
import React, { useState } from "react";
import { useEthers } from "@usedapp/core";
import { ethers } from "ethers";
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';


export const Deposit = () => {
    const { chainId } = useEthers();

    const [miningTransaction, setMiningTransaction] = useState<boolean>(false)

    const handleDepositTransaction = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setMiningTransaction(true);

        const data = new FormData(event.currentTarget as HTMLFormElement);
        const amount = ethers.utils.parseEther(String(data.get("amount")))

        const autonomousPaymentContract = await initTransaction(chainId)
        await autonomousPaymentContract.deposit({ value: amount });
        setMiningTransaction(false);



    }

    return (
        <MDBContainer>
            <MDBCard className="mt-3 mb-3">
                <MDBCardBody>
                    <MDBCardText>
                        <form onSubmit={handleDepositTransaction}>
                            <FormControl fullWidth sx={{ m: 1 }}>
                                <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-amount"
                                    startAdornment={<InputAdornment position="start">ETH</InputAdornment>}
                                    fullWidth
                                    label="Amount"
                                    name="amount"
                                />
                            </FormControl>
                            <LoadingButton
                                type="submit"
                                fullWidth
                                loading={miningTransaction}
                                variant="contained">
                                Deposit
                            </LoadingButton>
                        </form>
                    </MDBCardText>
                </MDBCardBody>
            </MDBCard>
        </MDBContainer>
    )

}