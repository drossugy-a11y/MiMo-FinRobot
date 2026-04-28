import { Card } from 'antd'

// Stable width patterns for skeleton items
const widthPatterns = ['100%', '90%', '85%', '95%', '80%', '88%', '92%', '75%']

function getStableWidth(index) {
  return widthPatterns[index % widthPatterns.length]
}

function SkeletonCard({ lines = 3, title = true, avatar = false }) {
  return (
    <Card
      style={{
        background: 'var(--bg-raised)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 8,
      }}
      bodyStyle={{ padding: 24 }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {avatar && (
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div className="skeleton" style={{ width: 48, height: 48, borderRadius: '50%' }} />
            <div style={{ flex: 1 }}>
              {title && <div className="skeleton" style={{ height: 20, width: '60%', marginBottom: 8 }} />}
              <div className="skeleton" style={{ height: 14, width: '40%' }} />
            </div>
          </div>
        )}
        {!avatar && title && <div className="skeleton" style={{ height: 24, width: '50%' }} />}
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="skeleton"
            style={{
              height: 14,
              width: i === lines - 1 ? '70%' : getStableWidth(i),
            }}
          />
        ))}
      </div>
    </Card>
  )
}

function SkeletonTable({ rows = 5, columns = 4 }) {
  return (
    <Card
      style={{
        background: 'var(--bg-raised)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 8,
      }}
      bodyStyle={{ padding: 0 }}
    >
      <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="skeleton" style={{ height: 20, width: 150 }} />
      </div>
      <div style={{ padding: '12px 24px' }}>
        {/* Header */}
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: 16, marginBottom: 16 }}>
          {Array.from({ length: columns }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 14, width: '80%' }} />
          ))}
        </div>
        {/* Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${columns}, 1fr)`,
              gap: 16,
              padding: '12px 0',
              borderBottom: rowIndex < rows - 1 ? '1px solid var(--border-subtle)' : 'none',
            }}
          >
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div
                key={colIndex}
                className="skeleton"
                style={{ height: 14, width: getStableWidth(rowIndex + colIndex) }}
              />
            ))}
          </div>
        ))}
      </div>
    </Card>
  )
}

function SkeletonChart({ height = 300 }) {
  return (
    <Card
      style={{
        background: 'var(--bg-raised)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 8,
      }}
      bodyStyle={{ padding: 24 }}
    >
      <div className="skeleton" style={{ height: 20, width: 150, marginBottom: 24 }} />
      <div className="skeleton" style={{ height, width: '100%', borderRadius: 8 }} />
    </Card>
  )
}

export { SkeletonCard, SkeletonTable, SkeletonChart }
