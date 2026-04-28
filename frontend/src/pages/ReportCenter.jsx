import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input, Select, Space, Typography, Button, List, Empty } from 'antd'
import { SearchOutlined, FileTextOutlined, ClockCircleOutlined, CloudServerOutlined, CopyOutlined, DownloadOutlined, PlayCircleOutlined } from '@ant-design/icons'
import { StatusBadge } from '../components/StatusIndicator'
import { SkeletonCard } from '../components/SkeletonLoader'
import ThemedCard from '../components/ThemedCard'
import PageTransition from '../components/PageTransition'
import { useReports } from '../hooks/useApi'

const { Text, Title, Paragraph } = Typography
const { Search } = Input

// Safe HTML renderer - escapes user content
function SafeHtmlContent({ content }) {
  if (!content) return null

  const lines = content.split('\n')
  return lines.map((line, i) => {
    // Escape HTML to prevent XSS
    const escapedLine = line
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')

    // Highlight financial numbers (safe - no HTML injection)
    const highlightedLine = escapedLine.replace(
      /(\d+(?:\.\d+)?(?:%|亿|万|元|倍))/g,
      '<span class="text-accent financial-data">$1</span>'
    )

    if (line.startsWith('# ')) {
      return <Title key={i} level={2} style={{ marginTop: 24, marginBottom: 16 }}>{line.slice(2)}</Title>
    }
    if (line.startsWith('## ')) {
      return <Title key={i} level={3} id={`heading-${i}`} style={{ marginTop: 20, marginBottom: 12 }}>{line.slice(3)}</Title>
    }
    if (line.startsWith('### ')) {
      return <Title key={i} level={4} id={`heading-${i}`} style={{ marginTop: 16, marginBottom: 8 }}>{line.slice(4)}</Title>
    }
    if (line.startsWith('- ')) {
      return <li key={i} style={{ color: 'var(--text-secondary)', marginBottom: 4 }}>{line.slice(2)}</li>
    }
    if (line.trim() === '') {
      return <div key={i} style={{ height: 12 }} />
    }
    return (
      <Paragraph
        key={i}
        style={{ color: 'var(--text-secondary)', marginBottom: 8, lineHeight: 1.8 }}
        dangerouslySetInnerHTML={{ __html: highlightedLine }}
      />
    )
  })
}

function ReportCenter() {
  const navigate = useNavigate()
  const { reports, loading, error } = useReports()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedReport, setSelectedReport] = useState(null)

  // Filter reports
  const filteredReports = useMemo(() => {
    if (!reports) return []
    return reports.filter((report) => {
      const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || report.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [reports, searchTerm, statusFilter])

  const handleCopyContent = async () => {
    if (selectedReport?.content) {
      try {
        await navigator.clipboard.writeText(selectedReport.content)
      } catch {
        // Fallback for older browsers
        const textarea = document.createElement('textarea')
        textarea.value = selectedReport.content
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }
    }
  }

  const handleExportPDF = () => {
    alert('PDF导出功能开发中...')
  }

  return (
    <PageTransition>
      <div style={{ display: 'flex', gap: 24, height: 'calc(100vh - 160px)' }}>
        {/* Left Sidebar - Report List */}
        <div
          style={{
            width: 380,
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--bg-raised)',
            borderRadius: 8,
            border: '1px solid var(--border-subtle)',
            overflow: 'hidden',
          }}
        >
          {/* Search and Filter */}
          <div style={{ padding: 16, borderBottom: '1px solid var(--border-subtle)' }}>
            <Search
              placeholder="搜索报告..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ marginBottom: 12 }}
              prefix={<SearchOutlined style={{ color: 'var(--text-tertiary)' }} />}
            />
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: '100%' }}
              options={[
                { value: 'all', label: '全部状态' },
                { value: 'completed', label: '已完成' },
                { value: 'processing', label: '处理中' },
                { value: 'pending', label: '待处理' },
                { value: 'failed', label: '失败' },
              ]}
            />
          </div>

          {/* Report List */}
          <div style={{ flex: 1, overflow: 'auto' }}>
            {loading ? (
              <div style={{ padding: 16 }}>
                <SkeletonCard lines={2} />
                <SkeletonCard lines={2} />
                <SkeletonCard lines={2} />
              </div>
            ) : error ? (
              <div style={{ padding: 16, textAlign: 'center' }}>
                <Text style={{ color: 'var(--data-negative)' }}>加载失败: {error}</Text>
              </div>
            ) : filteredReports.length === 0 ? (
              <Empty description="暂无报告" style={{ padding: 40, color: 'var(--text-secondary)' }} />
            ) : (
              <List
                dataSource={filteredReports}
                renderItem={(report) => (
                  <List.Item
                    onClick={() => setSelectedReport(report)}
                    style={{
                      padding: '12px 16px',
                      cursor: 'pointer',
                      background: selectedReport?.id === report.id ? 'var(--accent-muted)' : 'transparent',
                      borderBottom: '1px solid var(--border-subtle)',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      if (selectedReport?.id !== report.id) {
                        e.currentTarget.style.background = 'var(--bg-inset)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedReport?.id !== report.id) {
                        e.currentTarget.style.background = 'transparent'
                      }
                    }}
                  >
                    <List.Item.Meta
                      avatar={
                        <div style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--accent-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <FileTextOutlined style={{ color: 'var(--accent-primary)', fontSize: 18 }} />
                        </div>
                      }
                      title={
                        <Text style={{ color: 'var(--text-primary)', fontSize: 14, fontWeight: 500, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {report.title}
                        </Text>
                      }
                      description={
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 4 }}>
                          <StatusBadge status={report.status} size="small" />
                          <Text style={{ color: 'var(--text-tertiary)', fontSize: 11 }}>
                            {report.token_usage?.toLocaleString() || 0} tokens
                          </Text>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            )}
          </div>
        </div>

        {/* Right Content Area */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--bg-raised)',
            borderRadius: 8,
            border: '1px solid var(--border-subtle)',
            overflow: 'hidden',
          }}
        >
          {selectedReport ? (
            <>
              {/* Content Header */}
              <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Title level={4} style={{ margin: 0, fontFamily: 'var(--font-heading)' }}>{selectedReport.title}</Title>
                  <Space style={{ marginTop: 8 }}>
                    <StatusBadge status={selectedReport.status} />
                    <Text style={{ color: 'var(--text-tertiary)', fontSize: 12 }}>
                      <ClockCircleOutlined style={{ marginRight: 4 }} />
                      {new Date(selectedReport.created_at).toLocaleString('zh-CN')}
                    </Text>
                    <Text style={{ color: 'var(--text-tertiary)', fontSize: 12 }}>
                      <CloudServerOutlined style={{ marginRight: 4 }} />
                      {selectedReport.token_usage?.toLocaleString() || 0} tokens
                    </Text>
                  </Space>
                </div>
                <Space>
                  <Button icon={<CopyOutlined />} onClick={handleCopyContent}>复制</Button>
                  <Button type="primary" icon={<DownloadOutlined />} onClick={handleExportPDF} style={{ background: 'var(--accent-primary)', borderColor: 'var(--accent-primary)' }}>
                    导出PDF
                  </Button>
                </Space>
              </div>

              {/* Content Body */}
              <div style={{ flex: 1, overflow: 'auto', padding: 24 }}>
                <SafeHtmlContent content={selectedReport.content} />
              </div>

              {/* Audio Player (if available) */}
              {selectedReport.audio_url && (
                <div style={{ padding: '12px 24px', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-inset)' }}>
                  <Space>
                    <PlayCircleOutlined style={{ color: 'var(--accent-primary)', fontSize: 24 }} />
                    <Text style={{ color: 'var(--text-secondary)' }}>音频简报</Text>
                    <audio controls style={{ height: 32 }}>
                      <source src={selectedReport.audio_url} type="audio/mpeg" />
                    </audio>
                  </Space>
                </div>
              )}
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
              <FileTextOutlined style={{ fontSize: 64, color: 'var(--text-tertiary)' }} />
              <Text style={{ color: 'var(--text-secondary)', fontSize: 16 }}>选择一份报告查看详情</Text>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  )
}

export default ReportCenter
