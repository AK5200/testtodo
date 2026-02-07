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
        {/* This widget combines feedback board and changelog in one */}
        <Script
          id="feedbackhub-all-in-one"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var script = document.createElement('script');
                // Change this URL to your FeedbackHub instance URL
                script.src = 'https://yettobedecided-goyz.vercel.app/widget.js';
                script.async = true;
                // Replace 'your-workspace' with your actual workspace slug
                script.dataset.org = 'taskflow';
                script.dataset.type = 'all-in-one-popup';
                document.head.appendChild(script);
              })();
            `,
          }}
        />
        {/* Optional: Custom trigger button */}
        {/* Uncomment and customize the button below */}
        {/* <button id="feedbackhub-all-in-one-trigger" style="background: #F59E0B; color: white; padding: 8px 16px; border-radius: 8px; border: none; cursor: pointer;">Feedback & Updates</button> */}
      </body>
    </html>
  )
}
