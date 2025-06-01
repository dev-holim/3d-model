# 3D Model Viewer

A modern, interactive 3D model viewer built with Next.js, React Three Fiber, and Drei. This application provides a full-screen, responsive interface for viewing GLTF/GLB 3D models with intuitive controls.

## Features

- 🎯 **Interactive Controls**: Drag to rotate, scroll to zoom, right-click to pan
- 📱 **Responsive Design**: Full-screen layout that works on all devices
- 🎨 **Modern UI**: Clean interface with gradient background and glassmorphism elements
- ⚡ **Performance Optimized**: Model preloading and efficient rendering
- 🔄 **Auto-fit Models**: Automatically centers and scales models to fit the viewport
- 💡 **Realistic Lighting**: Advanced lighting setup with environment mapping and shadows
- 🎭 **Smooth Animations**: Subtle rotation animation and damped controls

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **React Three Fiber** - React renderer for Three.js
- **Drei** - Useful helpers and abstractions for React Three Fiber
- **Three.js** - 3D graphics library
- **pnpm** - Fast, disk space efficient package manager

## Getting Started

### Prerequisites

Make sure you have Node.js (18+) and pnpm installed on your system.

### Installation

1. **Clone or initialize the project**:
   ```bash
   # If starting fresh
   pnpm create next-app@latest 3d-model-viewer --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"
   
   # Or if you have the project files
   cd 3d-model-viewer
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Add your 3D model**:
   - Place your `.glb` file at `public/models/my-model.glb`
   - The model will be automatically loaded and displayed

4. **Start the development server**:
   ```bash
   pnpm dev
   ```

5. **Open your browser**:
   - Navigate to [http://localhost:3000](http://localhost:3000)
   - Your 3D model should be visible and interactive

### Manual Setup (Alternative)

If you prefer to set up the project manually:

```bash
# Create new Next.js project
pnpm create next-app@latest 3d-model-viewer --typescript --app

# Navigate to project
cd 3d-model-viewer

# Install 3D dependencies
pnpm install three @react-three/fiber @react-three/drei @types/three

# Create necessary directories
mkdir -p public/models components

# Add your GLB file to public/models/my-model.glb
```

## Project Structure

```
3d-model-viewer/
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main page with 3D viewer
├── components/
│   └── Model.tsx            # 3D model component
├── public/
│   └── models/
│       └── my-model.glb     # Your 3D model file
├── package.json
├── tsconfig.json
└── next.config.js
```

## Usage

### Controls

- **Rotate**: Left-click and drag
- **Zoom**: Mouse wheel or pinch
- **Pan**: Right-click and drag
- **Reset**: The model auto-fits on load

### Customization

#### Changing the Model

Replace `public/models/my-model.glb` with your own GLB file, or update the path in `components/Model.tsx`:

```typescript
const { scene } = useGLTF('/models/your-model.glb')
```

#### Adjusting Camera Settings

Modify the camera configuration in `app/page.tsx`:

```typescript
<Canvas
  camera={{
    position: [x, y, z],  // Camera position
    fov: 50,              // Field of view
    near: 0.1,            // Near clipping plane
    far: 1000             // Far clipping plane
  }}
>
```

#### Lighting Customization

Adjust lighting in `app/page.tsx`:

```typescript
<ambientLight intensity={0.4} />
<directionalLight position={[10, 10, 5]} intensity={1} />
<Environment preset="city" /> // Try: "sunset", "dawn", "night", etc.
```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Model Requirements

- **Format**: GLTF 2.0 (.glb or .gltf)
- **Size**: Recommended under 50MB for web performance
- **Optimization**: Consider using tools like [gltf-pipeline](https://github.com/CesiumGS/gltf-pipeline) for optimization

## Performance Tips

1. **Optimize Models**: Use Draco compression and texture optimization
2. **Model Size**: Keep file sizes reasonable for web delivery
3. **Texture Resolution**: Balance quality with performance
4. **LOD**: Consider level-of-detail models for complex scenes

## Browser Support

- Chrome 51+
- Firefox 53+
- Safari 10+
- Edge 79+

WebGL 2.0 support is recommended for best performance.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Troubleshooting

### Model Not Loading
- Check file path: `public/models/my-model.glb`
- Verify GLB format is valid
- Check browser console for errors

### Performance Issues
- Reduce model complexity
- Optimize textures
- Check lighting complexity

### Controls Not Working
- Ensure OrbitControls are properly imported
- Check for JavaScript errors in console

## Resources

- [React Three Fiber Documentation](https://docs.pmnd.rs/react-three-fiber)
- [Drei Documentation](https://github.com/pmndrs/drei)
- [Three.js Documentation](https://threejs.org/docs/)
- [GLTF Validator](https://github.khronos.org/glTF-Validator/) 