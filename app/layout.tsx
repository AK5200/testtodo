import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
  title: 'TaskFlow - Todo List App',
  description: 'A simple todo list SaaS application',
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
        {/* FeedbackHub All-in-One Widget (Pop-up) */}
        <Script
          id="feedbackhub-all-in-one"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var script = document.createElement('script');
                script.src = 'https://yettobedecided-goyz.vercel.app/widget.js';
                script.async = true;
                script.dataset.org = 'taskflow';
                script.dataset.type = 'all-in-one-popup';
                document.head.appendChild(script);
              })();
            `,
          }}
        />
      </body>
    </html>
  )
}
