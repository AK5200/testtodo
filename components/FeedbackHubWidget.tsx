'use client';

import { useEffect } from 'react';

export function FeedbackHubWidget() {
  useEffect(() => {
    // Check if script already exists to avoid duplicates
    if (document.getElementById('feedbackhub-widget-script')) {
      return;
    }

    const script = document.createElement('script');
    script.id = 'feedbackhub-widget-script';
    script.src = 'https://yettobedecided-8lws.vercel.app/widget.js';
    script.async = true;
    script.dataset.org = 'taskflow';
    script.dataset.type = 'all-in-one-popup';
    
    // Add error handling
    script.onerror = () => {
      console.error('Failed to load FeedbackHub widget. Please verify:');
      console.error('1. The widget.js file exists at: https://yettobedecided-8lws.vercel.app/widget.js');
      console.error('2. The FeedbackHub instance is properly configured');
      console.error('3. CORS is enabled for your domain');
    };

    script.onload = () => {
      console.log('FeedbackHub widget loaded successfully');
    };
    
    document.head.appendChild(script);

    return () => {
      // Cleanup: remove script on unmount
      const existingScript = document.getElementById('feedbackhub-widget-script');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return null;
}
