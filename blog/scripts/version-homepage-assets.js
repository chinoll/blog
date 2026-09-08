'use strict';

const { createHash } = require('crypto');

// Keep assets in their original directories so CSS-relative font/image URLs work.
const assets = [
  'homepage/vendor/strata.css',
  'homepage/site.css',
  'homepage/blog.css',
  'homepage/site.js',
  'homepage/favicon.svg'
];

function readRoute(route, name) {
  return new Promise((resolve, reject) => {
    const stream = route.get(name);
    if (!stream) return reject(new Error('Missing generated asset: ' + name));
    const chunks = [];
    stream.on('data', chunk => chunks.push(Buffer.from(chunk)));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
}

hexo.extend.filter.register('after_generate', async function () {
  const route = this.route;
  const replacements = await Promise.all(assets.map(async name => {
    const data = await readRoute(route, name);
    const digest = createHash('sha256').update(data).digest('hex').slice(0, 12);
    const versioned = name.replace(/\.(css|js|svg)$/, '.' + digest + '.$1');
    route.set(versioned, data);
    return ['/' + name, '/' + versioned];
  }));

  await Promise.all(route.list().filter(name => name.endsWith('.html')).map(async name => {
    const original = (await readRoute(route, name)).toString('utf8');
    let html = original;
    for (const [source, versioned] of replacements) {
      html = html.split(source).join(versioned);
    }
    if (html !== original) route.set(name, html);
  }));
});
