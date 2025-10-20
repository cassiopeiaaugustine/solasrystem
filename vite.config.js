import { defineConfig } from 'vite'

export default defineConfig({
  base: './', // Important for Electron file:// protocol
  server: {
    port: 5173, // Changed to default Vite port
    open: false, // Don't auto-open in browser for Electron
    host: 'localhost'
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        // Ensure proper asset handling for Electron
        assetFileNames: 'assets/[name].[hash][extname]',
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js'
      }
    }
  },
  // Optimize for Electron
  optimizeDeps: {
    include: ['three', 'gsap', 'lil-gui']
  }
})
