# Math Study Resources

A static, multi-page math resource website: 23 working calculators, 6 study guides, 3 cheat sheets, a searchable calculator directory, light and dark mode. Plain HTML, CSS and JavaScript only. No PHP, Node, database, build step or API keys.

Live address after deployment: https://fiveguysmenu6-stack.github.io/math-study-resources-Copy/

## Deploy on GitHub Pages (exact steps)

Repository: https://github.com/fiveguysmenu6-stack/math-study-resources-Copy/

1. Unzip `math-study-resources.zip`. Open the folder so you can see `index.html`, `calculators/`, `assets/` and the rest directly inside it (not inside another folder).
2. Open the repository on GitHub. Click **Add file → Upload files**.
3. Drag **the contents** of the unzipped folder into the upload area (select everything inside it: `index.html`, `404.html`, `.nojekyll`, `robots.txt`, `sitemap.xml`, `README.md`, and the folders `assets`, `calculators`, `css`, `embed`, `img`, `js`, `katex`, `resources`, `about`).
   - `.nojekyll` is a hidden file. If your file manager hides it, enable "show hidden files", or create it in GitHub with **Add file → Create new file**, name `.nojekyll`, leave it empty, commit.
   - GitHub's browser upload accepts up to 100 files at a time. This project has more, so upload in 2 or 3 batches (for example `assets`, `katex` and `embed` first, then the rest), or use Git:
     ```
     git clone https://github.com/fiveguysmenu6-stack/math-study-resources-Copy.git
     cd math-study-resources-Copy
     # copy the unzipped files into this folder, then:
     git add -A
     git commit -m "Add math resource site"
     git push
     ```
4. Commit to the **main** branch (the branch you will publish).
5. Go to **Settings → Pages**. Under **Build and deployment**, set **Source = Deploy from a branch**, **Branch = main**, **Folder = / (root)**. Click **Save**.
6. Wait 1 to 3 minutes. The page shows "Your site is live at https://fiveguysmenu6-stack.github.io/math-study-resources-Copy/".
7. Open the address. Check the home page, `calculators/`, `calculators/scientific-calculator/` and one guide.
8. Optional: submit `https://fiveguysmenu6-stack.github.io/math-study-resources-Copy/sitemap.xml` in Google Search Console (add the URL prefix property first).

If you later change the repository name or use a custom domain, search and replace `https://fiveguysmenu6-stack.github.io/math-study-resources-Copy/` in every `.html` file, `sitemap.xml` and `robots.txt` (canonical, Open Graph and structured-data URLs use it). All page links and assets are relative, so they keep working under any folder name.

## Folder structure

```
index.html                      Home (hero + quick calculator, categories, popular tools, guides)
404.html                        Not-found page (absolute URLs so it works from any depth)
about/index.html
calculators/index.html          Searchable, filterable directory
calculators/<name>/index.html   23 calculator pages (intro, tool, how to use, method, example, FAQ, related)
resources/index.html            Guides and cheat sheets index
resources/<name>/index.html     6 guides + 3 cheat sheets
embed/<name>.html               The calculator engines, loaded in an iframe by each calculator page (noindex)
assets/                         Calculator JS bundles, CSS and the Lora font (from the Mathvelo site)
katex/                          KaTeX (math typesetting) used by the calculators
css/site.css                    Site styles (light and dark tokens)
js/site.js                      Theme toggle, menu, directory search, iframe auto-height, quick calculator
js/calc.js                      Expression engine (own parser, no eval) for the quick calculator and Basic calculator
js/basic.js                     Basic calculator logic
img/favicon.svg, img/og.png     Icon and social preview image
sitemap.xml, robots.txt, .nojekyll
```

## How the calculators work

- **Scientific calculator**: the Casio fx-991 style emulator from the Mathvelo site (keypad, SHIFT/ALPHA, natural fractions, history, graph, solver, equation, matrix, vector, statistics, complex, base-N, table modes). The AI endpoint is switched off, so the side-panel solver is the local rule-based one. AI-only buttons and tabs are hidden.
- **Basic calculator**: new, native JavaScript using `js/calc.js`. Brackets, percent, sign change, memory keys, history saved in local storage, keyboard input.
- **Other 21 calculators**: the original Mathvelo calculators, stripped of the AI features, loaded as embedded pages. Each page grows to its content height automatically.
- Hero quick calculator on the home page uses `js/calc.js`.

## What was tested (Playwright / Chromium, served under `/math-study-resources-Copy/` to mimic GitHub Pages)

- All 37 pages and 22 embeds load at 1200px and 380px wide with no console errors, no failed requests, no horizontal overflow, exactly one `h1` each. (The only external request is the scientific calculator's Google Fonts stylesheet.)
- Every internal link on every page resolves to an existing file.
- Scientific calculator via keyboard and keypad: `7*8+2^2`=60, sin(30)=1/2, 1/3+1/6=1/2, √16=4, log(1000)=3, ln(e)=1, 5!=120, 2^10=1024, (1+2)*(3+4)=21, 2π, cos(60)=1/2, tan(45)=1, 10/4=5/2, asin(1)=90, e^2, cos(90)=0, 7×8 by keypad, Solve x²−5x+6=0 in the solver panel.
- Basic calculator: precedence, brackets, decimals, 0.1+0.2=0.3, divide by zero error, percent, continuing from a result, sign change, delete, memory keys (M+, M−, MR, MC), single decimal point, auto-closing brackets, keyboard input, history list, reuse, persistence and clear.
- Hero quick calculator: brackets, trig, powers, roots, factorial, percent, π, radians mode, error message.
- Each of the 21 embedded calculators was given a sample problem and the answer was checked (for example 25% of 80, 3(x+2)=x+14 gives x=4, x²−5x+6 gives 2 and 3, factoring x²+5x+6, 10P4=5040 and 10C4=210, ∫x² dx, matrix product 19 22 / 43 50, std dev of 2,4,4,4,5,5,7,9, z-score of 130 = 2, unit circle 225°).
- Directory search, category filter, `?q=` and `#category` links, empty-result message; theme toggle and persistence; mobile menu.
- No `.php`, no keys, no signing files in the project.

## Limitations (please read)

- Tested in Chromium via Playwright only. It was not tested on real iPhones, Android phones, Safari or Firefox.
- The AI solver, photo scanner and other server-backed features of the original Mathvelo site are not included (GitHub Pages cannot run them). The scientific calculator's solver is rule-based and does not solve everything (for example complex-number expressions).
- The scientific calculator loads fonts from Google Fonts. Offline, it falls back to system fonts.
- Dark mode of the 21 embedded calculators uses a colour-inversion filter, so a few colours differ slightly from light mode. The scientific calculator keeps its own look in both modes.
- Links to mathvelo.com are normal contextual links. They do not guarantee any change in search ranking.
- Structured data (WebApplication, BreadcrumbList, FAQPage, Article, WebSite, CollectionPage) only describes content that is visible on each page. There are no ratings or reviews.
- The scientific calculator iframe has a fixed layout height (it does not follow the browser window height) so the page does not jump while it loads.
