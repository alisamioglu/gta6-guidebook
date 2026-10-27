import { NativeTabs } from 'expo-router/native-tabs';

import { Colors } from '@/constants/theme';
import { useT } from '@/i18n/language';

export default function AppTabs() {
  const colors = Colors.dark;
  const t = useT();

  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={colors.backgroundSelected}
      tintColor={colors.pink}
      disableTransparentOnScrollEdge
      iconColor={{ default: colors.textSecondary, selected: colors.pink }}
      labelStyle={{ default: { color: colors.textSecondary }, selected: { color: colors.pink } }}>
      <NativeTabs.Trigger name="missions">
        <NativeTabs.Trigger.Label>{t('missions')}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="checklist" md="checklist" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="map">
        <NativeTabs.Trigger.Label>{t('map')}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'map', selected: 'map.fill' }} md="map" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
