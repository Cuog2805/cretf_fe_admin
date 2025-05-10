import React, { useState } from "react";
import { Layout, Input, Menu, Avatar, Select, Button } from "antd";
import { SearchOutlined, UserOutlined } from "@ant-design/icons";
import { Content } from "antd/es/layout/layout";
import { Option } from "antd/es/mentions";

const Banner: React.FC = () => {
    const [searchCategory, setSearchCategory] = useState("Buy");

    return (
      <Content style={{ textAlign: "center", background: "#f0f2f5" }}>
        <div style={{ background: "url('/image/banner-01.png') center/cover no-repeat", height: 500, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          <h1 style={{ color: "white", fontSize: "36px", fontWeight: "bold" }}>Find the right home at the right price</h1>
          <div style={{ display: "flex", alignItems: "center", width: "50%", background: "white", padding: "10px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", marginTop: "20px" }}>
            <Select value={searchCategory} onChange={setSearchCategory} style={{ width: 120 }}>
              <Option value="Buy">Buy</Option>
              <Option value="Rent">Rent</Option>
              <Option value="Sell">Sell</Option>
              <Option value="Mortgage">Mortgage</Option>
              <Option value="My Home Value">My Home Value</Option>
            </Select>
            <Input placeholder="City, Address, School, Agent, ZIP" style={{ flex: 1, marginLeft: 10 }} />
            <Button type="primary" icon={<SearchOutlined />} style={{ marginLeft: 10 }} />
          </div>
        </div>
      </Content>
    );
};

export default Banner;
