import "../styles/homepage.css";
import Socks from "./Socks";
import { ethers } from "ethers";
import axios from "axios";
import MintBox from "../components/MintBox";

function Home({
  readContracts,
  mainnetProvider,
  blockExplorer,
  totalSupply,
  DEBUG,
  tx,
  writeContracts,
  serverUrl,
  localProviderPollingTime,
  networkName,
  alchemyKey,
}) {
  return (
    <>
      <div style={{ overflow: "hidden" }}>
        <div
          className="homepage"
          style={{
            backgroundImage: "url('SOCKS.svg')",
            backgroundPosition: "center center",
            backgroundSize: "cover",
          }}
        >
          <div className="homepage__container">
            <p>{networkName}</p>

            <MintBox
              writeContracts={writeContracts}
              readContracts={readContracts}
              localProviderPollingTime={localProviderPollingTime}
              tx={tx}
            />
            {/* <p className="homepage__text  homepage__text--publicGoodText">
              All Ether from sales goes to public goods!!
            </p> */}
          </div>
        </div>
      </div>
      <Socks
        readContracts={readContracts}
        mainnetProvider={mainnetProvider}
        blockExplorer={blockExplorer}
        totalSupply={totalSupply}
        DEBUG={DEBUG}
        serverUrl={serverUrl}
        localProviderPollingTime={localProviderPollingTime}
        writeContracts={writeContracts}
        alchemyKey={alchemyKey}
      />
    </>
  );
}

export default Home;
