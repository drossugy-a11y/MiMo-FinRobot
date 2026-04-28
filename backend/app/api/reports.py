import os
import shutil
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from ..core.database import get_db
from ..models.report import Report, ReportStatus
from ..schemas.report import ReportResponse, ReportListResponse
from ..services.pdf_parser import pdf_parser
from ..services.report_generator import report_generator

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload", response_model=ReportResponse)
async def upload_report(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="只支持PDF文件")

    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    report = Report(
        title=file.filename.replace(".pdf", ""),
        filename=file.filename,
        status=ReportStatus.PENDING,
    )
    db.add(report)
    await db.commit()
    await db.refresh(report)

    return report.to_dict()


@router.post("/{report_id}/process", response_model=ReportResponse)
async def process_report(
    report_id: int,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Report).where(Report.id == report_id))
    report = result.scalar_one_or_none()

    if not report:
        raise HTTPException(status_code=404, detail="报告不存在")

    report.status = ReportStatus.PROCESSING
    await db.commit()

    try:
        file_path = os.path.join(UPLOAD_DIR, report.filename)

        parse_result = await pdf_parser.process_uploaded_pdf(file_path)
        if not parse_result["success"]:
            raise Exception(parse_result["error"])

        financial_data = {
            "company_name": report.title,
            "period": "最新报告期",
            "metrics": str(parse_result["data"].get("tables", [])),
            "analysis": parse_result["data"].get("analysis", ""),
        }

        report_content = await report_generator.generate_strategy_analysis(financial_data)
        summary = await report_generator.generate_report_summary(report_content)

        report.content = f"# {report.title}\n\n{summary}\n\n## 详细分析\n\n{report_content}"
        report.status = ReportStatus.COMPLETED
        report.token_usage = parse_result["data"].get("token_usage", 0)

    except Exception as e:
        report.status = ReportStatus.FAILED
        report.content = f"处理失败: {str(e)}"

    await db.commit()
    await db.refresh(report)
    return report.to_dict()


@router.get("/", response_model=ReportListResponse)
async def list_reports(
    page: int = 1,
    limit: int = 10,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Report).order_by(Report.created_at.desc()).offset((page - 1) * limit).limit(limit)
    )
    reports = result.scalars().all()

    count_result = await db.execute(select(Report))
    total = len(count_result.scalars().all())

    return {
        "reports": [r.to_dict() for r in reports],
        "total": total,
        "page": page,
        "limit": limit,
    }


@router.get("/{report_id}", response_model=ReportResponse)
async def get_report(
    report_id: int,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Report).where(Report.id == report_id))
    report = result.scalar_one_or_none()

    if not report:
        raise HTTPException(status_code=404, detail="报告不存在")

    return report.to_dict()


@router.delete("/{report_id}")
async def delete_report(
    report_id: int,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Report).where(Report.id == report_id))
    report = result.scalar_one_or_none()

    if not report:
        raise HTTPException(status_code=404, detail="报告不存在")

    file_path = os.path.join(UPLOAD_DIR, report.filename)
    if os.path.exists(file_path):
        os.remove(file_path)

    await db.delete(report)
    await db.commit()

    return {"message": "删除成功"}
