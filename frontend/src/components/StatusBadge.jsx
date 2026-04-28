function StatusBadge({ status }) {
  const badges = {
    pending: <span className="badge badge-pending">待处理</span>,
    processing: <span className="badge badge-processing">处理中</span>,
    completed: <span className="badge badge-completed">已完成</span>,
    failed: <span className="badge badge-failed">失败</span>,
  }
  return badges[status] || <span>{status}</span>
}

export default StatusBadge
