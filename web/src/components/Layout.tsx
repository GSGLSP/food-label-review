import { ReactNode } from 'react';
import { Layout as AntLayout, Menu, Avatar, Dropdown, Typography } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { UploadOutlined, AuditOutlined, FileTextOutlined, DashboardOutlined, LogoutOutlined } from '@ant-design/icons';

const { Header, Content, Sider } = AntLayout;
const { Text } = Typography;

interface Props {
  children: ReactNode;
  user: { username: string; realName: string; role: string };
  onLogout: () => void;
}

export default function Layout({ children, user, onLogout }: Props) {
  const location = useLocation();
  const menuItems = [
    { key: '/dashboard', icon: <DashboardOutlined />, label: <Link to="/dashboard">工作台</Link> },
    { key: '/labels/upload', icon: <UploadOutlined />, label: <Link to="/labels/upload">上传标签</Link> },
    { key: '/reviews', icon: <AuditOutlined />, label: <Link to="/reviews">审核任务</Link> },
    { key: '/reports', icon: <FileTextOutlined />, label: <Link to="/reports">报告管理</Link> },
  ];

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', background: '#001529', padding: '0 24px' }}>
        <div style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', marginRight: 32 }}>
          🍽️ 食品标签审核系统
        </div>
        <div style={{ flex: 1 }} />
        <Dropdown menu={{
          items: [
            { key: 'logout', icon: <LogoutOutlined />, label: '退出登录', onClick: onLogout },
          ]
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: '#fff' }}>
            <Avatar style={{ background: '#1677ff' }}>{user.realName[0]}</Avatar>
            <Text style={{ color: '#fff' }}>{user.realName}</Text>
          </div>
        </Dropdown>
      </Header>
      <AntLayout>
        <Sider width={200} style={{ background: '#fff' }}>
          <Menu mode="inline" selectedKeys={[location.pathname]} items={menuItems} style={{ height: '100%', borderRight: 0 }} />
        </Sider>
        <AntLayout style={{ padding: '0 24px 24px' }}>
          <Content style={{ marginTop: 24 }}>
            {children}
          </Content>
        </AntLayout>
      </AntLayout>
    </AntLayout>
  );
}
