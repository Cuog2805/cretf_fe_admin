import React from "react";
import { Card, Button, Typography } from "antd";

const { Title, Text } = Typography;

// Dữ liệu cho các thẻ
const cardData = [
  {
    title: "Buy",
    description: "We can help you search for apartments or rental homes in todays market.",
    buttonText: "Find an agent",
  },
  {
    title: "Rent",
    description: "Whether youre searching for apartments or rental homes, click here.",
    buttonText: "Explore rentals",
  },
];

const Section1 = () => {
  return (
    <div style={{ display: "flex", gap: 20, justifyContent: "center", padding: 20 }}>
      {cardData.map((item, index) => (
        <Card key={index} style={{ width: 300, textAlign: "center", borderRadius: 12 }}>
          <Title level={4}>{item.title}</Title>
          <Text>{item.description}</Text>
          <Button type="default" size="large" style={{ marginTop: 16 }}>
            {item.buttonText}
          </Button>
        </Card>
      ))}
    </div>
  );
};

export default Section1;
