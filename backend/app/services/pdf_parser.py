import base64
from typing import Dict, Any, List
from PyPDF2 import PdfReader
from .mimo_client import mimo_client
from ..core.config import settings


class PDFParserService:
    def __init__(self):
        self.client = mimo_client

    async def extract_text_from_pdf(self, file_path: str) -> str:
        reader = PdfReader(file_path)
        text_content = []
        for page in reader.pages:
            text = page.extract_text()
            if text:
                text_content.append(text)
        return "\n\n".join(text_content)

    async def extract_tables_from_pdf(self, file_path: str) -> List[Dict[str, Any]]:
        reader = PdfReader(file_path)
        tables = []
        for i, page in enumerate(reader.pages):
            text = page.extract_text()
            if text and self._looks_like_table(text):
                tables.append({
                    "page": i + 1,
                    "content": text,
                    "type": "table",
                })
        return tables

    def _looks_like_table(self, text: str) -> bool:
        lines = text.strip().split("\n")
        if len(lines) < 3:
            return False
        numeric_lines = sum(1 for line in lines if any(c.isdigit() for c in line))
        return numeric_lines / len(lines) > 0.3

    async def analyze_with_omni(
        self, file_path: str, prompt: str = None
    ) -> Dict[str, Any]:
        if prompt is None:
            prompt = """请分析这份财务报告，提取以下关键信息：
1. 公司名称和报告期间
2. 主要财务指标（营收、净利润、毛利率等）
3. 关键业务亮点和风险
4. 未来展望和战略方向
请用结构化的JSON格式返回。"""

        text_content = await self.extract_text_from_pdf(file_path)
        tables = await self.extract_tables_from_pdf(file_path)

        full_prompt = f"{prompt}\n\n报告文本内容：\n{text_content[:3000]}"
        if tables:
            full_prompt += f"\n\n检测到的表格数据：\n{str(tables[:3])}"

        result = await self.client.generate_text(
            prompt=full_prompt,
            system_prompt="你是一位专业的财务分析师，擅长解读财务报告。",
            max_tokens=settings.MAX_TOKENS_OMNI,
        )

        return {
            "raw_text": text_content,
            "tables": tables,
            "analysis": result,
            "token_usage": len(result.split()) * 2,
        }

    async def process_uploaded_pdf(self, file_path: str) -> Dict[str, Any]:
        try:
            analysis = await self.analyze_with_omni(file_path)
            return {
                "success": True,
                "data": analysis,
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
            }


pdf_parser = PDFParserService()
