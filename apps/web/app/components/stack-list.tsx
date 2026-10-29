import { stackColumns } from "../lib/stack";
import { TechIcon } from "./tech-icon";

export function StackList() {
  return (
    <div className="stack">
      {stackColumns.map((column) => (
        <div key={column.map((group) => group.title).join("-")} className="stack-col">
          {column.map((group) => (
            <section key={group.title} className="stack-group">
              <h2>{group.title}</h2>
              <ul>
                {group.items.map((item) => (
                  <li key={item.slug} className="stack-row">
                    <TechIcon slug={item.slug} />
                    <span>{item.name}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      ))}
    </div>
  );
}
