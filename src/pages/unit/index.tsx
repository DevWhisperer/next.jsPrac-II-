import {
  Badge,
  Button,
  Col,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Typography,
} from 'antd';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

interface UnitProps {
  branchDatas: [];
  sortedUnitItemData: { [id: number]: any };
  unitData: {
    [id: number]: any;
  };
  unitTotalVolumeData: { [id: number]: any };
  operatingCntByBranch: { [id: number]: any };
  operatedCntByBranch: { [id: number]: any };
  willOperateCntByBranch: { [id: number]: any };
}

export default function Unit({
  branchDatas,
  sortedUnitItemData,
  unitData,
  unitTotalVolumeData,
  operatingCntByBranch,
  operatedCntByBranch,
  willOperateCntByBranch,
}: UnitProps): React.ReactElement {
  const { Text } = Typography;
  const router = useRouter();

  let selectDataList: any[] = [];

  branchDatas.map((item) => {
    selectDataList.push({ value: item['id'], label: item['branchName'] });
  });
  const [selectedBranchId, setSelectedBranchId] = useState(
    router.query.garageId ? Number(router.query.garageId) : 1,
  );

  const [selectedUnitId, setSelectedUnitId] = useState(() => {
    router.query.garageId
      ? unitData[router.query.garageId as keyof {}][0].id
      : 1;
    return 1;
  });
  const selectChangeHandler = (id: number) => {
    setSelectedBranchId(id);
    setSelectedUnitId(unitData[id][0].id);
  };

  const selectedUnitDataList = unitData[selectedBranchId];
  let selectedUnitItemDatas = sortedUnitItemData[selectedUnitId];

  const unitColumns: any = [
    {
      title: '유닛',
      dataIndex: 'unitName',
      align: 'center',
    },
    {
      title: '총개수',
      dataIndex: 'numberOfUnitItems',
      align: 'center',
    },
    {
      title: '사용중',
      dataIndex: 'operatingCnt',
      align: 'center',
    },
    {
      title: '점유율',
      dataIndex: 'share',
      align: 'center',
      render: (text: never, record: any) =>
        Math.round(
          (record.width *
            record.depth *
            record.height *
            record.numberOfUnitItems *
            100) /
            unitTotalVolumeData[selectedBranchId],
        ) + '%',
    },
    {
      title: '너비',
      dataIndex: 'width',
      align: 'center',
    },
    {
      title: '깊이',
      dataIndex: 'depth',
      align: 'center',
    },
    {
      title: '높이',
      dataIndex: 'height',
      align: 'center',
    },
    {
      title: '이용요금',
      dataIndex: 'priceValue',
      align: 'center',
    },
    {
      title: '관리',
      dataIndex: 'manage',
      align: 'center',
      render: () => {
        return <ManageButtons />;
      },
    },
  ];

  const unitItemColumns: any[] = [
    {
      title: '유닛아이템',
      dataIndex: 'unitItemName',
      align: 'center',
    },
    {
      title: '유닛',
      dataIndex: 'unitName',
      align: 'center',
    },
    {
      title: '상태',
      dataIndex: 'statusCode',
      align: 'center',
      render: (text: never, record: any) => {
        return (
          <>
            {record.statusCode === 0 ? (
              <Badge status="success" text="이용예정" />
            ) : record.statusCode === 1 ? (
              <Badge status="processing" text="이용중" />
            ) : (
              <Badge status="default" text="이용완료" />
            )}
          </>
        );
      },
    },
    {
      title: '이용기간 경과율',
      dataIndex: 'elapsedRate',
      align: 'center',
    },
    {
      title: '이용시작일',
      dataIndex: 'startDate',
      align: 'center',
    },
    {
      title: '이용종료일',
      dataIndex: 'endDate',
      align: 'center',
    },
    {
      title: '예약번호',
      dataIndex: 'reserveNum',
      align: 'center',
    },
    {
      title: '관리',
      dataIndex: 'manage',
      align: 'center',
      render: () => {
        return <ManageButtons />;
      },
    },
  ];

  return (
    <div style={{ margin: '30px' }}>
      <div style={{ marginBottom: '10px' }}>유닛</div>
      <Space>
        <div>창고 : </div>
        <Select
          defaultValue={selectDataList[selectedBranchId - 1].label}
          onChange={selectChangeHandler}
          style={{ width: '50vw' }}
          options={selectDataList}
        />
      </Space>
      <div>
        <div style={{ marginBottom: '10px' }}>창고</div>
        <Row
          style={{
            border: '1px solid black',
          }}
        >
          <Col span={6}>
            <Statistic
              title={<Text>전체 유닛 갯수</Text>}
              value={
                operatingCntByBranch[selectedBranchId] +
                willOperateCntByBranch[selectedBranchId] +
                operatedCntByBranch[selectedBranchId]
              }
            />
          </Col>
          <Col span={6}>
            <Statistic
              title={<Badge status="processing" text="이용중" />}
              value={operatingCntByBranch[selectedBranchId]}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title={<Badge status="success" text="이용예정" />}
              value={willOperateCntByBranch[selectedBranchId]}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title={<Badge status="warning" text="이용종료" />}
              value={operatedCntByBranch[selectedBranchId]}
            />
          </Col>
        </Row>
      </div>

      <div style={{ marginTop: '10px' }}>
        <Space
          direction="vertical"
          align="end"
          style={{ width: '100%', padding: '10px' }}
        >
          <Button
            onClick={(e: React.MouseEvent): void => {
              console.log((e.target as HTMLLIElement).textContent);
            }}
          >
            + 유닛 추가
          </Button>
        </Space>
        <Table
          columns={unitColumns}
          dataSource={selectedUnitDataList}
          scroll={{ y: 240 }}
          tableLayout="auto"
          pagination={false}
          onRow={(record, rowIndex) => {
            return {
              onClick: (e) => {
                setSelectedUnitId(record.id);
              },
            };
          }}
        />
      </div>
      <div style={{ marginTop: '10px' }}>
        <Space
          direction="vertical"
          align="end"
          style={{ width: '100%', padding: '10px' }}
        >
          <Button
            onClick={(e: React.MouseEvent) => {
              console.log((e.target as HTMLLIElement).textContent);
            }}
          >
            + 유닛아이템 추가
          </Button>
        </Space>
        <Table
          columns={unitItemColumns}
          dataSource={selectedUnitItemDatas}
          scroll={{ y: 240 }}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '50', '100'],
          }}
          tableLayout="auto"
        />
      </div>
    </div>
  );
}

function ManageButtons() {
  const manageButtonClickHandler = (e: React.MouseEvent): void => {
    if ((e.target as HTMLLIElement).textContent === '더보기') {
      setManageButtonList((prev) => [
        ...prev.slice(0, prev.length - 1),
        <Button onClick={manageButtonClickHandler}>수정2</Button>,
        <Button onClick={manageButtonClickHandler}>수정3</Button>,
      ]);
    } else {
      console.log((e.target as HTMLLIElement).textContent);
    }
  };
  const [manageButtonList, setManageButtonList] = useState([
    <Button onClick={manageButtonClickHandler}>수정</Button>,
    <Button key="More" onClick={manageButtonClickHandler}>
      더보기
    </Button>,
  ]);

  return <Space>{manageButtonList}</Space>;
}

export async function getServerSideProps() {
  const branchDatas = require('../api/branch.json');
  const unitDatas = require('../api/unit.json');
  const unitItemDatas = require('../api/unit-item.json');

  const sortedUnitItemData: any = {};
  const operatedCntByUnit: { [id: number]: any } = {};
  const willOperateCntByUnit: { [id: number]: any } = {};
  const operatingCntByUnit: { [id: number]: any } = {};

  for (let data of unitItemDatas) {
    // 빈 배열들 추가
    if (!sortedUnitItemData[data.unitId]) {
      sortedUnitItemData[data.unitId] = [];
    }

    // 상태, 이용기간 경과율 정리
    let statusCode = 0;
    let elapsedRate = '';
    if (new Date().valueOf() - new Date(data.startDate).valueOf() > 0) {
      if (new Date().valueOf() - new Date(data.endDate).valueOf() < 0) {
        // 진행중
        statusCode = 1;
        elapsedRate =
          Math.round(
            ((new Date().valueOf() - new Date(data.startDate).valueOf()) *
              100) /
              (new Date(data.endDate).valueOf() -
                new Date(data.startDate).valueOf()),
          ) + '%';

        operatingCntByUnit[data.unitId] = operatingCntByUnit[data.unitId]
          ? operatingCntByUnit[data.unitId] + 1
          : 1;
      } else {
        // 완료
        statusCode = 2;
        elapsedRate = '100%';
        operatedCntByUnit[data.unitId] = operatedCntByUnit[data.unitId]
          ? operatedCntByUnit[data.unitId] + 1
          : 1;
      }
    } else {
      // 예정
      statusCode = 0;
      elapsedRate = '0%';
      willOperateCntByUnit[data.unitId] = willOperateCntByUnit[data.unitId]
        ? willOperateCntByUnit[data.unitId] + 1
        : 1;
    }

    sortedUnitItemData[data.unitId].push({
      id: data.id,
      unitItemName: data.unitItemName,
      unitName: unitDatas[data.unitId - 1].unitName,
      statusCode,
      elapsedRate,
      startDate: data.startDate.substr(0, 10).replaceAll('-', '.'),
      endDate: data.endDate.substr(0, 10).replaceAll('-', '.'),
      reserveNum: data.id,
      manage: (
        <Space>
          <ManageButtons />
        </Space>
      ),
    });
  }

  // unit 데이터
  const unitData: { [id: number]: any } = {};
  const unitTotalVolumeData: { [id: number]: any } = {};
  let allUnitVolume = 0;
  let operatingCntByBranch: { [id: number]: any } = {};
  let operatedCntByBranch: { [id: number]: any } = {};
  let willOperateCntByBranch: { [id: number]: any } = {};

  for (let data of unitDatas) {
    //브랜치별 status 수 계산
    if (!operatingCntByBranch.hasOwnProperty(data.branchId)) {
      operatingCntByBranch[data.branchId] = 0;
    }
    if (operatingCntByUnit[data.id] !== undefined) {
      operatingCntByBranch[data.branchId] =
        operatingCntByBranch[data.branchId] + operatingCntByUnit[data.id];
    }

    if (!operatedCntByBranch.hasOwnProperty(data.branchId)) {
      operatedCntByBranch[data.branchId] = 0;
    }
    if (operatedCntByUnit[data.id] !== undefined) {
      operatedCntByBranch[data.branchId] =
        operatedCntByBranch[data.branchId] + operatedCntByUnit[data.id];
    }

    if (!willOperateCntByBranch.hasOwnProperty(data.branchId)) {
      willOperateCntByBranch[data.branchId] = 0;
    }
    if (willOperateCntByUnit[data.id] !== undefined) {
      willOperateCntByBranch[data.branchId] =
        willOperateCntByBranch[data.branchId] + willOperateCntByUnit[data.id];
    }

    if (!unitData[data.branchId]) {
      // 새로운 branchId
      unitData[data.branchId] = [];
      unitTotalVolumeData[Math.max(data.branchId - 1, 1)] = allUnitVolume;
      allUnitVolume = 0;
    }
    allUnitVolume +=
      data.width * data.depth * data.height * data.numberOfUnitItems;
    unitData[data.branchId].push({
      id: data.id,
      unitName: data.unitName,
      numberOfUnitItems: data.numberOfUnitItems,
      width: data.width,
      depth: data.depth,
      height: data.height,
      priceValue: data.priceValue,
      operatingCnt: operatingCntByUnit[data.id],
    });
  }

  unitTotalVolumeData[unitDatas[unitDatas.length - 1].branchId] = allUnitVolume;
  return {
    props: {
      branchDatas,
      unitDatas,
      unitItemDatas,
      sortedUnitItemData: JSON.parse(JSON.stringify(sortedUnitItemData)),
      unitData: JSON.parse(JSON.stringify(unitData)),
      unitTotalVolumeData,
      operatingCnt: operatingCntByUnit,
      operatedCnt: operatedCntByUnit,
      willOperateCnt: willOperateCntByUnit,
      operatingCntByBranch,
      operatedCntByBranch,
      willOperateCntByBranch,
    },
  };
}
