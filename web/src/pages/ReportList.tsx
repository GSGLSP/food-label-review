import { useEffect, useState } from 'react';
import { Table, Card } from 'antd';
import { getReports } from '../api/review';

export default function ReportList() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { setLoading(true); getReports().then(setData).finally(() => setLoading(false)); }, []);

  const columns = [
    { title: '报告编号', dataIndex: ['reportNo'], key: 'reportNo' },
    { title: '标签编号', dataIndex: ['review', 'label', 'labelNo'], key: 'labelNo' },
    { title: '食品名称', dataIndex: ['review', 'label', 'foodName'], key: 'foodName' },
    { title: '审核人', dataIndex: ['review', 'reviewer', 'realName'], key: 'reviewer' },
    { title: '生成时间', dataIndex: 'generatedAt', key: 'generatedAt', render: (d: string) => d ? new Date(d).toLocaleString('zh-CN') : '—' },
  ];

  return (
    <Card title="📄 审核报告列表">
      <Table dataSource={data} columns={columns} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} locale={{ emptyText: '暂无报告，请先完成审核任务' }} />
    </Card>
  );
}
