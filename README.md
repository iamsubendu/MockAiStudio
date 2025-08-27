# MockAI Studio

A React web application that simulates a simplified AI studio for image generation, built to showcase modern front-end engineering skills.

## 🚀 Features

### ✅ Core Requirements Implemented

- **Upload & Preview**: Upload PNG/JPG files (≤10MB) with client-side downscaling to ≤1920px
- **Prompt & Style**: Text input for prompts + dropdown with 5 style options (Editorial, Streetwear, Vintage, Minimalist, Artistic)
- **Live Summary**: Real-time preview showing image + prompt + style
- **Generate (Mock API)**:
  - POST request with `{ imageDataUrl, prompt, style }`
  - Response: `{ id, imageUrl, prompt, style, createdAt }` after 1-2 seconds
  - 20% error rate simulation with "Model overloaded" message
  - Loading spinner with automatic retry (exponential backoff, max 3 attempts)
  - Abort functionality for in-flight requests
- **History**: Saves last 5 generations in localStorage, click to restore details
- **Accessibility**: Keyboard navigation, visible focus states, ARIA attributes

### 🎨 Tech Stack

- **React 18** + **TypeScript** (strict mode enabled)
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **ESLint** + **Prettier** for code quality
- **Lucide React** for icons

## 📦 Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd mockai-studio

# Install dependencies
npm install
```

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or next available port)

### Production Build

```bash
npm run build
npm run preview
```

## 🧪 Testing

```bash
# Run tests (if implemented)
npm test

# Run type checking
npm run type-check

# Run linting
npm run lint
```

## 🏗️ Architecture & Design Notes

### Component Structure

```
src/
├── components/
│   ├── Header.tsx          # Application header with branding
│   ├── MainContent.tsx     # Main layout orchestrator
│   ├── ImageUpload.tsx     # File upload with drag & drop
│   ├── PromptInput.tsx     # Text prompt + style selection
│   ├── GenerationSummary.tsx # Live preview of current setup
│   ├── GenerateButton.tsx  # Generate button with loading states
│   ├── History.tsx         # Generation history display
│   └── Footer.tsx          # Application footer
├── hooks/
│   └── useImageGeneration.ts # Business logic for image generation
├── services/
│   ├── api.ts              # Mock API service with retry logic
│   └── storage.ts          # localStorage management
├── utils/
│   └── imageProcessor.ts   # Image validation and downscaling
└── types/
    └── index.ts            # TypeScript interfaces
```

### Key Design Decisions

1. **Modular Architecture**: Separated concerns into components, hooks, services, and utilities
2. **Custom Hook Pattern**: `useImageGeneration` centralizes all business logic
3. **Responsive Design**: Mobile-first approach with Tailwind breakpoints
4. **Error Handling**: Comprehensive error states with user-friendly messages
5. **Accessibility**: ARIA labels, keyboard navigation, focus management
6. **Performance**: Image downscaling, abort controllers, efficient re-renders

### State Management

- **Local State**: React hooks for component-specific state
- **Shared State**: Custom hook for cross-component data
- **Persistence**: localStorage for generation history
- **API State**: Loading, error, and retry management

### Mock API Implementation

- **Realistic Simulation**: 1-2 second delay, 20% error rate
- **Retry Logic**: Exponential backoff with maximum 3 attempts
- **Abort Support**: Cancel in-flight requests
- **Error Simulation**: "Model overloaded" responses

## 🔧 Configuration

### Tailwind CSS

- Custom animations (`spin-slow`, `pulse-slow`)
- Responsive breakpoints: `sm:`, `lg:`, `xl:`
- Glassmorphism effects with backdrop blur

### TypeScript

- Strict mode enabled
- Comprehensive type definitions
- Type-only imports for better tree-shaking

## 📱 Responsive Design

- **Mobile (< 640px)**: Single column layout, optimized touch targets
- **Tablet (640px - 1024px)**: Improved spacing and typography
- **Desktop (1024px+)**: Two-column layout (2/3 + 1/3 split)

## ♿ Accessibility Features

- **Keyboard Navigation**: Tab through all interactive elements
- **Focus Management**: Visible focus states and focus indicators
- **ARIA Labels**: Descriptive labels for screen readers
- **Semantic HTML**: Proper heading hierarchy and landmarks
- **Color Contrast**: WCAG AA compliant color combinations

## 🚀 Performance Optimizations

- **Image Processing**: Client-side downscaling to reduce upload size
- **Lazy Loading**: Images loaded only when needed
- **Efficient Re-renders**: React.memo and useCallback optimizations
- **Bundle Optimization**: Tree-shaking and code splitting

## 🔒 Security Considerations

- **File Validation**: Type and size restrictions on uploads
- **Client-side Processing**: No sensitive data sent to server
- **Input Sanitization**: Proper handling of user inputs

## 📝 Future Enhancements

- Unit tests with React Testing Library
- End-to-end tests with Playwright
- PWA capabilities (manifest + offline caching)
- Error boundaries for better error handling
- Performance monitoring and analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is created for the Modelia Front-End Engineer assignment.

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**
