from fastapi import FastAPI
from pydantic import BaseModel

from parser import parse_error

app = FastAPI()


class ParseRequest(BaseModel):
    stackTrace: str
    logs: str


@app.post("/parse")
def parse(payload: ParseRequest):
    parsed_result = parse_error(
        {
            "stackTrace": payload.stackTrace,
            "logs": payload.logs,
        }
    )
    return parsed_result


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
