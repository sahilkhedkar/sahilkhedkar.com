import { dedent } from "../lib/highlight";

export function FolderTree({ tree }: { tree: string }) {
  const lines = dedent(tree).split("\n");

  return (
    <figure className="code-box folder-tree-box">
      <pre>
        <code>
          {lines.map((line, idx) => {
            const trimmed = line.trim();
            if (!trimmed) return <div key={idx} className="tree-line">&nbsp;</div>;

            // Check if there is a comment/description separated by " - "
            const parts = line.split(" - ");
            const pathPart = parts[0] ?? "";
            const descPart = parts.slice(1).join(" - ");

            // Match leading whitespace
            const leadingSpaces = pathPart.match(/^\s*/)?.[0] || "";
            const cleanPath = pathPart.trim();
            const isDir = cleanPath.endsWith("/");

            return (
              <div key={idx} className="tree-line">
                <span className="tree-indent">{leadingSpaces}</span>
                <span className={isDir ? "tree-dir" : "tree-file"}>{cleanPath}</span>
                {descPart && (
                  <span className="tree-desc">
                    <span className="tree-dash"> - </span>
                    {descPart}
                  </span>
                )}
              </div>
            );
          })}
        </code>
      </pre>
    </figure>
  );
}
