import { getContributions } from "../lib/contributions";
import { Skyline } from "./skyline";

export async function ContributionGraph() {
  const data = await getContributions();

  if (!data) {
    return <p className="empty">GitHub activity is unavailable right now.</p>;
  }

  return (
    <div className="contributions">
      <Skyline days={data.days} />
      <p id="contributions-caption" className="contributions-meta">
        Every window is a day of my last year. The blinking one is today.
      </p>
    </div>
  );
}
