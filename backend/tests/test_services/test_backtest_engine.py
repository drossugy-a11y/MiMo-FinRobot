import pytest
import pandas as pd
from app.services.backtest_engine import BacktestEngine


def test_generate_sample_data():
    engine = BacktestEngine()
    data = engine.generate_sample_data(days=30)

    assert isinstance(data, pd.DataFrame)
    assert len(data) == 30
    assert "date" in data.columns
    assert "open" in data.columns
    assert "high" in data.columns
    assert "low" in data.columns
    assert "close" in data.columns
    assert "volume" in data.columns


def test_run_backtest_with_sample_data():
    engine = BacktestEngine()
    data = engine.generate_sample_data()

    signals = [
        {"symbol": "TEST", "action": "buy", "confidence": 0.8},
        {"symbol": "TEST", "action": "sell", "confidence": 0.8},
    ]

    result = engine.run_backtest(
        signals=signals,
        historical_data=data,
        initial_capital=100000.0,
    )

    assert "initial_capital" in result
    assert "final_value" in result
    assert "equity_curve" in result
    assert "trades" in result
    assert "metrics" in result
    assert result["initial_capital"] == 100000.0
    assert isinstance(result["equity_curve"], list)
    assert isinstance(result["trades"], list)


def test_calculate_metrics():
    engine = BacktestEngine()
    equity_curve = [100000, 105000, 102000, 108000, 110000]
    trades = [
        {"action": "buy", "cost": 50000},
        {"action": "sell", "revenue": 55000, "cost": 50000},
    ]

    metrics = engine._calculate_metrics(equity_curve, trades, 100000.0)

    assert "total_return" in metrics
    assert "annual_return" in metrics
    assert "max_drawdown" in metrics
    assert "sharpe_ratio" in metrics
    assert "win_rate" in metrics
    assert "total_trades" in metrics
    assert metrics["total_trades"] == 2
