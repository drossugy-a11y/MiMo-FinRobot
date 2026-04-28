from sqlalchemy import Column, Integer, String, Text, DateTime, Float, ForeignKey, Enum
from sqlalchemy.sql import func
import enum

from ..core.database import Base


class BacktestStatus(str, enum.Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"


class Backtest(Base):
    __tablename__ = "backtests"

    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(Integer, ForeignKey("reports.id"), nullable=False)
    strategy_name = Column(String(255), nullable=False)
    initial_capital = Column(Float, default=100000.0)
    status = Column(Enum(BacktestStatus), default=BacktestStatus.PENDING)
    start_date = Column(String(10), nullable=True)
    end_date = Column(String(10), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    def to_dict(self):
        return {
            "id": self.id,
            "report_id": self.report_id,
            "strategy_name": self.strategy_name,
            "initial_capital": self.initial_capital,
            "status": self.status.value if self.status else None,
            "start_date": self.start_date,
            "end_date": self.end_date,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class BacktestResult(Base):
    __tablename__ = "backtest_results"

    id = Column(Integer, primary_key=True, index=True)
    backtest_id = Column(Integer, ForeignKey("backtests.id"), nullable=False)
    total_return = Column(Float, default=0.0)
    annual_return = Column(Float, default=0.0)
    max_drawdown = Column(Float, default=0.0)
    sharpe_ratio = Column(Float, default=0.0)
    win_rate = Column(Float, default=0.0)
    total_trades = Column(Integer, default=0)
    equity_curve = Column(Text, nullable=True)  # JSON string
    trades = Column(Text, nullable=True)  # JSON string
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    def to_dict(self):
        return {
            "id": self.id,
            "backtest_id": self.backtest_id,
            "total_return": self.total_return,
            "annual_return": self.annual_return,
            "max_drawdown": self.max_drawdown,
            "sharpe_ratio": self.sharpe_ratio,
            "win_rate": self.win_rate,
            "total_trades": self.total_trades,
            "equity_curve": self.equity_curve,
            "trades": self.trades,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
