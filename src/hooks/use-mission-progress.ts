import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

type Progress = {
  completed: string[];
  notes: Record<string, string>;
};

const KEY = 'mission-progress';

export function useMissionProgress() {
  const [progress, setProgress] = useState<Progress>({ completed: [], notes: {} });

  // reload when the screen shows up, the other tab might have changed it
  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem(KEY).then((saved) => {
        if (saved) setProgress(JSON.parse(saved));
      });
    }, []),
  );

  function update(next: Progress) {
    setProgress(next);
    AsyncStorage.setItem(KEY, JSON.stringify(next));
  }

  function toggleDone(id: string) {
    const done = progress.completed.includes(id);
    update({
      ...progress,
      completed: done ? progress.completed.filter((c) => c !== id) : [...progress.completed, id],
    });
  }

  function setNote(id: string, note: string) {
    update({ ...progress, notes: { ...progress.notes, [id]: note } });
  }

  return {
    completed: progress.completed,
    notes: progress.notes,
    toggleDone,
    setNote,
  };
}
