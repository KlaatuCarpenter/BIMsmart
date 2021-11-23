import React from "react";
import { DAppProvider, ChainId } from "@usedapp/core";
import { Header } from "./components/Header";
import { Main } from "./components/Main";
import { MDBContainer } from "mdb-react-ui-kit";

const config = {
    supportedChains: [ChainId.Kovan],
    notifications: {
      expirationPeriod: 1000,
      checkInterval: 1000,
    },
}

function App() {
  return (
    <DAppProvider config={config}>
      <MDBContainer>
        <Header />
        <Main />
      </MDBContainer>
    </DAppProvider>
  );
}

export default App;
