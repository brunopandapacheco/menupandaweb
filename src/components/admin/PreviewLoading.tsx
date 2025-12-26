export function PreviewLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Carregando prévia...</p>
      </div>
    </div>
  )
}