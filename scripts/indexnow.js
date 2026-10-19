/**
 * Avisa Bing, Yandex e demais buscadores IndexNow que as páginas do site mudaram.
 * Uso (depois do deploy): npm run indexnow
 * Requer `indexNowKey` em src/config/site.config.js.
 */
import siteConfig from '../src/config/site.config.js';
import { routes } from '../src/routes.js';

const key = siteConfig.indexNowKey;
if (!key) {
  console.error('Defina indexNowKey em src/config/site.config.js');
  process.exit(1);
}
const host = new URL(siteConfig.siteUrl).host;
const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host, key, keyLocation: `${siteConfig.siteUrl}/${key}.txt`, urlList: routes.map((r) => siteConfig.siteUrl + r) }),
});
console.log(`IndexNow: HTTP ${res.status} (${routes.length} URLs)`);
