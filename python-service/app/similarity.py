import math
import re
from collections import Counter


def text_to_vector(text):
    """
    Convert text into a simple bag-of-words frequency dict,
    basically counting how many times each word appears.
    """
    cleaned = str(text or "").lower()
    # Keep alphanumerics and underscores; everything else becomes a delimiter.
    words = re.findall(r"[a-z0-9_]+", cleaned)
    return dict(Counter(words))


def cosine_similarity(vec1, vec2):
    """
    Compute cosine similarity between two sparse frequency dicts.
    """
    if not vec1 or not vec2:
        return 0.0

    # Dot product over intersection of keys.
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


def find_similar_issue(current_text, past_texts):
    """
    Compare current issue text against past issues and return the most similar.

    Returns:
      {
        "index": <int or null>,
        "text": <most similar past text or null>,
        "score": <float>
      }
    """
    current_vec = text_to_vector(current_text)

    best = {"index": None, "text": None, "score": 0.0}

    for idx, past in enumerate(past_texts or []):
        past_vec = text_to_vector(past)
        score = cosine_similarity(current_vec, past_vec)
        if score > best["score"]:
            best = {"index": idx, "text": past, "score": float(score)}

    return best
