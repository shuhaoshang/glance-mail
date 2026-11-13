import maya from '../../../../docs/handoff/v2/provided/data/maya.json';
import type { Tab } from './TabBar';

export const emailTabs: Tab[] = [
  {
    id: 'needs-you',
    label: 'Needs you',
    count: maya.items.filter((item) => !item.isNew).length,
  },
  { id: 'heads-up', label: 'Heads-up', count: maya.goodToKnow.length },
  { id: 'other-mail', label: 'Other mail', count: maya.otherMail.total },
];
export const glanceTabs: Tab[] = [
  {
    id: 'watchlist',
    label: 'Watchlist',
    count: maya.watchlist.length,
    hasNews: maya.watchlist.some((item) => item.news > 0),
  },
  {
    id: 'memory',
    label: 'Memory',
    count: maya.memory.instructions.length + maya.memory.learned.length,
  },
];
export const panelItems: Record<string, string[]> = {
  'needs-you': maya.items
    .filter((item) => !item.isNew)
    .map((item) => item.name),
  'heads-up': maya.goodToKnow.map((item) => item.title),
  'other-mail': maya.otherMail.rows
    .filter((item) => !item.isNew)
    .map((item) => item.sender),
  watchlist: maya.watchlist.map((item) => item.name),
  memory: [...maya.memory.instructions, ...maya.memory.learned].map(
    (item) => item.text,
  ),
};
