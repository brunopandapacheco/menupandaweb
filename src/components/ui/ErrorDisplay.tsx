interface ErrorDisplayProps {
  message: string
}

export function ErrorDisplay({ message }: ErrorDisplayProps) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center p-8">
        <div className="text-red-600 text-xl font-semibold mb-2">Erro</div>
        <div className="text-gray-600">{message}</div>
      </div>
    </div>
  )
}