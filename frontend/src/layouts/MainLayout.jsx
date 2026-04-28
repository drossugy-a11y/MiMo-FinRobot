import { useState, useMemo } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu, Button, Space, Typography, Grid, Drawer } from 'antd'
import {
  DashboardOutlined,
  FileTextOutlined,
  LineChartOutlined,
  UploadOutlined,
  SunOutlined,
  MoonOutlined,
  RobotOutlined,
  MenuOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons'

const { Header, Sider, Content } = Layout
const { Title } = Typography
const { useBreakpoint } = Grid

// Menu items defined outside component to prevent recreation
const menuItems = [
  { key: '/', icon: <DashboardOutlined />, label: '仪表盘' },
  { key: '/reports', icon: <FileTextOutlined />, label: '报告中心' },
  { key: '/backtest', icon: <LineChartOutlined />, label: '回测可视化' },
  { key: '/upload', icon: <UploadOutlined />, label: '财报上传' },
  { key: '/about', icon: <InfoCircleOutlined />, label: '关于项目' },
]

// Mobile bottom navigation extracted outside render
function MobileNav({ location, onNavigate }) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'var(--bg-raised)',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        justifyContent: 'space-around',
        padding: '8px 0',
        zIndex: 100,
      }}
    >
      {menuItems.slice(0, 5).map(item => (
        <Button
          key={item.key}
          type="text"
          icon={item.icon}
          onClick={() => onNavigate(item.key)}
          style={{
            color: location.pathname === item.key
              ? 'var(--accent-primary)'
              : 'var(--text-secondary)',
            flexDirection: 'column',
            height: 'auto',
            padding: '4px 12px',
          }}
        >
          <span style={{ fontSize: 10, marginTop: 2 }}>{item.label}</span>
        </Button>
      ))}
    </div>
  )
}

function MainLayout({ isDark, toggleTheme, children }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const screens = useBreakpoint()
  const isMobile = !screens.md

  const handleMenuClick = ({ key }) => {
    navigate(key)
    setMobileMenuOpen(false)
  }

  const getPageTitle = () => {
    const item = menuItems.find(item => item.key === location.pathname)
    return item?.label || 'MiMo-FinRobot'
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
            background: 'var(--bg-inset)',
            borderRight: '1px solid var(--border-subtle)',
          }}
        >
          <div
            style={{
              height: 64,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderBottom: '1px solid var(--border-subtle)',
            }}
          >
            <RobotOutlined style={{ fontSize: 24, color: 'var(--accent-primary)' }} />
            {!collapsed && (
              <Title
                level={5}
                style={{
                  margin: 0,
                  marginLeft: 12,
                  fontFamily: 'var(--font-heading)',
                  color: 'var(--text-primary)',
                }}
              >
                MiMo-FinRobot
              </Title>
            )}
          </div>
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={handleMenuClick}
            style={{ background: 'transparent', border: 'none' }}
          />
        </Sider>
      )}

      <Layout
        style={{
          marginLeft: isMobile ? 0 : (collapsed ? 80 : 200),
          transition: 'margin-left 0.2s',
        }}
      >
        <Header
          style={{
            padding: '0 24px',
            background: 'var(--bg-base)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border-subtle)',
            position: 'sticky',
            top: 0,
            zIndex: 10,
          }}
        >
          <Space>
            {isMobile && (
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={() => setMobileMenuOpen(true)}
              />
            )}
            <Title
              level={4}
              style={{
                margin: 0,
                fontFamily: 'var(--font-heading)',
                color: 'var(--text-primary)',
              }}
            >
              {getPageTitle()}
            </Title>
          </Space>
          <Space>
            <Button
              type="text"
              icon={isDark ? <SunOutlined /> : <MoonOutlined />}
              onClick={toggleTheme}
              style={{ color: 'var(--text-secondary)' }}
            />
          </Space>
        </Header>

        <Content
          style={{
            margin: isMobile ? 16 : 24,
            padding: isMobile ? 16 : 24,
            background: 'var(--bg-raised)',
            borderRadius: 8,
            minHeight: isMobile ? 'calc(100vh - 140px)' : 'calc(100vh - 112px)',
            marginBottom: isMobile ? 80 : 24,
          }}
        >
          {children}
          <Outlet />
        </Content>
      </Layout>

      {/* Mobile Bottom Navigation */}
      {isMobile && <MobileNav location={location} onNavigate={handleMenuClick} />}

      {/* Mobile Drawer */}
      <Drawer
        title="菜单"
        placement="left"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        bodyStyle={{ padding: 0, background: 'var(--bg-inset)' }}
      >
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ background: 'transparent', border: 'none' }}
        />
      </Drawer>
    </Layout>
  )
}

export default MainLayout
