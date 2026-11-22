const FALLBACK_SHADER = `
precision mediump float;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform vec3 u_color;
uniform float u_light;
void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
  float ring = abs(sin(length(uv) * 9.0 - u_time * 1.8));
  float glow = 0.035 / (ring + 0.03) * smoothstep(1.2, 0.1, length(uv));
  vec3 bg = mix(vec3(0.03, 0.03, 0.04), vec3(0.96, 0.96, 0.97), u_light);
  gl_FragColor = vec4(mix(bg, u_color, clamp(glow, 0.0, 1.0)), 1.0);
}`;

const FALLBACK_DATA = [
  {
    code: "01 / MARKUP",
    lang: "HTML5 + SVG",
    title: "Semantic Structure & Vectors",
    description: "Accessible document hierarchy paired with resolution-independent inline SVG geometry."
  },
  {
    code: "02 / STYLING",
    lang: "CSS3",
    title: "Adaptive Theme Engine",
    description: "CSS custom properties and fluid grid layouts supporting instant Dark, Light, and RGB modes."
  },
  {
    code: "03 / LOGIC",
    lang: "JavaScript ES6+",
    title: "Async Runtime Controller",
    description: "Fetches external shader and JSON assets over HTTPS with real-time pointer physics."
  },
  {
    code: "04 / GPU",
    lang: "GLSL",
    title: "Hardware Fragment Shader",
    description: "Per-pixel trigonometric wave synthesis compiled at runtime through WebGL."
  }
];

const state = {
  party: false,
  light: false,
  hue: 200,
  mouseX: 0,
  mouseY: 0,
  targetX: 0,
  targetY: 0
};

function hslToRgb(h, s, l) {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;

  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];

  return [r + m, g + m, b + m];
}

function renderCards(items) {
  const grid = document.getElementById("cardsGrid");
  grid.innerHTML = items
    .map(
      (item) => `
      <article class="card">
        <div class="card-meta">
          <span>${item.code}</span>
          <span>${item.lang}</span>
        </div>
        <h2>${item.title}</h2>
        <p>${item.description}</p>
      </article>`
    )
    .join("");
}

function initWebGL(fragmentSource) {
  const canvas = document.getElementById("glCanvas");
  const gl = canvas.getContext("webgl");
  if (!gl) return;

  const vertexSource = `
    attribute vec2 a_position;
    void main() {
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  function compile(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  const vs = compile(gl.VERTEX_SHADER, vertexSource);
  const fs = compile(gl.FRAGMENT_SHADER, fragmentSource);
  if (!vs || !fs) return;

  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW
  );

  const posLoc = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(posLoc);
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

  const uTime = gl.getUniformLocation(program, "u_time");
  const uRes = gl.getUniformLocation(program, "u_resolution");
  const uMouse = gl.getUniformLocation(program, "u_mouse");
  const uColor = gl.getUniformLocation(program, "u_color");
  const uLight = gl.getUniformLocation(program, "u_light");

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  window.addEventListener("resize", resize);
  resize();

  window.addEventListener("pointermove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    state.targetX = (e.clientX - rect.left) * dpr;
    state.targetY = (rect.height - (e.clientY - rect.top)) * dpr;
  });

  const start = performance.now();
  function frame(now) {
    const elapsed = (now - start) * 0.001;
    state.mouseX += (state.targetX - state.mouseX) * 0.08;
    state.mouseY += (state.targetY - state.mouseY) * 0.08;

    if (state.party) {
      state.hue = (state.hue + 1.2) % 360;
      document.documentElement.style.setProperty("--accent", `hsl(${state.hue}, 90%, 55%)`);
    }

    const [r, g, b] = hslToRgb(state.hue, 0.85, 0.55);
    gl.uniform1f(uTime, elapsed);
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform2f(uMouse, state.mouseX, state.mouseY);
    gl.uniform3f(uColor, r, g, b);
    gl.uniform1f(uLight, state.light ? 1.0 : 0.0);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

async function boot() {
  const status = document.getElementById("statusBar");
  const partyBtn = document.getElementById("partyToggle");
  const themeBtn = document.getElementById("themeToggle");
  const clock = document.getElementById("clock");

  setInterval(() => {
    clock.textContent = new Date().toLocaleTimeString();
  }, 1000);

  partyBtn.addEventListener("click", () => {
    state.party = !state.party;
    partyBtn.classList.toggle("active", state.party);
    if (!state.party) {
      state.hue = 200;
      document.documentElement.style.removeProperty("--accent");
    }
  });

  themeBtn.addEventListener("click", () => {
    state.light = !state.light;
    document.documentElement.setAttribute("data-theme", state.light ? "light" : "dark");
    themeBtn.textContent = state.light ? "[ DARK ]" : "[ LIGHT ]";
  });

  const [shaderRes, dataRes] = await Promise.allSettled([
    fetch("./shader.glsl").then((r) => (r.ok ? r.text() : Promise.reject())),
    fetch("./data.json").then((r) => (r.ok ? r.json() : Promise.reject()))
  ]);

  const shaderSource = shaderRes.status === "fulfilled" ? shaderRes.value : FALLBACK_SHADER;
  const cardData = dataRes.status === "fulfilled" ? dataRes.value : FALLBACK_DATA;

  renderCards(cardData);
  initWebGL(shaderSource);

  const loadedExternal = shaderRes.status === "fulfilled" && dataRes.status === "fulfilled";
  status.textContent = loadedExternal
    ? "LIVE: shader.glsl + data.json mounted via HTTPS"
    : "LOCAL MODE: inline fallbacks active (push to GitHub for live fetch)";
}

boot();
