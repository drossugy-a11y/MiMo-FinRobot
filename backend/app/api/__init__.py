from fastapi import APIRouter
from .reports import router as reports_router
from .backtests import router as backtests_router

api_router = APIRouter()
api_router.include_router(reports_router, prefix="/reports", tags=["reports"])
api_router.include_router(backtests_router, prefix="/backtests", tags=["backtests"])
