'use client';

import { useEffect } from 'react';

export function FeedbackHubWidget() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://yettobedecided-cjbb-6e1g8j22v-ak5200s-projects.vercel.app/widget.js';
    script.setAttribute('data-org', 'taskflow');
    script.async = true;
    document.head.appendChild(script);
    
    return () => script.remove();
  }, []);
  
  return null;
}
