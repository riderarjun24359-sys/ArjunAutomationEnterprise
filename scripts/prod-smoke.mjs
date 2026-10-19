import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const baseURL = 'https://www.arjunautomations.com';

async function checkPage(url, name, checks = []) {
    // Register listeners BEFORE navigation so load-time errors are captured.
    const errors = [];
    const onPageError = (err) => errors.push(`pageerror: ${err.message}`);
    const onConsole = (msg) => { if (msg.type() === 'error') errors.push(`console: ${msg.text()}`); };
    page.on('pageerror', onPageError);
    page.on('console', onConsole);

    console.log(`\n=== ${name} (${url}) ===`);
    try {
        const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
        console.log(`Status: ${response.status()}`);

        await page.waitForTimeout(1000);

        if (errors.length > 0) {
            console.log('Console errors:', errors);
        } else {
            console.log('No console errors');
        }

        for (const { name: checkName, check } of checks) {
            const result = await check(page);
            console.log(`${result.pass ? '✅' : '❌'} ${checkName}: ${result.detail}`);
        }
    } catch (e) {
        console.log(`ERROR: ${e.message}`);
    }
}

async function runChecks() {
    await checkPage(baseURL, 'Homepage', [
        { name: 'H1 visible', check: async (p) => ({ pass: await p.locator('h1').first().isVisible(), detail: 'Hero headline visible' }) },
        { name: 'CTA link', check: async (p) => ({ pass: (await p.locator('a[href="/contact"]:has-text("Book Free Consultation")').count()) > 0 && (await p.getByRole('link', { name: 'Book Free Consultation' }).first().isVisible()).valueOf(), detail: 'Primary CTA present' }) },
        { name: 'Header present', check: async (p) => ({ pass: await p.locator('header').first().isVisible(), detail: 'Marketing header' }) },
        { name: 'Footer present', check: async (p) => ({ pass: await p.locator('footer').first().isVisible(), detail: 'Marketing footer' }) },
        { name: 'Orange accent', check: async (p) => ({ pass: (await p.locator('[class*="premium-accent"], [style*="ff6a00"], [style*="rgb(255, 106, 0)"]').first().count()) > 0, detail: 'Brand color present' }) },
    ]);

    await checkPage(`${baseURL}/services`, 'Services Index', [
        { name: 'Service cards', check: async (p) => ({ pass: (await p.locator('[href^="/services/"]').count()) > 0, detail: 'Service links present' }) },
        { name: 'H1', check: async (p) => ({ pass: await p.locator('h1').first().isVisible(), detail: 'Page title' }) },
    ]);

    await checkPage(`${baseURL}/services/platform-implementation`, 'Service Detail', [
        { name: 'H1', check: async (p) => ({ pass: await p.locator('h1').first().isVisible(), detail: 'Service title' }) },
        { name: 'Brand accent', check: async (p) => ({ pass: (await p.locator('[style*="ff6a00"], [style*="rgb(255, 106, 0)"], [class*="dos-brand"], [class*="premium-accent"]').first().count()) > 0, detail: 'Brand bullets' }) },
        { name: 'CTA section', check: async (p) => ({ pass: await p.locator('a[href="/contact"]:has-text("Book Consultation")').first().isVisible(), detail: 'Service CTA' }) },
    ]);

    await checkPage(`${baseURL}/contact`, 'Contact', [
        { name: 'Form visible', check: async (p) => ({ pass: await p.locator('form[aria-label="Contact form"]').first().isVisible(), detail: 'Contact form' }) },
        { name: 'Submit button orange', check: async (p) => ({ pass: (await p.locator('button[type="submit"][class*="dos-brand-primary"]').first().count()) > 0, detail: 'Brand submit button' }) },
        { name: 'Consent checkbox', check: async (p) => ({ pass: await p.locator('input[type="checkbox"][name="consent"]').first().isVisible(), detail: 'Consent field' }) },
    ]);

    await checkPage(`${baseURL}/pricing`, 'Pricing', [
        { name: 'H1', check: async (p) => ({ pass: await p.locator('h1').first().isVisible(), detail: 'Pricing title' }) },
    ]);

    await checkPage(`${baseURL}/api/ops/health`, 'Health Endpoint', [
        { name: 'JSON response', check: async (p) => ({ pass: (await p.textContent('body')).includes('"status"'), detail: 'Health JSON' }) },
    ]);

    await checkPage(`${baseURL}/api/ops/live`, 'Liveness Endpoint', [
        { name: 'OK response', check: async (p) => ({ pass: (await p.textContent('body')).includes('alive') || (await p.textContent('body')).includes('ok'), detail: 'Liveness OK' }) },
    ]);

    await checkPage(`${baseURL}/api/ops/ready`, 'Readiness Endpoint', [
        { name: 'JSON response', check: async (p) => ({ pass: (await p.textContent('body')).includes('ready'), detail: 'Readiness JSON' }) },
    ]);

    await browser.close();
    console.log('\n✅ Production smoke tests complete');
}

await runChecks();