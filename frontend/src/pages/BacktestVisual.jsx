import { useState, useMemo } from 'react'
import {
  Typography,
  Space,
  Card,
  Row,
  Col,
  Table,
  Select,
  Tag,
  Tooltip,
} from 'antd'
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  TrophyOutlined,
  WarningOutlined,
  BarChartOutlined,
  StockOutlined,
} from '@ant-design/icons'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart,
} from 'recharts'
import KPICard from '../components/KPICard'
import { SkeletonChart, SkeletonTable } from '../components/SkeletonLoader'
import PageTransition from '../components/PageTransition'

const { Title, Text } = Typography

// Mock backtest data
const mockEquityCurve = [
  { day: 1, equity: 100000, benchmark: 100000 },
  { day: 5, equity: 102500, benchmark: 101000 },
  { day: 10, equity: 105800, benchmark: 102500 },
  { day: 15, equity: 103200, benchmark: 101800 },
  { day: 20, equity: 108500, benchmark: 104200 },
  { day: 25, equity: 112300, benchmark: 105800 },
  { day: 30, equity: 115800, benchmark: 107200 },
  { day: 35, equity: 118200, benchmark: 108500 },
  { day: 40, equity: 122500, benchmark: 110200 },
  { day: 45, equity: 125800, benchmark: 112800 },
  { day: 50, equity: 128500, benchmark: 115200 },
  { day: 55, equity: 125200, benchmark: 113800 },
  { day: 60, equity: 130200, benchmark: 116500 },
]

// Mock trades data
const mockTrades = [
  {
    key: '1',
    symbol: 'XIACF',
    buyDate: '2025-01-15',
    sellDate: '2025-03-20',
    buyPrice: 42.5,
    sellPrice: 48.2,
    shares: 500,
    pnl: 2850,
    pnlPercent: 13.41,
    holdingDays: 64,
  },
  {
    key: '2',
    symbol: 'XIACF',
    buyDate: '2025-05-10',
    sellDate: '2025-08-05',
    buyPrice: 45.0,
    sellPrice: 52.8,
    shares: 400,
    pnl: 3120,
    pnlPercent: 17.33,
    holdingDays: 87,
  },
  {
    key: '3',
    symbol: 'BYD',
    buyDate: '2025-03-01',
    sellDate: '2025-04-15',
    buyPrice: 285.0,
    sellPrice: 272.5,
    shares: 100,
    pnl: -1250,
    pnlPercent: -4.39,
    holdingDays: 45,
  },
  {
    key: '4',
    symbol: 'TSLA',
    buyDate: '2025-06-20',
    sellDate: '2025-07-30',
    buyPrice: 180.0,
    sellPrice: 195.5,
    shares: 200,
    pnl: 3100,
    pnlPercent: 8.61,
    holdingDays: 40,
  },
]

// Mock monthly returns for heatmap
const mockMonthlyReturns = [
  { month: '1月', return: 5.2 },
  { month: '2月', return: -2.1 },
  { month: '3月', return: 8.5 },
  { month: '4月', return: 3.2 },
  { month: '5月', return: -1.5 },
  { month: '6月', return: 6.8 },
  { month: '7月', return: 4.2 },
  { month: '8月', return: -3.8 },
  { month: '9月', return: 7.5 },
  { month: '10月', return: 2.1 },
  { month: '11月', return: 5.8 },
  { month: '12月', return: 1.2 },
]

function BacktestVisual() {
  const [strategy, setStrategy] = useState('momentum')
  const [loading, setLoading] = useState(false)

  // Calculate metrics
  const metrics = useMemo(() => {
    const initial = 100000
    const final = mockEquityCurve[mockEquityCurve.length - 1].equity
    const totalReturn = ((final - initial) / initial) * 100
    const maxDrawdown = 12.3
    const sharpeRatio = 1.85
    const winRate = 68.5
    const profitLossRatio = 2.15
    const avgHoldingDays = 59

    return {
      totalReturn,
      annualReturn: totalReturn * 1.2,
      maxDrawdown,
      sharpeRatio,
      winRate,
      profitLossRatio,
      avgHoldingDays,
    }
  }, [])

  // Find max drawdown point for annotation
  const maxDrawdownPoint = useMemo(() => {
    let maxDD = 0
    let peak = mockEquityCurve[0].equity
    let ddPoint = mockEquityCurve[0]

    mockEquityCurve.forEach((point) => {
      if (point.equity > peak) peak = point.equity
      const dd = ((peak - point.equity) / peak) * 100
      if (dd > maxDD) {
        maxDD = dd
        ddPoint = point
      }
    })

    return ddPoint
  }, [])

  const tradeColumns = [
    {
      title: '标的',
      dataIndex: 'symbol',
      key: 'symbol',
      render: (text) => (
        <Text style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{text}</Text>
      ),
    },
    {
      title: '买入日期',
      dataIndex: 'buyDate',
      key: 'buyDate',
      render: (text) => (
        <Text style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{text}</Text>
      ),
    },
    {
      title: '卖出日期',
      dataIndex: 'sellDate',
      key: 'sellDate',
      render: (text) => (
        <Text style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{text}</Text>
      ),
    },
    {
      title: '买入价',
      dataIndex: 'buyPrice',
      key: 'buyPrice',
      render: (text) => (
        <Text style={{ fontFamily: 'var(--font-mono)' }}>${text.toFixed(2)}</Text>
      ),
    },
    {
      title: '卖出价',
      dataIndex: 'sellPrice',
      key: 'sellPrice',
      render: (text) => (
        <Text style={{ fontFamily: 'var(--font-mono)' }}>${text.toFixed(2)}</Text>
      ),
    },
    {
      title: '盈亏',
      dataIndex: 'pnl',
      key: 'pnl',
      render: (text, record) => (
        <Space>
          <Text
            className={text >= 0 ? 'positive' : 'negative'}
            style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}
          >
            {text >= 0 ? '+' : ''}{text.toLocaleString()}
          </Text>
          <Tag
            color={record.pnlPercent >= 0 ? 'green' : 'red'}
            style={{ fontFamily: 'var(--font-mono)', margin: 0 }}
          >
            {record.pnlPercent >= 0 ? '+' : ''}{record.pnlPercent}%
          </Tag>
        </Space>
      ),
    },
    {
      title: '持仓天数',
      dataIndex: 'holdingDays',
      key: 'holdingDays',
      render: (text) => (
        <Text style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{text}天</Text>
      ),
    },
  ]

  const getSharpeColor = () => {
    if (metrics.sharpeRatio > 1) return 'var(--data-positive)'
    if (metrics.sharpeRatio > 0) return 'var(--data-warning)'
    return 'var(--data-negative)'
  }

  return (
    <PageTransition>
      <Space direction="vertical" size={24} style={{ width: '100%' }}>
        {/* Strategy Selector */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={4} style={{ margin: 0, fontFamily: 'var(--font-heading)' }}>
            策略回测分析
          </Title>
          <Select
            value={strategy}
            onChange={setStrategy}
            style={{ width: 200 }}
            options={[
              { value: 'momentum', label: '动量策略' },
              { value: 'mean_reversion', label: '均值回归' },
              { value: 'trend_following', label: '趋势跟踪' },
            ]}
          />
        </div>

        {/* KPI Cards */}
        <div className="grid grid-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <KPICard
            title="年化收益率"
            value={metrics.annualReturn.toFixed(1)}
            suffix="%"
            trend={metrics.annualReturn >= 0 ? 'up' : 'down'}
            icon={<TrophyOutlined />}
          />
          <KPICard
            title="最大回撤"
            value={metrics.maxDrawdown}
            suffix="%"
            trend="down"
            icon={<WarningOutlined />}
          />
          <KPICard
            title="夏普比率"
            value={metrics.sharpeRatio}
            icon={<BarChartOutlined />}
          />
          <KPICard
            title="胜率"
            value={metrics.winRate}
            suffix="%"
            trend="up"
            icon={<StockOutlined />}
          />
          <KPICard
            title="盈亏比"
            value={metrics.profitLossRatio}
            icon={<BarChartOutlined />}
          />
          <KPICard
            title="平均持仓天数"
            value={metrics.avgHoldingDays}
            suffix="天"
            icon={<BarChartOutlined />}
          />
        </div>

        {/* Equity Curve Chart */}
        <Card
          style={{
            background: 'var(--bg-raised)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 8,
          }}
          title={
            <span style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
              策略收益曲线
            </span>
          }
          headStyle={{ borderBottom: '1px solid var(--border-subtle)' }}
          bodyStyle={{ padding: 24 }}
        >
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={mockEquityCurve} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
              <XAxis
                dataKey="day"
                stroke="var(--text-tertiary)"
                fontSize={12}
                fontFamily="var(--font-mono)"
              />
              <YAxis
                stroke="var(--text-tertiary)"
                fontSize={12}
                fontFamily="var(--font-mono)"
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <RechartsTooltip
                contentStyle={{
                  background: 'var(--bg-raised)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 8,
                  fontFamily: 'var(--font-mono)',
                }}
                formatter={(value) => [`¥${value.toLocaleString()}`, '资金']}
              />
              <Area
                type="monotone"
                dataKey="equity"
                stroke="var(--accent-primary)"
                fillOpacity={1}
                fill="url(#colorEquity)"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="benchmark"
                stroke="var(--text-tertiary)"
                strokeDasharray="5 5"
                strokeWidth={1}
                dot={false}
              />
              {/* Max drawdown annotation */}
              <ReferenceLine
                x={maxDrawdownPoint.day}
                stroke="var(--data-negative)"
                strokeDasharray="3 3"
                label={{
                  value: `最大回撤`,
                  fill: 'var(--data-negative)',
                  fontSize: 12,
                  fontFamily: 'var(--font-mono)',
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 16 }}>
            <Space>
              <div style={{ width: 12, height: 3, background: 'var(--accent-primary)', borderRadius: 2 }} />
              <Text style={{ color: 'var(--text-secondary)', fontSize: 12 }}>策略收益</Text>
            </Space>
            <Space>
              <div style={{ width: 12, height: 3, background: 'var(--text-tertiary)', borderRadius: 2, borderTop: '1px dashed var(--text-tertiary)' }} />
              <Text style={{ color: 'var(--text-secondary)', fontSize: 12 }}>基准收益</Text>
            </Space>
          </div>
        </Card>

        {/* Monthly Returns Heatmap */}
        <Card
          style={{
            background: 'var(--bg-raised)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 8,
          }}
          title={
            <span style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
              月度收益分布
            </span>
          }
          headStyle={{ borderBottom: '1px solid var(--border-subtle)' }}
          bodyStyle={{ padding: 24 }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 8 }}>
            {mockMonthlyReturns.map((item, index) => {
              const intensity = Math.min(Math.abs(item.return) / 10, 1)
              const bgColor = item.return >= 0
                ? `rgba(0, 255, 0, ${0.2 + intensity * 0.6})`
                : `rgba(255, 102, 102, ${0.2 + intensity * 0.6})`

              return (
                <Tooltip key={index} title={`${item.month}: ${item.return}%`}>
                  <div
                    style={{
                      background: bgColor,
                      borderRadius: 4,
                      padding: '12px 8px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'transform 0.15s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <Text
                      style={{
                        color: 'var(--text-primary)',
                        fontSize: 11,
                        display: 'block',
                      }}
                    >
                      {item.month}
                    </Text>
                    <Text
                      className={item.return >= 0 ? 'positive' : 'negative'}
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                    >
                      {item.return >= 0 ? '+' : ''}{item.return}%
                    </Text>
                  </div>
                </Tooltip>
              )
            })}
          </div>
        </Card>

        {/* Trade Records Table */}
        <Card
          style={{
            background: 'var(--bg-raised)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 8,
          }}
          title={
            <span style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
              交易记录
            </span>
          }
          headStyle={{ borderBottom: '1px solid var(--border-subtle)' }}
          bodyStyle={{ padding: 0 }}
        >
          <Table
            columns={tradeColumns}
            dataSource={mockTrades}
            pagination={{ pageSize: 10 }}
            scroll={{ x: 800 }}
            style={{ fontFamily: 'var(--font-mono)' }}
          />
        </Card>
      </Space>
    </PageTransition>
  )
}

export default BacktestVisual
