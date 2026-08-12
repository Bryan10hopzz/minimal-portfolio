# Bryan Alan — Portfolio Website

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

A personal portfolio and résumé site for an aspiring Network Security Engineer (CCNA & Palo Alto Firewall trained) focused on routing, switching, and network security. Built with plain HTML, CSS, and JavaScript — no frameworks, no build step, no dependencies.

## Preview

**Live site (once Pages is on):** https://bryan10hopzz.github.io/minimal-portfolio/

_Add a screenshot or GIF of the site here too, if you'd like._

## Pages

| Page | File | Description |
| --- | --- | --- |
| About Me | `index.html` | Landing page with an animated intro, typewriter title, and a link to connect on LinkedIn. |
| Resume | `resume.html` | Education, technical skills, projects, experience, and certifications, plus a "Download Resume" button. |
| Certifications | `certifications.html` | Gallery of certificate images (CCNA, Networking Essentials, Cybersecurity Fundamentals). |

## Features

- 🌓 **Light/dark theme** — toggle in the header (and mobile menu), saved to `localStorage`, otherwise follows the OS `prefers-color-scheme` and updates live until a manual choice is made.
- ✨ **Animated canvas background** — layered particles that drift and twinkle, with a subtle pointer-follow effect on desktop.
- 🖱️ **Custom cursor** — a dot with a trailing ring, enabled only on precision-pointer devices.
- ⌨️ **Typewriter headline** that cycles between "Network Security" and "Network" (phrases are configurable via a `data-words` attribute).
- 📱 **Responsive mobile navigation** — a slide-in sidebar with backdrop, `Esc`-to-close, click-outside-to-close, and auto-close on viewport resize.
- ⏳ **Page loader** that fades out once the page has finished loading.
- 📄 **Downloadable résumé** as a plain-text file.
- ♿ **Accessible markup** — semantic landmarks and `aria-*` attributes throughout the nav and header.
- 🎛️ **Respects `prefers-reduced-motion`** — the background animation, custom cursor, and typewriter effect are all skipped when it's set.

## Tech Stack

- **HTML5** — semantic, accessible markup
- **CSS3** — custom properties for theming, responsive breakpoints at 900px / 720px / 560px, no framework
- **JavaScript (ES6+)** — vanilla, no libraries or dependencies
- **Fonts** — [Manrope](https://fonts.google.com/specimen/Manrope) as the primary typeface, with Cormorant Garamond and Inter used as accents, loaded via Google Fonts

## Project Structure

```
.
├── index.html               # About Me / landing page
├── resume.html               # Resume page
├── certifications.html       # Certification gallery
├── styles.css                # All styling, layout, and light/dark theme tokens
├── script.js                 # Theme toggle, background animation, cursor, nav, typewriter
├── Bryan-Alan-Resume.txt     # Plain-text résumé, linked as a download from resume.html
└── assests/                  # Images used across the site (included — see note below)
    ├── 17179.jpg
    ├── Certificate Bryan Alan .png
    ├── Networking Essentials_page-0001.jpg
    └── Cybersecurity Fundamentals_page-0001.jpg
```

> **Note:** `assests/` is spelled that way on purpose — it matches the `src` paths already in the HTML. All four images are attached as `assests.zip`; unzip it straight into the project root so the folder and filenames land exactly as shown above (the spaces in the certificate filenames matter — they're URL-encoded as `%20` in the HTML).

## Getting Started

1. **Clone the repo**
   ```bash
   git clone https://github.com/Bryan10hopzz/minimal-portfolio.git
   cd minimal-portfolio
   ```
2. **Unzip `assests.zip`** into the project root, so `assests/` sits next to `index.html`.
3. **Open it locally** — double-click `index.html`, or serve it so paths resolve exactly as they will in production:
   ```bash
   # Python
   python3 -m http.server 8000

   # Node
   npx serve .
   ```
   Then visit `http://localhost:8000`.

## Deploying to GitHub Pages

1. Commit and push everything — including the unzipped `assests/` folder — to `Bryan10hopzz/minimal-portfolio`.
2. On GitHub, go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, then select `main` and the `/ (root)` folder → **Save**.
4. After a minute or two, it'll be live at:
   **https://bryan10hopzz.github.io/minimal-portfolio/**

## Customizing

- **Personal info** — update the name, `mailto:` email, and LinkedIn URL in `index.html` (the same email link is repeated in the header and mobile sidebar on all three pages).
- **Resume content** — edit `resume.html`; keep `Bryan-Alan-Resume.txt` in sync since it's offered separately as the downloadable file.
- **Certificates** — swap images in `assests/` and update the matching `<img>` tags in `certifications.html`.
- **Theme colors** — adjust the CSS custom properties in the `:root` and `html.dark-mode` blocks near the top of `styles.css`.
- **Typewriter phrases** — edit the pipe-separated `data-words` attribute on `.title-typewriter` in `index.html`.

## Contact

- **Email:** [bryanofficial2004@gmail.com](mailto:bryanofficial2004@gmail.com)
- **LinkedIn:** [linkedin.com/in/bryan-alan](https://www.linkedin.com/in/bryan-alan/)

## License

No license is currently attached to this project. Add one (e.g. [MIT](https://choosealicense.com/licenses/mit/)) if you'd like others to be able to reuse the code.
