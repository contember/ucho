# Echo Widget

A lightweight feedback widget built with Solid.js that allows users to capture screenshots, annotate them, and submit feedback.

## Usage

```typescript
import { initEcho } from '@app/echo';

initEcho({
  // Optional: widget position (default: 'bottom-right')
  position: 'bottom-right',
  
  // Optional: primary color for buttons and UI elements
  primaryColor: '#007AFF',
  
  // Required: callback function when feedback is submitted
  onSubmit: async (data) => {
    console.log('Feedback submitted:', data);
    // Handle the feedback data (send to server, etc.)
  }
});
```
