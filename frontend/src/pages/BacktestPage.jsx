import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useReports, createBacktest, runBacktest, getBacktestResult } from '../hooks/useApi'
import BacktestChart from '../components/BacktestChart'
import './BacktestPage.css'

function BacktestPage() {
  const [searchParams] = useSearchParams()
  const initialReportId = searchParams.get('reportId')
  const { reports } = useReports()

  const [selectedReportId, setSelectedReportId] = useState(initialReportId || '')
  const [strategyName, setStrategyName] = useState('momentum')
  const [initialCapital, setInitialCapital] = useState(100000)
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleRunBacktest = async () => {
    if (!selectedReportId) {
      setError('请选择一份报告')
      return
    }

    setRunning(true)
    setError(null)
    setResult(null)

    try {
      const backtest = await createBacktest({
        report_id: parseInt(selectedReportId),
        strategy_name: strategyName,
        initial_capital: initialCapital,
      })

      const backtestResult = await runBacktest(backtest.id)
      setResult(backtestResult)
    } catch (err) {
      setError(err.message)
    } finally {
      setRunning(false)
    }
  }

  const completedReports = reports.filter((r) => r.status === 'completed')

  return (
    <div className="backtest-page">
      <h1>量化回测</h1>

      <div className="card backtest-form">
        <h2>配置回测参数</h2>

        <div className="form-group">
          <label>选择报告</label>
          <select
            value={selectedReportId}
            onChange={(e) => setSelectedReportId(e.target.value)}
          >
            <option value="">请选择一份已分析的报告</option>
            {completedReports.map((report) => (
              <option key={report.id} value={report.id}>
                {report.title}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>策略名称</label>
          <select
            value={strategyName}
            onChange={(e) => setStrategyName(e.target.value)}
          >
            <option value="momentum">动量策略</option>
            <option value="mean_reversion">均值回归</option>
            <option value="trend_following">趋势跟踪</option>
          </select>
        </div>

        <div className="form-group">
          <label>初始资金</label>
          <input
            type="number"
            value={initialCapital}
            onChange={(e) => setInitialCapital(parseFloat(e.target.value))}
            min="10000"
            step="10000"
          />
        </div>

        <button
          className="btn btn-primary"
          onClick={handleRunBacktest}
          disabled={running}
        >
          {running ? '运行中...' : '开始回测'}
        </button>

        {error && <div className="error-message">{error}</div>}
      </div>

      {result && (
        <div className="backtest-results">
          <div className="card metrics-card">
            <h2>回测结果</h2>
            <div className="metrics-grid">
              <div className="metric">
                <span className="metric-label">总收益</span>
                <span className={`metric-value ${result.total_return >= 0 ? 'positive' : 'negative'}`}>
                  {result.total_return}%
                </span>
              </div>
              <div className="metric">
                <span className="metric-label">年化收益</span>
                <span className={`metric-value ${result.annual_return >= 0 ? 'positive' : 'negative'}`}>
                  {result.annual_return}%
                </span>
              </div>
              <div className="metric">
                <span className="metric-label">最大回撤</span>
                <span className="metric-value negative">{result.max_drawdown}%</span>
              </div>
              <div className="metric">
                <span className="metric-label">夏普比率</span>
                <span className="metric-value">{result.sharpe_ratio}</span>
              </div>
              <div className="metric">
                <span className="metric-label">胜率</span>
                <span className="metric-value">{result.win_rate}%</span>
              </div>
              <div className="metric">
                <span className="metric-label">总交易次数</span>
                <span className="metric-value">{result.total_trades}</span>
              </div>
            </div>
          </div>

          {result.equity_curve && (
            <div className="card chart-card">
              <h2>资金曲线</h2>
              <BacktestChart data={JSON.parse(result.equity_curve)} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default BacktestPage
