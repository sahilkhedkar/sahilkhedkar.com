export type ContributionDay = {
  date: string;
  count: number;
  level: number;
};

const SOURCE =
  "https://github-contributions-api.jogruber.de/v4/sahilkhedkar?y=last";

export async function getContributions(): Promise<{
  total: number;
  days: ContributionDay[];
} | null> {
  try {
    const response = await fetch(SOURCE, { next: { revalidate: 60 * 60 } });
    if (!response.ok) return null;

    const payload = (await response.json()) as {
      contributions?: ContributionDay[];
    };
    const days = payload.contributions;
    if (!days?.length) return null;

    return {
      total: days.reduce((sum, day) => sum + day.count, 0),
      days,
    };
  } catch {
    return null;
  }
}
