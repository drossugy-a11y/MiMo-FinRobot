#!/usr/bin/env python3
"""Mock API Server for MiMo-FinRobot Demo"""
from http.server import HTTPServer, SimpleHTTPRequestHandler
import json
import os
from datetime import datetime

# Mock data
MOCK_REPORTS = [
    {
        "id": 1,
        "title": "小米集团2025年Q4财报分析",
        "filename": "xiaomi_q4_2025.pdf",
        "status": "completed",
        "content": "# 小米集团2025年Q4财报分析\n\n## 核心财务指标\n\n| 指标 | 数值 | 同比变化 |\n|------|------|----------|\n| 营业收入 | 3,280亿元 | +18.5% |\n| 净利润 | 185亿元 | +25.3% |\n| 毛利率 | 22.8% | +2.1pp |\n| 研发投入 | 242亿元 | +32.1% |\n\n## 业务亮点\n\n### 智能手机业务\n- 全球出货量达1.68亿台，同比增长12%\n- 高端机型占比提升至28%\n- 海外市场份额持续扩大\n\n### IoT与生活消费品\n- AIoT连接设备数突破8.5亿台\n- 大家电业务收入增长45%\n- 智能电动汽车交付量达6.8万辆\n\n## 投资建议\n\n**买入评级**，目标价45港元。\n\n小米在智能电动汽车领域的突破性进展，加上AIoT生态的持续扩展，为公司打开了第二增长曲线。建议投资者重点关注：\n\n1. 汽车业务毛利率何时转正\n2. 高端手机市场份额变化\n3. AI大模型在IoT设备上的落地进度\n\n## 风险提示\n\n- 汽车业务前期投入较大，短期可能拖累利润\n- 全球智能手机市场竞争加剧\n- 汇率波动风险",
        "audio_url": None,
        "token_usage": 8542,
        "created_at": "2025-12-15T10:30:00Z",
        "updated_at": "2025-12-15T10:35:00Z"
    },
    {
        "id": 2,
        "title": "比亚迪2025年度研报",
        "filename": "byd_annual_2025.pdf",
        "status": "completed",
        "content": "# 比亚迪2025年度研报\n\n## 公司概况\n\n比亚迪股份有限公司（BYD Company Limited）是中国领先的新能源汽车和电池制造商。\n\n## 核心数据\n\n- 年度销量：427万辆（+41%）\n- 营收：7,820亿元（+35%）\n- 净利润：402亿元（+52%）\n- 全球市场份额：18.5%\n\n## 竞争优势\n\n1. 垂直整合能力：从电池到整车的完整产业链\n2. 技术领先：刀片电池、DM-i超级混动\n3. 成本控制：规模效应带来的成本优势\n\n## 量化信号\n\n```json\n{\n  \"signals\": [\n    {\"symbol\": \"BYD\", \"action\": \"buy\", \"confidence\": 0.85},\n    {\"symbol\": \"CATL\", \"action\": \"hold\", \"confidence\": 0.60}\n  ],\n  \"risk_level\": \"medium\",\n  \"suggested_position_size\": 0.15\n}\n```",
        "audio_url": None,
        "token_usage": 7234,
        "created_at": "2025-12-10T14:20:00Z",
        "updated_at": "2025-12-10T14:28:00Z"
    },
    {
        "id": 3,
        "title": "腾讯控股AI战略分析",
        "filename": "tencent_ai_strategy.pdf",
        "status": "pending",
        "content": None,
        "audio_url": None,
        "token_usage": 0,
        "created_at": "2025-12-18T09:15:00Z",
        "updated_at": "2025-12-18T09:15:00Z"
    }
]

MOCK_BACKTEST = {
    "id": 1,
    "report_id": 1,
    "strategy_name": "momentum",
    "initial_capital": 100000.0,
    "status": "completed",
    "start_date": "2025-01-01",
    "end_date": "2025-12-15",
    "created_at": "2025-12-15T11:00:00Z"
}

MOCK_BACKTEST_RESULT = {
    "id": 1,
    "backtest_id": 1,
    "total_return": 28.5,
    "annual_return": 31.2,
    "max_drawdown": 12.3,
    "sharpe_ratio": 1.85,
    "win_rate": 68.5,
    "total_trades": 42,
    "equity_curve": json.dumps([100000, 102500, 105800, 103200, 108500, 112300, 115800, 118200, 122500, 125800, 128500]),
    "trades": json.dumps([
        {"action": "buy", "symbol": "XIACF", "shares": 500, "price": 42.5, "cost": 21250, "timestamp": "2025-01-15T10:30:00"},
        {"action": "sell", "symbol": "XIACF", "shares": 500, "price": 48.2, "revenue": 24100, "timestamp": "2025-03-20T14:15:00"},
        {"action": "buy", "symbol": "XIACF", "shares": 400, "price": 45.0, "cost": 18000, "timestamp": "2025-05-10T09:45:00"},
        {"action": "sell", "symbol": "XIACF", "shares": 400, "price": 52.8, "revenue": 21120, "timestamp": "2025-08-05T11:20:00"}
    ]),
    "created_at": "2025-12-15T11:05:00Z"
}


class MockAPIHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path.startswith('/api/'):
            self.send_api_response()
        else:
            # Serve static files from frontend/dist
            if self.path == '/':
                self.path = '/index.html'
            return SimpleHTTPRequestHandler.do_GET(self)

    def do_POST(self):
        if self.path.startswith('/api/'):
            self.send_api_response()
        else:
            self.send_error(404)

    def do_DELETE(self):
        if self.path.startswith('/api/'):
            self.send_api_response()
        else:
            self.send_error(404)

    def send_api_response(self):
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

        if self.path == '/api/reports/' or self.path == '/api/reports':
            response = {
                "reports": MOCK_REPORTS,
                "total": len(MOCK_REPORTS),
                "page": 1,
                "limit": 10
            }
        elif self.path.startswith('/api/reports/') and self.path.endswith('/process'):
            report_id = int(self.path.split('/')[3])
            report = next((r for r in MOCK_REPORTS if r['id'] == report_id), None)
            if report:
                report['status'] = 'completed'
                response = report
            else:
                response = {"error": "Not found"}
        elif '/api/reports/' in self.path and not self.path.endswith('/process'):
            report_id = int(self.path.split('/')[3])
            report = next((r for r in MOCK_REPORTS if r['id'] == report_id), None)
            response = report if report else {"error": "Not found"}
        elif self.path == '/api/backtests/' or self.path == '/api/backtests':
            response = [MOCK_BACKTEST]
        elif '/api/backtests/' in self.path and '/result' in self.path:
            response = MOCK_BACKTEST_RESULT
        elif '/api/backtests/' in self.path:
            response = MOCK_BACKTEST
        else:
            response = {"error": "Unknown endpoint"}

        self.wfile.write(json.dumps(response).encode())


def main():
    # Change to frontend/dist directory to serve static files
    os.chdir('/home/claude/MiMo-FinRobot/frontend/dist')

    server = HTTPServer(('0.0.0.0', 3001), MockAPIHandler)
    print("🚀 MiMo-FinRobot Demo Server running at http://localhost:3001")
    print("📊 Mock data loaded with 3 sample reports")
    server.serve_forever()


if __name__ == '__main__':
    main()
