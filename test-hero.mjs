import { chromium } from 'playwright';
import fs from 'fs';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  console.log('Navigating to site...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  
  // Wait a bit for animations
  await page.waitForTimeout(3000);

  // Measure the hero section
  const heroInfo = await page.evaluate(() => {
    const hero = document.querySelector('.hero');
    if (!hero) return 'Hero section not found';
    
    const rect = hero.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(hero);
    const video = hero.querySelector('video');
    
    return {
      heroRect: { width: rect.width, height: rect.height, top: rect.top },
      heroDisplay: computedStyle.display,
      heroVisibility: computedStyle.visibility,
      heroOpacity: computedStyle.opacity,
      videoDetails: video ? {
         src: video.src, 
         rect: video.getBoundingClientRect(), 
         display: window.getComputedStyle(video).display
      } : 'No video found'
    };
  });

  console.log('Hero Details:', JSON.stringify(heroInfo, null, 2));

  // Take a full page screenshot
  await page.screenshot({ path: 'hero-screenshot.png', fullPage: true });
  console.log('Screenshot saved to hero-screenshot.png');

  await browser.close();
})();
