import { chromium } from 'playwright';
import fs from 'fs';

(async () => {
  const browser = await chromium.launch({ headless: true });
  
  const viewports = [
    { name: 'desktop', width: 1440, height: 900 },
    { name: 'mobile', width: 375, height: 812 }
  ];

  for (const vp of viewports) {
    console.log(`Testing viewport: ${vp.name} (${vp.width}x${vp.height})`);
    const context = await browser.newContext({
      viewport: vp
    });
    const page = await context.newPage();

    console.log('Navigating to site...');
    try {
      await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 60000 });
      
      console.log('Waiting for .hero selector...');
      await page.waitForSelector('.hero', { timeout: 30000 });
      console.log('.hero selector found.');
      
      // Wait longer for animations and preloader (has a 6s safety timer)
      await page.waitForTimeout(8000);

      // Measure the hero section and text
      const heroInfo = await page.evaluate(() => {
        const hero = document.querySelector('.hero');
        const textContainer = document.querySelector('.hero-text');
        const phrase1 = document.querySelector('.phrase-1');
        const phrase2 = document.querySelector('.phrase-2');
        
        if (!hero) return { error: 'Hero section not found in evaluation' };
        
        const heroRect = hero.getBoundingClientRect();
        const textRect = textContainer ? textContainer.getBoundingClientRect() : null;
        const p1Rect = phrase1 ? phrase1.getBoundingClientRect() : null;
        const p2Rect = phrase2 ? phrase2.getBoundingClientRect() : null;
        
        return {
          heroHeight: heroRect.height,
          textPosition: textRect ? {
            top: textRect.top,
            topPercent: (textRect.top / (heroRect.height || 1)) * 100
          } : 'Text container not found',
          phrase1: p1Rect ? { fontSize: window.getComputedStyle(phrase1.querySelector('h1')).fontSize } : null,
          phrase2: p2Rect ? { 
            fontSize: window.getComputedStyle(phrase2.querySelector('h2')).fontSize,
            top: p2Rect.top,
            topPercent: (p2Rect.top / (heroRect.height || 1)) * 100
          } : null
        };
      });

      console.log(`Hero Details (${vp.name}):`, JSON.stringify(heroInfo, null, 2));

      // Take a screenshot
      const screenshotPath = `hero-${vp.name}.png`;
      await page.screenshot({ path: screenshotPath });
      console.log(`Screenshot saved to ${screenshotPath}`);

    } catch (err) {
      console.error(`Error with ${vp.name}:`, err.message);
    }
    await context.close();
  }

  await browser.close();
})();
