import math
import re
from collections import Counter


def text_to_vector(text):
    """
    Convert text into a simple bag-of-words frequency dict,
    basically counting how many times each word appears.
    """
    cleaned = str(text or "").lower()
    words = re.findall(r"[a-z0-9_]+", cleaned)
    return dict(Counter(words))


def cosine_similarity(vec1, vec2):
    """
    Compute cosine similarity between two sparse frequency dicts.
    """
    if not vec1 or not vec2:
        return 0.0

    dot = 0.0
    for key, v1 in vec1.items():
        v2 = vec2.get(key)
        if v2 is not None:
            dot += float(v1) * float(v2)

    norm1 = math.sqrt(sum(float(v) * float(v) for v in vec1.values()))
    norm2 = math.sqrt(sum(float(v) * float(v) for v in vec2.values()))
    if norm1 == 0.0 or norm2 == 0.0:
        return 0.0

    return dot / (norm1 * norm2)


def _match_type(score: float) -> str:
    if score > 0.95:
        return "Exact match"
    if score > 0.75:
        return "Highly similar"
    return "Weak match"


def find_similar_issue(current_text, past_texts):
    """
    Compare current issue text against past issues and return the most similar.

    Returns:
      {
        "mostSimilar": <str or None>,
        "score": <float, 2 decimal places>,
        "matchType": "Exact match" | "Highly similar" | "Weak match"
      }
    """
    current_vec = text_to_vector(current_text)

    best_text = None
    best_raw_score = 0.0

    for past in past_texts or []:
        past_vec = text_to_vector(past)
        score = cosine_similarity(current_vec, past_vec)
        if score > best_raw_score:
            best_raw_score = float(score)
            best_text = past

    rounded = round(best_raw_score, 2)

    return {
        "mostSimilar": best_text,
        "score": rounded,
        "matchType": _match_type(best_raw_score),
    }
