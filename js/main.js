(function () {
  'use strict';

  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');

  if (header) {
    const isHeroHeader = header.classList.contains('site-header--hero');

    const updateHeader = () => {
      if (!isHeroHeader) {
        header.classList.add('is-scrolled');
        return;
      }

      const isScrolled = window.scrollY > 24;
      header.classList.toggle('is-scrolled', isScrolled);
      header.classList.toggle('is-at-top', !isScrolled);
    };

    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
    window.addEventListener('pageshow', updateHeader);
    window.addEventListener('resize', updateHeader, { passive: true });
  }

  if (menuToggle && header) {
    menuToggle.addEventListener('click', () => {
      const isOpen = header.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', isOpen);
    });

    document.querySelectorAll('.site-nav__link').forEach(link => {
      link.addEventListener('click', () => {
        header.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const contactForm = document.querySelector('.contact-form');

  if (contactForm) {
    const submitButton = contactForm.querySelector('[type="submit"]');
    const formStatus = contactForm.querySelector('.form-status');
    const defaultButtonText = submitButton.textContent;

    contactForm.addEventListener('submit', async event => {
      event.preventDefault();

      submitButton.disabled = true;
      submitButton.textContent = 'Надсилання…';
      formStatus.className = 'form-status';
      formStatus.textContent = '';

      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: new FormData(contactForm),
          headers: { Accept: 'application/json' }
        });

        if (!response.ok) {
          throw new Error('Form submission failed');
        }

        contactForm.reset();
        formStatus.classList.add('form-status--success');
        formStatus.textContent = 'Дякуємо! Ваше повідомлення успішно надіслано.';
      } catch (error) {
        formStatus.classList.add('form-status--error');
        formStatus.textContent = 'Не вдалося надіслати повідомлення. Спробуйте ще раз або напишіть нам на email.';
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = defaultButtonText;
      }
    });
  }

  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    reveals.forEach(el => observer.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
  }
})();
