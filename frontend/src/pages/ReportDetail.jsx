import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useReport } from '../hooks/useApi'
import StatusBadge from '../components/StatusBadge'
import './ReportDetail.css'

function ReportDetail() {
  const { id } = useParams()
  const { report, loading, error } = useReport(id)

  const contentLines = useMemo(() => {
    if (!report?.content) return []
    return report.content.split('\n')
  }, [report?.content])

  if (loading) {
    return <div className="loading">加载中...</div>
  }

  if (error) {
    return <div className="error">加载失败: {error}</div>
  }

  if (!report) {
    return <div className="error">报告不存在</div>
  }

  return (
    <div className="report-detail">
      <div className="page-header">
        <Link to="/" className="back-link">
          ← 返回列表
        </Link>
        <div className="header-actions">
          {report.status === 'completed' && (
            <Link to={`/backtest?reportId=${report.id}`} className="btn btn-primary">
              创建回测
            </Link>
          )}
        </div>
      </div>

      <div className="card report-info">
        <div className="report-title">
          <h1>{report.title}</h1>
          <StatusBadge status={report.status} />
        </div>
        <div className="report-meta">
          <span>文件: {report.filename}</span>
          <span>Token消耗: {(report.token_usage || 0).toLocaleString()}</span>
          <span>创建时间: {new Date(report.created_at).toLocaleString('zh-CN')}</span>
        </div>
      </div>

      {report.status === 'completed' && contentLines.length > 0 && (
        <div className="card report-content">
          <h2>研报内容</h2>
          <div className="content-body">
            {contentLines.map((line, i) => {
              if (line.startsWith('# ')) {
                return <h1 key={i}>{line.slice(2)}</h1>
              }
              if (line.startsWith('## ')) {
                return <h2 key={i}>{line.slice(3)}</h2>
              }
              if (line.startsWith('### ')) {
                return <h3 key={i}>{line.slice(4)}</h3>
              }
              if (line.trim() === '') {
                return <br key={i} />
              }
              return <p key={i}>{line}</p>
            })}
          </div>
        </div>
      )}

      {report.status === 'failed' && (
        <div className="card error-card">
          <h2>处理失败</h2>
          <p>{report.content}</p>
        </div>
      )}
    </div>
  )
}

export default ReportDetail
