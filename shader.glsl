precision mediump float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform vec3 u_color;
uniform float u_light;

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
  vec2 mouse = (u_mouse - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);

  float d = length(uv - mouse * 0.35);
  float wave = sin(uv.x * 6.0 + u_time * 1.4) * cos(uv.y * 6.0 - u_time * 1.1);
  float ring = abs(sin(length(uv) * 9.0 - u_time * 1.8 + wave * 0.8));

  float glow = 0.032 / (ring + 0.03) * smoothstep(1.25, 0.1, length(uv));
  float cursorGlow = 0.04 / (d + 0.08);
  float intensity = clamp(glow + cursorGlow * 0.55, 0.0, 1.4);

  vec3 bg = mix(vec3(0.03, 0.03, 0.04), vec3(0.96, 0.96, 0.97), u_light);
  vec3 finalColor = mix(bg, u_color, clamp(intensity * 0.85, 0.0, 1.0));

  gl_FragColor = vec4(finalColor, 1.0);
}
