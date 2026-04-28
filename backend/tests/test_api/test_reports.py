import pytest
import json


@pytest.mark.asyncio
async def test_root_endpoint(client):
    response = await client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "MiMo-FinRobot"
    assert data["status"] == "running"


@pytest.mark.asyncio
async def test_health_endpoint(client):
    response = await client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


@pytest.mark.asyncio
async def test_list_reports_empty(client):
    response = await client.get("/api/reports/")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 0
    assert data["reports"] == []


@pytest.mark.asyncio
async def test_create_report_invalid_file(client):
    response = await client.post(
        "/api/reports/upload",
        files={"file": ("test.txt", b"content", "text/plain")},
    )
    assert response.status_code == 400


@pytest.mark.asyncio
async def test_get_nonexistent_report(client):
    response = await client.get("/api/reports/999")
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_delete_nonexistent_report(client):
    response = await client.delete("/api/reports/999")
    assert response.status_code == 404
