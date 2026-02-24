<p align="center">
  <img src=".github/assets/ucho-icon.png" width="256" alt="Ucho">
</p>

# Ucho

A lightweight tool for capturing user feedback with screenshots, annotations, and debug information. Built with Solid.js and designed to seamlessly integrate into any web application.

## Features

- **Screenshot Capture**: Automatically capture the current page state
- **Drawing Tools**: Annotate screenshots with various drawing tools
- **Customizable UI**: Configurable colors, position and text
- **Framework Agnostic**: Works with any web application
- **Easy Integration**: Simple setup with NPM or direct script inclusion
- **Drawing Features**:
  - Multiple colors for annotations
  - WIP: Different shapes and tools
- **Responsive Design**: WIP: Works seamlessly on desktop and mobile devices
- **Console tracking**: Captures last 1000 console entries

## Usage

### Using as an NPM Package

```typescript
import { initUcho } from '@contember/ucho'

initUcho({
  onSubmit: async (data) => {
    console.log('Feedback submitted:', data);
    // Handle the feedback data (send to server, etc.)
  }
})
```

### Using Directly in HTML

```html
<script type="module">
  import { initUcho } from 'https://esm.sh/@contember/ucho'

  initUcho({
    onSubmit: async (data) => {
      console.log('Feedback submitted:', data)
      // Handle the feedback data (send to server, etc.)
    }
  })
</script>
```

## Configuration Options

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `position` | string | No | 'bottom-right' | WIP: Position on the page. Available positions: 'top-left', 'top-center', 'top-right', 'middle-left', 'middle-right', 'bottom-left', 'bottom-center', 'bottom-right' |
| `primaryColor` | string | No | '#6227dc' | Primary color for UI elements |
| `textConfig` | object | No | english | Customize all text elements in the interface |
| `onSubmit` | function | Yes | - | Callback function when feedback is submitted |

## Feedback Payload Structure

The `onSubmit` callback receives a data object with the following structure:

```typescript
interface FeedbackPayload {
  comment: string;          // User's written feedback
  screenshot: string;       // Base64 encoded screenshot
  metadata: {
    url: string;            // Current page URL
    userAgent: string;      // Browser user agent
    timestamp: number;      // Submission timestamp
    browserInfo: {
      width: number;            // Width of viewport
      height: number;           // Height of viewport
      screenWidth: number;      // Width of device
      screenHeight: number;     // Height of device 
    }
  }
  console: Array<{                    // Last 1000 console entries (logs, warnings, errors, uncaught errors, unhandled promise rejections)
    type: 'log' | 'warn' | 'error';   // Type of console entry
    message: string;                  // Content of the console message
    timestamp: string;                // When the message was logged
  }>
}
```

## License

Apache-2.0 - see [LICENSE](LICENSE) for details.
