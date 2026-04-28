import json
import numpy as np
import pandas as pd
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta


class BacktestEngine:
    def __init__(self):
        self.initial_capital = 100000.0

    def run_backtest(
        self,
        signals: List[Dict[str, Any]],
        historical_data: pd.DataFrame,
        initial_capital: float = 100000.0,
    ) -> Dict[str, Any]:
        self.initial_capital = initial_capital
        capital = initial_capital
        position = 0
        trades = []
        equity_curve = [capital]

        for signal in signals:
            symbol = signal.get("symbol", "")
            action = signal.get("action", "hold")
            confidence = signal.get("confidence", 0.5)

            if action == "buy" and position == 0:
                price = self._get_price(historical_data, symbol)
                if price > 0:
                    shares = int((capital * confidence * 0.9) / price)
                    if shares > 0:
                        cost = shares * price
                        capital -= cost
                        position = shares
                        trades.append({
                            "action": "buy",
                            "symbol": symbol,
                            "shares": shares,
                            "price": price,
                            "cost": cost,
                            "timestamp": datetime.now().isoformat(),
                        })

            elif action == "sell" and position > 0:
                price = self._get_price(historical_data, symbol)
                if price > 0:
                    revenue = position * price
                    capital += revenue
                    trades.append({
                        "action": "sell",
                        "symbol": symbol,
                        "shares": position,
                        "price": price,
                        "revenue": revenue,
                        "timestamp": datetime.now().isoformat(),
                    })
                    position = 0

            equity_curve.append(capital + position * self._get_price(historical_data, symbol))

        final_value = capital + position * self._get_price(historical_data, "final")
        metrics = self._calculate_metrics(equity_curve, trades, initial_capital)

        return {
            "initial_capital": initial_capital,
            "final_value": final_value,
            "equity_curve": equity_curve,
            "trades": trades,
            "metrics": metrics,
        }

    def _get_price(self, data: pd.DataFrame, symbol: str) -> float:
        if data is not None and not data.empty and "close" in data.columns:
            return float(data["close"].iloc[-1])
        return 100.0

    def _calculate_metrics(
        self,
        equity_curve: List[float],
        trades: List[Dict],
        initial_capital: float,
    ) -> Dict[str, float]:
        returns = pd.Series(equity_curve).pct_change().dropna()
        total_return = (equity_curve[-1] - initial_capital) / initial_capital
        annual_return = total_return * (252 / max(len(equity_curve), 1))

        peak = pd.Series(equity_curve).expanding(min_periods=1).max()
        drawdown = (pd.Series(equity_curve) - peak) / peak
        max_drawdown = abs(drawdown.min())

        sharpe = 0.0
        if len(returns) > 1 and returns.std() > 0:
            sharpe = (returns.mean() / returns.std()) * np.sqrt(252)

        winning_trades = [t for t in trades if t.get("action") == "sell" and t.get("revenue", 0) > t.get("cost", 0)]
        win_rate = len(winning_trades) / max(len([t for t in trades if t.get("action") == "sell"]), 1)

        return {
            "total_return": round(total_return * 100, 2),
            "annual_return": round(annual_return * 100, 2),
            "max_drawdown": round(max_drawdown * 100, 2),
            "sharpe_ratio": round(sharpe, 2),
            "win_rate": round(win_rate * 100, 2),
            "total_trades": len(trades),
        }

    def generate_sample_data(self, days: int = 252) -> pd.DataFrame:
        dates = pd.date_range(end=datetime.now(), periods=days, freq="B")
        np.random.seed(42)
        returns = np.random.normal(0.0005, 0.02, days)
        price = 100 * np.exp(np.cumsum(returns))

        df = pd.DataFrame({
            "date": dates,
            "open": price * (1 + np.random.uniform(-0.01, 0.01, days)),
            "high": price * (1 + np.random.uniform(0, 0.02, days)),
            "low": price * (1 - np.random.uniform(0, 0.02, days)),
            "close": price,
            "volume": np.random.randint(1000000, 10000000, days),
        })
        return df


backtest_engine = BacktestEngine()
