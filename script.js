


if (window.location.hash) {
  
  window.history.replaceState(null, null, window.location.pathname + window.location.search);
}


try { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; } catch (e) {}

document.addEventListener('DOMContentLoaded', function () {
  
  try { window.scrollTo(0,0); } catch (e) {}
  
  window.addEventListener('load', function() { try { window.scrollTo(0,0); } catch(e) {} });

  
  (function setupHamburgerMenu(){
    const hamburgerToggle = document.getElementById('hamburgerToggle');
    const mobileNav = document.getElementById('mobileNav');
    const mobileNavLinks = mobileNav ? mobileNav.querySelectorAll('.mobile-nav-link') : [];

    if (!hamburgerToggle || !mobileNav) return;

    
    const closeMenu = () => {
      hamburgerToggle.classList.remove('active');
      mobileNav.classList.remove('active');
      
      document.body.style.cursor = 'auto';
      document.body.classList.remove('menu-cross', 'over-header');
    };

    
    hamburgerToggle.addEventListener('click', function() {
      hamburgerToggle.classList.toggle('active');
      mobileNav.classList.toggle('active');
      
      document.body.style.cursor = '';
      document.body.classList.remove('menu-cross', 'over-header');
    });

    
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
        closeMenu();
      }
    });

    
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.hamburger-header') && mobileNav.classList.contains('active')) {
        closeMenu();
      }
    });

    
    window.addEventListener('scroll', function() {
      if (mobileNav.classList.contains('active')) {
        closeMenu();
      }
    }, { passive: true });

  })();

  /* Theme toggle behavior
     - Reads stored theme from localStorage (`site-theme`) and applies it by
       setting `data-theme` on the root `<html>` element.
     - Toggle stores the selection and updates `aria-pressed` for accessibility.
  */
  (function setupThemeToggle(){
    const KEY = 'site-theme';
    const themeToggle = document.getElementById('themeToggle');

    function applyTheme(theme) {
      try {
        if (theme === 'dark') document.documentElement.setAttribute('data-theme','dark');
        else document.documentElement.removeAttribute('data-theme');
        if (themeToggle) {
          const pressed = theme === 'dark' ? 'true' : 'false';
          themeToggle.setAttribute('aria-pressed', pressed);
        }
      } catch (e) { }
    }

    function getPreferred() {
      try {
        const stored = localStorage.getItem(KEY);
        if (stored === 'dark' || stored === 'light') return stored;
      } catch (e) {}
      try {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      } catch (e) {}
      return 'light';
    }

    const initial = getPreferred();
    applyTheme(initial === 'dark' ? 'dark' : 'light');

    if (!themeToggle) return;

    themeToggle.addEventListener('click', function () {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const next = isDark ? 'light' : 'dark';
      try { localStorage.setItem(KEY, next); } catch (e) {}
      applyTheme(next);
    });

    // allow keyboard activation via Space/Enter
    themeToggle.addEventListener('keydown', function (ev) {
      if (ev.key === ' ' || ev.key === 'Enter') { ev.preventDefault(); themeToggle.click(); }
    });
  })();

  
  (function setupFormHandler(){
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    const submitBtn = contactForm.querySelector('.form-submit-btn');
    const formLoading = document.getElementById('formLoading');
    const formSuccess = document.getElementById('formSuccess');
    const formError = document.getElementById('formError');

    contactForm.addEventListener('submit', function(e) {
      
      submitBtn.disabled = true;
      formLoading.style.display = 'flex';
      formSuccess.style.display = 'none';
      formError.style.display = 'none';

      
      setTimeout(() => {
        submitBtn.disabled = false;
        formLoading.style.display = 'none';
        formSuccess.style.display = 'flex';
        
        setTimeout(() => {
          formSuccess.style.display = 'none';
          contactForm.reset();
        }, 5000);
      }, 2000);
    });
  })();

  
  (function setupScrollToTop(){
    const toTopBtn = document.getElementById('scrollToTop');
    if (!toTopBtn) return;

    
    function toggleBtn() {
      try {
        if (window.scrollY > 300) toTopBtn.classList.add('visible');
        else toTopBtn.classList.remove('visible');
      } catch (e) { }
    }

    toggleBtn();
    window.addEventListener('scroll', toggleBtn, { passive: true });
    toTopBtn.addEventListener('click', function (ev) {
      ev.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  })();

  
  const container = document.querySelector('.projects-showcase');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');
  const indicators = Array.from(document.querySelectorAll('.indicator'));
  if (!container || !prevBtn || !nextBtn || indicators.length === 0) return;

  
  const slides = Array.from(container.querySelectorAll('.project-showcase-card'));
  let currentIndex = 0;
  const lastIndex = slides.length - 1;
  let isScrollingProgrammatically = false;
  let scrollTimeout = null;

  
  function setButtonState() {
    if (currentIndex <= 0) {
      prevBtn.classList.add('disabled');
      prevBtn.setAttribute('aria-disabled', 'true');
      prevBtn.disabled = true;
    } else {
      prevBtn.classList.remove('disabled');
      prevBtn.removeAttribute('aria-disabled');
      prevBtn.disabled = false;
    }

    if (currentIndex >= lastIndex) {
      nextBtn.classList.add('disabled');
      nextBtn.setAttribute('aria-disabled', 'true');
      nextBtn.disabled = true;
    } else {
      nextBtn.classList.remove('disabled');
      nextBtn.removeAttribute('aria-disabled');
      nextBtn.disabled = false;
    }
  }

  
  function updateIndicators() {
    indicators.forEach((btn, i) => {
      if (i === currentIndex) btn.classList.add('active');
      else btn.classList.remove('active');
    });
  }

  
  function goTo(index, smooth = true) {
    const clamped = Math.max(0, Math.min(lastIndex, index));
    currentIndex = clamped;
    setButtonState();
    updateIndicators();
    if (slides[currentIndex]) {
      isScrollingProgrammatically = true;
      slides[currentIndex].scrollIntoView({behavior: smooth ? 'smooth' : 'auto', block: 'nearest', inline: 'start'});
      window.clearTimeout(scrollTimeout);
      scrollTimeout = window.setTimeout(() => { isScrollingProgrammatically = false; }, 520);
    }
  }

  prevBtn.addEventListener('click', () => { if (!prevBtn.classList.contains('disabled')) goTo(currentIndex - 1); });
  nextBtn.addEventListener('click', () => { if (!nextBtn.classList.contains('disabled')) goTo(currentIndex + 1); });

  indicators.forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.index);
      if (!Number.isNaN(idx)) goTo(idx);
    });
  });

  
  document.addEventListener('keydown', (ev) => {
    const tag = document.activeElement && document.activeElement.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

    if (ev.key === 'ArrowLeft') {
      ev.preventDefault();
      goTo(currentIndex - 1);
    } else if (ev.key === 'ArrowRight') {
      ev.preventDefault();
      goTo(currentIndex + 1);
    }
  });

  
  container.addEventListener('scroll', () => {
    if (isScrollingProgrammatically) return;
    window.clearTimeout(scrollTimeout);
    scrollTimeout = window.setTimeout(() => {
      const width = container.clientWidth || container.getBoundingClientRect().width;
      if (!width) return;
      const idx = Math.round(container.scrollLeft / width);
      if (idx !== currentIndex) {
        currentIndex = Math.max(0, Math.min(lastIndex, idx));
        setButtonState();
        updateIndicators();
      }
    }, 80);
  });

  
  goTo(0, false);
  
  window.__portfolioCarousel = { goTo, getCurrent: () => currentIndex };
});


