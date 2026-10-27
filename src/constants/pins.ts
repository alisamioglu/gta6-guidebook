// label is a translation key
export const PIN_CATEGORIES = [
  { id: 'mission', label: 'categoryMission', color: '#D4537E' },
  { id: 'collectible', label: 'categoryCollectible', color: '#1D9E75' },
  { id: 'vehicle', label: 'categoryVehicle', color: '#EF9F27' },
  { id: 'other', label: 'categoryOther', color: '#7F77DD' },
] as const;

export type PinCategory = (typeof PIN_CATEGORIES)[number]['id'];

export function categoryColor(category: PinCategory) {
  return PIN_CATEGORIES.find((c) => c.id === category)?.color ?? PIN_CATEGORIES[3].color;
}
