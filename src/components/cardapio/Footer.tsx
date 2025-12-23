interface FooterProps {
  backgroundColor: string
}

export function Footer({ backgroundColor }: FooterProps) {
  return (
    <footer
      className="w-full py-6 text-center text-gray-700"
      style={{ backgroundColor }}
    >
      <p className="text-sm">
        Faça seu pedido! 📞 (11) 99999-9999
      </p>
    </footer>
  )
}