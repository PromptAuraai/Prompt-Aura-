// ============================================================
// PROMPTAURA - ULTRA PREMIUM SCRIPT
// Complete JavaScript - Version 2.0 (FIXED)
// ============================================================

// ============================================================
// GLOBAL VARIABLES
// ============================================================
let allPrompts = [];
let currentCategory = 'all';
let currentPage = 1;
let promptsPerPage = 10;
let galleryImages = [];
let galleryIndex = 0;
let galleryInterval;
let shuffledPrompts = [];
let currentSearchQuery = '';
let isSearchMode = false;
let searchResults = [];

// Featured Collections
let collectionsData = [];
let collectionPromptsData = {};

// ============================================================
// SCROLL REVEAL - INTERSECTION OBSERVER (FIXED)
// ============================================================
function initScrollReveal() {
  // Reveal elements with .reveal class (Sections only)
  const reveals = document.querySelectorAll('.reveal');
  const scaleItems = document.querySelectorAll('.reveal-scale');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(el => observer.observe(el));

  // Scale items
  scaleItems.forEach(el => {
    const observerScale = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });
    observerScale.observe(el);
  });
}

// ============================================================
// COUNT-UP ANIMATION
// ============================================================
function animateCountUp(element, target, duration = 2000, suffix = '+') {
  if (!element) return;
  let start = 0;
  const step = Math.ceil(target / (duration / 16));
  let current = 0;
  
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    element.textContent = current + suffix;
  }, 16);
}

function initCountUps() {
  const statPrompts = document.getElementById('statPrompts');
  const statCategories = document.getElementById('statCategories');
  const statUsers = document.getElementById('statUsers');

  if (statPrompts) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCountUp(statPrompts, 1000, 2000, '+');
          observer.unobserve(statPrompts);
        }
      });
    }, { threshold: 0.5 });
    observer.observe(statPrompts);
  }

  if (statCategories) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCountUp(statCategories, 50, 1500, '+');
          observer.unobserve(statCategories);
        }
      });
    }, { threshold: 0.5 });
    observer.observe(statCategories);
  }

  if (statUsers) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCountUp(statUsers, 10000, 2500, '+');
          observer.unobserve(statUsers);
        }
      });
    }, { threshold: 0.5 });
    observer.observe(statUsers);
  }
}

// ============================================================
// RIPPLE EFFECT ON BUTTONS
// ============================================================
function initRippleEffect() {
  document.addEventListener('click', function(e) {
    const button = e.target.closest('.btn-copy, .btn-copy-large, .load-more-btn, .hero-search-btn, .category-pill');
    if (!button) return;
    
    if (button.querySelector('.ripple')) return;
    
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
    button.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  });
}

// Add ripple CSS dynamically
function injectRippleStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .ripple {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      transform: scale(0);
      animation: rippleAnim 0.6s ease-out forwards;
      pointer-events: none;
    }
    @keyframes rippleAnim {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
    .btn-copy, .btn-copy-large, .load-more-btn, .hero-search-btn, .category-pill {
      position: relative;
      overflow: hidden;
    }
  `;
  document.head.appendChild(style);
}

// ============================================================
// HEADER SCROLL EFFECT
// ============================================================
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

// ============================================================
// SCROLL POSITION & PAGE FUNCTIONS
// ============================================================
function saveScrollPositionAndPage() {
  sessionStorage.setItem('scrollPosition', window.scrollY);
  sessionStorage.setItem('savedCurrentPage', currentPage);
  sessionStorage.setItem('savedCategory', currentCategory);
  sessionStorage.setItem('savedIsSearchMode', isSearchMode);
  sessionStorage.setItem('savedSearchQuery', currentSearchQuery);
}

function restoreScrollPositionAndPage() {
  const savedPosition = sessionStorage.getItem('scrollPosition');
  const savedPage = sessionStorage.getItem('savedCurrentPage');
  const savedCategory = sessionStorage.getItem('savedCategory');
  
  if (savedPage) {
    currentPage = parseInt(savedPage);
    sessionStorage.removeItem('savedCurrentPage');
  }
  
  if (savedCategory && savedCategory !== 'all') {
    currentCategory = savedCategory;
    sessionStorage.removeItem('savedCategory');
  }
  
  if (savedPosition) {
    setTimeout(() => {
      window.scrollTo(0, parseInt(savedPosition));
      sessionStorage.removeItem('scrollPosition');
    }, 150);
  }
}

function saveScrollPosition() {
  sessionStorage.setItem('scrollPosition', window.scrollY);
}

function restoreScrollPosition() {
  const savedPosition = sessionStorage.getItem('scrollPosition');
  if (savedPosition) {
    setTimeout(() => {
      window.scrollTo(0, parseInt(savedPosition));
      sessionStorage.removeItem('scrollPosition');
    }, 100);
  }
}

function saveShuffledPrompts(prompts) {
  sessionStorage.setItem('shuffledPrompts', JSON.stringify(prompts));
}

function getSavedShuffledPrompts() {
  const saved = sessionStorage.getItem('shuffledPrompts');
  return saved ? JSON.parse(saved) : null;
}

function clearSavedShuffledPrompts() {
  sessionStorage.removeItem('shuffledPrompts');
}

function scrollToCardsSection() {
  const cardsSection = document.querySelector('.prompts-main') || document.querySelector('.prompts-grid');
  if (cardsSection) {
    const offset = 80;
    const elementPosition = cardsSection.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({
      top: elementPosition - offset,
      behavior: 'smooth'
    });
  }
}

function scrollToCardById(cardId) {
  setTimeout(() => {
    const card = document.querySelector(`.prompt-card[data-id="${cardId}"]`);
    if (card) {
      const offset = 80;
      const elementPosition = card.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
      card.style.transition = 'all 0.3s';
      card.style.boxShadow = '0 0 0 3px #7C3AED';
      setTimeout(() => {
        card.style.boxShadow = '';
      }, 2000);
    }
  }, 300);
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function fixImagePath(imageUrl) {
  if (!imageUrl) return 'https://via.placeholder.com/400x300?text=No+Image';
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return imageUrl;
  if (imageUrl.startsWith('../')) return imageUrl;
  if (imageUrl.startsWith('assets/')) return imageUrl;
  return imageUrl;
}

// ============================================================
// FUZZY SEARCH
// ============================================================
function fuzzyMatch(str, pattern) {
  str = str.toLowerCase();
  pattern = pattern.toLowerCase();
  
  if (str.includes(pattern)) return true;
  
  if (pattern.length <= 10) {
    let distance = 0;
    let i = 0, j = 0;
    while (i < str.length && j < pattern.length) {
      if (str[i] !== pattern[j]) {
        distance++;
        if (distance > Math.floor(pattern.length * 0.3)) break;
        i++;
      } else {
        i++;
        j++;
      }
    }
    if (j === pattern.length && distance <= Math.floor(pattern.length * 0.3)) {
      return true;
    }
  }
  return false;
}

function calculateSearchScore(prompt, query) {
  let score = 0;
  const title = prompt.title.toLowerCase();
  const shortPrompt = prompt.short_prompt.toLowerCase();
  const fullPrompt = prompt.full_prompt.toLowerCase();
  const category = prompt.category.toLowerCase();
  const tags = prompt.tags ? prompt.tags.map(t => t.toLowerCase()) : [];
  
  if (title.includes(query)) score += 10;
  else if (fuzzyMatch(title, query)) score += 5;
  if (title === query) score += 15;
  if (category.includes(query)) score += 8;
  else if (fuzzyMatch(category, query)) score += 4;
  if (category === query) score += 10;
  
  tags.forEach(tag => {
    if (tag.includes(query)) score += 5;
    else if (fuzzyMatch(tag, query)) score += 2;
    if (tag === query) score += 8;
  });
  
  if (shortPrompt.includes(query)) score += 3;
  else if (fuzzyMatch(shortPrompt.substring(0, 50), query)) score += 1;
  if (fullPrompt.includes(query)) score += 1;
  
  return score;
}

function getSearchSuggestions(query) {
  if (!query || query.trim().length === 0) return [];
  const searchTerm = query.toLowerCase().trim();
  const scoredResults = allPrompts.map(prompt => {
    const score = calculateSearchScore(prompt, searchTerm);
    return { prompt, score };
  });
  return scoredResults
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.prompt);
}

function highlightMatch(text, query) {
  if (!query) return escapeHtml(text);
  const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
  return escapeHtml(text).replace(regex, '<strong>$1</strong>');
}

// ============================================================
// SEARCH FUNCTIONS
// ============================================================
function performSearch(query, isFromURL = false) {
  if (!query || query.trim() === '') {
    isSearchMode = false;
    currentSearchQuery = '';
    searchResults = [];
    currentPage = 1;
    renderPrompts();
    return;
  }
  
  const searchTerm = query.toLowerCase().trim();
  const scoredResults = allPrompts.map(prompt => {
    const score = calculateSearchScore(prompt, searchTerm);
    return { prompt, score };
  });
  
  const results = scoredResults
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.prompt);
  
  searchResults = results;
  isSearchMode = true;
  currentSearchQuery = searchTerm;
  currentPage = 1;
  
  if (isFromURL) {
    showSearchResultsBanner(query, results.length);
  }
  
  renderPrompts();
}

function clearSearch() {
  isSearchMode = false;
  currentSearchQuery = '';
  searchResults = [];
  currentPage = 1;
  renderPrompts();
  
  const banner = document.getElementById('searchResultsBanner');
  if (banner) banner.remove();
  
  const searchInput = document.getElementById('liveSearchInput');
  if (searchInput) searchInput.value = '';
  
  const heroSearchInput = document.getElementById('heroSearchInput');
  if (heroSearchInput) heroSearchInput.value = '';
}

function showSearchResultsBanner(query, count) {
  const existingBanner = document.getElementById('searchResultsBanner');
  if (existingBanner) existingBanner.remove();
  
  const banner = document.createElement('div');
  banner.id = 'searchResultsBanner';
  banner.className = 'search-results-banner';
  banner.innerHTML = `
    <div class="search-banner-content">
      <i class="fas fa-search"></i>
      <div>
        <strong>Search results for: "${escapeHtml(query)}"</strong>
        <span>Found ${count} prompts</span>
      </div>
      <button id="clearSearchBanner" class="clear-search-banner">Clear Search</button>
    </div>
  `;
  
  const categoriesSection = document.querySelector('.categories-section');
  categoriesSection.parentNode.insertBefore(banner, categoriesSection.nextSibling);
  
  document.getElementById('clearSearchBanner').addEventListener('click', () => {
    clearSearch();
    banner.remove();
  });
}

// ============================================================
// GALLERY
// ============================================================
function initializeGallery() {
  const slider = document.getElementById('gallerySlider');
  if (!slider || !galleryImages.length) return;
  
  slider.innerHTML = galleryImages.map((img, idx) => `
    <div class="gallery-slide ${idx === 0 ? 'active' : ''}" data-category="${img.category}">
      <img src="${img.url}" alt="Gallery image" loading="lazy">
    </div>
  `).join('');
  
  startGalleryRotation();
  
  document.querySelectorAll('.gallery-slide').forEach(slide => {
    slide.addEventListener('click', () => {
      const category = slide.dataset.category;
      if (category) {
        clearSearch();
        currentCategory = category;
        currentPage = 1;
        renderPrompts();
        updateActiveCategory();
        setTimeout(scrollToCardsSection, 300);
      }
    });
  });
}

function startGalleryRotation() {
  if (galleryInterval) clearInterval(galleryInterval);
  galleryInterval = setInterval(() => {
    const slides = document.querySelectorAll('.gallery-slide');
    if (slides.length === 0) return;
    const current = document.querySelector('.gallery-slide.active');
    let next = current.nextElementSibling;
    if (!next) next = slides[0];
    current.classList.remove('active');
    next.classList.add('active');
  }, 4000);
}

// ============================================================
// TRENDING
// ============================================================
function initializeTrending(trending) {
  const track = document.getElementById('trendingTrack');
  if (!track || !trending.length) return;
  
  const promptTitleToId = {};
  allPrompts.forEach(prompt => {
    promptTitleToId[prompt.title.toLowerCase()] = prompt.id;
  });
  
  track.innerHTML = trending.map(prompt => {
    const actualPromptId = promptTitleToId[prompt.title.toLowerCase()] || prompt.id;
    return `
      <div class="trending-card" data-id="${actualPromptId}" style="cursor: pointer;">
        <div class="trending-card-img-wrapper">
          <img src="${prompt.image}" alt="${escapeHtml(prompt.title)}" loading="lazy">
          <div class="trending-badge">
            <i class="fas fa-fire"></i>
            <span>Trending</span>
          </div>
        </div>
        <div class="trending-card-content">
          <h3>${escapeHtml(prompt.title)}</h3>
          <p>${escapeHtml(prompt.short_prompt.substring(0, 80))}...</p>
          <button class="btn-copy" data-prompt="${prompt.full_prompt.replace(/"/g, '&quot;')}">Copy Prompt</button>
        </div>
      </div>
    `;
  }).join('');
  
  document.querySelectorAll('.trending-card').forEach(card => {
    const cardId = card.dataset.id;
    card.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-copy')) return;
      if (cardId) {
        saveScrollPosition();
        window.location.href = `pages/prompt.html?id=${cardId}`;
      }
    });
  });
  
  document.querySelectorAll('.trending-card .btn-copy').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const originalText = btn.textContent;
      const textToCopy = btn.dataset.prompt;
      
      navigator.clipboard.writeText(textToCopy).then(() => {
        btn.textContent = 'Copied! ✓';
        setTimeout(() => {
          btn.textContent = originalText;
        }, 1500);
      }).catch(() => {
        btn.textContent = 'Failed!';
        setTimeout(() => {
          btn.textContent = originalText;
        }, 1500);
      });
    });
  });
}

// ============================================================
// CATEGORIES
// ============================================================
function initializeCategories(categories) {
  const container = document.getElementById('categoriesList');
  if (!container) return;
  
  container.innerHTML = `
    <button class="category-pill active" data-category="all">All</button>
    ${categories.map(cat => `
      <button class="category-pill" data-category="${cat.id}">${escapeHtml(cat.name)}</button>
    `).join('')}
  `;
  
  container.querySelectorAll('.category-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.category;
      saveScrollPosition();
      if (category === 'all') {
        window.location.href = `index.html`;
      } else {
        window.location.href = `pages/category.html?category=${category}`;
      }
    });
  });
}

function updateActiveCategory() {
  document.querySelectorAll('.category-pill').forEach(btn => {
    if (btn.dataset.category === currentCategory) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

// ============================================================
// J-STYLE HUB
// ============================================================
function initializeJStyleHub(jstyleCollections) {
  const container = document.getElementById('jstylehubGrid');
  if (!container) return;
  
  if (!jstyleCollections || jstyleCollections.length === 0) {
    container.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No collections available</p>';
    return;
  }
  
  container.innerHTML = jstyleCollections.map(collection => `
    <div class="jstyle-card" data-collection="${collection.collection}" data-id="${collection.id}">
      <img src="${collection.thumbnail}" alt="${escapeHtml(collection.title)}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'">
      <div class="jstyle-card-overlay">
        <h3 class="jstyle-card-title">${escapeHtml(collection.title)}</h3>
      </div>
    </div>
  `).join('');
  
  document.querySelectorAll('.jstyle-card').forEach(card => {
    card.addEventListener('click', () => {
      const collectionId = card.dataset.collection;
      saveScrollPosition();
      window.location.href = `pages/collection.html?collection=${collectionId}`;
    });
  });
}

// ============================================================
// FEATURED COLLECTIONS
// ============================================================
async function loadCollections() {
  try {
    const response = await fetch('data/collections.json');
    if (response.ok) {
      collectionsData = await response.json();
      await loadCollectionPromptCounts();
      renderCollections();
    } else {
      console.log('Collections file not found, skipping...');
    }
  } catch (error) {
    console.error('Error loading collections:', error);
  }
}

async function loadCollectionPromptCounts() {
  for (const collection of collectionsData) {
    try {
      const response = await fetch(collection.file);
      if (response.ok) {
        const prompts = await response.json();
        collection.promptCount = prompts.length;
        collectionPromptsData[collection.id] = prompts;
      } else {
        collection.promptCount = 0;
      }
    } catch (e) {
      console.warn('Could not load prompt count for:', collection.id);
      collection.promptCount = 0;
    }
  }
}

function renderCollections() {
  const grid = document.getElementById('collectionsGrid');
  if (!grid) return;
  
  if (!collectionsData || collectionsData.length === 0) {
    grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #888888; padding: 40px 0;">No collections available</p>';
    return;
  }
  
  grid.innerHTML = collectionsData.map(collection => `
    <div class="collection-cover-card" data-collection="${collection.id}" onclick="window.location.href='pages/featured.html?id=${collection.id}'">
      <img src="${collection.cover}" alt="${escapeHtml(collection.title)}" loading="lazy" onerror="this.src='https://via.placeholder.com/800x450?text=${escapeHtml(collection.title)}'">
      <div class="collection-cover-overlay">
        <h3>${escapeHtml(collection.title)}</h3>
        <p>${escapeHtml(collection.description)}</p>
        <span class="collection-cover-badge"><i class="fas fa-arrow-right"></i> Explore</span>
        <span class="collection-cover-count"><i class="fas fa-file-alt"></i> ${collection.promptCount || 0} prompts</span>
      </div>
    </div>
  `).join('');
}

// ============================================================
// PROMPTS GRID
// ============================================================
function getCurrentPrompts() {
  if (isSearchMode && currentSearchQuery) {
    return searchResults;
  }
  if (currentCategory !== 'all') {
    return allPrompts.filter(p => p.category === currentCategory);
  }
  return shuffledPrompts;
}

function renderPagination(totalItems) {
  const totalPages = Math.ceil(totalItems / promptsPerPage);
  const existingPagination = document.querySelector('.pagination-container');
  if (existingPagination) existingPagination.remove();
  
  if (totalPages <= 1) return;
  
  const paginationDiv = document.createElement('div');
  paginationDiv.className = 'pagination-container';
  
  let paginationHTML = '<div class="pagination">';
  paginationHTML += `<button class="page-btn prev-btn" ${currentPage === 1 ? 'disabled' : ''} data-page="${currentPage - 1}">
    <i class="fas fa-chevron-left"></i>
  </button>`;
  
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + 4);
  if (endPage - startPage < 4) {
    startPage = Math.max(1, endPage - 4);
  }
  
  if (startPage > 1) {
    paginationHTML += `<button class="page-btn" data-page="1">1</button>`;
    if (startPage > 2) paginationHTML += `<span class="page-dots">...</span>`;
  }
  
  for (let i = startPage; i <= endPage; i++) {
    paginationHTML += `<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
  }
  
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) paginationHTML += `<span class="page-dots">...</span>`;
    paginationHTML += `<button class="page-btn" data-page="${totalPages}">${totalPages}</button>`;
  }
  
  paginationHTML += `<button class="page-btn next-btn" ${currentPage === totalPages ? 'disabled' : ''} data-page="${currentPage + 1}">
    <i class="fas fa-chevron-right"></i>
  </button>`;
  paginationHTML += '</div>';
  paginationDiv.innerHTML = paginationHTML;
  
  const loadMoreContainer = document.getElementById('loadMoreBtnWrapper');
  loadMoreContainer.parentNode.insertBefore(paginationDiv, loadMoreContainer);
  
  document.querySelectorAll('.page-btn').forEach(btn => {
    if (!btn.disabled && btn.dataset.page) {
      btn.addEventListener('click', () => {
        saveScrollPositionAndPage();
        currentPage = parseInt(btn.dataset.page);
        renderPrompts();
        setTimeout(scrollToCardsSection, 100);
      });
    }
  });
}

// ============================================================
// ✅ FIXED: RENDER PROMPTS - CARDS ALWAYS VISIBLE
// ============================================================
function renderPrompts() {
  let promptsList = getCurrentPrompts();
  const totalItems = promptsList.length;
  const start = (currentPage - 1) * promptsPerPage;
  const end = start + promptsPerPage;
  const paginated = promptsList.slice(start, end);
  const grid = document.getElementById('promptsGrid');
  
  if (paginated.length === 0) {
    grid.innerHTML = `
      <div class="no-results" style="grid-column: 1/-1; text-align: center; padding: 60px;">
        <i class="fas fa-search" style="font-size: 48px; color: #cccccc;"></i>
        <h3>No prompts found</h3>
        <p>Try a different search term or category</p>
      </div>
    `;
    renderPagination(0);
    return;
  }
  
  grid.innerHTML = paginated.map((prompt, idx) => {
    let aspectRatioValue = '16 / 9';
    if (prompt.ratio === '9:16') aspectRatioValue = '9 / 16';
    else if (prompt.ratio === '4:5') aspectRatioValue = '4 / 5';
    else if (prompt.ratio === '1:1') aspectRatioValue = '1 / 1';
    
    return `
      <div class="prompt-card" data-id="${prompt.id}" style="cursor: pointer;">
        <h3>${escapeHtml(prompt.title)}</h3>
        <div style="width: 100%; overflow: hidden; border-radius: 14px; margin-bottom: 12px; background: #f0f2f5; aspect-ratio: ${aspectRatioValue} !important;">
          <img src="${prompt.image}" alt="${escapeHtml(prompt.title)}" style="width: 100%; height: 100%; object-fit: cover; display: block;" loading="lazy" onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'">
        </div>
        <div class="short-prompt">${escapeHtml(prompt.short_prompt)}</div>
        <div class="full-prompt" id="full-${prompt.id}">${escapeHtml(prompt.full_prompt)}</div>
        <div class="card-buttons">
          <button class="btn-copy" data-prompt="${prompt.full_prompt.replace(/"/g, '&quot;')}">Copy Prompt</button>
          <button class="btn-show-more" data-id="${prompt.id}">Show More</button>
        </div>
      </div>
    `;
  }).join('');
  
  // ✅ FIX: Cards are now directly visible - removed reveal-stagger class
  
  document.querySelectorAll('.prompt-card').forEach(card => {
    const cardId = card.dataset.id;
    card.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-copy') || 
          e.target.classList.contains('btn-show-more') ||
          e.target.closest('.btn-copy') ||
          e.target.closest('.btn-show-more')) {
        return;
      }
      saveScrollPositionAndPage();
      window.location.href = `pages/prompt.html?id=${cardId}`;
    });
  });
  
  insertInlineAds();
  
  document.querySelectorAll('.btn-copy').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const originalText = btn.textContent;
      const textToCopy = btn.dataset.prompt;
      
      navigator.clipboard.writeText(textToCopy).then(() => {
        btn.textContent = 'Copied! ✓';
        setTimeout(() => {
          btn.textContent = originalText;
        }, 1500);
      }).catch(() => {
        btn.textContent = 'Failed!';
        setTimeout(() => {
          btn.textContent = originalText;
        }, 1500);
      });
    });
  });
  
  document.querySelectorAll('.btn-show-more').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      const fullPromptDiv = document.getElementById(`full-${id}`);
      if (fullPromptDiv.classList.contains('show')) {
        fullPromptDiv.classList.remove('show');
        btn.textContent = 'Show More';
      } else {
        fullPromptDiv.classList.add('show');
        btn.textContent = 'Show Less';
      }
    });
  });
  
  renderPagination(totalItems);
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  if (loadMoreBtn) loadMoreBtn.style.display = 'none';
}

// ============================================================
// INLINE ADS
// ============================================================
function insertInlineAds() {
  const grid = document.getElementById('promptsGrid');
  if (!grid) return;
  
  const cards = grid.children;
  const cardsArray = Array.from(cards);
  const existingAds = grid.querySelectorAll('.ad-container');
  existingAds.forEach(ad => ad.remove());
  
  cardsArray.forEach(card => grid.appendChild(card));
  
  const adPositions = [];
  for (let i = 2; i <= cardsArray.length; i += 2) {
    adPositions.push(i);
  }
  
  for (let i = 0; i < cardsArray.length; i++) {
    const card = cardsArray[i];
    if (adPositions.includes(i + 1)) {
      const adDiv = document.createElement('div');
      adDiv.className = 'ad-container';
      adDiv.style.margin = '0';
      adDiv.style.marginBottom = '20px';
      adDiv.innerHTML = `
        <div class="ad-label">Sponsored</div>
        <div class="ad-placeholder">
          <i class="fas fa-ad" style="margin-right: 8px;"></i>
          Advertisement Space
        </div>
      `;
      if (card.nextSibling) {
        grid.insertBefore(adDiv, card.nextSibling);
      } else {
        grid.appendChild(adDiv);
      }
    }
  }
}

// ============================================================
// SEARCH SETUP
// ============================================================
function setupSearch() {
  const searchInput = document.getElementById('liveSearchInput');
  const suggestionsDiv = document.getElementById('searchSuggestions');
  let debounceTimer;
  
  if (!searchInput) return;
  
  function renderSuggestions(query) {
    if (query.length < 1) {
      suggestionsDiv.classList.remove('active');
      return;
    }
    
    const suggestions = getSearchSuggestions(query);
    
    if (suggestions.length === 0) {
      suggestionsDiv.innerHTML = `
        <div class="suggestion-no-results">
          <i class="fas fa-search"></i> No results found for "${escapeHtml(query)}"
        </div>
      `;
      suggestionsDiv.classList.add('active');
      return;
    }
    
    suggestionsDiv.innerHTML = `
      <div class="suggestions-scroll-container" style="max-height: 400px; overflow-y: auto; overflow-x: hidden;">
        ${suggestions.map(prompt => `
          <div class="suggestion-item" data-id="${prompt.id}" data-title="${escapeHtml(prompt.title)}">
            <img class="suggestion-thumbnail" src="${prompt.image}" alt="${escapeHtml(prompt.title)}" loading="lazy" onerror="this.src='https://via.placeholder.com/48x48?text=No+Image'">
            <div class="suggestion-info">
              <div class="suggestion-title">${highlightMatch(prompt.title, query)}</div>
              <span class="suggestion-category">${escapeHtml(prompt.category)}</span>
              <div class="suggestion-match">${highlightMatch(prompt.short_prompt.substring(0, 60), query)}...</div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
    
    suggestionsDiv.classList.add('active');
    
    document.querySelectorAll('.suggestion-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const promptId = item.dataset.id;
        const promptTitle = item.dataset.title;
        searchInput.value = promptTitle;
        performSearch(promptTitle);
        suggestionsDiv.classList.remove('active');
        setTimeout(() => {
          scrollToCardById(promptId);
        }, 200);
      });
    });
  }
  
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    clearTimeout(debounceTimer);
    if (query.length === 0) {
      suggestionsDiv.classList.remove('active');
      if (isSearchMode) performSearch('');
      return;
    }
    debounceTimer = setTimeout(() => {
      renderSuggestions(query);
    }, 150);
  });
  
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const query = searchInput.value.trim();
      if (query) {
        performSearch(query);
        suggestionsDiv.classList.remove('active');
      }
    }
  });
  
  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !suggestionsDiv.contains(e.target)) {
      suggestionsDiv.classList.remove('active');
    }
  });
}

// ============================================================
// EVENT LISTENERS
// ============================================================
function setupEventListeners() {
  const searchToggle = document.getElementById('searchToggleBtn');
  const searchExpand = document.getElementById('searchExpand');
  if (searchToggle) {
    searchToggle.addEventListener('click', () => {
      searchExpand.classList.toggle('active');
    });
  }
  
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const searchInput = document.getElementById('liveSearchInput');
  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      clearSearch();
      document.getElementById('searchSuggestions').classList.remove('active');
    });
  }
  
  const mobileCatBtn = document.getElementById('mobileCategoryBtn');
  if (mobileCatBtn) {
    mobileCatBtn.addEventListener('click', () => {
      document.getElementById('categoriesList').scrollIntoView({ behavior: 'smooth' });
    });
  }
  
  const closeSticky = document.getElementById('closeStickyAd');
  if (closeSticky) {
    closeSticky.addEventListener('click', () => {
      document.getElementById('stickyBottomAd').style.display = 'none';
    });
  }
  
  setupSearch();
}

// ============================================================
// LOAD DATA & INITIALIZE
// ============================================================
async function loadData() {
  try {
    const [galleryRes, trendingRes, promptsRes, categoriesRes] = await Promise.all([
      fetch('data/gallery.json'),
      fetch('data/trending.json'),
      fetch('data/prompts.json'),
      fetch('data/categories.json')
    ]);
    
    galleryImages = await galleryRes.json();
    let trendingData = await trendingRes.json();
    allPrompts = await promptsRes.json();
    const categories = await categoriesRes.json();
    
    trendingData = shuffleArray(trendingData);
    
    const savedPrompts = getSavedShuffledPrompts();
    if (savedPrompts) {
      shuffledPrompts = savedPrompts;
    } else {
      shuffledPrompts = shuffleArray([...allPrompts]);
      saveShuffledPrompts(shuffledPrompts);
    }
    
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('q') || urlParams.get('search') || urlParams.get('query');
    if (searchQuery) {
      currentSearchQuery = searchQuery.toLowerCase();
      performSearch(currentSearchQuery, true);
    }
    
    initializeGallery();
    initializeTrending(trendingData);
    initializeCategories(categories);
    
    restoreScrollPositionAndPage();
    renderPrompts();
    setupEventListeners();
    
    // Load J-Style Hub
    try {
      const jstyleRes = await fetch('data/jstylehub.json');
      if (jstyleRes.ok) {
        const jstyleCollections = await jstyleRes.json();
        initializeJStyleHub(jstyleCollections);
      }
    } catch (jstyleError) {
      console.log('J-Style Hub file not found, skipping...');
    }
    
    // Load Featured Collections
    await loadCollections();
    
    // Initialize premium features after data loads
    setTimeout(() => {
      initScrollReveal();
      initCountUps();
      initHeaderScroll();
      initRippleEffect();
    }, 300);
    
  } catch (error) {
    console.error('Error loading data:', error);
  }
}

// ============================================================
// INJECT RIPPLE STYLES
// ============================================================
injectRippleStyles();

// ============================================================
// START
// ============================================================
loadData();