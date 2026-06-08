// ========== SLIDING MENU FUNCTIONALITY ==========
// This file handles the hamburger menu (☰) functionality for all pages

// Get DOM elements
const menuToggleBtn = document.getElementById('menuToggleBtn');
const slidingMenu = document.getElementById('slidingMenu');
const menuOverlay = document.getElementById('menuOverlay');
const menuCloseBtn = document.getElementById('menuCloseBtn');

// Function to open menu
function openMenu() {
  if (slidingMenu && menuOverlay) {
    slidingMenu.classList.add('active');
    menuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
  }
}

// Function to close menu
function closeMenu() {
  if (slidingMenu && menuOverlay) {
    slidingMenu.classList.remove('active');
    menuOverlay.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
  }
}

// Toggle menu function
function toggleMenu() {
  if (slidingMenu && slidingMenu.classList.contains('active')) {
    closeMenu();
  } else {
    openMenu();
  }
}

// Add event listeners if elements exist
if (menuToggleBtn) {
  menuToggleBtn.addEventListener('click', toggleMenu);
}

if (menuCloseBtn) {
  menuCloseBtn.addEventListener('click', closeMenu);
}

if (menuOverlay) {
  menuOverlay.addEventListener('click', closeMenu);
}

// Close menu on escape key press
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && slidingMenu && slidingMenu.classList.contains('active')) {
    closeMenu();
  }
});

// Prevent menu from closing when clicking inside the menu
if (slidingMenu) {
  slidingMenu.addEventListener('click', function(e) {
    e.stopPropagation();
  });
}

// Highlight current page in menu
function highlightCurrentPage() {
  const currentPath = window.location.pathname;
  const menuItems = document.querySelectorAll('.menu-item');
  
  menuItems.forEach(item => {
    const itemHref = item.getAttribute('href');
    if (itemHref) {
      // Check if this menu item matches current page
      if (currentPath.includes(itemHref) || 
          (currentPath.endsWith('/') && itemHref === 'index.html') ||
          (currentPath === '/' && itemHref === 'index.html')) {
        item.classList.add('active');
      }
    }
  });
}

// Call highlight function when page loads
document.addEventListener('DOMContentLoaded', function() {
  highlightCurrentPage();
});