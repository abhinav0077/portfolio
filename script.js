document.addEventListener('DOMContentLoaded', function() {
  // Smooth scroll for navigation
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', function(e){
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if(target) target.scrollIntoView({behavior:'smooth', block:'start'});
    });
  });

  // Particles.js full page with repulsion
  particlesJS("particles-js", {
    "particles": {
      "number": {"value": 80},
      "color": {"value": "#ffffff"},
      "shape": {"type": "circle"},
      "opacity": {"value": 0.5},
      "size": {"value": 3},
      "line_linked": {"enable": true,"distance": 120,"color": "#ffffff","opacity":0.4,"width":1},
      "move": {"enable": true,"speed": 2,"direction":"none","random":false,"straight":false,"out_mode":"out","bounce":false}
    },
    "interactivity": {
      "detect_on": "canvas",
      "events": {
        "onhover": {"enable": true,"mode": "repulse"},
        "onclick": {"enable": true,"mode": "push"}
      },
      "modes": {
        "repulse": {"distance":200,"duration":0.4},
        "push":{"particles_nb":4}
      }
    },
    "retina_detect": true
  });
});
