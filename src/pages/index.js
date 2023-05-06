import React, { useRef, useState } from 'react';
import {
  Badge,
  Button,
  Col,
  List,
  Row,
  Segmented,
  Space,
  Statistic,
  Table,
  Typography,
} from 'antd';
import { useRouter } from 'next/router';

function GarageStaticsStatus(props) {
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
            value={props.notOperatingCnt.current + props.operatingCnt.current}
          />
        </Col>
        <Col span={4}>
          <Statistic
            title={<Badge status="processing" text="검수중" />}
            value={props.examingCnt.current}
          />
        </Col>
        <Col span={4}>
          <Statistic
            title={<Badge status="success" text="검수완료" />}
            value={props.examedCnt.current}
          />
        </Col>
        <Col span={4}>
          <Statistic
            title={<Badge status="warning" text="검수반려" />}
            value={props.examRejectedCnt.current}
          />
        </Col>
        <Col span={4}>
          <Statistic
            title={<Badge status="error" text="미운영" />}
            value={props.notOperatingCnt.current}
          />
        </Col>
        <Col span={4}>
          <Statistic
            title={<Badge status="success" text="운영중" />}
            value={props.operatingCnt.current}
          />
        </Col>
      </Row>
    </div>
  );
}

function GarageList({ tableData }) {
  const router = useRouter();
  const columns = [
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
    },
    {
      title: '검수상태',
      dataIndex: 'inspectionStatus',
      align: 'center',
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
    },
  ];

  const addStorageHanlder = (e) => {
    console.log(e.target.textContent);
  };
  const garageListClickHandler = (id) => {
    router.push(
      {
        pathname: '/unit',
        query: { garageId: id },
      },
      '/unit',
    );
  };

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
        onRow={(record) => {
          return {
            onClick: () => garageListClickHandler(record.id),
          };
        }}
      />
    </div>
  );
}

export default function Home() {
  const examingCnt = useRef(0);
  const examedCnt = useRef(0);
  const examRejectedCnt = useRef(0);
  const notOperatingCnt = useRef(0);
  const operatingCnt = useRef(0);

  const datas = require('./api/branch.json');

  const tableData = [];
  for (let data of datas) {
    switch (data.isExamined) {
      case 0:
        examingCnt.current++;
        break;
      case 1:
        examedCnt.current++;
        break;
      case 2:
        examRejectedCnt.current++;
        break;
      default:
        break;
    }
    switch (data.isAvailable) {
      case 0:
        notOperatingCnt.current++;
        break;
      case 1:
        operatingCnt.current++;
        break;
      default:
        break;
    }

    const buttonClickHandler = (e) => {
      e.stopPropagation();
      if (e.target.textContent === '더보기') {
        setManageButtonList((prev) => [
          ...prev.slice(0, prev.length - 1),
          <Button onClick={buttonClickHandler}>추가</Button>,
          <Button onClick={buttonClickHandler}>버튼</Button>,
        ]);
      } else {
        console.log(e.target.textContent);
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

    tableData.push({
      id: data.id,
      branchName: data.branchName,
      operationStatus:
        data.isExamined === 0 ? (
          <Badge status="success" text="운영중" />
        ) : (
          <Badge status="error" text="미운영" />
        ),

      inspectionStatus:
        data.isExamined === 0 ? (
          <Badge status="processing" text="검수중" />
        ) : data.isExamined === 1 ? (
          <Badge status="success" text="검수완료" />
        ) : (
          <Badge status="warning" text="검수반려" />
        ),
      unit: data.numberOfUnits + '개',
      registrationDate: data.createdAt.substring(0, 10),
      modificationDate: data.updatedAt.substring(0, 10),
      management: <Space>{manageButtonList}</Space>,
    });
  }

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
