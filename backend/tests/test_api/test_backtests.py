import pytest


@pytest.mark.asyncio
async def test_list_backtests_empty(client):
    response = await client.get("/api/backtests/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 0


@pytest.mark.asyncio
async def test_create_backtest_nonexistent_report(client):
    response = await client.post(
        "/api/backtests/",
        json={
            "report_id": 999,
            "strategy_name": "test_strategy",
            "initial_capital": 100000.0,
        },
    )
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_get_nonexistent_backtest(client):
    response = await client.get("/api/backtests/999")
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_get_nonexistent_backtest_result(client):
    response = await client.get("/api/backtests/999/result")
    assert response.status_code == 404
