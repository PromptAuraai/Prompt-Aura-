// ========== ADSENSE READY CONFIGURATION ==========
// Sirf apni AdSense Publisher ID yahan dalo
// Example: const ADSENSE_PUBLISHER_ID = 'ca-pub-1234567890123456';

const ADSENSE_PUBLISHER_ID = 'ca-pub-XXXXXXXXXXXXXXXX'; // ← YAHAN APNI ID DALO

// ========== AD POSITIONS (DON'T CHANGE) ==========
// Ye positions pe ads automatically insert honge
const AD_POSITIONS = {
  BANNER_TOP: 'adAfterGallery',      // Gallery ke baad
  BANNER_MID: 'adAfterTrending',     // Trending ke baad
  INLINE: [1, 3, 5, 7, 9],                 // Cards ke beech (positions 2,4,6,8,10 ke baad)
  SIDEBAR: ['sidebarAd1', 'sidebarAd2'],
  STICKY_BOTTOM: 'stickyBottomAd'
};

// ========== INITIALIZE ADS ==========
window.addEventListener('load', function() {
  console.log('AdSense ready - Add your publisher ID to enable ads');
  
  // Check if AdSense ID is configured
  if (ADSENSE_PUBLISHER_ID === 'ca-pub-XXXXXXXXXXXXXXXX') {
    console.warn('⚠️ Please add your AdSense Publisher ID in ads.js file');
    console.warn('📍 Open ads.js and replace XXXXXXXXXXXXXXXX with your ID');
  } else {
    console.log('✅ AdSense configured with ID: ' + ADSENSE_PUBLISHER_ID);
    loadAdSenseScript();
  }
  
  // Initialize all ad containers with proper formatting
  initializeAdContainers();
});

// Load AdSense script dynamically
function loadAdSenseScript() {
  // Check if script already exists
  if (document.querySelector('script[src*="adsbygoogle.js"]')) {
    return;
  }
  
  const script = document.createElement('script');
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUBLISHER_ID}`;
  script.async = true;
  script.crossOrigin = 'anonymous';
  document.head.appendChild(script);
  
  console.log('📢 AdSense script loaded');
}

// Initialize all ad containers
function initializeAdContainers() {
  // Format banner ads
  formatBannerAd('adAfterGallery');
  formatBannerAd('adAfterTrending');
  
  // Format sticky bottom ad
  formatStickyAd();
  
  // Setup inline ad refresh
  window.refreshAds = function() {
    console.log('🔄 Ads refreshed');
    refreshInlineAds();
  };
}

// Format banner ad container
function formatBannerAd(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  // Remove placeholder content
  if (container.querySelector('.ad-placeholder')) {
    const placeholder = container.querySelector('.ad-placeholder');
    
    if (ADSENSE_PUBLISHER_ID !== 'ca-pub-XXXXXXXXXXXXXXXX') {
      // Replace with AdSense code
      const ins = document.createElement('ins');
      ins.className = 'adsbygoogle';
      ins.style.display = 'block';
      ins.style.textAlign = 'center';
      ins.setAttribute('data-ad-client', ADSENSE_PUBLISHER_ID);
      ins.setAttribute('data-ad-slot', 'YOUR_AD_SLOT'); // ← Apna ad slot yahan dalo
      ins.setAttribute('data-ad-format', 'auto');
      ins.setAttribute('data-full-width-responsive', 'true');
      
      placeholder.innerHTML = '';
      placeholder.appendChild(ins);
      
      // Push ad
      (adsbygoogle = window.adsbygoogle || []).push({});
    } else {
      // Keep placeholder
      placeholder.innerHTML = '<i class="fas fa-ad" style="margin-right: 8px;"></i> Advertisement Space<br><small style="font-size: 11px;">Add your AdSense code in ads.js</small>';
    }
  }
}

// Format sticky bottom ad
function formatStickyAd() {
  const stickyAd = document.getElementById('stickyBottomAd');
  if (!stickyAd) return;
  
  const placeholder = stickyAd.querySelector('.ad-placeholder');
  if (placeholder) {
    if (ADSENSE_PUBLISHER_ID !== 'ca-pub-XXXXXXXXXXXXXXXX') {
      const ins = document.createElement('ins');
      ins.className = 'adsbygoogle';
      ins.style.display = 'block';
      ins.setAttribute('data-ad-client', ADSENSE_PUBLISHER_ID);
      ins.setAttribute('data-ad-slot', 'YOUR_STICKY_AD_SLOT');
      ins.setAttribute('data-ad-format', 'auto');
      
      placeholder.innerHTML = '';
      placeholder.appendChild(ins);
      (adsbygoogle = window.adsbygoogle || []).push({});
    } else {
      placeholder.innerHTML = '<i class="fas fa-ad"></i> Mobile Sticky Ad';
    }
  }
}

// Refresh inline ads (called after pagination or dynamic content load)
function refreshInlineAds() {
  // Find all inline ad containers
  const inlineAds = document.querySelectorAll('.ad-container .ad-placeholder');
  
  inlineAds.forEach(ad => {
    if (ad.contains(ad.querySelector('ins'))) return;
    
    if (ADSENSE_PUBLISHER_ID !== 'ca-pub-XXXXXXXXXXXXXXXX') {
      const ins = document.createElement('ins');
      ins.className = 'adsbygoogle';
      ins.style.display = 'block';
      ins.setAttribute('data-ad-client', ADSENSE_PUBLISHER_ID);
      ins.setAttribute('data-ad-slot', 'YOUR_INLINE_AD_SLOT');
      ins.setAttribute('data-ad-format', 'rectangle');
      
      ad.innerHTML = '';
      ad.appendChild(ins);
      (adsbygoogle = window.adsbygoogle || []).push({});
    }
  });
}

// ========== HELPER FUNCTIONS FOR DYNAMIC ADS ==========
// Call this function after rendering new content (pagination, search, etc.)
function updateAdUnits() {
  if (typeof adsbygoogle !== 'undefined') {
    (adsbygoogle = window.adsbygoogle || []).push({});
  }
}

// Export for use in other scripts
window.updateAdUnits = updateAdUnits;
window.adsReady = true;