import React, { useEffect, useState, useRef, memo } from 'react'
import { Typography } from 'antd'
import { ArrowUpOutlined, ArrowDownOutlined, MinusOutlined } from '@ant-design/icons'
import ThemedCard from './ThemedCard'

const { Text } = Typography

function AnimatedNumber({ value, duration = 800 }) {
  const [displayValue, setDisplayValue] = useState(0)
  const startRef = useRef(0)
  const startTimeRef = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    startRef.current = displayValue
    startTimeRef.current = null

    const animate = (currentTime) => {
      if (!startTimeRef.current) startTimeRef.current = currentTime
      const elapsed = currentTime - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = startRef.current + (value - startRef.current) * eased

      setDisplayValue(current)

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      }
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [value, duration])

  return <span>{Math.round(displayValue).toLocaleString()}</span>
}

function KPICard({
  title,
  value,
  prefix = '',
  suffix = '',
  trend = null,
  trendValue = null,
  icon,
  loading = false,
}) {
  const getTrendColor = () => {
    if (trend === 'up') return 'var(--data-positive)'
    if (trend === 'down') return 'var(--data-negative)'
    return 'var(--text-tertiary)'
  }

  const getTrendIcon = () => {
    if (trend === 'up') return <ArrowUpOutlined />
    if (trend === 'down') return <ArrowDownOutlined />
    return <MinusOutlined />
  }

  if (loading) {
    return (
      <ThemedCard bodyStyle={{ padding: 24 }}>
        <div className="skeleton" style={{ height: 20, width: 100, marginBottom: 16 }} />
        <div className="skeleton" style={{ height: 40, width: 150 }} />
      </ThemedCard>
    )
  }

  return (
    <ThemedCard bodyStyle={{ padding: 24 }} hoverable>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Text
            style={{
              color: 'var(--text-secondary)',
              fontSize: 14,
              fontFamily: 'var(--font-body)',
              display: 'block',
              marginBottom: 8,
            }}
          >
            {title}
          </Text>
          <div
            className="count-up"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 32,
              fontWeight: 600,
              color: 'var(--text-primary)',
              lineHeight: 1,
            }}
          >
            {prefix}
            <AnimatedNumber value={value} />
            {suffix}
          </div>
        </div>
        {icon && (
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 8,
              background: 'var(--accent-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-primary)',
              fontSize: 24,
            }}
          >
            {icon}
          </div>
        )}
      </div>
      {trend && trendValue !== null && (
        <div
          style={{
            marginTop: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span
            style={{
              color: getTrendColor(),
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 14,
              fontFamily: 'var(--font-mono)',
            }}
          >
            {getTrendIcon()}
            {Math.abs(trendValue)}%
          </span>
          <Text style={{ color: 'var(--text-tertiary)', fontSize: 12 }}>
            vs 上月
          </Text>
        </div>
      )}
    </ThemedCard>
  )
}

export default memo(KPICard)
