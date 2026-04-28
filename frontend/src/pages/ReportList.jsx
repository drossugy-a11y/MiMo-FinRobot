import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useReports, uploadReport, processReport, deleteReport } from '../hooks/useApi'
import './ReportList.css'

function ReportList() {
  const { reports, loading, error, refetch } = useReports()
  const [uploading, setUploading] = useState(false)
  const [processing, setProcessing] = useState(null)

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    try {
      await uploadReport(file)
      refetch()
    } catch (err) {
      alert('上传失败: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleProcess = async (reportId) => {
    setProcessing(reportId)
    try {
      await processReport(reportId)
      refetch()
    } catch (err) {
      alert('处理失败: ' + err.message)
    } finally {
      setProcessing(null)
    }
  }

  const handleDelete = async (reportId) => {
    if (!confirm('确定要删除这份报告吗？')) return
    try {
      await deleteReport(reportId)
      refetch()
    } catch (err) {
      alert('删除失败: ' + err.message)
    }
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

  if (loading) {
    return <div className="loading">加载中...</div>
  }

  if (error) {
    return <div className="error">加载失败: {error}</div>
  }

  return (
    <div className="report-list">
      <div className="page-header">
        <h1>财务研报列表</h1>
        <label className="btn btn-primary upload-btn">
          {uploading ? '上传中...' : '上传PDF'}
          <input
            type="file"
            accept=".pdf"
            onChange={handleUpload}
            style={{ display: 'none' }}
            disabled={uploading}
          />
        </label>
      </div>

      {reports.length === 0 ? (
        <div className="empty-state">
          <p>还没有任何报告</p>
          <p>上传一份PDF开始吧！</p>
        </div>
      ) : (
        <div className="report-grid">
          {reports.map((report) => (
            <div key={report.id} className="card report-card">
              <div className="report-header">
                <h3>
                  <Link to={`/reports/${report.id}`}>{report.title}</Link>
                </h3>
                {getStatusBadge(report.status)}
              </div>
              <p className="report-filename">{report.filename}</p>
              <div className="report-meta">
                <span>Token: {report.token_usage.toLocaleString()}</span>
                <span>{new Date(report.created_at).toLocaleDateString('zh-CN')}</span>
              </div>
              <div className="report-actions">
                {report.status === 'pending' && (
                  <button
                    className="btn btn-primary"
                    onClick={() => handleProcess(report.id)}
                    disabled={processing === report.id}
                  >
                    {processing === report.id ? '处理中...' : '开始分析'}
                  </button>
                )}
                {report.status === 'completed' && (
                  <Link to={`/reports/${report.id}`} className="btn btn-primary">
                    查看报告
                  </Link>
                )}
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(report.id)}
                >
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ReportList
