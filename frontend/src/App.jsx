import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ConfigProvider, theme as antTheme } from 'antd'
import { useTheme } from './hooks/useTheme'
import MainLayout from './layouts/MainLayout'
import Dashboard from './pages/Dashboard'
import ReportCenter from './pages/ReportCenter'
import BacktestVisual from './pages/BacktestVisual'
import UploadPage from './pages/UploadPage'
import About from './pages/About'
import NotFound from './pages/NotFound'
import './styles/global.css'

function App() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
        token: {
          colorPrimary: isDark ? '#00d4aa' : '#00b894',
          colorBgContainer: isDark ? '#12162a' : '#fff',
          colorBgElevated: isDark ? '#1a1e35' : '#fff',
          colorBgLayout: isDark ? '#0a0e27' : '#f5f5f5',
          colorText: isDark ? '#F5F5F7' : '#1a1a2e',
          colorTextSecondary: isDark ? 'rgba(245, 245, 247, 0.6)' : 'rgba(26, 26, 46, 0.6)',
          colorBorder: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
          borderRadius: 8,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        },
        components: {
          Menu: {
            darkItemBg: 'transparent',
            darkSubMenuItemBg: 'transparent',
            darkItemSelectedBg: 'rgba(0, 212, 170, 0.15)',
            itemColor: isDark ? 'rgba(245, 245, 247, 0.6)' : 'rgba(26, 26, 46, 0.6)',
            darkItemColor: isDark ? 'rgba(245, 245, 247, 0.6)' : 'rgba(26, 26, 46, 0.6)',
          },
          Card: {
            colorBgContainer: isDark ? '#12162a' : '#fff',
          },
          Table: {
            colorBgContainer: isDark ? '#12162a' : '#fff',
          },
        },
      }}
    >
      <Router>
        <MainLayout isDark={isDark} toggleTheme={toggleTheme}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/reports" element={<ReportCenter />} />
            <Route path="/reports/:id" element={<ReportCenter />} />
            <Route path="/backtest" element={<BacktestVisual />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MainLayout>
      </Router>
    </ConfigProvider>
  )
}

export default App
