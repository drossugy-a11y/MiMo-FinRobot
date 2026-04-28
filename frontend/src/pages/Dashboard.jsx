import { useState, useMemo } from 'react'
import { Typography, Space, Select, Card, Row, Col, Timeline, Tag, Alert } from 'antd'
import {
  FileTextOutlined,
  ExperimentOutlined,
  CloudServerOutlined,
} from '@ant-design/icons'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import KPICard from '../components/KPICard'
import ThemedCard from '../components/ThemedCard'
import { StatusIndicator } from '../components/StatusIndicator'
import PageTransition from '../components/PageTransition'
import { useReports, useBacktests } from '../hooks/useApi'

const { Title, Text } = Typography

// Chart tooltip style (shared)
const chartTooltipStyle = {
  background: 'var(--bg-raised)',
  border: '1px solid var(--border-default)',
  borderRadius: 8,
  fontFamily: 'var(--font-mono)',
}

// Mock data for token consumption trend
const mockTokenData = [
  { date: '周一', input: 12000, output: 8000 },
  { date: '周二', input: 15000, output: 10000 },
  { date: '周三', input: 18000, output: 12000 },
  { date: '周四', input: 14000, output: 9000 },
  { date: '周五', input: 20000, output: 14000 },
  { date: '周六', input: 8000, output: 5000 },
  { date: '周日', input: 10000, output: 7000 },
]

// Mock model distribution
const mockModelData = [
  { name: 'MiMo-V2.5-Pro', value: 45, color: '#00d4aa' },
  { name: 'MiMo-V2.5-Omni', value: 35, color: '#4A9EFF' },
  { name: 'MiMo-V2.5-TTS', value: 20, color: '#FFD700' },
]

// Mock recent tasks
const mockTasks = [
  {
    id: 1,
    action: '上传了小米集团Q4财报',
    result: '生成了投资策略分析报告',
    tokens: 8542,
    time: '2分钟前',
    status: 'completed',
  },
  {
    id: 2,
    action: '上传了比亚迪年度研报',
    result: '生成了量化回测策略',
    tokens: 7234,
    time: '15分钟前',
    status: 'completed',
  },
  {
    id: 3,
    action: '上传了腾讯AI战略分析',
    result: '正在识别图表数据...',
    tokens: 2100,
    time: '1小时前',
    status: 'processing',
  },
]

// System status items
const systemStatusItems = [
  { label: 'MiMo API', status: 'active' },
  { label: 'PDF解析模块', status: 'active' },
  { label: '研报生成模块', status: 'active' },
  { label: '回测引擎', status: 'active' },
  { label: '数据库', status: 'active' },
]

function Dashboard() {
  const [timeRange, setTimeRange] = useState('7d')
  const { reports, loading: reportsLoading, error: reportsError } = useReports()
  const { backtests, loading: backtestsLoading, error: backtestsError } = useBacktests()

  // Memoized calculations
  const stats = useMemo(() => {
    const totalReports = reports?.length || 0
    const completedBacktests = backtests?.filter(b => b.status === 'completed').length || 0
    const totalTokens = reports?.reduce((sum, r) => sum + (r.token_usage || 0), 0) || 0
    return { totalReports, completedBacktests, totalTokens }
  }, [reports, backtests])

  return (
    <PageTransition>
      <Space direction="vertical" size={24} style={{ width: '100%' }}>
        {/* Error Alerts */}
        {reportsError && (
          <Alert message="报告数据加载失败" description={reportsError} type="error" showIcon closable />
        )}
        {backtestsError && (
          <Alert message="回测数据加载失败" description={backtestsError} type="error" showIcon closable />
        )}

        {/* KPI Cards */}
        <div className="grid grid-4">
          <KPICard
            title="已处理财报"
            value={stats.totalReports}
            trend="up"
            trendValue={12}
            icon={<FileTextOutlined />}
            loading={reportsLoading}
          />
          <KPICard
            title="生成报告数"
            value={stats.totalReports}
            trend="up"
            trendValue={8}
            icon={<FileTextOutlined />}
            loading={reportsLoading}
          />
          <KPICard
            title="回测成功策略"
            value={stats.completedBacktests}
            trend="up"
            trendValue={15}
            icon={<ExperimentOutlined />}
            loading={backtestsLoading}
          />
          <KPICard
            title="Token消耗"
            value={stats.totalTokens}
            trend="up"
            trendValue={23}
            icon={<CloudServerOutlined />}
            loading={reportsLoading}
          />
        </div>

        {/* Charts Section */}
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <ThemedCard
              title="Token消耗趋势"
              extra={
                <Select
                  value={timeRange}
                  onChange={setTimeRange}
                  options={[
                    { value: '7d', label: '7天' },
                    { value: '30d', label: '30天' },
                    { value: '90d', label: '90天' },
                  ]}
                  size="small"
                  style={{ width: 100 }}
                />
              }
              bodyStyle={{ padding: '24px 24px 8px 24px' }}
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockTokenData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                  <XAxis dataKey="date" stroke="var(--text-tertiary)" fontSize={12} fontFamily="var(--font-mono)" />
                  <YAxis stroke="var(--text-tertiary)" fontSize={12} fontFamily="var(--font-mono)" />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Legend />
                  <Bar dataKey="input" name="Input Tokens" fill="var(--accent-primary)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="output" name="Output Tokens" fill="var(--data-info)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ThemedCard>
          </Col>

          <Col xs={24} lg={8}>
            <ThemedCard title="模型消耗占比">
              <Space direction="vertical" size={16} style={{ width: '100%' }}>
                {mockModelData.map((model) => (
                  <div key={model.name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <Text style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{model.name}</Text>
                      <Text style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                        {model.value}%
                      </Text>
                    </div>
                    <div style={{ height: 8, background: 'var(--bg-inset)', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${model.value}%`, background: model.color, borderRadius: 4, transition: 'width 0.5s ease' }} />
                    </div>
                  </div>
                ))}
              </Space>
            </ThemedCard>
          </Col>
        </Row>

        {/* Recent Tasks & System Status */}
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <ThemedCard title="最近分析任务">
              <Timeline
                items={mockTasks.map((task) => ({
                  color: task.status === 'completed' ? 'green' : 'blue',
                  children: (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <Text style={{ color: 'var(--text-primary)', display: 'block' }}>{task.action}</Text>
                        <Text style={{ color: 'var(--text-secondary)', fontSize: 13 }}>→ {task.result}</Text>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <Tag style={{ fontFamily: 'var(--font-mono)', background: 'var(--accent-muted)', color: 'var(--accent-primary)', border: 'none' }}>
                          {task.tokens.toLocaleString()} tokens
                        </Tag>
                        <Text style={{ color: 'var(--text-tertiary)', fontSize: 12, display: 'block', marginTop: 4 }}>
                          {task.time}
                        </Text>
                      </div>
                    </div>
                  ),
                }))}
              />
            </ThemedCard>
          </Col>

          <Col xs={24} lg={8}>
            <ThemedCard title="系统状态">
              <Space direction="vertical" size={20} style={{ width: '100%' }}>
                {systemStatusItems.map((item) => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ color: 'var(--text-secondary)' }}>{item.label}</Text>
                    <StatusIndicator status={item.status} showLabel={false} />
                  </div>
                ))}
              </Space>
            </ThemedCard>
          </Col>
        </Row>
      </Space>
    </PageTransition>
  )
}

export default Dashboard
