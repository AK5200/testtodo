'use client';

import { useEffect } from 'react';

export function FeedbackHubWidget() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://yettobedecided-goyz.vercel.app/widget.js';  // ← Fixed URL
    script.setAttribute('data-org', 'taskflow');
    script.async = true;
    document.head.appendChild(script);
    
    return () => script.remove();
  }, []);
  
  return null;
}
