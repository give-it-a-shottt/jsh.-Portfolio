from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class CamelModel(BaseModel):
    # JSON 은 camelCase(openNow), 파이썬 코드는 snake_case(open_now).
    # alias 로 둘을 잇고, 응답도 camelCase 로 나간다(FastAPI 기본값).
    # 모델에 없는 필드는 버린다 - 쓰는 필드만 분명하게 남긴다.
    model_config = ConfigDict(
        alias_generator=to_camel, populate_by_name=True, extra="ignore"
    )
