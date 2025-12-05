interface BannerAdProps {
  bannerUrl?: string
}

export function BannerAd({ bannerUrl }: BannerAdProps) {
  if (!bannerUrl || bannerUrl.trim() === '') {
    return null
  }

  return (
    <div className="mx-4 mb-4">
      <div className="w-full h-32 rounded-lg overflow-hidden shadow-sm">
        <img 
          src={bannerUrl} 
          alt="Banner Publicitário" 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
      </div>
    </div>
  )
}