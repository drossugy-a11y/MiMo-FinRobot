import { useState, useCallback, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Typography, Upload, Card, Table, Space, Steps, Progress, message } from 'antd'
import { InboxOutlined, FileTextOutlined, CheckCircleOutlined, LoadingOutlined, EyeOutlined } from '@ant-design/icons'
import { StatusBadge } from '../components/StatusIndicator'
import ThemedCard from '../components/ThemedCard'
import PageTransition from '../components/PageTransition'
import { uploadReport, useReports } from '../hooks/useApi'

const { Title, Text } = Typography
const { Dragger } = Upload

function UploadPage() {
  const navigate = useNavigate()
  const { reports, loading, refetch } = useReports()
  const [uploading, setUploading] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [processingStatus, setProcessingStatus] = useState(null)
  const timeoutRef = useRef(null)

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const processingSteps = [
    { title: '提取文本数据', description: '正在解析PDF文档...' },
    { title: '识别图表数据', description: 'MiMo-V2.5-Omni 正在分析...' },
    { title: '生成分析摘要', description: 'MiMo-V2.5-Pro 正在生成...' },
  ]

  const handleUpload = useCallback(async (file) => {
    setUploading(true)
    setCurrentStep(0)
    setUploadProgress(0)
    setProcessingStatus('uploading')

    try {
      // Step 1: Upload file
      setUploadProgress(30)
      await uploadReport(file)
      setUploadProgress(100)

      // Step 2: Processing animation
      setProcessingStatus('processing')
      for (let i = 0; i < processingSteps.length; i++) {
        setCurrentStep(i)
        await new Promise((resolve) => setTimeout(resolve, 2000))
      }

      // Complete
      setProcessingStatus('completed')
      message.success('报告上传成功！')

      // Refresh list
      refetch()

      // Auto navigate to reports after 1.5s (with cleanup)
      timeoutRef.current = setTimeout(() => {
        navigate('/reports')
      }, 1500)

    } catch (error) {
      message.error('上传失败: ' + error.message)
      setProcessingStatus('error')
    } finally {
      setUploading(false)
    }
  }, [navigate, refetch])

  const uploadProps = {
    name: 'file',
    multiple: false,
    accept: '.pdf',
    showUploadList: false,
    disabled: uploading,
    beforeUpload: (file) => {
      const isPDF = file.type === 'application/pdf'
      if (!isPDF) {
        message.error('只能上传PDF文件！')
        return false
      }
      handleUpload(file)
      return false
    },
  }

  const historyColumns = [
    {
      title: '文件名',
      dataIndex: 'filename',
      key: 'filename',
      render: (text) => (
        <Space>
          <FileTextOutlined style={{ color: 'var(--accent-primary)' }} />
          <Text style={{ color: 'var(--text-primary)' }}>{text}</Text>
        </Space>
      ),
    },
    {
      title: '上传时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text) => (
        <Text style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
          {new Date(text).toLocaleString('zh-CN')}
        </Text>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <StatusBadge status={status} />,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <button
          onClick={() => navigate(`/reports/${record.id}`)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--accent-primary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <EyeOutlined /> 查看
        </button>
      ),
    },
  ]

  return (
    <PageTransition>
      <Space direction="vertical" size={24} style={{ width: '100%' }}>
        <Title level={4} style={{ margin: 0, fontFamily: 'var(--font-heading)' }}>
          财报上传
        </Title>

        {/* Upload Area */}
        <ThemedCard bodyStyle={{ padding: 48 }}>
          <Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              {uploading ? (
                <LoadingOutlined style={{ color: 'var(--accent-primary)', fontSize: 64 }} />
              ) : (
                <InboxOutlined style={{ color: 'var(--accent-primary)', fontSize: 64 }} />
              )}
            </p>
            <p className="ant-upload-text" style={{ color: 'var(--text-primary)', fontSize: 18 }}>
              {uploading ? '正在上传...' : '点击或拖拽PDF文件到此处'}
            </p>
            <p className="ant-upload-hint" style={{ color: 'var(--text-secondary)' }}>
              支持 PDF 格式的财务报告，文件大小不超过 20MB
            </p>
          </Dragger>
        </ThemedCard>

        {/* Processing Status */}
        {processingStatus && (
          <ThemedCard
            title={
              <Space>
                {processingStatus === 'completed' ? (
                  <CheckCircleOutlined style={{ color: 'var(--data-positive)' }} />
                ) : processingStatus === 'error' ? (
                  <LoadingOutlined style={{ color: 'var(--data-negative)' }} />
                ) : (
                  <LoadingOutlined style={{ color: 'var(--accent-primary)' }} />
                )}
                <span>
                  {processingStatus === 'completed'
                    ? '处理完成'
                    : processingStatus === 'error'
                    ? '处理失败'
                    : '智能解析中'}
                </span>
              </Space>
            }
          >
            {processingStatus === 'uploading' && (
              <div>
                <Text style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: 16 }}>
                  正在上传文件...
                </Text>
                <Progress percent={uploadProgress} strokeColor="var(--accent-primary)" trailColor="var(--bg-inset)" />
              </div>
            )}

            {processingStatus === 'processing' && (
              <Steps
                current={currentStep}
                direction="vertical"
                items={processingSteps.map((step, index) => ({
                  title: <Text style={{ color: 'var(--text-primary)' }}>{step.title}</Text>,
                  description: <Text style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{step.description}</Text>,
                  icon:
                    index < currentStep ? (
                      <CheckCircleOutlined style={{ color: 'var(--data-positive)' }} />
                    ) : index === currentStep ? (
                      <LoadingOutlined style={{ color: 'var(--accent-primary)' }} />
                    ) : undefined,
                }))}
              />
            )}

            {processingStatus === 'completed' && (
              <div style={{ textAlign: 'center', padding: 24 }}>
                <CheckCircleOutlined style={{ fontSize: 64, color: 'var(--data-positive)', marginBottom: 16 }} />
                <Title level={4} style={{ color: 'var(--text-primary)' }}>报告生成成功！</Title>
                <Text style={{ color: 'var(--text-secondary)' }}>正在跳转到报告页面...</Text>
              </div>
            )}
          </ThemedCard>
        )}

        {/* Upload History */}
        <ThemedCard title="上传历史" bodyStyle={{ padding: 0 }}>
          <Table columns={historyColumns} dataSource={reports || []} loading={loading} pagination={{ pageSize: 5 }} rowKey="id" />
        </ThemedCard>
      </Space>
    </PageTransition>
  )
}

export default UploadPage
