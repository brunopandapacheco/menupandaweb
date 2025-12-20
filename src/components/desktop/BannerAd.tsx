interface DesktopBannerAdProps {
  bannerUrl?: string
}

export function DesktopBannerAd({ bannerUrl }: DesktopBannerAdProps) {
  if (!bannerUrl || bannerUrl.trim() === '') {
    return null
  }

  return (
    <div className="mx-8 mb-8 flex justify-center">
      <div className="inline-block rounded-xl overflow-hidden shadow-2xl shadow-black/30 hover:shadow-3xl transition-shadow duration-300">
        <img 
          src={bannerUrl} 
          alt="Banner Publicitário" 
          className="max-w-full h-auto object-contain hover:scale-105 transition-transform duration-300"
          style={{ maxHeight: '400px' }}
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
      </div>
    </div>
  )
}