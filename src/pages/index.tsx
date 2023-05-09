import React, { useState } from 'react';
import {
  Badge,
  Button,
  Col,
  Row,
  Space,
  Statistic,
  Table,
  Typography,
} from 'antd';
import { useRouter } from 'next/router';

interface StatusProps {
  examingCnt: number;
  examedCnt: number;
  examRejectedCnt: number;
  notOperatingCnt: number;
  operatingCnt: number;
}

interface tableDataType {
  id: number;
  branchName: string;
  isAvailable: number;
  isExamined: number;
  unit: string;
  registrationDate: string;
  modificationDate: string;
}

function GarageStaticsStatus(props: StatusProps) {
  const { Text } = Typography;

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>창고</div>
      <Row
        style={{
          border: '1px solid black',
        }}
      >
        <Col span={4}>
          <Statistic
            title={<Text>전체</Text>}
            value={props.notOperatingCnt + props.operatingCnt}
          />
        </Col>
        <Col span={4}>
          <Statistic
            title={<Badge status="processing" text="검수중" />}
            value={props.examingCnt}
          />
        </Col>
        <Col span={4}>
          <Statistic
            title={<Badge status="success" text="검수완료" />}
            value={props.examedCnt}
          />
        </Col>
        <Col span={4}>
          <Statistic
            title={<Badge status="warning" text="검수반려" />}
            value={props.examRejectedCnt}
          />
        </Col>
        <Col span={4}>
          <Statistic
            title={<Badge status="error" text="미운영" />}
            value={props.notOperatingCnt}
          />
        </Col>
        <Col span={4}>
          <Statistic
            title={<Badge status="success" text="운영중" />}
            value={props.operatingCnt}
          />
        </Col>
      </Row>
    </div>
  );
}
type GarageListProps = { tableData: readonly any[] };
const GarageList: React.FC<GarageListProps> = ({ tableData }) => {
  const router = useRouter();
  const columns: Array<object> = [
    {
      title: '순번',
      dataIndex: 'id',
      align: 'center',
    },
    {
      title: '창고명',
      dataIndex: 'branchName',
      align: 'center',
    },
    {
      title: '운영상태',
      dataIndex: 'operationStatus',
      align: 'center',
      render: (text: never, row: any) => {
        return (
          <>
            {row.isAvailable === 0 ? (
              <Badge status="error" text="미운영" />
            ) : (
              <Badge status="success" text="운영중" />
            )}
          </>
        );
      },
    },
    {
      title: '검수상태',
      dataIndex: 'inspectionStatus',
      align: 'center',
      render: (text: never, row: any) => {
        return (
          <>
            {row.isExamined === 0 ? (
              <Badge status="processing" text="검수중" />
            ) : row.isExamined === 1 ? (
              <Badge status="success" text="검수완료" />
            ) : (
              <Badge status="warning" text="검수반려" />
            )}
          </>
        );
      },
    },
    {
      title: '유닛',
      dataIndex: 'unit',
      align: 'center',
    },
    {
      title: '등록일',
      dataIndex: 'registrationDate',
      align: 'center',
    },
    {
      title: '수정일',
      dataIndex: 'modificationDate',
      align: 'center',
    },
    {
      title: '관리',
      dataIndex: 'management',
      align: 'center',
      render: () => {
        return <ManageButtons />;
      },
    },
  ];

  const addStorageHanlder = (e: React.MouseEvent): void => {
    const eventTarget = e.target as HTMLElement;
    console.log(eventTarget.textContent);
  };
  const garageListClickHandler = (id: number): void => {
    router.push(
      {
        pathname: '/unit',
        query: { garageId: id },
      },
      '/unit',
    );
  };

  function ManageButtons() {
    const manageButtonClickHandler = (e: any): void => {
      e.stopPropagation();
      if (e.target.textContent === '더보기') {
        setManageButtonList((prev) => [
          ...prev.slice(0, prev.length - 1),
          <Button onClick={manageButtonClickHandler}>더1</Button>,
          <Button onClick={manageButtonClickHandler}>더2</Button>,
        ]);
      } else {
        console.log(e.target.textContent);
      }
    };
    const [manageButtonList, setManageButtonList] = useState([
      <Button onClick={manageButtonClickHandler}>창고</Button>,
      <Button onClick={manageButtonClickHandler}>유닛</Button>,
      <Button onClick={manageButtonClickHandler}>예약</Button>,
      <Button key="More" onClick={manageButtonClickHandler}>
        더보기
      </Button>,
    ]);

    return <Space>{manageButtonList}</Space>;
  }

  return (
    <div style={{ marginTop: '20px' }}>
      <Space
        direction="vertical"
        align="end"
        style={{ width: '100%', padding: '10px' }}
      >
        <Button onClick={addStorageHanlder}>+ 창고추가</Button>
      </Space>
      <Table
        columns={columns}
        dataSource={tableData}
        scroll={{ y: 240 }}
        tableLayout="auto"
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '50', '100'],
        }}
        onRow={(record) => {
          return {
            onClick: () => garageListClickHandler(record.id),
          };
        }}
      />
    </div>
  );
};

interface HomeProps {
  tableData: any[];
  examingCnt: number;
  examedCnt: number;
  examRejectedCnt: number;
  notOperatingCnt: number;
  operatingCnt: number;
}

export default function Home({
  tableData,
  examingCnt,
  examedCnt,
  examRejectedCnt,
  notOperatingCnt,
  operatingCnt,
}: HomeProps) {
  const buttonClickHandler = (e: React.MouseEvent): void => {
    e.stopPropagation();
    const eventTarget = e.target as HTMLElement;
    if (eventTarget.textContent === '더보기') {
      setManageButtonList((prev) => [
        ...prev.slice(0, prev.length - 1),
        <Button onClick={buttonClickHandler}>추가</Button>,
        <Button onClick={buttonClickHandler}>버튼</Button>,
      ]);
    } else {
      console.log(eventTarget.textContent);
    }
  };

  const [manageButtonList, setManageButtonList] = useState([
    <Button onClick={buttonClickHandler}>창고</Button>,
    <Button onClick={buttonClickHandler}>유닛</Button>,
    <Button onClick={buttonClickHandler}>예약</Button>,
    <Button key="More" onClick={buttonClickHandler}>
      더보기
    </Button>,
  ]);

  return (
    <div style={{ margin: '30px' }}>
      <GarageStaticsStatus
        examingCnt={examingCnt}
        examedCnt={examedCnt}
        examRejectedCnt={examRejectedCnt}
        notOperatingCnt={notOperatingCnt}
        operatingCnt={operatingCnt}
      />
      <GarageList tableData={tableData} />
    </div>
  );
}

export async function getServerSideProps() {
  const branchDatas = require('./api/branch.json');
  const tableData: any[] = [];

  let [examingCnt, examedCnt, examRejectedCnt] = [0, 0, 0];
  let [notOperatingCnt, operatingCnt] = [0, 0];

  for (let data of branchDatas) {
    switch (data.isExamined) {
      case 0:
        examingCnt++;
        break;
      case 1:
        examedCnt++;
        break;
      case 2:
        examRejectedCnt++;
        break;
      default:
        break;
    }
    switch (data.isAvailable) {
      case 0:
        notOperatingCnt++;
        break;
      case 1:
        operatingCnt++;
        break;
      default:
        break;
    }

    tableData.push({
      id: data.id,
      branchName: data.branchName,
      isAvailable: data.isAvailable,
      isExamined: data.isExamined,
      unit: data.numberOfUnits + '개',
      registrationDate: data.createdAt.substring(0, 10),
      modificationDate: data.updatedAt.substring(0, 10),
    });
  }

  return {
    props: {
      tableData: JSON.parse(JSON.stringify(tableData)),
      examingCnt,
      examedCnt,
      examRejectedCnt,
      notOperatingCnt,
      operatingCnt,
    },
  };
}
