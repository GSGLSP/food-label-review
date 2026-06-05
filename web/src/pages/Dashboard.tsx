import { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, List, Tag, Space } from 'antd';
import { AuditOutlined, FileTextOutlined, ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { getLabels } from '../api/label';
import { getReviews } from '../api/review';
import { Link } from 'react-router-dom';

interface Props { user: { username: string; realName: string; role: string } }

interface Stats { labelTotal: number; labelPending: number; reviewTotal: number; reviewPending: number; reportTotal: number; reviewApproved: number; }

export default function Dashboard({ user }: Props) {
  const [stats, setStats] = useState<Stats>({ labelTotal: 0, labelPending: 0, reviewTotal: 0, reviewPending: 0, reportTotal: 0, reviewApproved: 0 });
  const [recentLabels, setRecentLabels] = useState<any[]>([]);
  const [recentReviews, setRecentReviews] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      getLabels().then((d: any[]) => { setRecentLabels(d.slice(0, 5)); return d; }),
      getReviews().then((d: any[]) => { setRecentReviews(d.slice(0, 5)); return d; }),
    ]).then(([labels, reviews]) => {
      setStats({
        labelTotal: labels.length,
        labelPending: labels.filter((l: any) => l.ocrStatus === 'pending' || l.ocrStatus === 'processing').length,
        reviewTotal: reviews.length,
        reviewPending: reviews.filter((r: any) => r.status === 'pending' || r.status === 'reviewing').length,
        reportTotal: 0,
        reviewApproved: reviews.filter((r: any) => r.status === 'approved').length,
      });
    });
  }, []);

  const statCards = [
    { title: '标签总数', value: stats.labelTotal, icon: <FileTextOutlined style={{ color: '#1677ff' }} /> },
    { title: '待OCR处理', value: stats.labelPending, icon: <ClockCircleOutlined style={{ color: '#faad14' }} /> },
    { title: '审核任务', value: stats.reviewTotal, icon: <AuditOutlined style={{ color: '#52c41a' }} /> },
    { title: '待审核', value: stats.reviewPending, icon: <ClockCircleOutlined style={{ color: '#ff4d4f' }} /> },
    { title: '已通过', value: stats.reviewApproved, icon: <CheckCircleOutlined style={{ color: '#52c41a' }} /> },
  ];

  return (
    <Space direction="vertical" style={{ width: '100%' }} size={16}>
      <div>欢迎，<b>{user.realName}</b>！以下是系统概览：</div>
      <Row gutter={16}>
        {statCards.map((s) => (
          <Col span={4} key={s.title}>
            <Card size="small">
              <Statistic title={s.title} value={s.value} valueStyle={{ fontSize: 24 }} prefix={s.icon} />
            </Card>
          </Col>
        ))}
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Card title="最近上传的标签" extra={<Link to="/labels/upload">上传新标签</Link>}>
            <List size="small" dataSource={recentLabels} locale={{ emptyText: '暂无数据' }}
              renderItem={(item: any) => (
                <List.Item>
                  <Space>
                    <span>{item.labelNo}</span>
                    <Tag color={item.ocrStatus === 'done' ? 'green' : item.ocrStatus === 'processing' ? 'blue' : 'default'}>
                      {item.ocrStatus === 'done' ? '已识别' : item.ocrStatus === 'processing' ? '识别中' : '待处理'}
                    </Tag>
                    <span style={{ color: '#888', fontSize: 12 }}>{item.foodType || '预包装食品'}</span>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="最近审核任务" extra={<Link to="/reviews">查看全部</Link>}>
            <List size="small" dataSource={recentReviews} locale={{ emptyText: '暂无数据' }}
              renderItem={(item: any) => (
                <List.Item>
                  <Space>
                    <span>{item.label?.labelNo || '—'}</span>
                    <Tag color={item.status === 'approved' ? 'green' : item.status === 'rejected' ? 'red' : 'blue'}>
                      {item.status === 'approved' ? '已通过' : item.status === 'rejected' ? '驳回' : '审核中'}
                    </Tag>
                    <span style={{ color: '#888', fontSize: 12 }}>{item.reviewer?.realName}</span>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </Space>
  );
}
