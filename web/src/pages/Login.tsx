import { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { login } from '../api/auth';

interface Props {
  onLogin: (user: { username: string; realName: string; role: string }) => void;
}

export default function Login({ onLogin }: Props) {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      const data = await login(values.username, values.password);
      localStorage.setItem('token', data.access_token);
      onLogin({ username: data.username, realName: data.realName, role: data.role });
      message.success('登录成功');
    } catch {
      message.error('用户名或密码错误');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5' }}>
      <Card title="食品标签审核系统 - 登录" style={{ width: 400 }}>
        <Form layout="vertical" onFinish={onFinish} initialValues={{ username: 'admin', password: 'admin123' }}>
          <Form.Item name="username" label="用户名" rules={[{ required: true }]}>
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item name="password" label="密码" rules={[{ required: true }]}>
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>登录</Button>
          </Form.Item>
          <div style={{ fontSize: 12, color: '#888', textAlign: 'center' }}>
            默认账号: admin / admin123
          </div>
        </Form>
      </Card>
    </div>
  );
}
