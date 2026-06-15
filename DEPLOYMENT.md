# Build and Deployment Guide

## Local Development

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local HTTP server (optional but recommended)

### Running Locally
1. Navigate to the project directory
2. Start a local HTTP server:
   \\\
   python -m http.server 8000
   \\\
3. Open http://localhost:8000/PixelStudio/index.html in your browser

## Building for Production
1. All files are already optimized for production
2. The application uses vanilla JavaScript with no dependencies
3. Simply copy the PixelStudio folder to your hosting server

## Deployment

### Using GitHub Pages
1. Push your code to GitHub
2. Go to repository Settings > Pages
3. Select 'main' branch as source
4. Access the app at https://yourusername.github.io/PixelStudio/

### Using Any Static Host
- Upload the PixelStudio folder to any static hosting service
- Ensure PixelStudio/index.html is accessible from the root path

## Performance Optimization
- Currently optimized for modern browsers
- No build process required
- Minimal file sizes
- No external dependencies

## Troubleshooting
- Clear browser cache if experiencing issues
- Ensure JavaScript is enabled
- Check browser console for any errors
