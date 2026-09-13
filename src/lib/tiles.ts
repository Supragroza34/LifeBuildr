export type Tile = {
  key: string;
  title: string;
  description: string;
  href: string;
  icon: string; // emoji for now — swap for an icon component later if you want
};

/**
 * Central tile registry for the dashboard grid.
 * To add a new tool: add an entry here and build the page at `href`.
 * No dashboard code needs to change.
 */
export const tiles: Tile[] = [
  {
    key: "tracker",
    title: "Application Tracker",
    description: "Track every school, status, and funding offer.",
    href: "/dashboard/tracker",
    icon: "📋",
  },
  {
    key: "deadlines",
    title: "Deadline Countdown",
    description: "Color-coded countdown to every deadline.",
    href: "/dashboard/deadlines",
    icon: "⏳",
  },
  {
    key: "news",
    title: "News Feed",
    description: "Visa policy, funding, and international student news.",
    href: "/dashboard/news",
    icon: "📰",
  },
  {
    key: "catalogue",
    title: "University Catalogue",
    description: "Search or add schools, review auto-populated details.",
    href: "/dashboard/catalogue",
    icon: "🏛️",
  },
  {
    key: "checklist",
    title: "Prep Checklist",
    description: "Cross-school tasks: tests, SOP, outreach, visa logistics.",
    href: "/dashboard/checklist",
    icon: "✅",
  },
  {
    key: "scanner",
    title: "Site Scanner",
    description: "Watch specific pages and flag when their content changes.",
    href: "/dashboard/scanner",
    icon: "🔍",
  },
];
