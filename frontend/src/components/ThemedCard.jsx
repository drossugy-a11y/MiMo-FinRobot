import { Card, Typography } from 'antd'

const { Title } = Typography

// Shared card styles to avoid repetition
export const cardStyles = {
  background: 'var(--bg-raised)',
  border: '1px solid var(--border-subtle)',
  borderRadius: 8,
}

// Reusable card title component
export function CardTitle({ children, style }) {
  return (
    <span
      style={{
        fontFamily: 'var(--font-heading)',
        color: 'var(--text-primary)',
        ...style,
      }}
    >
      {children}
    </span>
  )
}

// Themed Card wrapper
function ThemedCard({ title, headStyle, bodyStyle, children, ...props }) {
  return (
    <Card
      style={cardStyles}
      title={title ? <CardTitle>{title}</CardTitle> : undefined}
      headStyle={{ borderBottom: '1px solid var(--border-subtle)', ...headStyle }}
      bodyStyle={{ padding: 24, ...bodyStyle }}
      {...props}
    >
      {children}
    </Card>
  )
}

export default ThemedCard
