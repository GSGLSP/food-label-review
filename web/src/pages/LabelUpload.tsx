import { useState } from 'react';
import { Upload, Button, message, Card, Select, Form, Image, Space } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { uploadLabel } from '../api/label';

interface Props { username: string; realName: string; role: string }

export default function LabelUpload(_props: Props) {
  const [file, setFile] = useState<any>(null);
  const [preview, setPreview] = useState<string>('');
  const [foodType, setFoodType] = useState('预包装食品');
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) { message.warning('请先选择图片'); return; }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      fd.append('foodType', foodType);
      const res = await uploadLabel(fd);
      message.success('上传成功！标签ID: ' + res.id);
      setFile(null); setPreview('');
    } catch { message.error('上传失败，请重试'); }
    finally { setUploading(false); }
  };

  return (
    <Card title="📤 上传食品标签图片">
      <Space direction="vertical" style={{ width: '100%' }} size={16}>
        <Form.Item label="食品类型">
          <Select value={foodType} onChange={setFoodType} style={{ width: 300 }}>
            <Select.Option value="预包装食品">预包装食品</Select.Option>
            <Select.Option value="食用农产品">食用农产品</Select.Option>
            <Select.Option value="进口食品">进口食品</Select.Option>
          </Select>
        </Form.Item>
        <Upload accept="image/*" beforeUpload={(f) => { setFile(f); setPreview(URL.createObjectURL(f)); return false; }} showUploadList={false}>
          <Button icon={<UploadOutlined />}>选择标签图片（支持 JPG/PNG）</Button>
        </Upload>
        {preview && <Image src={preview} width={400} style={{ border: '1px solid #ddd', borderRadius: 8 }} />}
        <Button type="primary" onClick={handleUpload} loading={uploading} disabled={!file} style={{ width: 200 }}>
          确认上传
        </Button>
      </Space>
    </Card>
  );
}