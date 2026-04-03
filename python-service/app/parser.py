import re
import classifier

def parse_error(data):
    stack_trace = str(data.get("stackTrace", "") or "")
    logs = str(data.get("logs", "") or "")
    text = f"{stack_trace}\n{logs}"

    error_type = None
    error_message = None
    file_name = None
    line_number = None

    def clean_error_message(msg):
        if msg is None:
            return None
        cleaned = str(msg).strip()
        cleaned = re.sub(r"\s+(?:at|@)\s+.+$", "", cleaned, flags=re.IGNORECASE)
        cleaned = re.sub(
            r"\s*\(\s*[^)]*:\d+(?::\d+)?\s*\)\s*$",
            "",
            cleaned,
            flags=re.IGNORECASE,
        )
        cleaned = re.sub(r"\s+[^()\s]+:\d+(?::\d+)?\s*$", "", cleaned)
        return cleaned.strip() or None

    type_match = re.search(
        r"\b([A-Za-z_]\w*(?:Error|Exception)|ECONNREFUSED|ECONNRESET|ETIMEDOUT|EADDRINUSE)\b",
        text,
    )
    if type_match:
        error_type = type_match.group(1)
        type_message_match = re.search(
            rf"{re.escape(error_type)}\s*:\s*([^\n\r]+)",
            text,
            re.IGNORECASE,
        )
        if type_message_match:
            error_message = clean_error_message(type_message_match.group(1))
        
    keys = []

    if error_type == "KeyError":
        key_matches = re.findall(r"KeyError:\s*['\"]([^'\"]+)['\"]", text)
        if key_matches:
            keys = list(set(key_matches)) 

    js_file_line_match = re.search(
        r"(?:\(|\s)([^()\s]+?\.[A-Za-z0-9]+):(\d+)(?::\d+)?\)?",
        text,
    )
    if js_file_line_match:
        file_name = js_file_line_match.group(1)
        line_number = js_file_line_match.group(2)

    if not file_name:
        py_file_match = re.search(r'File\s+"([^"]+)"', text)
        if py_file_match:
            file_name = py_file_match.group(1)

    if not line_number:
        py_line_match = re.search(r"\bline\s+(\d+)\b", text, re.IGNORECASE)
        if py_line_match:
            line_number = py_line_match.group(1)

    if error_message is None:
        for line in text.splitlines():
            cleaned = line.strip()
            if not cleaned:
                continue
            if re.search(
                r"(error|exception|failed|cannot|undefined|not\s+found|refused)",
                cleaned,
                re.IGNORECASE,
            ):
                if ":" in cleaned:
                    error_message = cleaned.split(":", 1)[1].strip() or cleaned
                else:
                    error_message = cleaned
                break

    if line_number is not None:
        try:
            line_number = int(line_number)
        except (TypeError, ValueError):
            line_number = None

    error_message = clean_error_message(error_message) if error_message is not None else None

    parsed ={
        "type": error_type,
        "message": error_message,
        "file": file_name,
        "line": line_number,
        "keys": keys if keys else None,
        "raw": data,
    }

    category = classifier.classify_error(parsed)
    
    parsed["category"] = category

    return parsed
