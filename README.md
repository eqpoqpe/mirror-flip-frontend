# Canva Mirror Flip App

A **Canva App** that allows users to mirror and flip images with real-time preview and adjustable opacity controls. 🎨

This app provides an intuitive interface for creating mirror effects and flipping images horizontally or vertically, with live preview capabilities and seamless integration into Canva designs.

## ✨ Features

- **Mirror & Flip Images**: Flip images horizontally (mirror effect) or vertically
- **Real-time Preview**: See changes instantly with live preview
- **Adjustable Opacity**: Fine-tune opacity from 10% to 100% with a slider control
- **Side-by-side Comparison**: Compare original and transformed images
- **Flexible Image Input**: Upload new images or work with selected images from Canva
- **Seamless Integration**: Add transformed images to designs or replace existing ones
- **Download Support**: Download the transformed images directly

## 🛠 Technical Approach

### Architecture Overview

This app is built using the **Canva Apps SDK** with a React-based frontend that leverages several key components:

1. **Image Processing**: Uses HTML5 Canvas API for real-time image transformations
2. **State Management**: React hooks for managing image states and user interactions
3. **Async Operations**: React Query for handling image uploads and processing
4. **UI Components**: Canva's App UI Kit for consistent design patterns

### Key Technical Components

#### Image Transformation Engine (`flipImageCanvas`)

- Utilizes HTML5 Canvas for client-side image processing
- Applies matrix transformations for flipping operations
- Supports opacity adjustments with global alpha blending
- Optimized for real-time preview with debounced updates

#### Component Architecture

- **ImageUpload**: Handles file upload and image source management
- **MirrorFlipControls**: Provides flip toggles and opacity slider
- **LivePreview**: Real-time preview with loading states
- **ImageComparison**: Side-by-side before/after view
- **ActionButtons**: Design integration and download functionality

#### State Management Strategy

- Centralized state for image sources, transformation parameters, and UI states
- Ref-based state access for async callbacks
- Automatic cleanup and reset functionality

#### Canva Integration

- Selection API integration for working with existing images
- Asset API for temporary URLs and uploads
- Design API for adding/replacing elements in designs

## 🚀 Requirements

- Node.js `v18` or `v20.10.0`
- npm `v9` or `v10`
- Modern browser with Canvas API support

**Note:** We recommend using [nvm](https://github.com/nvm-sh/nvm#intro) for Node.js version management. The [.nvmrc](/.nvmrc) file ensures the correct version.

## 🏃‍♂️ Quick Start

### Step 1: Clone and Install

```bash
git clone <repository-url>
cd enlarger-frontend-main
npm install
```

### Step 2: Start Development Server

```bash
npm start
```

The development server will start at <http://localhost:8080>.

### Step 3: Configure Canva App

1. Create an app via the [Canva Developer Portal](https://www.canva.com/developers/apps)
2. Set **App source** to **Development URL**
3. Enter `http://localhost:8080` as the **Development URL**
4. Click **Preview** to open the app in Canva

### Step 4: Test the App


1. Upload an image or select an existing image in your Canva design
2. Use the flip controls to mirror horizontally or flip vertically
3. Adjust opacity using the slider (10-100%)
4. Preview the transformation in real-time
5. Add the transformed image to your design or replace the existing one

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```bash
CANVA_APP_ORIGIN=# Your app origin from Developer Portal
CANVA_HMR_ENABLED=false
CANVA_FRONTEND_PORT=8080
```

### Hot Module Replacement (Optional)

To enable faster development with HMR:

1. Copy your **App origin** from the Developer Portal
2. Update `.env`:
   ```bash
   CANVA_APP_ORIGIN=your-app-origin-here
   CANVA_HMR_ENABLED=true
   ```
3. Restart the development server

## 🔧 Development

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm test` - Run tests
- `npm run format` - Format code with Prettier

### Project Structure

```text
src/
├── app.tsx                 # Main application component
├── index.tsx              # App entry point
└── components/
    ├── action-buttons.tsx    # Design integration & download
    ├── image-comparison.tsx  # Before/after comparison
    ├── image-upload.tsx     # File upload handling
    ├── live-preview.tsx     # Real-time preview
    └── mirror-flip-controls.tsx # Flip controls & opacity
```

### Key Dependencies

- **@canva/app-ui-kit** - Canva's UI component library
- **@canva/design** - Design API for element manipulation
- **@canva/asset** - Asset management for uploads/downloads
- **react-compare-slider** - Image comparison component
- **@tanstack/react-query** - Async state management

## 🌐 Safari Support

Safari requires HTTPS for mixed content. To preview in Safari:

1. Start with HTTPS enabled:
   
   ```bash
   npm start --use-https
   ```

1. Navigate to <https://localhost:8080>
1. Bypass the security certificate warning
1. Set Development URL to <https://localhost:8080> in Developer Portal

## 📖 API Reference

### Core Functions

#### `flipImageCanvas(imageUrl, flipHorizontal, flipVertical, opacity)`

Transforms an image using Canvas API with specified flip parameters and opacity.

#### Selection Integration

- Monitors Canva image selection changes
- Automatically loads selected images for transformation
- Supports both uploaded and design-sourced images

#### Asset Management

- Handles temporary URL generation for Canva assets
- Manages file uploads and downloads
- Supports various image formats (JPEG, PNG, WebP)
