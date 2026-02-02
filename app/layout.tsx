import type { Metadata } from 'next'
import './globals.css'
import { FeedbackHubWidget } from '@/components/FeedbackHubWidget'

export const metadata: Metadata = {
  title: 'TaskFlow - Todo List App',
  description: 'A simple todo list SaaS - FeedbackHub test customer',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <FeedbackHubWidget />
      </body>
    </html>
  )
}
