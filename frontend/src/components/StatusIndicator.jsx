import { Space, Typography, Tooltip } from 'antd'

const { Text } = Typography

// Shared status configuration
export function getStatusConfig(status) {
  const configs = {
    active: { color: 'var(--data-positive)', pulse: true, label: '活跃' },
    completed: { color: 'var(--data-positive)', pulse: true, label: '已完成' },
    online: { color: 'var(--data-positive)', pulse: true, label: '在线' },
    warning: { color: 'var(--data-warning)', pulse: true, label: '警告' },
    processing: { color: 'var(--data-warning)', pulse: true, label: '处理中' },
    error: { color: 'var(--data-negative)', pulse: false, label: '错误' },
    failed: { color: 'var(--data-negative)', pulse: false, label: '失败' },
    offline: { color: 'var(--data-negative)', pulse: false, label: '离线' },
    idle: { color: 'var(--data-neutral)', pulse: false, label: '空闲' },
    pending: { color: 'var(--data-neutral)', pulse: false, label: '待处理' },
  }
  return configs[status] || configs.idle
}

function StatusIndicator({ status, label, showLabel = true, size = 'medium' }) {
  const config = getStatusConfig(status)
  const displayLabel = label || config.label
  const dotSize = size === 'small' ? 6 : size === 'large' ? 12 : 8

  return (
    <Tooltip title={displayLabel}>
      <Space size={8} style={{ display: 'inline-flex', alignItems: 'center' }}>
        <span
          className={config.pulse ? 'status-pulse' : ''}
          style={{
            width: dotSize,
            height: dotSize,
            borderRadius: '50%',
            backgroundColor: config.color,
            display: 'inline-block',
            boxShadow: `0 0 8px ${config.color}`,
            animation: config.pulse ? 'pulse 2s infinite' : 'none',
          }}
        />
        {showLabel && (
          <Text
            style={{
              color: 'var(--text-secondary)',
              fontSize: size === 'small' ? 12 : 14,
            }}
          >
            {displayLabel}
          </Text>
        )}
      </Space>
    </Tooltip>
  )
}

function StatusBadge({ status, size = 'medium' }) {
  const config = getStatusConfig(status)

  return (
    <span
      style={{
        background: `${config.color}15`,
        color: config.color,
        border: `1px solid ${config.color}40`,
        padding: size === 'small' ? '2px 8px' : '4px 12px',
        borderRadius: 4,
        fontSize: size === 'small' ? 11 : 12,
        fontWeight: 500,
        fontFamily: 'var(--font-mono)',
      }}
    >
      {config.label}
    </span>
  )
}

export { StatusIndicator, StatusBadge }
