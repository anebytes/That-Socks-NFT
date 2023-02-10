import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, List, Spin, Space, Select, Modal } from "antd";
import { Address, AddressInput } from "../components";
import { ethers } from "ethers";

import "./YourSocks.css";
import SockCard from "../components/SockCard";
import StyleCard from "../components/StyleCard";

import { NftExcludeFilters, Alchemy, Network } from "alchemy-sdk";

function YourSocks({
  readContracts,
  writeContracts,
  priceToMint,
  yourCollectibles,
  tx,
  mainnetProvider,
  blockExplorer,
  transferToAddresses,
  setTransferToAddresses,
  address,
  localProviderPollingTime,
  alchemyKey,
}) {
  const settings = {
    apiKey: alchemyKey,
    network: Network.ETH_GOERLI,
  };

  const [loading, setLoading] = useState(true);
  const [nfts, setNfts] = useState([]);
  const [styleNfts, setStyleNfts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const alchemy = new Alchemy(settings);

  const thatSocksContract = writeContracts?.ThatSocks?.address;
  const backgroundContract = writeContracts?.Background?.address;
  const legContract = writeContracts?.Leg?.address;
  const pegContract = writeContracts?.Peg?.address;
  const shoeContract = writeContracts?.Shoe?.address;
  const patternContract = writeContracts?.Pattern?.address;
  const logoContract = writeContracts?.Logo?.address;
  const [displayContractName, setDisplayContractName] = useState("ThatSocks");
  const [selectedStyleContract, setSelectedStyleContract] = useState();
  const [selectedContract, setSelectedContract] = useState();
  const [selectedCard, setSelectedCard] = useState(null);
  const [styleMode, setStyleMode] = useState("Add Accessory");
  const [upgradeTxStyleId, setUpgradeTxStyleId] = useState();
  const [upgradeTxSocksId, setUpgradeTxSocksId] = useState();
  const [upgradeTxContractName, setUpgradeTxContractName] = useState("Background");
  const [refresh, setRefresh] = useState(false);
  const [upgradedStyleId, setUpgradedStyleId] = useState();

  if (thatSocksContract && !selectedContract) {
    setSelectedContract(thatSocksContract);
    setDisplayContractName("ThatSocks");
  }
  if (!selectedStyleContract && backgroundContract) {
    setSelectedStyleContract(backgroundContract);
  }

  useEffect(() => {
    const updateAllSocks = async () => {
      if (address && selectedContract) {
        setLoading(true);
        const response = await alchemy.nft.getNftsForOwner(address, {
          contractAddresses: [selectedContract],
        });

        console.log(response);
        setNfts(response.ownedNfts);
        console.log(nfts);
        setLoading(false);
      }
    };
    updateAllSocks();
  }, [readContracts, address, selectedContract, writeContracts, refresh]);

  useEffect(() => {
    const useAddress = styleMode == "Add Accessory" ? address : thatSocksContract;

    const updateStyles = async () => {
      if (useAddress && selectedStyleContract) {
        const response = await alchemy.nft.getNftsForOwner(useAddress, {
          contractAddresses: [selectedStyleContract],
        });

        console.log(response);
        setStyleNfts(response?.ownedNfts);
        console.log(styleNfts);
      }
    };
    updateStyles();
  }, [readContracts, address, selectedStyleContract, writeContracts, selectedStyleContract, styleMode, refresh]);

  useEffect(() => {
    if (upgradeTxSocksId) {
      const getUpgradeId = async () => {
        const upgradeIds = await readContracts.ThatSocks.socksUpgrades(upgradeTxSocksId);
        console.log(upgradeIds);
        const idname = upgradeTxContractName.toLowerCase() + "Id";
        let currentUpgradeId = upgradeIds[idname].toNumber();
        setUpgradedStyleId(currentUpgradeId);
      };
      getUpgradeId();
    }
  }, [upgradeTxSocksId, upgradeTxContractName]);

  const handleContractChange = value => {
    setSelectedContract(value);
    if (value == thatSocksContract) {
      setDisplayContractName("ThatSocks");
    }
    if (value == backgroundContract) {
      setDisplayContractName("Background");
    }
    if (value == pegContract) {
      setDisplayContractName("Peg");
    }
    if (value == legContract) {
      setDisplayContractName("Leg");
    }
    if (value == logoContract) {
      setDisplayContractName("Logo");
    }
    if (value == patternContract) {
      setDisplayContractName("Pattern");
    }
    if (value == shoeContract) {
      setDisplayContractName("Shoe");
    }
  };

  const handleStyleContractChange = value => {
    setSelectedStyleContract(value);

    if (value == backgroundContract) {
      setUpgradeTxContractName("Background");
    }
    if (value == pegContract) {
      setUpgradeTxContractName("Peg");
    }
    if (value == legContract) {
      setUpgradeTxContractName("Leg");
    }
    if (value == logoContract) {
      setUpgradeTxContractName("Logo");
    }
    if (value == patternContract) {
      setUpgradeTxContractName("Pattern");
    }
    if (value == shoeContract) {
      setUpgradeTxContractName("Shoe");
    }
  };

  const showModal = id => {
    setIsModalOpen(true);
    setUpgradeTxSocksId(id);
    console.log(upgradeTxSocksId);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    resetStates();
  };

  const handleCardClick = id => {
    setSelectedCard(id);
    setUpgradeTxStyleId(id);
  };

  const handleBlur = () => {
    setSelectedCard(null);
  };

  const handleTx = async () => {
    if (styleMode == "Add Accessory") {
      try {
        const socksIdBytes = "0x" + parseInt(upgradeTxSocksId).toString(16).padStart(64, "0");
        const upgradeTx = await tx(
          writeContracts[upgradeTxContractName]["safeTransferFrom(address,address,uint256,bytes)"](
            address,
            thatSocksContract,
            upgradeTxStyleId,
            socksIdBytes,
          ),
        );
        resetStates();
        setRefresh(!refresh);
      } catch (error) {
        console.log(error);
        resetStates();
        setRefresh(!refresh);
      }
    }
    if (styleMode == "Remove Accessory") {
      try {
        const upgradeTx = await tx(
          writeContracts["ThatSocks"]["removeNftFromSocks(address,uint256)"](selectedStyleContract, upgradeTxSocksId),
        );
        resetStates();
        setRefresh(!refresh);
      } catch (error) {
        console.log(error);
        resetStates();
        setRefresh(!refresh);
      }
    }
  };

  const resetStates = () => {
    setSelectedCard(null);
    setUpgradeTxStyleId(null);
  };

  return (
    <div className="your-socks" style={{ backgroundImage: "url(SOCKS2.svg)" }}>
      <h2 className="your-socks__title">Your private collection of socks and accessories</h2>
      <p className="your-socks__description">These are all socks and accessories you've minted!</p>
      <Space wrap>
        <Select
          defaultValue="Socks"
          style={{
            width: 120,
            marginBottom: 20,
          }}
          onChange={handleContractChange}
          options={[
            {
              value: thatSocksContract,
              label: "Socks",
            },
            {
              value: backgroundContract,
              label: "Background",
            },
            {
              value: legContract,
              label: "Leg",
            },
            {
              value: pegContract,
              label: "Peg",
            },
            {
              value: patternContract,
              label: "Pattern",
            },
            {
              value: logoContract,
              label: "Logo",
            },
            {
              value: shoeContract,
              label: "Shoe",
            },
          ]}
        />
      </Space>
      <div style={{ margin: "auto", paddingBottom: 25 }}>
        <List
          loading={loading}
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 2,
            lg: 3,
            xl: 4,
            xxl: 6,
          }}
          dataSource={nfts}
          renderItem={item => {
            const id = item.tokenId;

            return (
              <List.Item key={id + "_" + "_" + item.owner} style={{ maxWidth: "320px" }}>
                <SockCard
                  image={item?.media[0]?.raw}
                  id={id}
                  name={item.title}
                  description={item.description}
                  owner={address}
                  address={address}
                  mainnetProvider={mainnetProvider}
                  blockExplorer={blockExplorer}
                  yourSocks
                  tx={tx}
                  transferToAddresses={transferToAddresses}
                  setTransferToAddresses={setTransferToAddresses}
                  writeContracts={writeContracts}
                  address={address}
                  showModal={showModal}
                  selectedContract={selectedContract}
                  readContracts={readContracts}
                  displayContractName={displayContractName}
                  refresh={refresh}
                  setRefresh={setRefresh}
                />
                <Modal
                  visible={isModalOpen}
                  onCancel={handleCancel}
                  okText={styleMode == "Add Accessory" ? "Upgrade" : "Downgrade"}
                  onOk={handleTx}
                  mask={false}
                >
                  <Space wrap>
                    <Select
                      defaultValue="Add Accessory"
                      style={{
                        width: 150,
                      }}
                      onChange={setStyleMode}
                      options={[
                        {
                          value: "Add Accessory",
                          label: "Add Accessory",
                        },
                        {
                          value: "Remove Accessory",
                          label: "Remove Accessory",
                        },
                      ]}
                    />
                  </Space>{" "}
                  <Space wrap>
                    <Select
                      defaultValue="Background"
                      style={{
                        width: 120,
                      }}
                      onChange={handleStyleContractChange}
                      options={[
                        {
                          value: backgroundContract,
                          label: "Background",
                        },
                        {
                          value: legContract,
                          label: "Leg",
                        },
                        {
                          value: pegContract,
                          label: "Peg",
                        },
                        {
                          value: patternContract,
                          label: "Pattern",
                        },
                        {
                          value: logoContract,
                          label: "Logo",
                        },
                        {
                          value: shoeContract,
                          label: "Shoe",
                        },
                      ]}
                    />
                  </Space>
                  {styleMode == "Add Accessory" && (
                    <List
                      loading={loading}
                      grid={{
                        gutter: 9,
                        xs: 3,
                        sm: 3,
                        md: 3,
                        lg: 3,
                        xl: 3,
                        xxl: 3,
                      }}
                      dataSource={styleNfts}
                      renderItem={item => {
                        const id = item.tokenId;

                        return (
                          <List.Item
                            key={id + "_" + "_" + item.owner}
                            style={{ maxWidth: "320px" }}
                            onClick={() => handleCardClick(id)}
                            onBlur={handleBlur}
                            className={selectedCard === id ? "selected-card" : ""}
                          >
                            <StyleCard
                              image={item?.media[0]?.raw}
                              id={id}
                              name={item.title}
                              description={item.description}
                              owner={address}
                              mainnetProvider={mainnetProvider}
                              blockExplorer={blockExplorer}
                              yourSocks
                              tx={tx}
                              transferToAddresses={transferToAddresses}
                              setTransferToAddresses={setTransferToAddresses}
                              writeContracts={writeContracts}
                              address={address}
                              selectedContract={selectedContract}
                              accessoryName={upgradeTxContractName}
                              localProviderPollingTime={localProviderPollingTime}
                              readContracts={readContracts}
                            />
                          </List.Item>
                        );
                      }}
                    />
                  )}
                  {styleMode == "Remove Accessory" && (
                    <List
                      loading={loading}
                      grid={{
                        gutter: 1,
                        xs: 1,
                        sm: 1,
                        md: 1,
                        lg: 1,
                        xl: 1,
                        xxl: 1,
                      }}
                      dataSource={styleNfts}
                      renderItem={item => {
                        const id = item.tokenId;
                        if (id == upgradedStyleId) {
                          return (
                            <List.Item
                              key={id + "_" + "_" + item.owner}
                              style={{ maxWidth: "180px" }}
                              onClick={() => handleCardClick(id)}
                              onBlur={handleBlur}
                              className={selectedCard === id ? "selected-card" : ""}
                            >
                              <StyleCard
                                image={item?.media[0]?.raw}
                                id={id}
                                name={item.title}
                                description={item.description}
                                owner={address}
                                mainnetProvider={mainnetProvider}
                                blockExplorer={blockExplorer}
                                yourSocks
                                tx={tx}
                                transferToAddresses={transferToAddresses}
                                setTransferToAddresses={setTransferToAddresses}
                                writeContracts={writeContracts}
                                address={address}
                                selectedContract={selectedContract}
                                accessoryName={upgradeTxContractName}
                                localProviderPollingTime={localProviderPollingTime}
                                readContracts={readContracts}
                                styleMode={styleMode}
                                socksId={upgradeTxSocksId}
                              />
                            </List.Item>
                          );
                        }
                      }}
                    />
                  )}
                </Modal>
              </List.Item>
            );
          }}
        />
      </div>
    </div>
  );
}

export default YourSocks;
