const { spawn } = require('child_process');
const http = require('http');

// Function to check if a port is responding
function checkPort(port) {
  return new Promise((resolve) => {
    const http = require('http');
    const req = http.get(`http://localhost:${port}`, (res) => {
      resolve(res.statusCode === 200);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(1000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

// Function to wait for Vite dev server
async function waitForVite() {
  const ports = [5173, 5174, 5175, 5176, 5177, 5178];
  
  for (const port of ports) {
    const isReady = await checkPort(port);
    if (isReady) {
      console.log(`Vite dev server found on port ${port}`);
      return port;
    }
    
    // Wait a bit before checking next port
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  throw new Error('Vite dev server not found on any port');
}

// Start Vite dev server
console.log('Starting Vite dev server...');
const viteProcess = spawn('npm', ['run', 'dev'], { 
  stdio: 'inherit',
  shell: true 
});

// Wait for Vite to start
waitForVite()
  .then(port => {
    console.log(`Starting Electron with dev server on port ${port}`);
    
    // Set environment variable and start Electron
    const electronProcess = spawn('electron', ['.'], {
      stdio: 'inherit',
      shell: true,
      env: {
        ...process.env,
        ELECTRON_IS_DEV: '1',
        VITE_PORT: port.toString()
      }
    });
    
    // Handle cleanup
    process.on('SIGINT', () => {
      console.log('\nShutting down...');
      viteProcess.kill();
      electronProcess.kill();
      process.exit(0);
    });
    
    electronProcess.on('close', () => {
      viteProcess.kill();
      process.exit(0);
    });
  })
  .catch(error => {
    console.error('Error:', error.message);
    viteProcess.kill();
    process.exit(1);
  });
