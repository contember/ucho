# Echo Widget

A lightweight feedback widget built with Solid.js that allows users to capture screenshots, annotate them, and submit feedback.

## Usage

```typescript
import { initEcho } from 'contember-echo';

initEcho({
  // Optional: widget position (default: 'bottom-right')
  position: 'bottom-right',
  
  // Optional: primary color for buttons and UI elements
  primaryColor: '#007AFF',

  // Optional: customize all text elements in the widget
  textConfig: {
    welcomeMessage: {
      text: 'Click here to leave feedback',
      closeAriaLabel: 'Close welcome message',
    },
    feedbackForm: {
      title: 'Send Feedback',
      placeholder: "What's on your mind? We'd love to hear your feedback...",
      screenshotAlt: 'Screenshot Preview',
      submitButton: 'Send Feedback',
      minimizeTitle: 'Minimize',
      expandTitle: 'Expand',
      closeTitle: 'Close',
      showFormTitle: 'Show Feedback Form',
    },
    notification: {
      successTitle: 'Thank you for your feedback!',
      errorTitle: 'Something went wrong.',
      errorMessage: 'Failed to send feedback. Please try again.',
      hideTitle: 'Hide notification',
    },
    drawingTooltip: {
      text: 'Click & drag to draw',
    },
  }
  
  // Required: callback function when feedback is submitted
  onSubmit: async (data) => {
    console.log('Feedback submitted:', data);
    // Handle the feedback data (send to server, etc.)
  }
});
```
