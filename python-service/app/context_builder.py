def build_context(parsed_data, raw_input):
    raw = {}
    if isinstance(parsed_data, dict):
        raw = parsed_data.get("raw") or {}

    if not isinstance(raw, dict):
        raw = {}

    if raw_input is None:
        raw_input = {}

    if not isinstance(raw_input, dict):
        raw_input = {}

    error_type = parsed_data.get("type") if isinstance(parsed_data, dict) else None
    message = parsed_data.get("message") if isinstance(parsed_data, dict) else None
    file_name = parsed_data.get("file") if isinstance(parsed_data, dict) else None
    line_number = parsed_data.get("line") if isinstance(parsed_data, dict) else None
    category = parsed_data.get("category") if isinstance(parsed_data, dict) else None

    logs = raw.get("logs") or raw_input.get("logs")

    code = (
        parsed_data.get("code")
        if isinstance(parsed_data, dict)
        else None
    )
    if not code:
        code = (
            raw_input.get("code")
            or raw_input.get("codeSnippet")
            or raw_input.get("snippet")
            or raw_input.get("code_snippet")
            or raw.get("code")
            or raw.get("codeSnippet")
            or raw.get("snippet")
            or raw.get("code_snippet")
        )

    error_type_str = str(error_type) if error_type else ""
    message_str = str(message) if message else ""
    keys = parsed_data.get("keys") if isinstance(parsed_data, dict) else None

    if error_type_str == "KeyError" and keys:
        sorted_keys = sorted(keys)
        error_summary = f"KeyError: missing keys [{', '.join(sorted_keys)}]"
    elif error_type_str and message_str:
        error_summary = f"{error_type_str}: {message_str}"
    elif message_str:
        error_summary = message_str
    elif error_type_str:
        error_summary = error_type_str
    else:
        error_summary = "Unknown error"

    file_str = str(file_name) if file_name else ""
    if file_str and line_number is not None:
        location = f"{file_str}:{line_number}"
    elif file_str:
        location = file_str
    elif line_number is not None:
        location = str(line_number)
    else:
        location = "unknown"

    return {
        "errorSummary": error_summary,
        "location": location,
        "category": category or "UNKNOWN",
        "logs": logs or "",
        "code": code or "",
    }
