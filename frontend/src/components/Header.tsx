import { useEthers } from "@usedapp/core";
import { MDBBtn } from 'mdb-react-ui-kit';

export const Header = () => {
  const { activateBrowserWallet, deactivate, account } = useEthers();


  return (
    <div className='d-flex justify-content-end'>
      {!account && <MDBBtn onClick={() => activateBrowserWallet()}> Connect </MDBBtn>}
      {account && <MDBBtn onClick={deactivate}> Disconnect </MDBBtn>}

  
    </div>
  );
};
