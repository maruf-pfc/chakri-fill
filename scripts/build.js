const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log("=========================================");
console.log("Building ChakriFill Extensions...");
console.log("=========================================");

const distDir = path.join(__dirname, '../dist');
const chromeDir = path.join(distDir, 'chrome');
const firefoxDir = path.join(distDir, 'firefox');

// Clean and recreate directories using OS shell commands
try {
  execSync(`rm -rf "${distDir}"`);
} catch (e) {}
fs.mkdirSync(chromeDir, { recursive: true });
fs.mkdirSync(firefoxDir, { recursive: true });

const folders = ['assets', 'background', 'content', 'options', 'popup'];

// Copy folders and manifest to chrome
folders.forEach(folder => {
  const src = path.join(__dirname, '../', folder);
  const dest = path.join(chromeDir, folder);
  execSync(`cp -R "${src}" "${dest}"`);
});
fs.copyFileSync(path.join(__dirname, '../manifest.json'), path.join(chromeDir, 'manifest.json'));
console.log("✔ Copied files to dist/chrome");

// Copy folders and manifest to firefox
folders.forEach(folder => {
  const src = path.join(__dirname, '../', folder);
  const dest = path.join(firefoxDir, folder);
  execSync(`cp -R "${src}" "${dest}"`);
});
fs.copyFileSync(path.join(__dirname, '../manifest.firefox.json'), path.join(firefoxDir, 'manifest.json'));
console.log("✔ Copied files to dist/firefox");

// Create zip archives if zip tool exists
try {
  // Check if zip command is available
  execSync('zip --version', { stdio: 'ignore' });
  console.log("Creating zip archives...");
  
  // Chrome zip
  execSync('zip -r ../chakri-fill-chrome.zip .', { cwd: chromeDir, stdio: 'ignore' });
  // Firefox zip
  execSync('zip -r ../chakri-fill-firefox.zip .', { cwd: firefoxDir, stdio: 'ignore' });
  
  console.log("✔ Build success! Packages saved to dist/:\n  - dist/chakri-fill-chrome.zip\n  - dist/chakri-fill-firefox.zip");
} catch (e) {
  console.log("✔ Build success! (Note: 'zip' utility not found, skipped zipping)");
}
console.log("=========================================");
