import { useEthers } from "@usedapp/core";
import Button from '@mui/material/Button';
import {MDBContainer} from "mdb-react-ui-kit";

export const Header = () => {
  const { activateBrowserWallet, deactivate, account } = useEthers();


  return (
    <MDBContainer>
    <div className='d-flex justify-content-end mt-3'>
      {!account && <Button variant="contained" onClick={() => activateBrowserWallet()}> Connect </Button>}
      {account && <Button variant="outlined" onClick={deactivate}> Disconnect </Button>}

  
    </div>
    </MDBContainer>
  );
};
