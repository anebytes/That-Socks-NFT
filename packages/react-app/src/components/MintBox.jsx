import React, { useState, useEffect, useRef } from "react";
import { Button, Select, Space } from "antd";
import { useContractReader } from "eth-hooks";
import { ethers } from "ethers";
import "./MintBox.css";

const MintBox = ({ writeContracts, readContracts, localProviderPollingTime, tx }) => {
  const thatSocksContract = writeContracts?.ThatSocks?.address;
  const backgroundContract = writeContracts?.Background?.address;
  const legContract = writeContracts?.Leg?.address;
  const pegContract = writeContracts?.Peg?.address;
  const shoeContract = writeContracts?.Shoe?.address;
  const patternContract = writeContracts?.Pattern?.address;
  const logoContract = writeContracts?.Logo?.address;

  const [selectedContract, setSelectedContract] = useState();
  const [selectedContractName, setSelectedContractName] = useState();
  const [mintPrice, setMintPrice] = useState(null);
  const [image, setImage] = useState();
  const [refreshCanvas, setRefreshCanvas] = useState(false);
  const [amountLeft, setAmountLeft] = useState();

  const price = useContractReader(readContracts, "ThatSocks", "price", [], localProviderPollingTime);

  const getAmountLeft = async () => {
    const totalSupply = await readContracts[selectedContractName]?.totalSupply();
    setAmountLeft(3728 - totalSupply);
  };

  const getMintPrice = async () => {
    try {
      const price = await readContracts[selectedContractName]?.price();
      setMintPrice(price);
      console.log(mintPrice);
    } catch (error) {
      console.log(error);
      setMintPrice(0);
      console.log(mintPrice);
    }
  };

  const getMintFee = async () => {
    const price = await readContracts[selectedContractName]?.price();
    return price;
  };

  if (thatSocksContract && !selectedContract && price) {
    setSelectedContract(thatSocksContract);
    setSelectedContractName("ThatSocks");
    getMintPrice();
    setMintPrice(price);
    getAmountLeft();
  }

  const handleContractChange = value => {
    setSelectedContract(value);
    setImage(null);
    setRefreshCanvas(!refreshCanvas);
    contextRef.current.globalCompositeOperation = "null";
    setIsErase(false);
    if (value == thatSocksContract) {
      setSelectedContractName("ThatSocks");
    }
    if (value == backgroundContract) {
      setSelectedContractName("Background");
    }
    if (value == pegContract) {
      setSelectedContractName("Peg");
    }
    if (value == legContract) {
      setSelectedContractName("Leg");
    }
    if (value == logoContract) {
      setSelectedContractName("Logo");
    }
    if (value == patternContract) {
      setSelectedContractName("Pattern");
    }
    if (value == shoeContract) {
      setSelectedContractName("Shoe");
    }
    getMintPrice();

    getAmountLeft();
  };

  useEffect(() => {
    getMintPrice();
    getAmountLeft();
  }, [selectedContract, selectedContractName, refreshCanvas]);

  const handleTx = async () => {
    getMintPrice();
    if (image) {
      setRefreshCanvas(!refreshCanvas);
      setImage();
    } else {
      setRefreshCanvas(!refreshCanvas);
    }
    try {
      const mintTx = await tx(writeContracts[selectedContractName].mintItem({ value: getMintFee(), gasLimit: 300000 }));
      const receipt = await mintTx.wait();
      const recentMintId = receipt.events[0].args[2].toNumber();
      setRecentlyListedImage(recentMintId);
      setToErase();
    } catch (error) {
      console.log(error);
    }
    getMintPrice();
    getAmountLeft();
  };

  const setRecentlyListedImage = async id => {
    let svg = await readContracts[selectedContractName].renderTokenById(id);
    svg =
      `<svg width="100%" viewBox="0 0 1086 1086" preserveAspectRatio="xMidYMid meet" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">` +
      svg +
      `</svg>`;
    setImage(svg);
    getAmountLeft();
  };

  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [isErase, setIsErase] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 300;
    canvas.height = 300;
    const context = canvas.getContext("2d");

    context.lineCap = "round";
    context.lineWidth = 60;
    contextRef.current = context;
    context.fillStyle = "silver";
    // context.strokeStyle = "silver";

    contextRef.current.fillRect(0, 0, canvas.width, canvas.height);
    contextRef.current.globalCompositeOperation = "null";
  }, [refreshCanvas]);

  const startDrawing = ({ nativeEvent }) => {
    const { clientX, clientY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(clientX, clientY);
    contextRef.current.lineTo(clientX, clientY);
    contextRef.current.stroke();
    setIsDrawing(true);
    nativeEvent.preventDefault();
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) {
      return;
    }

    const { offsetX, offsetY } = nativeEvent;

    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
    nativeEvent.preventDefault();
  };

  const stopDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const setToErase = () => {
    contextRef.current.globalCompositeOperation = "destination-out";
    setIsErase(true);
  };

  return (
    <div className="mintbox">
      <div className="mintbox__container">
        <div style={{ display: "flex", height: "10%" }}>
          <div className="mintbox__heading1">
            <img
              src="/assets/party.svg"
              alt="party"
              style={{
                padding: "7px",
              }}
            />
          </div>
          <div className="mintbox__heading2">
            {!image && <p>Mint and scratch the protective layer to view your NFT</p>}
            {image && <p>NFT minted!! Now scratch the protective layer to view your nft</p>}
          </div>
        </div>
        <div style={{ display: "flex", height: "90%", flexDirection: "column", justifyContent: "center" }}>
          <div
            style={{
              width: "95%",
              height: "60%",
              border: "2px solid #000000",
              marginTop: "20px",
              margin: "auto",
              borderRadius: "20px",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {image && (
              <div
                dangerouslySetInnerHTML={{ __html: image }}
                style={{ width: "100%", height: "100%", zIndex: "9", backgroundColor: "#FFFFFF" }}
              ></div>
            )}
            <canvas
              style={{
                height: "100%",
                width: "100%",
                backgroundColor: "transparent",
                cursor: "url(coin.svg) 25 25, pointer",
                position: "absolute",
                top: 0,
                left: 0,
              }}
              ref={canvasRef}
              onMouseDown={e => {
                if (isErase && image) {
                  startDrawing(e);
                }
              }}
              onMouseMove={e => {
                if (isErase && image) draw(e);
              }}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
            ></canvas>
          </div>
          <div style={{ height: "17%", padding: "20px" }}>
            <p style={{ fontWeight: 400 }}>
              Only <span style={{ fontWeight: "bold" }}>3728 Socks</span> available on a price curve
              <span style={{ fontWeight: "bold" }}> increasing 0.2%</span> with each new mint.
            </p>
          </div>
          <div style={{ height: "21%" }}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <Space wrap>
                <Select
                  defaultValue="Socks"
                  style={{
                    width: 120,
                    marginBottom: 20,
                    marginRight: 8,
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
              <p style={{ fontWeight: "bold" }}>{!amountLeft ? "NaN LEFT" : amountLeft + " LEFT"}</p>
            </div>
            <button className="mintbox__btn" onClick={handleTx}>
              <p style={{ margin: 0, marginRight: "0.5rem" }}>
                Mint Now for {mintPrice && (+ethers.utils.formatEther(mintPrice)).toFixed(4)}
              </p>
              <img src="/assets/fa-ethereum.svg" alt="ethereum" style={{ height: "1rem", width: "1rem" }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MintBox;
