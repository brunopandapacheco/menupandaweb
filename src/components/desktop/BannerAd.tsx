interface BannerAdProps {
  bannerUrl?: string
}

export function DesktopBannerAd({ bannerUrl }: BannerAdProps) {
  // Hide banner completely on desktop
  return null
}