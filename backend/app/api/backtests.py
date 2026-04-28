import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from ..core.database import get_db
from ..models.backtest import Backtest, BacktestResult, BacktestStatus
from ..models.report import Report
from ..schemas.backtest import BacktestCreate, BacktestResponse, BacktestResultResponse
from ..services.backtest_engine import backtest_engine
from ..services.report_generator import report_generator

router = APIRouter()


@router.post("/", response_model=BacktestResponse)
async def create_backtest(
    backtest_data: BacktestCreate,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Report).where(Report.id == backtest_data.report_id))
    report = result.scalar_one_or_none()

    if not report:
        raise HTTPException(status_code=404, detail="报告不存在")

    backtest = Backtest(
        report_id=backtest_data.report_id,
        strategy_name=backtest_data.strategy_name,
        initial_capital=backtest_data.initial_capital,
        status=BacktestStatus.PENDING,
        start_date=backtest_data.start_date,
        end_date=backtest_data.end_date,
    )
    db.add(backtest)
    await db.commit()
    await db.refresh(backtest)

    return backtest.to_dict()


@router.post("/{backtest_id}/run", response_model=BacktestResultResponse)
async def run_backtest(
    backtest_id: int,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Backtest).where(Backtest.id == backtest_id))
    backtest = result.scalar_one_or_none()

    if not backtest:
        raise HTTPException(status_code=404, detail="回测不存在")

    backtest.status = BacktestStatus.RUNNING
    await db.commit()

    try:
        report_result = await db.execute(select(Report).where(Report.id == backtest.report_id))
        report = report_result.scalar_one_or_none()

        if not report or not report.content:
            raise Exception("无法获取报告内容")

        signals_result = await report_generator.extract_trading_signals(report.content)
        signals = signals_result.get("signals", [])

        historical_data = backtest_engine.generate_sample_data()

        backtest_result = backtest_engine.run_backtest(
            signals=signals,
            historical_data=historical_data,
            initial_capital=backtest.initial_capital,
        )

        result_record = BacktestResult(
            backtest_id=backtest.id,
            total_return=backtest_result["metrics"]["total_return"],
            annual_return=backtest_result["metrics"]["annual_return"],
            max_drawdown=backtest_result["metrics"]["max_drawdown"],
            sharpe_ratio=backtest_result["metrics"]["sharpe_ratio"],
            win_rate=backtest_result["metrics"]["win_rate"],
            total_trades=backtest_result["metrics"]["total_trades"],
            equity_curve=json.dumps(backtest_result["equity_curve"]),
            trades=json.dumps(backtest_result["trades"]),
        )
        db.add(result_record)

        backtest.status = BacktestStatus.COMPLETED
        await db.commit()
        await db.refresh(result_record)

        return result_record.to_dict()

    except Exception as e:
        backtest.status = BacktestStatus.FAILED
        await db.commit()
        raise HTTPException(status_code=500, detail=f"回测失败: {str(e)}")


@router.get("/", response_model=list[BacktestResponse])
async def list_backtests(
    report_id: int = None,
    db: AsyncSession = Depends(get_db),
):
    query = select(Backtest).order_by(Backtest.created_at.desc())
    if report_id:
        query = query.where(Backtest.report_id == report_id)

    result = await db.execute(query)
    backtests = result.scalars().all()
    return [b.to_dict() for b in backtests]


@router.get("/{backtest_id}", response_model=BacktestResponse)
async def get_backtest(
    backtest_id: int,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Backtest).where(Backtest.id == backtest_id))
    backtest = result.scalar_one_or_none()

    if not backtest:
        raise HTTPException(status_code=404, detail="回测不存在")

    return backtest.to_dict()


@router.get("/{backtest_id}/result", response_model=BacktestResultResponse)
async def get_backtest_result(
    backtest_id: int,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(BacktestResult).where(BacktestResult.backtest_id == backtest_id)
    )
    backtest_result = result.scalar_one_or_none()

    if not backtest_result:
        raise HTTPException(status_code=404, detail="回测结果不存在")

    return backtest_result.to_dict()
