# MiMo-FinRobot 项目计划文档

> **MiMo 驱动的全自动财务报告生成与量化回测系统**

---

## 目录

1. [项目愿景](#1-项目愿景)
2. [技术架构](#2-技术架构)
3. [模块拆解与 Token 估算](#3-模块拆解与-token-估算)
4. [开发阶段](#4-开发阶段)
5. [Token 预算估算](#5-token-预算估算)
6. [风险评估](#6-风险评估)

---

## 1. 项目愿景

### 1.1 为什么初学者应该构建这个系统？

**从零到一的实战训练场：**
本项目是一个完整的 AI Agent 应用落地案例，覆盖了从 PDF 解析、多模态理解、LLM 推理、代码生成、量化回测到前端可视化的完整链路。作为一个仅有 1 周 Agent 项目经验的初学者，你将获得：

- **API 调用经验**：学习如何调用大模型 API（OpenAI 兼容格式）
- **Agent 架构思维**：理解"多个 AI Agent 协作完成任务"的设计模式
- **全栈开发能力**：FastAPI 后端 + React 前端 + SQLite 数据库
- **量化金融入门**：用 Python 实现简单的事件驱动回测引擎
- **开源项目经验**：完整的 GitHub 项目发布流程

**技术亮点总结：**
| 维度 | 说明 |
|------|------|
| 多模态 AI | 使用 MiMo-V2.5-Omni 读取 PDF 中的图表和表格 |
| 推理型 Agent | 使用 MiMo-V2.5-Pro 生成投资策略和分析报告 |
| 语音合成 | 使用 MiMo-V2.5-TTS 将报告转为语音播报 |
| 量化回测 | Python 事件驱动架构，支持历史数据回测 |
| Web 界面 | React + Recharts 可视化仪表板 |

### 1.2 系统解决什么问题？

**痛点：** 金融机构的分析师每天需要阅读大量 PDF 研报，手动提取关键数据，撰写分析报告，再进行策略回测验证。这个过程耗时且重复性高。

**MiMo-FinRobot 的解决方案：**

```
PDF 研报上传 → AI 自动识别图表数据 → Agent 生成投资策略 → 回测引擎验证 → 生成报告 → 语音播报
```

**核心价值：**
1. **自动化报告解析**：AI 自动从 PDF 研报中提取财务数据、图表趋势
2. **智能策略生成**：基于提取的数据，AI Agent 自动分析并生成投资建议
3. **策略回测验证**：将 AI 生成的策略在历史数据上进行回测，验证可行性
4. **多模态输出**：生成可视化报告 + 语音简报，方便不同场景使用

### 1.3 MiMo 模型如何使这一切成为可能？

MiMo 是小米推出的推理型大模型系列，专为复杂推理和代码生成任务设计。本项目使用三个 MiMo 变体：

| 模型 | 用途 | 为什么选择它 |
|------|------|-------------|
| **MiMo-V2.5-Pro** | 策略生成与代码编写 | 强大的推理和代码生成能力，适合 Agent 场景 |
| **MiMo-V2.5-Omni** | 读取 PDF 中的图表/表格 | 多模态能力，能理解图像中的数据和趋势 |
| **MiMo-V2.5-TTS** | 将报告转为语音简报 | 文本转语音能力，支持自然的语音播报 |

---

## 2. 技术架构

### 2.1 技术栈选择

**为什么选择这个技术栈？**

| 技术 | 选择理由 | 替代方案（为什么不选） |
|------|---------|----------------------|
| **FastAPI** | Python 生态、异步支持好、自动文档 | Django（太重）、Flask（不够现代） |
| **React** | 组件化、生态丰富、就业市场需求大 | Vue（都可以，React 更主流）、原生 HTML（不够） |
| **SQLite** | 零配置、单文件数据库、适合小项目 | PostgreSQL（太复杂）、MongoDB（不需要 NoSQL） |
| **Python** | AI/ML 生态最好、金融分析库丰富 | Node.js（AI 库不如 Python） |

### 2.2 MiMo API 集成点

所有 MiMo 模型通过 **OpenAI 兼容 API** 调用，这使得集成非常简单：

```python
# 统一的 API 调用方式（伪代码）
from openai import OpenAI

client = OpenAI(
    api_key="your-mimo-api-key",
    base_url="https://api.mimo.example.com/v1"  # MiMo API 端点
)

# 1. Pro 模型 - 推理和代码生成
response = client.chat.completions.create(
    model="MiMo-V2.5-Pro",
    messages=[{"role": "user", "content": "分析以下财务数据..."}]
)

# 2. Omni 模型 - 多模态 PDF 读取
response = client.chat.completions.create(
    model="MiMo-V2.5-Omni",
    messages=[{
        "role": "user",
        "content": [
            {"type": "text", "text": "请提取这张图表中的数据"},
            {"type": "image_url", "image_url": {"url": "data:image/png;base64,..."}}
        ]
    }]
)

# 3. TTS 模型 - 文本转语音
response = client.audio.speech.create(
    model="MiMo-V2.5-TTS",
    input="报告摘要：目标公司营收增长15%...",
    voice="alloy"
)
```

### 2.3 数据流架构

```
┌─────────────────────────────────────────────────────────────────────┐
│                        用户 (浏览器)                                 │
│                    React 前端仪表板                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐   │
│  │ 上传 PDF  │  │ 查看报告  │  │ 回测结果  │  │ 语音播放器        │   │
│  └────┬─────┘  └────▲─────┘  └────▲─────┘  └────▲─────────────┘   │
│       │             │             │              │                  │
└───────┼─────────────┼─────────────┼──────────────┼──────────────────┘
        │  HTTP API   │             │              │
        ▼             │             │              │
┌─────────────────────────────────────────────────────────────────────┐
│                     FastAPI 后端服务                                  │
│                                                                      │
│  ┌──────────────┐                                                   │
│  │ /api/upload   │  上传 PDF → 存储到 data/pdfs/                     │
│  └──────┬───────┘                                                   │
│         │                                                            │
│         ▼                                                            │
│  ┌──────────────────────────────────────┐                           │
│  │  PDF 解析模块                         │                           │
│  │  ├─ PyMuPDF 提取文本                  │                           │
│  │  ├─ 图片提取 → base64 编码            │                           │
│  │  └─ MiMo-V2.5-Omni: 识别图表数据      │◄── 多模态调用             │
│  └──────┬───────────────────────────────┘                           │
│         │                                                            │
│         ▼                                                            │
│  ┌──────────────────────────────────────┐                           │
│  │  研报生成 Agent 集群                   │                           │
│  │  ├─ 分析 Agent: 解读财务数据           │                           │
│  │  ├─ 策略 Agent: 生成投资策略           │◄── MiMo-V2.5-Pro         │
│  │  └─ 代码 Agent: 编写回测代码           │◄── MiMo-V2.5-Pro         │
│  └──────┬───────────────────────────────┘                           │
│         │                                                            │
│         ▼                                                            │
│  ┌──────────────────────────────────────┐                           │
│  │  量化回测引擎 (Python 事件驱动)        │                           │
│  │  ├─ 接收 Agent 生成的策略代码          │                           │
│  │  ├─ 加载历史行情数据                   │                           │
│  │  ├─ 逐日回测执行                      │                           │
│  │  └─ 生成回测报告 (收益曲线/夏普比率等)  │                           │
│  └──────┬───────────────────────────────┘                           │
│         │                                                            │
│         ▼                                                            │
│  ┌──────────────────────────────────────┐                           │
│  │  报告输出模块                          │                           │
│  │  ├─ Markdown 报告生成                 │                           │
│  │  ├─ MiMo-V2.5-TTS: 语音简报生成       │◄── 文本转语音             │
│  │  └─ 存储到 SQLite 数据库               │                           │
│  └──────────────────────────────────────┘                           │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────┐
│          SQLite 数据库               │
│  ├─ reports 表 (报告记录)            │
│  ├─ backtests 表 (回测结果)          │
│  └─ audio_briefings 表 (语音文件)    │
└─────────────────────────────────────┘
```

### 2.4 项目文件结构

```
MiMo-FinRobot/
├── README.md                          # 项目说明文档
├── project_plan.md                    # 本文档
├── requirements.txt                   # Python 依赖
├── .env.example                       # 环境变量模板
├── .gitignore                         # Git 忽略文件
│
├── backend/                           # FastAPI 后端
│   ├── main.py                        # 应用入口
│   ├── config.py                      # 配置管理
│   ├── database.py                    # SQLite 数据库初始化
│   │
│   ├── api/                           # API 路由
│   │   ├── __init__.py
│   │   ├── reports.py                 # 报告相关 API
│   │   ├── backtests.py               # 回测相关 API
│   │   └── audio.py                   # 语音相关 API
│   │
│   ├── models/                        # 数据模型
│   │   ├── __init__.py
│   │   ├── report.py                  # 报告数据模型
│   │   └── backtest.py                # 回测数据模型
│   │
│   ├── services/                      # 业务逻辑
│   │   ├── __init__.py
│   │   ├── pdf_parser.py              # PDF 解析服务
│   │   ├── report_generator.py        # 研报生成服务
│   │   ├── backtesting_engine.py      # 回测引擎
│   │   ├── tts_service.py             # 语音合成服务
│   │   └── mimo_client.py             # MiMo API 客户端
│   │
│   └── prompts/                       # AI Prompt 模板
│       ├── __init__.py
│       ├── analysis_prompt.txt        # 财务分析 Prompt
│       ├── strategy_prompt.txt        # 策略生成 Prompt
│       └── code_gen_prompt.txt        # 代码生成 Prompt
│
├── frontend/                          # React 前端
│   ├── package.json
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── App.jsx                    # 主组件
│       ├── index.jsx                  # 入口文件
│       ├── components/                # 组件
│       │   ├── UploadPanel.jsx        # PDF 上传面板
│       │   ├── ReportViewer.jsx       # 报告查看器
│       │   ├── BacktestChart.jsx      # 回测图表
│       │   ├── AudioPlayer.jsx        # 语音播放器
│       │   └── Dashboard.jsx          # 仪表板布局
│       └── api/                       # API 调用
│           └── client.js              # Axios 封装
│
├── data/                              # 数据目录
│   ├── pdfs/                          # 上传的 PDF 文件
│   ├── audio/                         # 生成的语音文件
│   └── backtest_data/                 # 回测历史数据
│
└── scripts/                           # 辅助脚本
    ├── init_db.py                     # 数据库初始化
    ├── download_sample_data.py        # 下载示例数据
    └── generate_demo_report.py        # 生成演示报告
```

---

## 3. 模块拆解与 Token 估算

### 3.1 模块一：PDF 报告解析器

**功能描述：**
自动解析上传的 PDF 财务研报，提取文本内容、图表、表格数据。

**使用的 MiMo 模型：** MiMo-V2.5-Omni（多模态）

**工作流程：**
```
PDF 文件
  ├─ PyMuPDF 提取纯文本
  ├─ PyMuPDF 提取页面图片（图表/表格截图）
  └─ MiMo-V2.5-Omni 逐图分析
      ├─ 图表类型识别（K线图/柱状图/饼图/折线图）
      ├─ 数据点提取
      └─ 趋势描述
  └─ 合并所有结果 → 结构化 JSON
```

**Token 消耗估算：**
| 操作 | 输入 Token | 输出 Token | 总计 | 说明 |
|------|-----------|-----------|------|------|
| 单页图片分析 | 800-1200 | 500-800 | 1300-2000 | 每张图表一次调用 |
| 文本理解与摘要 | 1500-2500 | 500-1000 | 2000-3500 | 整页文本 |
| **平均一份研报（20页）** | ~25,000 | ~12,000 | **~37,000** | 含图表分析 |

**实现复杂度：** ⭐⭐⭐（中等）

**关键代码片段（伪代码）：**
```python
# services/pdf_parser.py
import fitz  # PyMuPDF
from openai import OpenAI

class PDFParser:
    def __init__(self, mimo_client: OpenAI):
        self.client = mimo_client
    
    async def parse_pdf(self, pdf_path: str) -> dict:
        doc = fitz.open(pdf_path)
        results = {"text": "", "charts": []}
        
        for page in doc:
            # 提取文本
            results["text"] += page.get_text()
            
            # 提取图片并用 MiMo-V2.5-Omni 分析
            images = page.get_images()
            for img in images:
                base64_image = self._extract_image_base64(page, img)
                chart_data = await self._analyze_chart(base64_image)
                results["charts"].append(chart_data)
        
        return results
    
    async def _analyze_chart(self, image_base64: str) -> dict:
        response = self.client.chat.completions.create(
            model="MiMo-V2.5-Omni",
            messages=[{
                "role": "user",
                "content": [
                    {"type": "text", "text": ANALYSIS_PROMPT},
                    {"type": "image_url", "image_url": {
                        "url": f"data:image/png;base64,{image_base64}"
                    }}
                ]
            }],
            max_tokens=1000
        )
        return json.loads(response.choices[0].message.content)
```

---

### 3.2 模块二：研报生成 Agent 集群

**功能描述：**
多个 AI Agent 协作，基于解析出的财务数据，自动生成投资分析报告。

**使用的 MiMo 模型：** MiMo-V2.5-Pro（推理）

**Agent 集群设计：**

```
                    ┌─────────────────┐
                    │  Orchestrator   │
                    │  (协调者 Agent)  │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
    ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
    │ 分析 Agent    │ │ 策略 Agent    │ │ 代码 Agent    │
    │ 解读财务数据  │ │ 生成投资策略  │ │ 编写回测代码  │
    └──────────────┘ └──────────────┘ └──────────────┘
```

**三个 Agent 的分工：**

| Agent | 职责 | 输入 | 输出 |
|-------|------|------|------|
| **分析 Agent** | 解读财务指标、行业趋势 | PDF 解析数据 | 财务分析摘要 |
| **策略 Agent** | 基于分析生成投资策略 | 分析摘要 | 投资策略文档 |
| **代码 Agent** | 将策略转化为可执行代码 | 策略文档 | Python 回测代码 |

**Token 消耗估算：**
| 操作 | 输入 Token | 输出 Token | 总计 | 说明 |
|------|-----------|-----------|------|------|
| 分析 Agent | 2000-3000 | 1000-2000 | 3000-5000 | 解读财务数据 |
| 策略 Agent | 2500-3500 | 1500-2500 | 4000-6000 | 生成投资策略 |
| 代码 Agent | 3000-4000 | 2000-4000 | 5000-8000 | 编写回测代码 |
| **总计** | 7500-10500 | 4500-8500 | **12000-19000** | 三个 Agent |

**实现复杂度：** ⭐⭐⭐⭐（较高）

**关键代码片段（伪代码）：**
```python
# services/report_generator.py
class ReportGeneratorAgentCluster:
    def __init__(self, mimo_client: OpenAI):
        self.client = mimo_client
    
    async def generate_report(self, parsed_data: dict) -> dict:
        # Step 1: 分析 Agent
        analysis = await self._analysis_agent(parsed_data)
        
        # Step 2: 策略 Agent
        strategy = await self._strategy_agent(analysis)
        
        # Step 3: 代码 Agent
        backtest_code = await self._code_agent(strategy)
        
        return {
            "analysis": analysis,
            "strategy": strategy,
            "backtest_code": backtest_code
        }
    
    async def _analysis_agent(self, data: dict) -> str:
        response = self.client.chat.completions.create(
            model="MiMo-V2.5-Pro",
            messages=[
                {"role": "system", "content": ANALYSIS_SYSTEM_PROMPT},
                {"role": "user", "content": f"分析以下财务数据：\n{json.dumps(data)}"}
            ],
            temperature=0.3,
            max_tokens=2000
        )
        return response.choices[0].message.content
    
    async def _strategy_agent(self, analysis: str) -> str:
        response = self.client.chat.completions.create(
            model="MiMo-V2.5-Pro",
            messages=[
                {"role": "system", "content": STRATEGY_SYSTEM_PROMPT},
                {"role": "user", "content": f"基于以下分析生成投资策略：\n{analysis}"}
            ],
            temperature=0.5,
            max_tokens=2500
        )
        return response.choices[0].message.content
    
    async def _code_agent(self, strategy: str) -> str:
        response = self.client.chat.completions.create(
            model="MiMo-V2.5-Pro",
            messages=[
                {"role": "system", "content": CODE_GEN_SYSTEM_PROMPT},
                {"role": "user", "content": f"将以下策略转化为 Python 回测代码：\n{strategy}"}
            ],
            temperature=0.2,
            max_tokens=4000
        )
        return response.choices[0].message.content
```

---

### 3.3 模块三：量化回测引擎

**功能描述：**
接收 Agent 生成的策略代码，在历史行情数据上执行回测，输出收益曲线和风险指标。

**使用的 MiMo 模型：** 无（纯 Python 实现）

**技术选型：**
- 事件驱动架构（类似 Zipline 简化版）
- pandas 用于数据处理
- numpy 用于计算收益指标
- matplotlib 生成图表（或前端 Recharts）

**工作流程：**
```
Agent 生成的策略代码
  │
  ├─ 加载历史数据 (data/backtest_data/)
  │   └─ CSV 格式: date, open, high, low, close, volume
  │
  ├─ 事件循环
  │   ├─ MarketEvent: 每日行情更新
  │   ├─ SignalEvent: 策略产生交易信号
  │   ├─ OrderEvent: 执行交易订单
  │   └─ FillEvent: 订单成交确认
  │
  ├─ 计算指标
  │   ├─ 总收益率
  │   ├─ 年化收益率
  │   ├─ 夏普比率 (Sharpe Ratio)
  │   ├─ 最大回撤 (Max Drawdown)
  │   └─ 胜率 (Win Rate)
  │
  └─ 输出回测报告 JSON
```

**Token 消耗估算：** 0 tokens（纯 Python 计算）

**实现复杂度：** ⭐⭐⭐（中等）

**关键代码片段（伪代码）：**
```python
# services/backtesting_engine.py
import pandas as pd
import numpy as np
from dataclasses import dataclass
from typing import List

@dataclass
class Trade:
    date: str
    action: str  # "BUY" or "SELL"
    symbol: str
    quantity: int
    price: float

class BacktestingEngine:
    def __init__(self, initial_capital: float = 100000.0):
        self.initial_capital = initial_capital
        self.portfolio_value = initial_capital
        self.trades: List[Trade] = []
        self.equity_curve: List[float] = []
    
    def run(self, strategy_code: str, data_path: str) -> dict:
        """执行回测"""
        # 加载数据
        data = pd.read_csv(data_path)
        
        # 动态执行 Agent 生成的策略代码
        # 注意：生产环境需要沙箱执行！
        strategy_namespace = {"data": data, "pd": pd, "np": np}
        exec(strategy_code, strategy_namespace)
        
        # 计算回测结果
        results = self._calculate_metrics()
        return results
    
    def _calculate_metrics(self) -> dict:
        equity = np.array(self.equity_curve)
        returns = np.diff(equity) / equity[:-1]
        
        return {
            "total_return": (equity[-1] - equity[0]) / equity[0],
            "annualized_return": np.mean(returns) * 252,
            "sharpe_ratio": np.mean(returns) / np.std(returns) * np.sqrt(252),
            "max_drawdown": self._max_drawdown(equity),
            "win_rate": self._win_rate(),
            "equity_curve": equity.tolist(),
            "trades": [{"date": t.date, "action": t.action, "price": t.price} 
                      for t in self.trades]
        }
```

---

### 3.4 模块四：语音简报生成

**功能描述：**
将生成的投资报告转为语音简报，方便用户在移动端收听。

**使用的 MiMo 模型：** MiMo-V2.5-TTS（文本转语音）

**工作流程：**
```
Markdown 报告
  │
  ├─ 提取关键摘要 (MiMo-V2.5-Pro 辅助)
  │   └─ 限制在 2000 字以内
  │
  ├─ MiMo-V2.5-TTS 生成语音
  │   ├─ 输入: 摘要文本
  │   ├─ 输出: WAV/MP3 音频文件
  │   └─ 保存到 data/audio/
  │
  └─ 返回音频文件路径
```

**Token 消耗估算：**
| 操作 | 输入 Token | 输出 Token | 总计 | 说明 |
|------|-----------|-----------|------|------|
| 摘要提取 (Pro) | 2000-3000 | 500-800 | 2500-3800 | 精简报告内容 |
| TTS 生成 | 500-2000 | - | 500-2000 | 字符数 = Token 数 |
| **总计** | 2500-5000 | 500-800 | **3000-5800** | |

**实现复杂度：** ⭐⭐（简单）

---

## 4. 开发阶段

### Phase 1: 项目脚手架与结构搭建（第 1-2 天）

**目标：** 搭建完整的项目结构，确保所有工具链正常工作。

**任务清单：**
- [ ] 初始化 Git 仓库，创建 GitHub 仓库 `MiMo-FinRobot`
- [ ] 创建后端项目结构（FastAPI + 目录结构）
- [ ] 创建前端项目结构（React + Vite）
- [ ] 配置 SQLite 数据库
- [ ] 编写 `.env.example` 和配置管理
- [ ] 编写 `requirements.txt` 和 `package.json`
- [ ] 验证 FastAPI 能正常启动（`uvicorn main:app`）
- [ ] 验证 React 能正常启动（`npm run dev`）
- [ ] 编写基础 README.md

**交付物：**
- 可运行的空项目骨架
- GitHub 仓库创建完成
- 基础 README 文档

**预计工时：** 8-12 小时（初学者）

---

### Phase 2: PDF 解析模块（第 3-4 天）

**目标：** 实现 PDF 上传和解析功能，使用 MiMo-V2.5-Omni 提取图表数据。

**任务清单：**
- [ ] 实现 `/api/upload` 上传接口
- [ ] 集成 PyMuPDF 进行文本提取
- [ ] 集成 MiMo-V2.5-Omni API 调用
- [ ] 实现图片提取和 base64 编码
- [ ] 实现图表识别和数据提取
- [ ] 测试用 PDF 文件准备（2-3 份样本研报）
- [ ] 编写 PDF 解析 Prompt 模板
- [ ] 端到端测试：上传 PDF → 返回结构化数据

**交付物：**
- PDF 解析 API 接口
- MiMo-V2.5-Omni 集成代码
- 3 份测试 PDF 样本

**预计工时：** 10-16 小时

---

### Phase 3: 研报生成 Agent 集群（第 5-7 天）

**目标：** 实现三个 AI Agent 协作生成投资报告。

**任务清单：**
- [ ] 设计 Orchestrator 协调逻辑
- [ ] 实现分析 Agent（解读财务数据）
- [ ] 实现策略 Agent（生成投资策略）
- [ ] 实现代码 Agent（编写回测代码）
- [ ] 编写三个 Agent 的 System Prompt
- [ ] 实现 Agent 间的数据传递
- [ ] 集成 MiMo-V2.5-Pro API 调用
- [ ] 端到端测试：解析数据 → 生成完整报告

**交付物：**
- 三个 AI Agent 实现
- Prompt 模板库
- Agent 集群 API 接口

**预计工时：** 15-20 小时

---

### Phase 4: 量化回测引擎（第 8-9 天）

**目标：** 实现事件驱动的回测引擎，支持 Agent 生成的策略代码。

**任务清单：**
- [ ] 设计事件驱动架构
- [ ] 实现 MarketEvent / SignalEvent / OrderEvent / FillEvent
- [ ] 下载示例历史行情数据（A 股/美股）
- [ ] 实现收益指标计算（夏普比率、最大回撤等）
- [ ] 实现回测结果 API 接口
- [ ] 编写回测数据可视化（前端配合）
- [ ] 安全注意事项：Agent 生成代码的沙箱执行
- [ ] 端到端测试：策略代码 → 回测结果

**交付物：**
- 回测引擎核心代码
- 历史行情数据样本
- 回测结果 API 接口

**预计工时：** 10-14 小时

---

### Phase 5: 前端开发（第 10-12 天）

**目标：** 构建 React 前端仪表板，提供完整的用户界面。

**任务清单：**
- [ ] 设计 UI 原型（简单线框图即可）
- [ ] 实现 PDF 上传面板（拖拽上传）
- [ ] 实现报告查看器（Markdown 渲染）
- [ ] 实现回测图表（Recharts 折线图/收益曲线）
- [ ] 实现语音播放器（HTML5 Audio）
- [ ] 实现仪表板布局（侧边栏 + 主内容区）
- [ ] 对接后端 API
- [ ] 响应式设计（基础适配）

**交付物：**
- React 前端应用
- 完整 UI 组件
- API 对接完成

**预计工时：** 12-18 小时

---

### Phase 6: 集成测试与文档（第 13-14 天）

**目标：** 端到端测试，完善文档，准备发布。

**任务清单：**
- [ ] 端到端流程测试（上传 PDF → 生成报告 → 回测 → 语音）
- [ ] 编写完整的 README.md（含截图）
- [ ] 编写视频教程脚本（15-20 分钟）
- [ ] 准备演示数据和截图
- [ ] 代码审查和清理
- [ ] Git 提交和标签（v1.0.0）
- [ ] GitHub Release 发布
- [ ] 社交媒体推广文案

**交付物：**
- 完整可运行的项目
- 视频教程脚本
- GitHub 发布

**预计工时：** 8-12 小时

---

## 5. Token 预算估算

### 5.1 单次报告生成周期的 Token 消耗

| 阶段 | MiMo 模型 | 输入 Token | 输出 Token | 合计 |
|------|----------|-----------|-----------|------|
| **PDF 文本解析** | MiMo-V2.5-Omni | 1,500 | 500 | 2,000 |
| **PDF 图表分析** (×5张) | MiMo-V2.5-Omni | 5,000 | 2,500 | 7,500 |
| **财务分析 Agent** | MiMo-V2.5-Pro | 2,500 | 1,500 | 4,000 |
| **策略生成 Agent** | MiMo-V2.5-Pro | 3,000 | 2,000 | 5,000 |
| **代码生成 Agent** | MiMo-V2.5-Pro | 3,500 | 3,000 | 6,500 |
| **报告摘要提取** | MiMo-V2.5-Pro | 2,000 | 800 | 2,800 |
| **TTS 语音生成** | MiMo-V2.5-TTS | 1,000 | - | 1,000 |
| **总计** | - | **18,500** | **10,300** | **28,800** |

### 5.2 月度使用量估算

| 使用场景 | 次数/月 | 单次 Token | 月度 Token | 占比 |
|---------|--------|-----------|-----------|------|
| 报告生成周期 | 30 | 28,800 | 864,000 | 65% |
| 调试/测试 | 100 | 5,000 | 500,000 | 38% |
| **总计** | - | - | **~1,364,000** | - |

### 5.3 成本估算（假设参考定价）

> **注意：** 以下价格为假设值，实际价格请参考 MiMo 官方定价。

| 模型 | 输入价格 (假设) | 输出价格 (假设) | 单次报告成本 |
|------|--------------|--------------|------------|
| MiMo-V2.5-Pro | $0.003/1K tokens | $0.009/1K tokens | ~$0.14 |
| MiMo-V2.5-Omni | $0.005/1K tokens | $0.015/1K tokens | ~$0.04 |
| MiMo-V2.5-TTS | $0.002/1K tokens | - | ~$0.002 |
| **单次总计** | - | - | **~$0.18** |
| **月度总计（30次）** | - | - | **~$5.40** |

**初学者建议：** 开发阶段设置 `MAX_TOKENS_PER_REQUEST = 2000` 限制，避免调试时过度消耗 Token。

---

## 6. 风险评估

### 6.1 技术风险

| 风险 | 概率 | 影响 | 缓解措施 |
|------|------|------|---------|
| **MiMo API 限流** | 中 | 高 | 实现指数退避重试；设置请求队列；准备本地 mock 服务 |
| **Token 成本超支** | 中 | 中 | 设置 Token 使用上限；缓存 API 响应；调试时用 mock 数据 |
| **PDF 解析失败** | 高 | 中 | 支持多种 PDF 格式；添加错误处理；准备 fallback 方案 |
| **Agent 生成代码有 Bug** | 高 | 高 | 沙箱执行；添加代码验证步骤；人工审核兜底 |
| **前端与后端联调困难** | 中 | 中 | 先后端 API 测试通过再对接前端；使用 Swagger 文档 |

### 6.2 初学者常见陷阱

| 陷阱 | 说明 | 建议 |
|------|------|------|
| **过度设计** | 想一开始就做得完美 | 先跑通最小闭环（MVP），再迭代优化 |
| **Prompt 调优陷阱** | 花太多时间调 Prompt | 用固定 Prompt 先跑通，后续再优化 |
| **忽略错误处理** | AI 调用失败时没有处理 | 为每个 API 调用添加 try-except |
| **Git 管理混乱** | 提交信息不规范 | 遵循 Conventional Commits 规范 |
| **时间管理** | 每个模块都想做得很完美 | 严格按计划执行，每个阶段设 deadline |
| **安全问题** | exec() 执行 Agent 代码 | 使用 restrictedpython 或 ast 模块限制执行 |

### 6.3 API 相关风险

```
⚠️ 重要提醒：

1. API Key 安全：
   - 永远不要将 API Key 提交到 Git
   - 使用 .env 文件管理密钥
   - 在 .gitignore 中包含 .env

2. 速率限制：
   - 每个 MiMo API 调用之间至少间隔 1 秒
   - 实现请求队列，避免并发超限
   - 监控 API 使用量

3. 成本控制：
   - 设置每月 Token 使用上限
   - 调试时使用 mock 数据或本地模型
   - 缓存已生成的报告，避免重复调用
```

### 6.4 应急预案

| 场景 | 应对方案 |
|------|---------|
| MiMo API 不可用 | 使用本地 mock 服务，返回预设数据 |
| Token 用完 | 切换到备用模型或暂停服务 |
| PDF 解析失败 | 提示用户重新上传，或使用纯文本输入 |
| 回测代码报错 | 回退到预设的默认策略进行演示 |

---

## 附录

### A. 环境变量配置 (.env.example)

```bash
# MiMo API 配置
MIMO_API_KEY=your-mimo-api-key-here
MIMO_API_BASE_URL=https://api.mimo.example.com/v1

# 模型配置
MIMO_PRO_MODEL=MiMo-V2.5-Pro
MIMO_OMNI_MODEL=MiMo-V2.5-Omni
MIMO_TTS_MODEL=MiMo-V2.5-TTS

# Token 限制
MAX_TOKENS_PER_REQUEST=4000
MONTHLY_TOKEN_BUDGET=1500000

# 数据库
DATABASE_URL=sqlite:///./data/finrobot.db

# 服务配置
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000
FRONTEND_URL=http://localhost:5173

# 安全
SECRET_KEY=your-secret-key-for-jwt
```

### B. Python 依赖 (requirements.txt)

```txt
# Web 框架
fastapi==0.115.0
uvicorn[standard]==0.30.0
python-multipart==0.0.9

# 数据库
sqlalchemy==2.0.35
aiosqlite==0.20.0

# AI API
openai==1.50.0
httpx==0.27.0

# PDF 处理
PyMuPDF==1.24.0
Pillow==10.4.0

# 数据处理
pandas==2.2.0
numpy==1.26.0

# 工具
python-dotenv==1.0.0
pydantic==2.9.0

# 可视化（可选，用于生成图表图片）
matplotlib==3.9.0
```

### C. 视频教程脚本大纲（15-20 分钟）

```
视频标题：《用 MiMo 搭建 AI 金融分析师 - 15分钟从零开始》

0:00 - 开场介绍 (2分钟)
   - 项目效果演示
   - 什么是 MiMo 模型
   - 今天要做什么

2:00 - 项目结构概览 (2分钟)
   - 技术栈介绍
   - 代码目录结构
   - 数据流图

4:00 - 后端搭建 (4分钟)
   - FastAPI 入门
   - MiMo API 调用示例
   - 核心代码讲解

8:00 - 前端搭建 (3分钟)
   - React 组件设计
   - API 对接
   - UI 演示

11:00 - AI Agent 协作 (3分钟)
   - 三个 Agent 的分工
   - Prompt 设计技巧
   - 实际运行效果

14:00 - 回测引擎 (2分钟)
   - 事件驱动架构
   - 回测结果展示

16:00 - 总结与展望 (2分钟)
   - 项目回顾
   - 扩展方向
   - 开源社区贡献
```

### D. GitHub 仓库描述模板

```markdown
# 🤖 MiMo-FinRobot

> MiMo 驱动的全自动财务报告生成与量化回测系统

[![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green.svg)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg)](https://reactjs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## ✨ 特性

- 🔍 **PDF 智能解析** - 使用 MiMo-V2.5-Omni 自动识别图表和表格
- 🧠 **AI Agent 集群** - 多个 MiMo-V2.5-Pro Agent 协作生成报告
- 📊 **量化回测** - 事件驱动回测引擎，验证投资策略
- 🔊 **语音简报** - MiMo-V2.5-TTS 将报告转为语音

## 🚀 快速开始

[快速开始指南...]

## 📁 项目结构

[项目结构说明...]

## 🤝 贡献

欢迎贡献！请查看 CONTRIBUTING.md
```

---

## 总结

MiMo-FinRobot 项目是一个适合初学者的完整 AI Agent 应用案例。通过这个项目，你将学习到：

1. **多模态 AI 应用开发** - 使用 MiMo-V2.5-Omni 解析 PDF
2. **Agent 架构设计** - 多个 AI Agent 协作完成复杂任务
3. **全栈开发** - FastAPI + React + SQLite
4. **量化金融基础** - 事件驱动回测引擎
5. **开源项目管理** - GitHub 协作和文档编写

**预估总开发时间：** 14-21 天（每天 3-4 小时）
**预估 Token 成本：** $5-10/月（正常使用）

祝你开发顺利！🎉
