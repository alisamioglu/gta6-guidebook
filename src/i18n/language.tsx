import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';

import { missionTexts } from '@/i18n/mission-texts';
import { Language, LANGUAGES, StringKey, strings } from '@/i18n/strings';
import { Mission } from '@/data/missions';

const KEY = 'language';

function isLanguage(value: string | null | undefined): value is Language {
  return LANGUAGES.some((l) => l.code === value);
}

// start with the phone's language if we have it
function deviceLanguage(): Language {
  const code = getLocales()[0]?.languageCode;
  return isLanguage(code) ? code : 'en';
}

const LanguageContext = createContext<{
  language: Language;
  setLanguage: (language: Language) => void;
}>({ language: 'en', setLanguage: () => {} });

export function LanguageProvider({ children }: PropsWithChildren) {
  const [language, setLanguageState] = useState<Language>(deviceLanguage);

  useEffect(() => {
    AsyncStorage.getItem(KEY).then((saved) => {
      if (isLanguage(saved)) setLanguageState(saved);
    });
  }, []);

  function setLanguage(next: Language) {
    setLanguageState(next);
    AsyncStorage.setItem(KEY, next);
  }

  return <LanguageContext value={{ language, setLanguage }}>{children}</LanguageContext>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export function useT() {
  const { language } = useLanguage();
  return (key: StringKey, vars?: Record<string, string | number>) => {
    let text = strings[language][key];
    for (const [name, value] of Object.entries(vars ?? {})) {
      text = text.replace(`{${name}}`, String(value));
    }
    return text;
  };
}

// mission title and steps in the current language, english if missing
export function useMissionText() {
  const { language } = useLanguage();
  return (mission: Mission) => {
    const text = language === 'en' ? undefined : missionTexts[language][mission.id];
    return { title: text?.title ?? mission.title, steps: text?.steps ?? mission.steps };
  };
}
