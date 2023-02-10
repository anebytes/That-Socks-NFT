import React from "react";
import { Typography } from "antd";

const { Title, Text } = Typography;

// displays a page header

export default function Header({ link, title, subTitle, ...props }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "1.2rem" }}>
      <div style={{ display: "flex", flexDirection: "column", flex: 1, alignItems: "start" }}>
        <a href="/">
          <div style={{ position: "absolute", left: -20, top: -30 }}>
            <img src="that-socks.svg" width="130" height="130" alt="That Socks" />
          </div>
          <Title level={4} style={{ marginLeft: 50 }}>
            That Socks
          </Title>
        </a>
        <Text type="secondary" style={{ textAlign: "left", marginLeft: 50 }}>
          That Socks NFTs
        </Text>
      </div>
      {props.children}
    </div>
  );
}
