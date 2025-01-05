# Contember Admin

A powerful, React-based administration interface designed for managing Contember projects with ease and flexibility.

## Overview

This administration UI provides a comprehensive set of tools and interfaces to manage your Contember project's content
and data efficiently. Built with React and enhanced with TailwindCSS and Shadcn UI, it offers a modern and responsive
user experience.

## Project Structure

```
├── app/                        # Core application logic and components
│   ├── components/            # Reusable UI components
│   │   ├── forms/            # Entity form components
│   │   ├── previews/         # Entity preview components
│   │   ├── details/          # Entity detail components
│   │   ├── layout.tsx        # Layout components
│   │   ├── navigation.tsx    # Navigation components
│   │   └── ...
│   └── pages/                # Global context providers
├── entrypoint/               # Authentication-related pages
│   ├── pages/               # Individual page components
│   ├── entrypoint.tsx
│   └── ...
├── lib/                      # Reusable UI components and hooks (headless)
└── public/                   # Static assets and resources
```

## Concepts

- **Forms**: Customizable form components for creating and editing entities, extracted from edit and create pages.
- **Previews**: Defines how the Entity is represented in the UI, often combining fields like name, title, creation time, etc.
- **Details**: Read-only, formatted fields for better readability, extracted from detail pages.

## Key Features

- **Authentication System**: Secure login and password reset functionality
- **Headless UI Components**: Flexible, reusable components in the `lib` directory
- **Modern Styling**: Built with TailwindCSS and [Shadcn UI](https://ui.shadcn.com) for beautiful, responsive designs
- **Modular Architecture**: Well-organized codebase for easy maintenance and scaling
- **Type-Safe Development**: Fully typed with TypeScript for better development experience

## Getting Started

1. First, ensure you have reviewed the main [project overview](../README.md) for:
	- Project structure understanding
	- Local development setup
	- Environment configuration

2. To start the development server:
   ```bash
   # Follow the instructions in the main project README
   ```

## Technology Stack

- React 18+
- TailwindCSS
- Shadcn UI
- Contember Platform
- TypeScript

## Additional Resources

- [Contember Documentation](https://docs.contember.com)
- [React Documentation](https://reactjs.org)
- [TailwindCSS Documentation](https://tailwindcss.com)
- [Shadcn UI Documentation](https://ui.shadcn.com)
