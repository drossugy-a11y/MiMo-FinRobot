import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function BacktestChart({ data }) {
  if (!data || data.length === 0) {
    return <div className="no-data">暂无数据</div>
  }

  const chartData = data.map((value, index) => ({
    day: index + 1,
    value: value,
  }))

  const minValue = Math.min(...data) * 0.95
  const maxValue = Math.max(...data) * 1.05

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="day"
            stroke="#64748b"
            tick={{ fontSize: 12 }}
            label={{ value: '交易日', position: 'insideBottom', offset: -5 }}
          />
          <YAxis
            stroke="#64748b"
            tick={{ fontSize: 12 }}
            domain={[minValue, maxValue]}
            label={{ value: '资金', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            contentStyle={{
              background: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
            }}
            formatter={(value) => [`¥${value.toLocaleString()}`, '资金']}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#2563eb"
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
