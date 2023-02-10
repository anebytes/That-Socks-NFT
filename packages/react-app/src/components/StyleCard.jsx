import { useState, useEffect } from "react";
import { Button, Card } from "antd";
import Address from "./Address";
import AddressInput from "./AddressInput";
import { useContractReader } from "eth-hooks";
import "./StyleCard.css";
import { UpOutlined } from "@ant-design/icons";

export default function StyleCard({ id, name, description, readContracts, accessoryName, styleMode }) {
  const [image, setImage] = useState();

  useEffect(() => {
    const getImage = async () => {
      let image = await readContracts[accessoryName]?.renderTokenById(id);
      image =
        `<svg width="100%" viewBox="0 0 1086 1086" preserveAspectRatio="xMidYMid meet" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">` +
        image +
        `</svg>`;
      setImage(image);
    };
    if (id && accessoryName) getImage();
  }, [accessoryName, id, readContracts]);

  return (
    <>
      {!styleMode && (
        <Card
          style={{ marginTop: 10, maxWidth: "180px" }}
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
          <div style={{ borderTop: "1px solid #f0f0f0", textAlign: "left" }}>
            <div style={{ fontSize: "11px", fontWeight: "bold", marginTop: "-10px" }}>
              <span style={{ fontSize: 11, marginRight: 8 }}>{name}</span>
            </div>
            <div style={{ fontSize: 11, marginTop: "" }}>{description}</div>
          </div>
        </Card>
      )}
      {styleMode && (
        <Card
          style={{ marginTop: 10, maxWidth: "180px" }}
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
          <div style={{ borderTop: "1px solid #f0f0f0", textAlign: "left" }}>
            <div style={{ fontSize: "11px", fontWeight: "bold", marginTop: "-10px" }}>
              <span style={{ fontSize: 11, marginRight: 8 }}>{name}</span>
            </div>
            <div style={{ fontSize: 11, marginTop: "" }}>{description}</div>
          </div>
        </Card>
      )}
    </>
  );
}
