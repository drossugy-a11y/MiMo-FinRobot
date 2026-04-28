import { useParams, Link } from 'react-router-dom'
import { useReport } from '../hooks/useApi'
import './ReportDetail.css'

function ReportDetail() {
  const { id } = useParams()
  const { report, loading, error } = useReport(id)

  if (loading) {
    return <div className="loading">加载中...</div>
  }

  if (error) {
    return <div className="error">加载失败: {error}</div>
  }

  if (!report) {
    return <div className="error">报告不存在</div>
  }

  const getStatusBadge = (status) => {
    const badges = {
      pending: <span className="badge badge-pending">待处理</span>,
      processing: <span className="badge badge-processing">处理中</span>,
      completed: <span className="badge badge-completed">已完成</span>,
      failed: <span className="badge badge-failed">失败</span>,
    }
    return badges[status] || status
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
          {getStatusBadge(report.status)}
        </div>
        <div className="report-meta">
          <span>文件: {report.filename}</span>
          <span>Token消耗: {report.token_usage.toLocaleString()}</span>
          <span>创建时间: {new Date(report.created_at).toLocaleString('zh-CN')}</span>
        </div>
      </div>

      {report.status === 'completed' && report.content && (
        <div className="card report-content">
          <h2>研报内容</h2>
          <div className="content-body">
            {report.content.split('\n').map((line, i) => {
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
