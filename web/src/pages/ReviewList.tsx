import { useEffect, useState } from 'react';
import { Table, Tag, Button, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getReviews } from '../api/review';

export default function ReviewList() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { load(); }, []);
  const load = () => { setLoading(true); getReviews().then(setData).finally(() => setLoading(false)); };

  const columns = [
    { title: '标签编号', dataIndex: ['label', 'labelNo'], key: 'labelNo' },
    { title: '食品名称', dataIndex: ['label', 'foodName'], key: 'foodName' },
    { title: '类型', dataIndex: ['label', 'foodType'], key: 'foodType' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (s: string) => (
      <Tag color={s === 'approved' ? 'green' : s === 'rejected' ? 'red' : 'blue'}>
        {s === 'approved' ? '已通过' : s === 'rejected' ? '已驳回' : '审核中'}
      </Tag>
    )},
    { title: '审核人', dataIndex: ['reviewer', 'realName'], key: 'reviewer' },
    { title: '结果', dataIndex: 'overallResult', key: 'overallResult', render: (r: string) => r ? (
      <Tag color={r === 'pass' ? 'green' : r === 'conditional_pass' ? 'orange' : 'red'}>{r === 'pass' ? '通过' : r === 'conditional_pass' ? '条件通过' : '不通过'}</Tag>
    ) : '—' },
    { title: '操作', key: 'action', render: (_: any, r: any) => (
      <Button size="small" type="link" onClick={() => navigate(`/reviews/${r.id}`)}>查看详情</Button>
    )},
  ];

  return (
    <Card title="📋 审核任务列表">
      <Table dataSource={data} columns={columns} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />
    </Card>
  );
}
