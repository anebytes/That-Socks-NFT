import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, List, Spin } from "antd";
import { NftExcludeFilters, Alchemy, Network } from "alchemy-sdk";
import { Address } from "../components";
import { ethers } from "ethers";
import axios from "axios";

import "./Socks.css";
import SockCard from "../components/SockCard";

function Socks({
  readContracts,
  mainnetProvider,
  blockExplorer,
  totalSupply,
  DEBUG,
  serverUrl,
  localProviderPollingTime,
  writeContracts,
  alchemyKey,
}) {
  const [allSocks, setAllSocks] = useState();
  const [page, setPage] = useState(1);
  const [loadingSocks, setLoadingSocks] = useState(true);
  const perPage = 12;

  const settings = {
    apiKey: alchemyKey,
    network: Network.ETH_GOERLI,
  };

  const alchemy = new Alchemy(settings);

  const omitMetadata = false;
  const thatSocksContract = writeContracts?.ThatSocks?.address;

  useEffect(() => {
    const updateAllSocks = async () => {
      if (thatSocksContract) {
        setLoadingSocks(true);
        const response = await alchemy.nft.getNftsForContract(thatSocksContract, {
          omitMetadata: omitMetadata,
        });

        console.log(response);
        setAllSocks(response?.nfts);
        console.log(allSocks);
        setLoadingSocks(false);
      }
    };
    updateAllSocks();
  }, [page, readContracts, totalSupply, thatSocksContract]);

  return (
    <div className="socks" style={{}}>
      <div style={{ width: "auto", margin: "auto", paddingBottom: 25, minHeight: 800 }}>
        <div>
          <List
            grid={{
              gutter: 16,
              xs: 1,
              sm: 2,
              md: 2,
              lg: 3,
              xl: 4,
              xxl: 6,
            }}
            pagination={{
              total: totalSupply,
              defaultPageSize: perPage,
              defaultCurrent: page,
              onChange: currentPage => {
                setPage(currentPage);
              },
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${totalSupply} items`,
            }}
            loading={loadingSocks}
            dataSource={allSocks?.slice(0).reverse()}
            renderItem={item => {
              const id = item.tokenId;

              return (
                <List.Item key={id + "_" + "_" + item.owner}>
                  <SockCard
                    id={id}
                    name={item.title}
                    description={item.description}
                    localProviderPollingTime={localProviderPollingTime}
                    mainnetProvider={mainnetProvider}
                    blockExplorer={blockExplorer}
                    readContracts={readContracts}
                    displayContractName={"ThatSocks"}
                  />
                </List.Item>
              );
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Socks;
