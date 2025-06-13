// ---- Animated Pastel Bubbles ----
function createBubbles() {
  const bubbles = document.querySelector('.bubbles');
  for (let i = 0; i < 24; i++) {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    const size = Math.random() * 60 + 30;
    bubble.style.width = size + 'px';
    bubble.style.height = size + 'px';
    bubble.style.left = Math.random() * 100 + 'vw';
    bubble.style.bottom = '-' + (Math.random() * 60) + 'px';
    bubble.style.animationDuration = (Math.random() * 8 + 12) + 's';
    bubbles.appendChild(bubble);
  }
}
createBubbles();

// ---- Typewriter Effect ----
const typewriterText = "🌸 Amorè & Me: 8 Years of EPIC Friendship 🌸";
let twIndex = 0;
function typeWriter() {
  const el = document.getElementById("typewriter");
  if (twIndex <= typewriterText.length) {
    el.innerHTML = typewriterText.substring(0, twIndex) + '<span class="cursor">|</span>';
    twIndex++;
    setTimeout(typeWriter, 80);
  } else {
    el.innerHTML = typewriterText;
  }
}
typeWriter();

// ---- Carousel ----
const imageCount = 45;
let carouselIndex = 0;
const carousel = document.querySelector('.carousel');
const indicators = document.querySelector('.carousel-indicators');
let carouselTimer;

function renderCarousel() {
  carousel.innerHTML = '';
  const img = document.createElement('img');
  img.src = `images/Image${carouselIndex+1}.jpeg`;
  img.alt = `Friendship photo ${carouselIndex+1}`;
  img.tabIndex = 0;
  img.addEventListener('click', () => {
    img.classList.add('enlarged');
    img.addEventListener('click', () => img.classList.remove('enlarged'), { once: true });
  });
  carousel.appendChild(img);

  // Indicators
  indicators.innerHTML = '';
  for (let i = 0; i < imageCount; i++) {
    const dot = document.createElement('span');
    dot.className = 'dot' + (i === carouselIndex ? ' active' : '');
    dot.addEventListener('click', () => { carouselIndex = i; renderCarousel(); resetCarouselTimer(); });
    indicators.appendChild(dot);
  }
}
function nextImage() {
  carouselIndex = (carouselIndex + 1) % imageCount;
  renderCarousel();
}
function prevImage() {
  carouselIndex = (carouselIndex - 1 + imageCount) % imageCount;
  renderCarousel();
}
function resetCarouselTimer() {
  clearInterval(carouselTimer);
  carouselTimer = setInterval(nextImage, 3500);
}
document.querySelector('.carousel-btn.left').onclick = () => { prevImage(); resetCarouselTimer(); };
document.querySelector('.carousel-btn.right').onclick = () => { nextImage(); resetCarouselTimer(); };
renderCarousel();
resetCarouselTimer();

// ---- Pop-up Messages (on scroll) ----
const popupContainer = document.getElementById('popup-container');
const popupMessages = [
  "You're EPIC, Amorè! 💖",
  "6 km walk for Texs? Legendary! 🚶‍♀️✨",
  "Forever friends, forever EPIC! 🌸",
  "Amorè, you light up my phone and heart! 📱💫",
  "Walking, laughing, loving — besties always! 🥰",
  "Here's to 8 years of EPIC friendship! 🎉",
  "You + Me = EPIC Duo! 💕",
  "Never found Texs, but found a treasure in you! 💎",
  "If friendship was fashion, we'd be haute couture! 👗✨",
  "Sending you virtual hugs and pastel vibes! 🐰🌸",
  "You make every day a little more kawaii! 🍥",
  "Our friendship is like bubble tea—sweet, colorful, and a little bit extra! 🧋",
  "You're the cherry blossom to my spring! 🌸",
  "Epic adventures, epic laughs, epic us! 🚶‍♀️💖",
  "Amorè, you're my favorite notification! 📱💬"
];
let lastPopupIdx = -1;
function showPopup() {
  let idx;
  do { idx = Math.floor(Math.random() * popupMessages.length); } while (idx === lastPopupIdx);
  lastPopupIdx = idx;
  const msg = popupMessages[idx];
  const popup = document.createElement('div');
  popup.className = 'popup-message';
  popup.textContent = msg;
  popupContainer.appendChild(popup);
  playChime();
  setTimeout(() => { popup.remove(); }, 6000);
}
let popupTimeout;
function schedulePopup() {
  popupTimeout = setTimeout(() => {
    showPopup();
    schedulePopup();
  }, 4000 + Math.random() * 3500);
}
window.addEventListener('scroll', () => {
  if (!popupTimeout) schedulePopup();
});
window.addEventListener('mousemove', () => {
  if (!popupTimeout) schedulePopup();
});

// ---- Modal Surprise ----
const surpriseBtn = document.querySelector('a[href="#surprise"]');
const modal = document.getElementById('modal');
const closeBtn = document.querySelector('.close-btn');
function showModal() {
  modal.style.display = 'flex';
  playChime();
}
function closeModal() {
  modal.style.display = 'none';
}
surpriseBtn.addEventListener('click', e => {
  e.preventDefault();
  showModal();
});
closeBtn.addEventListener('click', closeModal);
window.addEventListener('click', e => {
  if (e.target === modal) closeModal();
});

// ---- Sound effect ----
function playChime() {
  const chime = document.getElementById('chime-sound');
  if (chime) {
    chime.currentTime = 0;
    chime.play();
  }
}
