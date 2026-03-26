from fastapi import FastAPI
from pydantic import BaseModel

from parser import parse_error
from context_builder import build_context

app = FastAPI()


class ParseRequest(BaseModel):
    stackTrace: str
    logs: str


@app.post("/parse")
def parse(payload: ParseRequest):
    raw_input = {
        "stackTrace": payload.stackTrace,
        "logs": payload.logs,
    }

    parsed = parse_error(raw_input)
    context = build_context(parsed, raw_input)

    return {"parsed": parsed, "context": context}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
