from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # Application
    APP_NAME: str = "MiMo-FinRobot"
    APP_VERSION: str = "0.1.0"
    DEBUG: bool = False

    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./mimo_finrobot.db"

    # MiMo API Configuration
    MIMO_API_KEY: str = ""
    MIMO_API_BASE_URL: str = "https://api.mimo.com/v1"
    MIMO_MODEL_PRO: str = "MiMo-V2.5-Pro"
    MIMO_MODEL_OMNI: str = "MiMo-V2.5-Omni"
    MIMO_MODEL_TTS: str = "MiMo-V2.5-TTS"

    # Token Limits
    MAX_TOKENS_PRO: int = 4096
    MAX_TOKENS_OMNI: int = 2048
    MAX_TOKENS_TTS: int = 1024

    # Rate Limits (requests per minute)
    RATE_LIMIT_PRO: int = 10
    RATE_LIMIT_OMNI: int = 5
    RATE_LIMIT_TTS: int = 10

    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
