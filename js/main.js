/* ==========================================
   LECTORIA — Interactive Controller
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Header Scroll Handling
  const header = document.querySelector('.site-header');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 8) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // 2. Mobile Menu Toggle
  const mobileToggleBtn = document.getElementById('mobileMenuToggle');
  const mobileNavPanel = document.getElementById('mobileNavPanel');
  
  if (mobileToggleBtn && mobileNavPanel) {
    mobileToggleBtn.addEventListener('click', () => {
      const isHidden = mobileNavPanel.style.display === 'none' || !mobileNavPanel.style.display;
      mobileNavPanel.style.display = isHidden ? 'flex' : 'none';
      mobileToggleBtn.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
    });

    const mobileLinks = mobileNavPanel.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileNavPanel.style.display = 'none';
        mobileToggleBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 3. Reader Theme Switcher (Claro, Sepia, Oscuro)
  const readerThemeInputs = document.querySelectorAll('input[name="reader-theme"]');
  const readerPreviewBox = document.getElementById('readerPreviewBox');

  const themeStyles = {
    light: { bg: 'var(--color-bg)', color: 'var(--color-text)' },
    sepia: { bg: '#f2e4c8', color: '#4a3a24' },
    dark: { bg: '#221f1c', color: '#efe6d8' }
  };

  readerThemeInputs.forEach(input => {
    input.addEventListener('change', (e) => {
      const selectedTheme = e.target.value;
      if (readerPreviewBox && themeStyles[selectedTheme]) {
        readerPreviewBox.style.backgroundColor = themeStyles[selectedTheme].bg;
        readerPreviewBox.style.color = themeStyles[selectedTheme].color;
      }
      
      // Update label active class
      document.querySelectorAll('.reader-theme-opt').forEach(opt => opt.classList.remove('active'));
      e.target.closest('.reader-theme-opt')?.classList.add('active');
    });
  });

  // 4. Billing Period Switcher (Mensual vs Anual)
  const billingInputs = document.querySelectorAll('input[name="billing"]');
  const pricePlanEstudiante = document.getElementById('pricePlanEstudiante');
  const pricePlanPro = document.getElementById('pricePlanPro');

  billingInputs.forEach(input => {
    input.addEventListener('change', (e) => {
      const mode = e.target.value;
      
      // Update price display labels
      if (pricePlanEstudiante) {
        pricePlanEstudiante.textContent = mode === 'monthly' ? '$3.99 / mes' : '$39.99 / año';
      }
      if (pricePlanPro) {
        pricePlanPro.textContent = mode === 'monthly' ? '$7.99 / mes' : '$79.99 / año';
      }

      // Update segment style active state
      document.querySelectorAll('.billing-opt').forEach(opt => opt.classList.remove('active'));
      e.target.closest('.billing-opt')?.classList.add('active');
    });
  });

  // 5. FAQ Accordion Toggle
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const button = item.querySelector('.faq-button');
    if (button) {
      button.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');

        // Close all other items for clean accordion behavior
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('open');
          }
        });

        // Toggle clicked item
        if (isOpen) {
          item.classList.remove('open');
        } else {
          item.classList.add('open');
        }
      });
    }
  });

  // 6. Reduced Motion check for video
  const mediaQueryMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mascotVideo = document.getElementById('heroMascotVideo');
  if (mascotVideo && mediaQueryMotion.matches) {
    mascotVideo.pause();
  }
});
