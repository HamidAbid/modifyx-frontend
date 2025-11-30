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

console.log('Both servers are running!');
console.log('Frontend: http://localhost:5173');
console.log('Backend: http://localhost:5000');
console.log('Press Ctrl+C to stop both servers.'); 