import { useEffect, useState } from "react";
import { Button, Card } from "antd";
import Address from "./Address";
import AddressInput from "./AddressInput";
import { useContractReader } from "eth-hooks";
import { NftExcludeFilters, Alchemy, Network } from "alchemy-sdk";

export default function SockCard({
  id,
  name,
  description,
  mainnetProvider,
  blockExplorer,
  yourSocks,
  tx,
  transferToAddresses,
  setTransferToAddresses,
  writeContracts,
  address,
  readContracts,
  localProviderPollingTime,
  showModal,
  selectedContract,
  displayContractName,
  refresh,
  setRefresh,
}) {
  const showTransfer = yourSocks && tx && transferToAddresses && setTransferToAddresses && writeContracts && address;
  const showStyleButton = selectedContract == writeContracts?.ThatSocks?.address;

  const [image, setImage] = useState();
  const [owner, setOwner] = useState();
  const [sockDescription, setSockDescription] = useState();

  useEffect(() => {
    const getImageandOwner = async () => {
      if (!address) {
        let owner = await readContracts[displayContractName]?.ownerOf(id);
        setOwner(owner);
      } else {
        setOwner(address);
      }
      console.log(owner);
      let image = await readContracts[displayContractName]?.renderTokenById(id);
      image =
        `<svg width="100%" viewBox="-4 16 1086 1086" preserveAspectRatio="xMidYMid meet" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">` +
        image +
        `</svg>`;
      setImage(image);
    };
    const getSockDescription = async () => {
      if (displayContractName == "ThatSocks") {
        const desc = await readContracts[displayContractName]?.getDescription(id);
        setSockDescription(desc);
      } else {
        setSockDescription();
      }
    };
    if (id && displayContractName) getImageandOwner();
    getSockDescription();
  }, [displayContractName, id, readContracts, refresh]);

  const handleTransfer = async () => {
    try {
      const transferTx = await tx(
        writeContracts[displayContractName].transferFrom(address, transferToAddresses[id], id),
      );
      setRefresh(!refresh);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card
      style={{
        maxWidth: "300px",
        minHeight: "440px",
        border: "2px solid #000000",
        borderRadius: "10px",
        overflow: "hidden",
      }}
      cover={
        <div
          style={{
            width: "100%",
            overflow: "hidden",
          }}
          dangerouslySetInnerHTML={{ __html: image }}
        />
      }
    >
      {/* <img src='' alt={"Socks #" + id} width="200" /> */}
      {/* <div
        style={{
          width: "100%",
          overflow: "hidden",
        }}
        dangerouslySetInnerHTML={{ __html: image }}
      /> */}
      <div style={{ borderTop: "1px solid #f0f0f0", textAlign: "left" }}>
        <div style={{ fontSize: "17px", fontWeight: "bold", marginTop: "-10px" }}>
          <span style={{ fontSize: 15, marginRight: 8 }}>{name}</span>
        </div>
        <div style={{ marginTop: "8px", fontSize: "12px", minHeight: "56px" }}>
          {sockDescription ? sockDescription : description}
        </div>
        {!yourSocks && (
          <div style={{ marginTop: "8px" }}>
            <Address address={owner} ensProvider={mainnetProvider} blockExplorer={blockExplorer} fontSize={16} />
          </div>
        )}
        {showTransfer && (
          <>
            <div style={{ marginTop: "10px" }}>
              <AddressInput
                style={{ marginTop: "10px" }}
                ensProvider={mainnetProvider}
                placeholder="transfer to address"
                value={transferToAddresses[id]}
                onChange={newValue => {
                  const update = {};
                  update[id] = newValue;
                  setTransferToAddresses({ ...transferToAddresses, ...update });
                }}
              />
            </div>
            <Button
              style={{ marginTop: "10px" }}
              onClick={() => {
                handleTransfer();
              }}
            >
              Transfer
            </Button>
            {showStyleButton && (
              <Button type="primary" style={{ marginTop: "10px", float: "right" }} onClick={() => showModal(id)}>
                Add/Remove Style
              </Button>
            )}
          </>
        )}
      </div>
    </Card>
  );
}
