document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // Scroll Reveal Animation
  const reveals = document.querySelectorAll('.reveal');

  const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const elementVisible = 150;

    reveals.forEach((reveal) => {
      const elementTop = reveal.getBoundingClientRect().top;
      if (elementTop < windowHeight - elementVisible) {
        reveal.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', revealOnScroll);
  // Trigger once on load
  revealOnScroll();

  // Highlight Active Link
  const currentLocation = location.pathname.split('/').pop();
  const navItems = document.querySelectorAll('.nav-links a');
  
  navItems.forEach(item => {
    const itemHref = item.getAttribute('href');
    if (itemHref === currentLocation || (currentLocation === '' && itemHref === 'index.html')) {
      item.classList.add('active');
    }
  });

  // Header Scroll Effect
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
      header.style.padding = '0';
    } else {
      header.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
    }
  });

  // Newsletter Form Handler
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = newsletterForm.querySelector('input[name="email"]').value;
      const btn = newsletterForm.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      
      try {
        btn.textContent = 'Envoi...';
        btn.disabled = true;
        
        const response = await fetch('/api/newsletter', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });
        
        const result = await response.json();
        if (response.ok) {
          alert('Merci pour votre inscription à la newsletter !');
          newsletterForm.reset();
        } else {
          alert(result.error || 'Une erreur est survenue.');
        }
      } catch (error) {
        console.error('Newsletter error:', error);
        alert("Une erreur est survenue lors de l'inscription.");
      } finally {
        btn.textContent = originalText;
        btn.disabled = false;
      }
    });
  }
});
