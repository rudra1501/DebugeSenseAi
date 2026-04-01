function generateDiff(beforeCode, afterCode) {
  const beforeLines = String(beforeCode ?? "").split(/\r?\n/);
  const afterLines = String(afterCode ?? "").split(/\r?\n/);
  const changes = [];

  const maxLen = Math.max(beforeLines.length, afterLines.length);

  for (let i = 0; i < maxLen; i += 1) {
    const beforeLine = beforeLines[i];
    const afterLine = afterLines[i];

    if (beforeLine === afterLine) {
      continue;
    }

    if (beforeLine !== undefined) {
      changes.push(`- ${beforeLine}`);
    }

    if (afterLine !== undefined) {
      changes.push(`+ ${afterLine}`);
    }
  }

  return changes;
}

module.exports = {
  generateDiff,
};
