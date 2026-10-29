const KEYWORDS = new Set([
  "const",
  "let",
  "var",
  "return",
  "async",
  "await",
  "new",
  "function",
  "if",
  "else",
  "for",
  "of",
  "try",
  "catch",
  "finally",
  "throw",
  "class",
  "import",
  "from",
  "export",
  "default",
  "true",
  "false",
  "null",
  "undefined",
  "in",
  "typeof",
  "instanceof",
]);

export type Token = {
  type: "text" | "k" | "s" | "n" | "c" | "f" | "tag" | "punc";
  value: string;
};

export function dedent(source: string) {
  const lines = source.replace(/^\n/, "").replace(/\n[ \t]*$/, "").split("\n");
  const widths = lines.filter((line) => line.trim()).map((line) => line.match(/^[ \t]*/)?.[0].length ?? 0);
  const trim = widths.length ? Math.min(...widths) : 0;
  return lines.map((line) => line.slice(trim)).join("\n");
}

function at(source: string, index: number) {
  return source[index] ?? "";
}

export function tokenize(source: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < source.length) {
    const rest = source.slice(i);
    const current = at(source, i);

    if (/\s/.test(current)) {
      let j = i + 1;
      while (j < source.length && /\s/.test(at(source, j))) j += 1;
      tokens.push({ type: "text", value: source.slice(i, j) });
      i = j;
      continue;
    }

    if (rest.startsWith("//")) {
      const end = source.indexOf("\n", i);
      const j = end === -1 ? source.length : end;
      tokens.push({ type: "c", value: source.slice(i, j) });
      i = j;
      continue;
    }

    if (current === "'" || current === '"') {
      const quote = current;
      let j = i + 1;
      while (j < source.length) {
        const next = at(source, j);
        if (next === "\\") {
          j += 2;
          continue;
        }
        if (next === quote) {
          j += 1;
          break;
        }
        if (next === "\n") break;
        j += 1;
      }
      tokens.push({ type: "s", value: source.slice(i, j) });
      i = j;
      continue;
    }

    if (current === "`") {
      let j = i + 1;
      while (j < source.length) {
        const next = at(source, j);
        if (next === "\\") {
          j += 2;
          continue;
        }
        if (next === "`") {
          j += 1;
          break;
        }
        j += 1;
      }
      tokens.push({ type: "s", value: source.slice(i, j) });
      i = j;
      continue;
    }

    if (/[0-9]/.test(current) && (i === 0 || /[^A-Za-z0-9_$]/.test(at(source, i - 1)))) {
      let j = i + 1;
      while (j < source.length && /[0-9A-Za-z_.]/.test(at(source, j))) j += 1;
      tokens.push({ type: "n", value: source.slice(i, j) });
      i = j;
      continue;
    }

    if (/[A-Za-z_$]/.test(current)) {
      let j = i + 1;
      while (j < source.length && /[A-Za-z0-9_$]/.test(at(source, j))) j += 1;
      const word = source.slice(i, j);
      if (KEYWORDS.has(word)) tokens.push({ type: "k", value: word });
      else if (at(source, j) === "(") tokens.push({ type: "f", value: word });
      else tokens.push({ type: "text", value: word });
      i = j;
      continue;
    }

    if (current === "<") {
      const match = rest.match(/^(<\/?[A-Za-z0-9_-]+)(\s[^>]*)?(\/?>)/);
      if (match) {
        const tagPart = match[1] || "";
        const isClose = tagPart.startsWith("</");
        const tagName = isClose ? tagPart.slice(2) : tagPart.slice(1);
        tokens.push({ type: "punc", value: isClose ? "</" : "<" });
        tokens.push({ type: "tag", value: tagName });
        if (match[2]) tokens.push({ type: "text", value: match[2] });
        if (match[3]) tokens.push({ type: "punc", value: match[3] });
        i += match[0].length;
        continue;
      }
    }

    if (/[(){};:,.]/.test(current)) {
      tokens.push({ type: "punc", value: current });
      i += 1;
      continue;
    }

    tokens.push({ type: "text", value: current });
    i += 1;
  }

  return tokens;
}
