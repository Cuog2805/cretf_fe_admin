import React from "react";
import { Card, Button, Typography } from "antd";
import { useNavigate } from "@umijs/max";

const { Title, Text } = Typography;

// Dữ liệu cho các thẻ
const cardData = [
  {
    title: "Mua",
    description: "Tìm kiếm căn hộ hoặc nhà đang rao bán trên thị trường hiện nay.",
    buttonText: "Tìm ngay",
    link: "/buy/houses-for-sale",
  },
  {
    title: "Cho thuê",
    description: "Tìm kiếm căn hộ hoặc nhà đang cho thuê trên thị trường hiện nay.",
    buttonText: "Tìm ngay",
    link: "/rent/houses-for-rent",
  },
];

const Section1 = () => {
  const navigate = useNavigate();
  
  return (
    <div style={{ display: "flex", gap: 20, justifyContent: "center", padding: 20 }}>
      {cardData.map((item, index) => (
        <Card key={index} style={{ width: 300, textAlign: "center", borderRadius: 12 }}>
          <Title level={4}>{item.title}</Title>
          <Text>{item.description}</Text>
          <br />
          <Button type="default" size="large" onClick={() => navigate(item.link)} style={{ marginTop: 16 }}>
            {item.buttonText}
          </Button>
        </Card>
      ))}
    </div>
  );
};

export default Section1;
