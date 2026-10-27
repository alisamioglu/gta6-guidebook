// no AdMob on web, the fake ads stay
export const ads = null;

export type AdKind = 'banner' | 'interstitial' | 'native';

export function unitId(_kind: AdKind) {
  return '';
}

export async function startAds() {
  return false;
}
