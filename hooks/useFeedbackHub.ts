'use client';

import { useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

declare global {
  interface Window {
    FeedbackHub?: {
      identify: (user: User) => void;
      clearIdentity: () => void;
      open?: () => void;
    };
  }
}

/**
 * Hook to identify user with FeedbackHub widget
 * Call this whenever user state changes (login/logout)
 */
export function useFeedbackHub(user: User | null) {
  useEffect(() => {
    // Wait for FeedbackHub to be available
    const checkAndIdentify = () => {
      if (window.FeedbackHub && window.FeedbackHub.identify) {
        if (user) {
          // Identify the user
          window.FeedbackHub.identify({
            id: user.id,
            email: user.email,
            name: user.name,
            ...(user.avatar && { avatar: user.avatar }),
          });
          console.log('FeedbackHub: User identified', { id: user.id, email: user.email });
        } else {
          // Clear identity on logout
          if (window.FeedbackHub.clearIdentity) {
            window.FeedbackHub.clearIdentity();
            console.log('FeedbackHub: Identity cleared');
          }
        }
      } else {
        // FeedbackHub not loaded yet, retry after a short delay
        setTimeout(checkAndIdentify, 100);
      }
    };

    checkAndIdentify();
  }, [user]);
}

/**
 * Hook to auto-open FeedbackHub widget when ?feedbackhub=open is in URL
 */
export function useFeedbackHubAutoOpen() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const shouldOpen = urlParams.get('feedbackhub') === 'open';

    if (shouldOpen) {
      const tryOpen = () => {
        if (window.FeedbackHub && window.FeedbackHub.open) {
          window.FeedbackHub.open();
          console.log('FeedbackHub: Auto-opened widget');
          // Remove the query parameter from URL without reload
          const newUrl = window.location.pathname;
          window.history.replaceState({}, '', newUrl);
        } else {
          // Widget not loaded yet, retry
          setTimeout(tryOpen, 100);
        }
      };

      // Wait a bit for widget to fully initialize
      setTimeout(tryOpen, 500);
    }
  }, []);
}
