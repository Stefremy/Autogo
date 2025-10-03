(async () => {
  const puppeteer = require('puppeteer');
  const urlBase = process.env.BASE_URL || 'http://localhost:3001';
  console.log('BASE_URL', urlBase);

  const browser = await puppeteer.launch({ args: ['--no-sandbox','--disable-setuid-sandbox'], headless: true });
  const page = await browser.newPage();
  page.on('console', (msg) => console.log('PAGE:', msg.text()));

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  try {
    await page.goto(urlBase + '/viaturas', { waitUntil: 'networkidle2' });
    console.log('Loaded /viaturas');

    // Set price filters (use aria-labels present in the UI)
    const minPriceVal = '1500';
    const maxPriceVal = '8000';
    // Replace direct value injection with keyboard typing to ensure React sees changes
    const setInput = async (selector, value) => {
      const el = await page.$(selector);
      if (!el) return false;
      try {
        await el.focus();
        // clear existing value
        await page.keyboard.down('Control');
        await page.keyboard.press('KeyA');
        await page.keyboard.up('Control');
        await page.keyboard.press('Backspace');
        await page.keyboard.type(String(value));
        // blur to trigger change handlers
        await el.evaluate((e) => e.blur());
        return true;
      } catch (e) {
        return false;
      }
    };

    const ensureInputValue = async (selector, value, attempts = 3) => {
      for (let i = 0; i < attempts; i++) {
        const got = await page.$eval(selector, el => (el && (el.value || ''))).catch(() => null);
        if (got === String(value)) return true;
        const ok = await setInput(selector, value).catch(() => false);
        console.log('ensureInputValue try', i, 'selector', selector, 'setOk', ok, 'current', got);
        await delay(300);
      }
      const final = await page.$eval(selector, el => (el && (el.value || ''))).catch(() => null);
      console.log('ensureInputValue final', selector, final);
      return final === String(value);
    };

    // Try both aria-label and placeholder fallbacks, ensure values applied
    await ensureInputValue('input[aria-label="Preço mínimo"]', minPriceVal).catch(()=>{});
    await ensureInputValue('input[aria-label="Preço máximo"]', maxPriceVal).catch(()=>{});
    await ensureInputValue('input[placeholder="Min €"]', minPriceVal).catch(()=>{});
    await ensureInputValue('input[placeholder="Max €"]', maxPriceVal).catch(()=>{});
    console.log('Set/verified min/max price inputs to', minPriceVal, maxPriceVal);

    // Click Filtrar button (search for common texts)
    const clickedFilter = await page.$$eval('button', (btns) => {
      const texts = ['Filtrar','Buscar','Filter','Pesquisar','Search'];
      for (const b of btns) {
        try {
          const txt = (b.textContent || '').trim();
          for (const t of texts) if (txt.includes(t)) { if (typeof b.click === 'function') b.click(); return true; }
        } catch (e) {}
      }
      return false;
    }).catch(() => false);

    if (clickedFilter) {
      console.log('Clicked filter button');
      await delay(800);
      // allow the UI to apply filters
      await page.waitForTimeout?.(500).catch(()=>{});
    } else {
      console.log('Filter button not found/clicked');
    }

    // Navigate to page 2 if available (click next)
    const clickedNext = await page.$$eval('button', (btns) => {
      for (const b of btns) {
        try {
          const txt = (b.textContent || '').trim();
          if (txt.includes('Seguinte') || txt.includes('Next') || txt.includes('→') || txt.includes('»')) {
            if (typeof b.click === 'function') b.click();
            return true;
          }
        } catch (e) {}
      }
      return false;
    }).catch(() => false);

    if (clickedNext) {
      console.log('Clicked next');
      await delay(1000);
    } else {
      console.log('No next button clicked');
    }

    // Click the first car link (robust: retry after clearing filters and fallback to a fixed car)
    let carExists = await page.$('a[href^="/cars/"]');
    if (!carExists) {
      console.log('No car link found after filtering. Attempting to clear filters and retry.');
      // try to clear min/max inputs using the clear button if present, or manually empty inputs
      try {
        await page.$$eval('button', (btns) => {
          for (const b of btns) {
            const txt = (b.textContent || '').trim();
            if (txt.includes('Limpar') || txt.includes('Limpar Filtros') || txt.includes('Clear')) {
              if (typeof b.click === 'function') b.click();
              return true;
            }
          }
          return false;
        }).catch(() => null);
        // small delay to allow UI to reset
        await delay(600);
      } catch (e) {}

      // try to find a car again
      carExists = await page.$('a[href^="/cars/"]');
    }

    if (!carExists) {
      console.log('Still no car link found — falling back to opening a known car from dataset.');
      // Fallback: read first slug from data/cars.json (relative to script file)
      let fallbackSlug = null;
      try {
        const cars = require('../../data/cars.json');
        const c = (Array.isArray(cars) && cars.find(x => x && (x.slug || x.id))) || null;
        if (c) fallbackSlug = c.slug || c.id;
      } catch (e) {
        // ignore
      }
      if (!fallbackSlug) {
        console.log('No fallback slug available; aborting test.');
        await browser.close();
        process.exit(1);
      }

      const detailUrl = urlBase + '/cars/' + fallbackSlug;
      console.log('Navigating to fallback car:', detailUrl);
      try {
        // Use DOMContentLoaded + longer timeout to avoid networkidle hangs on dev server
        await page.goto(detailUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
        console.log('Opened fallback car detail:', page.url());
      } catch (err) {
        console.warn('Fallback navigation warning, proceeding anyway:', err && err.message ? err.message : err);
      }
    } else {
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle2' }),
        page.click('a[href^="/cars/"]')
      ]).catch(() => {});
      console.log('Opened first car detail:', page.url());
    }

    // Go back
    await page.goBack({ waitUntil: 'networkidle2' }).catch(() => {});
    console.log('Went back to:', page.url());

    // Wait for pagination label to appear and read it
    try {
      await page.waitForSelector('nav .px-3.py-1', { timeout: 2000 });
    } catch (e) {
      // fallback: try read nav text later
    }

    // Report query string and persisted filters from localStorage
    // Use page.evaluate to read window.location.href because Next.js shallow router.replace can leave puppeteer.page.url() out-of-sync
    await delay(200);
    const currentUrl = await page.evaluate(() => window.location.href).catch(() => page.url());
    const query = (() => {
      try { return new URL(currentUrl).searchParams.toString(); } catch (e) { return '' }
    })();
    console.log('Query after back (from window.location):', query, 'full:', currentUrl);

    const stored = await page.evaluate(() => {
      try {
        return localStorage.getItem('autogo_filters_v1');
      } catch (e) {
        return null;
      }
    }).catch(() => null);
    console.log('localStorage autogo_filters_v1:', stored);

    // Assert presence of min/max in query and storage
    const hasMinInQuery = query.includes('minPrice=' + encodeURIComponent(minPriceVal));
    const hasMaxInQuery = query.includes('maxPrice=' + encodeURIComponent(maxPriceVal));
    const hasPageInQuery = query.includes('page=2');

    console.log('hasMinInQuery:', hasMinInQuery, 'hasMaxInQuery:', hasMaxInQuery, 'hasPageInQuery:', hasPageInQuery);

    let storageObj = null;
    try {
      storageObj = stored ? JSON.parse(stored) : null;
    } catch (e) { storageObj = null; }
    console.log('storageObj:', storageObj);

    const storageOk = storageObj && storageObj.minPrice === minPriceVal && storageObj.maxPrice === maxPriceVal;
    console.log('storageOk:', !!storageOk);

    // Try to read page label text (pagination control)
    const pageLabel = await page.$$eval('nav .px-3.py-1, nav .px-3, nav div', els => {
      for (const el of els) {
        const txt = (el.textContent || '').trim();
        if (/Página\s*\d+/i.test(txt) || /\d+\s*\/\s*\d+/.test(txt)) return txt;
      }
      return null;
    }).catch(() => null);
    console.log('Page label text:', pageLabel);

    // Also check input values on the page for min/max filters (read common selectors)
    const readInputValue = async (selectors) => {
      for (const sel of selectors) {
        const v = await page.$eval(sel, el => (el && (el.value || ''))).catch(() => null);
        if (v !== null) return v;
      }
      return null;
    };

    const inputMin = await readInputValue(['input[aria-label="Preço mínimo"]', 'input[placeholder="Min €"]', 'input[name="minPrice"]']);
    const inputMax = await readInputValue(['input[aria-label="Preço máximo"]', 'input[placeholder="Max €"]', 'input[name="maxPrice"]']);
    console.log('Input values after back:', { inputMin, inputMax });

    await browser.close();

    // Final assertion result printed to stdout for CI
    const inputsMatch = inputMin === minPriceVal && inputMax === maxPriceVal;
    const anyQueryMatch = hasMinInQuery && hasMaxInQuery;
    if (storageOk && (inputsMatch || anyQueryMatch)) {
      console.log('TEST PASS: filters persisted (storage and UI or URL).');
      process.exit(0);
    } else {
      console.error('TEST FAIL: persistence missing', { hasMinInQuery, hasMaxInQuery, hasPageInQuery, storageOk, inputsMatch, inputMin, inputMax });
      process.exit(3);
    }
  } catch (e) {
    console.error('TEST ERROR', e && e.stack ? e.stack : e);
    await browser.close();
    process.exit(2);
  }
})();
