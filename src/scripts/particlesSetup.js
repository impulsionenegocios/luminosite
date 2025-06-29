export const defaultParticlesConfig = {
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 800,
      },
    },
    color: {
      value: '#c9a874',
    },
    shape: {
      type: 'circle',
    },
    opacity: {
      value: 0.1,
      random: true,
    },
    size: {
      value: 5,
      random: true,
    },
    line_linked: {
      enable: true,
      distance: 150,
      color: '#c9a874',
      opacity: 0.05,
      width: 1,
    },
    move: {
      enable: true,
      speed: 2,
      direction: 'none',
      random: true,
      straight: false,
      out_mode: 'out',
      bounce: false,
    },
  },
  interactivity: {
    detect_on: 'canvas',
    events: {
      onhover: {
        enable: true,
        mode: 'grab',
      },
      onclick: {
        enable: true,
        mode: 'push',
      },
      resize: true,
    },
  },
  retina_detect: true,
};

export function setupParticles(containerId, config) {
  if (typeof window !== 'undefined') {
    // Assuming particlesJS is globally available or imported elsewhere
    // If using tsparticles, it would be: tsparticles.load(containerId, config);
    // For now, keeping it as particlesJS as per original code structure
    window.particlesJS(containerId, config);
  }
}
