export const metadata = {
  title: 'Lumo Estúdio — Gerador de Prompts Cinematográficos',
  description: 'Crie prompts profissionais para Midjourney, Flux, Leonardo e mais.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, padding: 0, background: '#070707' }}>{children}</body>
    </html>
  )
}
