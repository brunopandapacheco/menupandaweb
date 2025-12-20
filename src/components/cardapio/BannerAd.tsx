interface BannerAdProps {
  bannerUrl?: string
}

export function BannerAd({ bannerUrl }: BannerAdProps) {
  if (!bannerUrl || bannerUrl.trim() === '') {
    return null
  }

  return (
    <div className="mx-4 mb-4">
      <div className="w-full h-auto rounded-lg overflow-hidden shadow-lg shadow-black/30">
        <img 
          src={bannerUrl} 
          alt="Banner Publicitário" 
          className="w-full h-auto object-contain"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
      </div>
    </div>
  )
}