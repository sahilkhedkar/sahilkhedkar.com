import { dedent, tokenize } from "../lib/highlight";

export function CodeBlock({ code }: { code: string }) {
  const tokens = tokenize(dedent(code));
  let offset = 0;

  return (
    <figure className="code">
      <pre>
        <code>
          {tokens.map((token) => {
            const key = offset;
            offset += token.value.length;
            if (token.type === "text") return <span key={key}>{token.value}</span>;
            return (
              <span key={key} className={`tok-${token.type}`}>
                {token.value}
              </span>
            );
          })}
        </code>
      </pre>
    </figure>
  );
}
