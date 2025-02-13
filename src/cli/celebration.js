// src/cli/celebration.js
import chalk from 'chalk';

const frames = [
  `
    🎉 
   \\|/
    |  
   / \\
  `,
  `
    🎊
    /|\\
     |
    / \\
  `,
  `
    ✨
    \\|/
     |
    / \\
  `
];

export function celebrate(message) {
  let frameIndex = 0;
  const animation = setInterval(() => {
    process.stdout.write('\x1B[2J\x1B[3J\x1B[H');
    console.log(chalk.rainbow(`
    ===============================
         ${message}
    ===============================
    `));
    console.log(chalk.cyan(frames[frameIndex]));
    frameIndex = (frameIndex + 1) % frames.length;
  }, 200);

  // Stop after 2 seconds
  setTimeout(() => {
    clearInterval(animation);
    process.stdout.write('\x1B[2J\x1B[3J\x1B[H');
    console.log(chalk.green(`
    ===============================
         ${message}
    ===============================
    `));
  }, 2000);
}