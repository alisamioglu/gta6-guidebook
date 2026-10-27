import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

import { PIN_CATEGORIES, PinCategory } from '@/constants/pins';

export type Pin = {
  id: string;
  // 0-1, relative to the map image
  x: number;
  y: number;
  title: string;
  note: string;
  category: PinCategory;
  // file uris, older pins don't have this
  photos?: string[];
};

const KEY = 'map-pins';

// old pins only had a color, the colors match the categories in order
function withCategory(pin: Pin & { color?: string }): Pin {
  if (pin.category) return pin;
  const match = PIN_CATEGORIES.find((c) => c.color === pin.color);
  return { ...pin, category: match?.id ?? 'other' };
}

export function usePins() {
  const [pins, setPins] = useState<Pin[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(KEY).then((saved) => {
      if (saved) setPins(JSON.parse(saved).map(withCategory));
    });
  }, []);

  function update(next: Pin[]) {
    setPins(next);
    AsyncStorage.setItem(KEY, JSON.stringify(next));
  }

  function savePin(pin: Pin) {
    const exists = pins.some((p) => p.id === pin.id);
    update(exists ? pins.map((p) => (p.id === pin.id ? pin : p)) : [...pins, pin]);
  }

  function deletePin(id: string) {
    update(pins.filter((p) => p.id !== id));
  }

  return { pins, savePin, deletePin };
}
