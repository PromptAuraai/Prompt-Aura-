// ============================================================
// PROMPTAURA - SLIDING MENU (ULTRA PREMIUM)
// Complete Menu Functionality - Version 2.0
// ============================================================

(function() {
  'use strict';

  // ============================================================
  // DOM ELEMENTS
  // ============================================================
  const menuToggleBtn = document.getElementById('menuToggleBtn');
  const slidingMenu = document.getElementById('slidingMenu');
  const menuOverlay = document.getElementById('menuOverlay');
  const menuCloseBtn = document.getElementById('menuCloseBtn');
  const body = document.body;

  // ============================================================
  // STATE
  // ============================================================
  let isMenuOpen = false;
  let touchStartX = 0;
  let touchEndX = 0;
  let isSwiping = false;

  // ============================================================
  // FUNCTIONS
  // ============================================================

  /**
   * Open the sliding menu
   */
  function openMenu() {
    if (!slidingMenu || !menuOverlay) return;
    
    slidingMenu.classList.add('active');
    menuOverlay.classList.add('active');
    body.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.width = '100%';
    
    isMenuOpen = true;
    
    // Focus trap - focus first focusable element
    setTimeout(() => {
      const firstFocusable = slidingMenu.querySelector('a, button, input, select, textarea');
      if (firstFocusable) firstFocusable.focus();
    }, 100);
    
    // Dispatch custom event for analytics
    document.dispatchEvent(new CustomEvent('menu:open'));
  }

  /**
   * Close the sliding menu
   */
  function closeMenu() {
    if (!slidingMenu || !menuOverlay) return;
    
    slidingMenu.classList.remove('active');
    menuOverlay.classList.remove('active');
    body.style.overflow = '';
    body.style.position = '';
    body.style.width = '';
    
    isMenuOpen = false;
    
    // Return focus to toggle button
    if (menuToggleBtn) {
      setTimeout(() => {
        menuToggleBtn.focus();
      }, 100);
    }
    
    // Dispatch custom event for analytics
    document.dispatchEvent(new CustomEvent('menu:close'));
  }

  /**
   * Toggle the sliding menu
   */
  function toggleMenu() {
    if (isMenuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  /**
   * Highlight current page in menu
   */
  function highlightCurrentPage() {
    const currentPath = window.location.pathname;
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
      const itemHref = item.getAttribute('href');
      if (!itemHref) return;
      
      // Clean paths for comparison
      const cleanCurrent = currentPath.replace(/\/$/, '');
      const cleanHref = itemHref.replace(/^\//, '').replace(/\.html$/, '');
      const cleanItem = cleanHref.replace(/\.html$/, '');
      
      // Check matches
      const isMatch = 
        cleanCurrent === cleanItem ||
        cleanCurrent.endsWith(cleanItem) ||
        (cleanCurrent === '' && cleanItem === 'index') ||
        (cleanCurrent === '/' && cleanItem === 'index') ||
        (cleanCurrent.includes(cleanItem) && cleanItem !== '');
      
      if (isMatch) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  /**
   * Handle swipe to close on touch devices
   */
  function handleTouchStart(e) {
    if (!slidingMenu || !slidingMenu.classList.contains('active')) return;
    
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    isSwiping = true;
  }

  function handleTouchMove(e) {
    if (!isSwiping || !slidingMenu || !slidingMenu.classList.contains('active')) return;
    
    const touch = e.touches[0];
    touchEndX = touch.clientX;
    const diff = touchStartX - touchEndX;
    
    // If swiping left more than 50px, close menu
    if (diff > 50) {
      closeMenu();
      isSwiping = false;
    }
  }

  function handleTouchEnd() {
    isSwiping = false;
  }

  // ============================================================
  // EVENT LISTENERS
  // ============================================================

  // Toggle button
  if (menuToggleBtn) {
    menuToggleBtn.addEventListener('click', toggleMenu);
    menuToggleBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleMenu();
      }
    });
  }

  // Close button
  if (menuCloseBtn) {
    menuCloseBtn.addEventListener('click', closeMenu);
    menuCloseBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        closeMenu();
      }
    });
  }

  // Overlay click
  if (menuOverlay) {
    menuOverlay.addEventListener('click', closeMenu);
  }

  // Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && isMenuOpen) {
      closeMenu();
    }
  });

  // Touch events for swipe to close
  if (slidingMenu) {
    slidingMenu.addEventListener('touchstart', handleTouchStart, { passive: true });
    slidingMenu.addEventListener('touchmove', handleTouchMove, { passive: true });
    slidingMenu.addEventListener('touchend', handleTouchEnd, { passive: true });
  }

  // Prevent menu from closing when clicking inside the menu
  if (slidingMenu) {
    slidingMenu.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  }

  // ============================================================
  // MENU ITEM CLICK - AUTO CLOSE
  // ============================================================
  document.addEventListener('click', function(e) {
    const menuItem = e.target.closest('.menu-item');
    if (menuItem && isMenuOpen) {
      // Small delay to allow click to register before navigation
      setTimeout(() => {
        closeMenu();
      }, 150);
    }
  });

  // ============================================================
  // RESIZE HANDLER - Close menu on desktop
  // ============================================================
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth >= 1024 && isMenuOpen) {
        closeMenu();
      }
    }, 200);
  }, { passive: true });

  // ============================================================
  // KEYBOARD NAVIGATION - Trap focus inside menu
  // ============================================================
  slidingMenu?.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      const focusableElements = slidingMenu.querySelectorAll(
        'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements.length === 0) return;
      
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  });

  // ============================================================
  // HIGHLIGHT CURRENT PAGE
  // ============================================================
  document.addEventListener('DOMContentLoaded', function() {
    highlightCurrentPage();
  });

  // Re-run highlight when page changes (SPA support)
  window.addEventListener('popstate', function() {
    setTimeout(highlightCurrentPage, 100);
  });

  // ============================================================
  // EXPOSE API FOR OTHER SCRIPTS
  // ============================================================
  window.PromptAuraMenu = {
    open: openMenu,
    close: closeMenu,
    toggle: toggleMenu,
    isOpen: () => isMenuOpen,
    highlight: highlightCurrentPage
  };

  // ============================================================
  // CONSOLE LOG FOR DEBUG
  // ============================================================
  console.log('🍔 PromptAura Sliding Menu loaded successfully!');

})();