# MLT001

> **An experimental test project coded 100% by AI.**

**MLT001** is a zero-dependency, multi-language static web application built entirely through AI-assisted code generation. Designed to run natively on **GitHub Pages**, it combines six web technologies into an interactive digital studio portfolio (**Luminox.fx**) featuring real-time GPU shaders, dynamic theme engines, and a client project brief builder.

---

## Languages & Technologies Used

This repository intentionally separates logic, styling, shaders, vectors, and data across multiple file formats so every layer operates modularly in the browser:

* **HTML5 (`index.html`):** Semantic document structure, accessibility attributes, and interactive controls.
* **SVG (`index.html`):** Resolution-independent inline vector geometry for brand emblems.
* **CSS3 (`style.css`):** Custom CSS variables, 1px hairline grids, responsive layouts, and instant **Dark**, **Light**, and **Party (RGB)** theme modes.
* **GLSL (`shader.glsl`):** Hardware-accelerated WebGL fragment shader rendering interactive light waves and void particles.
* **JavaScript ES6+ (`app.js`):** Zero-dependency runtime controller managing WebGL compilation, pointer physics, clipboard actions, and dynamic `mailto:` brief generation.
* **JSON (`portfolio.json`):** Structured data store powering service divisions, pricing tiers, and customizable brief templates.

---

## Project Structure

```text
MLT001/
├── index.html       # HTML5 semantic layout + inline SVG vector emblems
├── style.css        # CSS3 themes, responsive grids, and RGB accent sync
├── shader.glsl      # GLSL GPU fragment shader for interactive hero visuals
├── portfolio.json   # JSON database for divisions, tiers, and brief templates
├── app.js           # JavaScript ES6+ WebGL engine and UI state controller
└── README.md        # Project documentation
```

---

## Key Features

* **Interactive WebGL Hero:** Real-time GLSL shader reacting smoothly to mouse and touch coordinates.
* **Multi-Theme Engine:**
  * `[ LIGHT ] / [ DARK ]` — Switches between an obsidian dark mode and a clean editorial light theme.
  * `[ PARTY ]` — Activates a continuous HSL color-cycle across the GPU shader, UI borders, and footer watermark.
* **Dynamic Arsenal & Pricing:** Renders service divisions (**Motion & Animation**, **Web Architecture**, **Market & Financial Tech**, and **Audio & AI Synthesis**) directly from `portfolio.json`.
* **Live Project Brief Builder:** Auto-populates package details into an editable brief template with one-click clipboard copy and direct email launch.

---

## Deployment on GitHub Pages

1. Push all project files to the `main` branch of your GitHub repository.
2. Open the repository **Settings** tab and navigate to **Pages** in the left sidebar.
3. Under **Build and deployment → Source**, select **Deploy from a branch**.
4. Choose **`main`** and **`/ (root)`**, then click **Save**.
5. Once the deployment workflow finishes, your site will be live at `https://<your-username>.github.io/MLT001/`.

---

## Disclaimer

This repository (**MLT001**) is a test project created to explore end-to-end AI code generation across frontend markup, styling, client-side scripting, data structuring, and GPU shader programming.