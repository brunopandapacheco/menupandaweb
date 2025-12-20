interface DesktopBannerAdProps {
  bannerUrl?: string
}

export function DesktopBannerAd({ bannerUrl }: DesktopBannerAdProps) {
  if (!bannerUrl || bannerUrl.trim() === '') {
    return null
  }

  return (
    <div className="mx-8 mb-8">
      <div className="w-full h-64 rounded-xl overflow-hidden shadow-2xl shadow-black/30 hover:shadow-3xl transition-shadow duration-300">
        <img 
          src={bannerUrl} 
          alt="Banner Publicitário" 
          className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
      </div>
    </div>
  )
}