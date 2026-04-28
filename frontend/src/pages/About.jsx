import { Typography, Card, Space, Tag, Button, Timeline, Row, Col } from 'antd'
import {
  GithubOutlined,
  RobotOutlined,
  FileTextOutlined,
  AudioOutlined,
  ExperimentOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  RocketOutlined,
} from '@ant-design/icons'
import PageTransition from '../components/PageTransition'

const { Title, Text, Paragraph } = Typography

const models = [
  {
    name: 'MiMo-V2.5-Pro',
    role: '策略生成与深度推理',
    description: '负责分析财务数据，生成投资策略分析报告，提取量化交易信号。',
    icon: <RobotOutlined />,
    color: '#00d4aa',
    capabilities: ['财务分析', '策略推理', '报告生成', '信号提取'],
  },
  {
    name: 'MiMo-V2.5-Omni',
    role: '财报图表识别提取',
    description: '多模态模型，能够识别PDF中的图表、表格和关键财务数据。',
    icon: <FileTextOutlined />,
    color: '#4A9EFF',
    capabilities: ['图表识别', '表格提取', 'OCR', '数据分析'],
  },
  {
    name: 'MiMo-V2.5-TTS',
    role: '研报转音频简报',
    description: '将生成的研报内容转换为语音播报，方便快速了解要点。',
    icon: <AudioOutlined />,
    color: '#FFD700',
    capabilities: ['语音合成', '音频生成', '多语言支持', '语调控制'],
  },
]

const techStack = [
  'React', 'FastAPI', 'SQLite', 'MiMo-V2.5', 'Recharts',
  'Ant Design', 'Vite', 'Python', 'SQLAlchemy', 'TDD',
]

const roadmap = [
  {
    phase: '已完成',
    color: 'green',
    items: [
      { title: '项目基础架构搭建', date: '2025-12-01' },
      { title: 'PDF财报解析模块', date: '2025-12-10' },
      { title: '研报生成Agent集群', date: '2025-12-15' },
      { title: '量化回测引擎', date: '2025-12-18' },
      { title: 'Web前端界面', date: '2025-12-20' },
    ],
  },
  {
    phase: '进行中',
    color: 'blue',
    items: [
      { title: '音频简报功能', date: '2025-12-25' },
      { title: '多策略对比', date: '2025-12-28' },
    ],
  },
  {
    phase: '计划中',
    color: 'gray',
    items: [
      { title: '实时行情接入', date: '2026-Q1' },
      { title: '移动端App', date: '2026-Q1' },
      { title: '社区策略分享', date: '2026-Q2' },
    ],
  },
]

function About() {
  return (
    <PageTransition>
      <Space direction="vertical" size={32} style={{ width: '100%' }}>
        {/* Hero Section */}
        <Card
          style={{
            background: 'linear-gradient(135deg, var(--bg-raised) 0%, var(--accent-muted) 100%)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 12,
            textAlign: 'center',
            padding: '48px 24px',
          }}
          bodyStyle={{ padding: 0 }}
        >
          <RobotOutlined style={{ fontSize: 72, color: 'var(--accent-primary)', marginBottom: 24 }} />
          <Title
            level={2}
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'var(--text-primary)',
              marginBottom: 16,
            }}
          >
            MiMo-FinRobot
          </Title>
          <Paragraph
            style={{
              color: 'var(--text-secondary)',
              fontSize: 16,
              maxWidth: 600,
              margin: '0 auto 24px',
            }}
          >
            一个由新手开发者使用 AI Agent 搭建的智能金融分析系统。
            <br />
            一周时间，从零到成品，展示 MiMo 模型的强大能力。
          </Paragraph>
          <Button
            type="primary"
            icon={<GithubOutlined />}
            size="large"
            href="https://github.com/drossugy-a11y/MiMo-FinRobot"
            target="_blank"
            style={{
              background: 'var(--accent-primary)',
              borderColor: 'var(--accent-primary)',
              height: 48,
              paddingInline: 32,
            }}
          >
            在 GitHub 上查看
          </Button>
        </Card>

        {/* Architecture Diagram */}
        <Card
          style={{
            background: 'var(--bg-raised)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 8,
          }}
          title={
            <span style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
              技术架构
            </span>
          }
          headStyle={{ borderBottom: '1px solid var(--border-subtle)' }}
          bodyStyle={{ padding: 32 }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
              lineHeight: 1.8,
              color: 'var(--text-secondary)',
              background: 'var(--bg-inset)',
              padding: 24,
              borderRadius: 8,
              overflowX: 'auto',
            }}
          >
            <pre style={{ margin: 0 }}>
{`┌─────────────────────────────────────────────────────────────────┐
│                        React Frontend                          │
│   ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│   │ 仪表盘   │ │ 报告中心 │ │ 回测可视化│ │ 财报上传 │        │
│   └──────────┘ └──────────┘ └──────────┘ └──────────┘        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      FastAPI Backend                            │
│   ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│   │ API 路由  │ │ 服务层   │ │ 数据模型 │ │ 数据库   │        │
│   └──────────┘ └──────────┘ └──────────┘ └──────────┘        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     MiMo Model Cluster                         │
│   ┌──────────────┐ ┌──────────────┐ ┌──────────────┐         │
│   │ V2.5-Pro     │ │ V2.5-Omni    │ │ V2.5-TTS     │         │
│   │ 策略推理     │ │ 图表识别     │ │ 语音合成     │         │
│   └──────────────┘ └──────────────┘ └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │    SQLite DB     │
                    └──────────────────┘`}
            </pre>
          </div>
        </Card>

        {/* MiMo Models */}
        <div>
          <Title
            level={4}
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'var(--text-primary)',
              marginBottom: 24,
            }}
          >
            MiMo 模型能力
          </Title>
          <Row gutter={[24, 24]}>
            {models.map((model) => (
              <Col xs={24} md={8} key={model.name}>
                <Card
                  style={{
                    background: 'var(--bg-raised)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 8,
                    height: '100%',
                  }}
                  bodyStyle={{ padding: 24 }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: `${model.color}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 16,
                    }}
                  >
                    <span style={{ fontSize: 24, color: model.color }}>{model.icon}</span>
                  </div>
                  <Title level={5} style={{ color: 'var(--text-primary)', marginBottom: 8 }}>
                    {model.name}
                  </Title>
                  <Text style={{ color: model.color, display: 'block', marginBottom: 12 }}>
                    {model.role}
                  </Text>
                  <Paragraph style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>
                    {model.description}
                  </Paragraph>
                  <Space wrap>
                    {model.capabilities.map((cap) => (
                      <Tag
                        key={cap}
                        style={{
                          background: 'var(--bg-inset)',
                          color: 'var(--text-secondary)',
                          border: '1px solid var(--border-subtle)',
                        }}
                      >
                        {cap}
                      </Tag>
                    ))}
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Tech Stack */}
        <Card
          style={{
            background: 'var(--bg-raised)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 8,
          }}
          title={
            <span style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
              技术栈
            </span>
          }
          headStyle={{ borderBottom: '1px solid var(--border-subtle)' }}
          bodyStyle={{ padding: 24 }}
        >
          <Space wrap size={12}>
            {techStack.map((tech) => (
              <Tag
                key={tech}
                style={{
                  background: 'var(--accent-muted)',
                  color: 'var(--accent-primary)',
                  border: '1px solid var(--accent-primary)',
                  padding: '6px 16px',
                  fontSize: 14,
                  borderRadius: 4,
                }}
              >
                {tech}
              </Tag>
            ))}
          </Space>
        </Card>

        {/* Roadmap */}
        <Card
          style={{
            background: 'var(--bg-raised)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 8,
          }}
          title={
            <span style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
              项目 Roadmap
            </span>
          }
          headStyle={{ borderBottom: '1px solid var(--border-subtle)' }}
          bodyStyle={{ padding: 32 }}
        >
          <Row gutter={[32, 32]}>
            {roadmap.map((phase) => (
              <Col xs={24} md={8} key={phase.phase}>
                <div style={{ marginBottom: 16 }}>
                  <Tag
                    color={phase.color}
                    style={{ fontSize: 14, padding: '4px 12px' }}
                  >
                    {phase.phase}
                  </Tag>
                </div>
                <Timeline
                  items={phase.items.map((item) => ({
                    color: phase.color,
                    children: (
                      <div>
                        <Text style={{ color: 'var(--text-primary)', display: 'block' }}>
                          {item.title}
                        </Text>
                        <Text style={{ color: 'var(--text-tertiary)', fontSize: 12 }}>
                          {item.date}
                        </Text>
                      </div>
                    ),
                  }))}
                />
              </Col>
            ))}
          </Row>
        </Card>

        {/* Developer Story */}
        <Card
          style={{
            background: 'linear-gradient(135deg, var(--accent-muted) 0%, var(--bg-raised) 100%)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 8,
          }}
          title={
            <span style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
              开发者故事
            </span>
          }
          headStyle={{ borderBottom: '1px solid var(--border-subtle)' }}
          bodyStyle={{ padding: 32 }}
        >
          <Paragraph style={{ color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1.8 }}>
            这个项目由一个刚接触 AI 开发一周的新手完成。之前完全没想过自己能做出一个像样的系统，
            但用了 Claude Code 和 MiMo 模型之后，发现哪怕像我这样的小白，也能通过"说人话 + 让 Agent 干活"的方式，
            把一个复杂的想法落地。
          </Paragraph>
          <Paragraph style={{ color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1.8 }}>
            整个过程中，我没有手写一行代码。但逻辑和决策都是我自己把关的——我会看它生成的代码对不对，
            需不需要调整。这就是 AI 时代的开发方式：你负责思考，Agent 负责执行。
          </Paragraph>
          <Paragraph style={{ color: 'var(--accent-primary)', fontSize: 16, fontWeight: 500, marginTop: 24 }}>
            踩坑不可怕，关键是动手。你真的可以只用一周时间，让 Agent 帮你把想法变成代码。
          </Paragraph>
        </Card>
      </Space>
    </PageTransition>
  )
}

export default About
