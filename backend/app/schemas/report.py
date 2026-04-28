from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ReportCreate(BaseModel):
    title: str
    filename: str


class ReportResponse(BaseModel):
    id: int
    title: str
    filename: str
    status: str
    content: Optional[str] = None
    audio_url: Optional[str] = None
    token_usage: int = 0
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ReportListResponse(BaseModel):
    reports: list[ReportResponse]
    total: int
    page: int = 1
    limit: int = 10
