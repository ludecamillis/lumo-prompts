import { ClerkProvider } from '@clerk/nextjs'

export const metadata = {
  title: 'Lumo Estúdio — Gerador de Prompts Cinematográficos',
  description: 'Crie prompts cinematográficos profissionais para IA',
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="pt-BR">
        <body style={{ margin: 0, padding: 0, background: '#070707' }}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
