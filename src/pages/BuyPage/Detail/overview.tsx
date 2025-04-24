import { Divider } from "antd";
import { Flex } from "antd";
import { Space, Tag } from "antd";
import useStatus from "@/selectors/useStatus";
import { Card } from "antd";
import { Typography } from "antd";

const { Text, Title } = Typography;

const Overview = ({ propertyDetail }: { propertyDetail: API.PropertyDTO | null }) => {
  const { propertyStatusList } = useStatus();
  return (
    <div
      id="overview"
      style={{
        paddingTop: '120px',
        marginTop: '-110px',
      }}
    >
      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            {propertyDetail?.statusIds?.map((statusId) => {
              const status = propertyStatusList.find((s) => s.statusId === statusId);
              return (
                <Tag
                  key={statusId}
                  color={status?.color}
                  style={{
                    fontWeight: 600,
                  }}
                >
                  {status?.name?.toUpperCase()}
                </Tag>
              );
            })}
            <Title level={3} style={{ marginTop: 16 }}>
              {propertyDetail?.addressSpecific?.toLocaleUpperCase()}
            </Title>
          </div>

          <Flex gap="large">
            <div>
              <Title level={2} style={{ margin: 0 }}>
                {propertyDetail?.propertyPriceNewest?.value}&ensp;
                {propertyDetail?.propertyPriceNewest?.scaleUnit}
              </Title>
              {/* <Text type="secondary">Est. $3,916/mo</Text> */}
            </div>
            <Divider type="vertical" style={{ height: '50px' }} />
            <div>
              <Title level={3} style={{ margin: 0 }}>
                {propertyDetail?.amenityDTOs?.find((item) => item.code === 'BED')?.value}
              </Title>
              <Text type="secondary">
                {propertyDetail?.amenityDTOs?.find((item) => item.code === 'BED')?.scaleUnit}
              </Text>
            </div>
            <div>
              <Title level={3} style={{ margin: 0 }}>
                {propertyDetail?.amenityDTOs?.find((item) => item.code === 'BATH')?.value}
              </Title>
              <Text type="secondary">
                {propertyDetail?.amenityDTOs?.find((item) => item.code === 'BATH')?.scaleUnit}
              </Text>
            </div>
            <div>
              <Title level={3} style={{ margin: 0 }}>
                {propertyDetail?.amenityDTOs?.find((item) => item.code === 'AREA')?.value}
              </Title>
              <Text type="secondary">
                {propertyDetail?.amenityDTOs?.find((item) => item.code === 'AREA')?.scaleUnit}
              </Text>
            </div>
          </Flex>
        </Space>
      </Card>
    </div>
  );
};

export default Overview;
