# chinoll's homepage and blog

Personal homepage: https://blog.chinoll.org/

Programming notes: https://blog.chinoll.org/blog/

The homepage introduces chinoll (fufuning), with selected AI and machine-learning
projects. The existing Hexo/NexT blog remains available at `/blog/`; article,
archive, category, and tag URLs are preserved.

## Edit and preview

Use Node.js 22:

```sh
cd blog
npm ci
npm run build
npm run server
```

- `blog/source/index.html`: introduction, project descriptions, and contact details.
- `blog/source/homepage/site.css`: homepage layout, responsive rules, and themes.
- `blog/source/homepage/site.js`: accessible theme switch with a saved preference.
- `blog/source/_posts/`: existing and new blog articles.
- `blog/_config.yml`: site URL and blog index path.
- `blog/scripts/version-homepage-assets.js`: gives styles, scripts, and the favicon
  content-based filenames and updates generated HTML references automatically.
  Returning visitors therefore load the matching assets after a design update.

## Publication

The source is kept in this repository; generated static files are published to
`chinoll/chinoll.github.io`. The existing workflow is preserved and uses the
`HEXO_DEPLOY_PRI` repository secret. To generate the complete site locally, run
`npm run build` from `blog/`. Publish the contents of `blog/public/` to the
publishing repository, keeping its `CNAME` and Git history.

## Design and assets

The homepage adapts [Strata by HTML5 UP](https://html5up.net/strata), downloaded
from the [zce/html5up template mirror](https://github.com/zce/html5up/tree/master/strata).
The original stylesheet and CC BY 3.0 license are in
`blog/source/homepage/vendor/`. The layout, typography, project entries, theme
switch, and responsive behavior are customized for this site. Template
attribution is also visible in the page footer.

The visual theme pairs Chino Kafuu and Tippy illustrations with ice-blue gingham,
scalloped edges, rounded typography, and a cafe illustration for dark mode.
Nunito Variable and Pacifico fonts are self-hosted from Fontsource, with their
SIL Open Font Licenses alongside the font files. Illustration source links are
in the homepage footer and `blog/source/homepage/images/SOURCES.md`. Artwork is
stored locally as optimized WebP images, separately from the template license.
