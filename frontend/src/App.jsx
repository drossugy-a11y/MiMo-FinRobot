import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import ReportList from './pages/ReportList'
import ReportDetail from './pages/ReportDetail'
import BacktestPage from './pages/BacktestPage'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="container nav-container">
            <Link to="/" className="logo">
              <span className="logo-icon">🤖</span>
              <span className="logo-text">MiMo-FinRobot</span>
            </Link>
            <div className="nav-links">
              <Link to="/" className="nav-link">报告列表</Link>
              <Link to="/backtest" className="nav-link">量化回测</Link>
            </div>
          </div>
        </nav>

        <main className="main">
          <div className="container">
            <Routes>
              <Route path="/" element={<ReportList />} />
              <Route path="/reports/:id" element={<ReportDetail />} />
              <Route path="/backtest" element={<BacktestPage />} />
            </Routes>
          </div>
        </main>

        <footer className="footer">
          <div className="container">
            <p>MiMo-FinRobot - Powered by MiMo V2.5</p>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App
