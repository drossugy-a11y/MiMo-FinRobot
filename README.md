# MiMo-FinRobot

🤖 MiMo驱动的全自动金融研报生成与量化回测系统

## 项目简介

MiMo-FinRobot 是一个利用小米 MiMo 系列大模型构建的智能金融分析系统。它可以自动解析PDF财报、生成专业研报、执行量化回测，并通过Web界面展示结果。

### 核心功能

- **PDF财报解析** - 使用 MiMo-V2.5-Omni 多模态模型自动识别和提取财报中的图表数据
- **智能研报生成** - 使用 MiMo-V2.5-Pro 推理模型生成专业的投资分析报告
- **量化回测引擎** - 基于研报中的交易信号执行历史回测
- **语音简报** - 使用 MiMo-V2.5-TTS 将研报转换为语音播报

## 技术栈

- **后端**: FastAPI + SQLAlchemy + SQLite
- **前端**: React + Vite + Recharts
- **AI模型**: MiMo-V2.5-Pro / Omni / TTS

## 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/your-username/MiMo-FinRobot.git
cd MiMo-FinRobot
```

### 2. 后端配置

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# 编辑 .env 文件，填入你的 MiMo API Key
```

### 3. 启动后端

```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

### 4. 前端配置

```bash
cd frontend
npm install
npm run dev
```

### 5. 访问应用

- 前端界面: http://localhost:3000
- API文档: http://localhost:8000/docs

## 使用流程

1. 上传一份PDF格式的财务报告
2. 点击"开始分析"，系统自动提取数据并生成研报
3. 查看生成的研报内容
4. 创建量化回测，查看策略表现

## Token消耗估算

| 模型 | 用途 | 单次消耗 |
|------|------|---------|
| MiMo-V2.5-Omni | PDF图表识别 | ~1,300-2,000 tokens |
| MiMo-V2.5-Pro | 策略生成 | ~4,000-8,000 tokens |
| MiMo-V2.5-TTS | 语音合成 | ~500-2,000 tokens |

## 项目结构

```
MiMo-FinRobot/
├── backend/
│   ├── app/
│   │   ├── api/          # API路由
│   │   ├── core/         # 配置和数据库
│   │   ├── models/       # 数据模型
│   │   ├── schemas/      # 请求/响应模型
│   │   └── services/     # 业务逻辑
│   └── tests/            # 测试文件
├── frontend/
│   ├── src/
│   │   ├── components/   # React组件
│   │   ├── hooks/        # 自定义Hook
│   │   └── pages/        # 页面组件
│   └── public/
└── docs/
```

## 开发者

这个项目由一个刚接触AI开发一周的新手，通过与Claude Code协作完成。

## License

MIT
