export const PIN_CATEGORIES = [
  { id: 'mission', label: 'Mission', color: '#D4537E' },
  { id: 'collectible', label: 'Collectible', color: '#1D9E75' },
  { id: 'vehicle', label: 'Vehicle', color: '#EF9F27' },
  { id: 'other', label: 'Other', color: '#7F77DD' },
] as const;

export type PinCategory = (typeof PIN_CATEGORIES)[number]['id'];

export function categoryColor(category: PinCategory) {
  return PIN_CATEGORIES.find((c) => c.id === category)?.color ?? PIN_CATEGORIES[3].color;
}
