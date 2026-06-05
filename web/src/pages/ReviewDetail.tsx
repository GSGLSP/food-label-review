import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Table, Tag, Button, Space, Radio, message, Alert } from 'antd';
import { getReview, updateReviewItem, submitReview, generateReport } from '../api/review';

export default function ReviewDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState<any>(null);
  const [loading, setLoading] = useState(false); void loading;

  useEffect(() => { if (id) load(); }, [id]);
  const load = () => { setLoading(true); getReview(parseInt(id!)).then(setReview).finally(() => setLoading(false)); };

  if (!review) return null;

  const criticalFail = review.items.filter((i: any) => i.result === 'fail' && i.severity === 'critical').length;

  return (
    <Space direction="vertical" style={{ width: '100%' }} size={16}>
      <Card title={`审核详情 - ${review.label?.labelNo}`} extra={<Button onClick={() => navigate('/reviews')}>返回列表</Button>}>
        <Space wrap>
          <span>标签类型：{review.label?.foodType || '—'}</span>
          <span>上传人：{review.label?.uploadUser?.realName || '—'}</span>
          <Tag color={review.status === 'approved' ? 'green' : review.status === 'rejected' ? 'red' : 'blue'}>
            {review.status === 'approved' ? '已通过' : review.status === 'rejected' ? '已驳回' : '审核中'}
          </Tag>
          {review.overallResult && <Tag color={review.overallResult === 'pass' ? 'green' : 'red'}>{review.overallResult === 'pass' ? '通过' : '不通过'}</Tag>}
        </Space>
      </Card>
      {criticalFail > 0 && review.status !== 'approved' && review.status !== 'rejected' && (
        <Alert message={`发现 ${criticalFail} 项严重不合格项（critical），必须修正后才能通过审核！`} type="error" showIcon />
      )}
      <Card title="审核检查项">
        <Table dataSource={review.items} rowKey="id" pagination={false} size="small"
          columns={[
            { title: '分类', dataIndex: 'category', key: 'category', width: 120 },
            { title: '检查项', dataIndex: 'checkName', key: 'checkName' },
            { title: '法规依据', dataIndex: 'regulation', key: 'regulation', width: 200 },
            { title: '严重程度', dataIndex: 'severity', key: 'severity', width: 80, render: (s: string) => (
              <Tag color={s === 'critical' ? 'red' : s === 'major' ? 'orange' : 'default'}>{s}</Tag>
            )},
            { title: '判定结果', dataIndex: 'result', key: 'result', width: 120, render: (r: string, row: any) => (
              review.status === 'approved' || review.status === 'rejected' ? (
                <Tag color={r === 'pass' ? 'green' : r === 'fail' ? 'red' : 'default'}>{r === 'pass' ? '通过' : r === 'fail' ? '不通过' : '—'}</Tag>
              ) : (
                <Radio.Group value={r} onChange={(e) => {
                  updateReviewItem(review.id, row.id, { result: e.target.value, issue: row.issue, suggestion: row.suggestion })
                    .then(() => message.success('已更新')).catch(() => message.error('更新失败'))
                    .finally(() => setTimeout(load, 300));
                }}>
                  <Radio.Button value="pass">通过</Radio.Button>
                  <Radio.Button value="fail">不通过</Radio.Button>
                  <Radio.Button value="not_applicable">不适用</Radio.Button>
                </Radio.Group>
              )
            )},
            { title: '问题描述', dataIndex: 'issue', key: 'issue', render: (t: string) => t || '—' },
            { title: '修改建议', dataIndex: 'suggestion', key: 'suggestion', render: (t: string) => t || '—' },
          ]}
        />
      </Card>
      {review.status !== 'approved' && review.status !== 'rejected' && (
        <Card>
          <Space>
            <Button type="primary" onClick={() => handleSubmit('pass')}>标记为通过</Button>
            <Button danger onClick={() => handleSubmit('fail')}>标记为不通过</Button>
            <Button onClick={() => handleGenerateReport()}>生成报告</Button>
          </Space>
        </Card>
      )}
    </Space>
  );

  function handleSubmit(result: string) {
    submitReview(review.id, result).then(() => {
      message.success(result === 'pass' ? '审核已通过' : '审核已驳回');
      load();
    });
  }

  function handleGenerateReport() {
    generateReport(review.id).then(() => message.success('报告已生成')).catch(() => message.error('生成失败'));
  }
}