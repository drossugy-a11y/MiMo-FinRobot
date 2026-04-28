import { Button, Result } from 'antd'
import { useNavigate } from 'react-router-dom'
import PageTransition from '../components/PageTransition'

function NotFound() {
  const navigate = useNavigate()

  return (
    <PageTransition>
      <Result
        status="404"
        title={
          <span style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
            404
          </span>
        }
        subTitle={
          <span style={{ color: 'var(--text-secondary)' }}>
            抱歉，您访问的页面不存在
          </span>
        }
        extra={
          <Button
            type="primary"
            onClick={() => navigate('/')}
            style={{
              background: 'var(--accent-primary)',
              borderColor: 'var(--accent-primary)',
            }}
          >
            返回仪表盘
          </Button>
        }
        style={{
          background: 'transparent',
          minHeight: 'calc(100vh - 200px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      />
    </PageTransition>
  )
}

export default NotFound
