import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export type Pin = {
  id: string;
  // 0-1, relative to the map image
  x: number;
  y: number;
  title: string;
  note: string;
  color: string;
};

const KEY = 'map-pins';

export function usePins() {
  const [pins, setPins] = useState<Pin[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(KEY).then((saved) => {
      if (saved) setPins(JSON.parse(saved));
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
