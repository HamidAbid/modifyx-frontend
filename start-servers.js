import { spawn } from 'child_process';

// Start backend server
const backendServer = spawn('npm', ['run', 'backend'], { 
  stdio: 'inherit',
  shell: true
});

// Start frontend server
const frontendServer = spawn('npm', ['run', 'dev'], { 
  stdio: 'inherit',
  shell: true
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('Stopping servers...');
  backendServer.kill();
  frontendServer.kill();
  process.exit();
});

