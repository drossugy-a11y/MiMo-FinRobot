import { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function BacktestChart({ data }) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return []
    return data.map((value, index) => ({
      day: index + 1,
      value: value,
    }))
  }, [data])

  const { minValue, maxValue } = useMemo(() => {
    if (!data || data.length === 0) return { minValue: 0, maxValue: 100 }
    const min = Math.min(...data) * 0.95
    const max = Math.max(...data) * 1.05
    return { minValue: min, maxValue: max }
  }, [data])

  if (chartData.length === 0) {
    return <div className="no-data">暂无数据</div>
  }

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="chart-grid" />
          <XAxis
            dataKey="day"
            className="chart-axis"
            tick={{ fontSize: 12 }}
            label={{ value: '交易日', position: 'insideBottom', offset: -5 }}
          />
          <YAxis
            className="chart-axis"
            tick={{ fontSize: 12 }}
            domain={[minValue, maxValue]}
            label={{ value: '资金', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            contentStyle={{
              background: 'white',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius)',
            }}
            formatter={(value) => [`¥${value.toLocaleString()}`, '资金']}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="var(--color-primary)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default BacktestChart
