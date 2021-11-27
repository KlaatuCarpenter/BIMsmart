import React from "react";
import { DAppProvider, ChainId } from "@usedapp/core";
import { Main } from "./components/Main";

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
      
        {/* <Header /> */}
        <Main />
        
      
    </DAppProvider>
  );
}

export default App;
