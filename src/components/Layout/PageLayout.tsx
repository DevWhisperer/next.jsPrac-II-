import React, { useState } from 'react';
import { Affix, Layout, Menu } from 'antd';
import type { AppProps, MenuProps } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';

const { Header, Sider, Content } = Layout;

const items: MenuProps['items'] = [
  {
    key: '1',
    label: <Link href="/">창고</Link>,
  },
  {
    key: '2',
    label: <Link href="/unit">유닛</Link>,
  },
];

const PageLayout: React.FC<AppProps> = ({ children }) => {
  const router = useRouter();
  return (
    <Layout>
      <Header>
        <Menu theme="dark" mode="horizontal" />
      </Header>
      <Layout>
        <Affix>
          <Sider
            style={{
              background: 'white',
              height: '100vh',
              textAlign: 'center',
            }}
          >
            <Menu
              defaultSelectedKeys={router.route === '/' ? ['1'] : ['2']}
              items={items}
            />
          </Sider>
        </Affix>
        <Layout style={{ display: 'flex', flexDirection: 'column' }}>
          <Content>{children}</Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default PageLayout;
