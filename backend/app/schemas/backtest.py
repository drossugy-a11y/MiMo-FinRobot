from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class BacktestCreate(BaseModel):
    report_id: int
    strategy_name: str
    initial_capital: float = 100000.0
    start_date: Optional[str] = None
    end_date: Optional[str] = None


class BacktestResponse(BaseModel):
    id: int
    report_id: int
    strategy_name: str
    initial_capital: float
    status: str
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class BacktestResultResponse(BaseModel):
    id: int
    backtest_id: int
    total_return: float
    annual_return: float
    max_drawdown: float
    sharpe_ratio: float
    win_rate: float
    total_trades: int
    equity_curve: Optional[str] = None
    trades: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
