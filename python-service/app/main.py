from fastapi import FastAPI
from pydantic import BaseModel

from app.parser import parse_error
from app.context_builder import build_context
from app.similarity import find_similar_issue

app = FastAPI()


class ParseRequest(BaseModel):
    stackTrace: str
    logs: str
    code: str | None = None


class SimilarRequest(BaseModel):
    current: str
    past: list[str] = []


@app.post("/parse")
def parse(payload: ParseRequest):
    raw_input = {
        "stackTrace": payload.stackTrace,
        "logs": payload.logs,
        "code": payload.code,
    }

    parsed = parse_error(raw_input)
    context = build_context(parsed, raw_input)

    return {"parsed": parsed, "context": context}


@app.post("/similar")
def similar(payload: SimilarRequest):
    return find_similar_issue(payload.current, payload.past)


