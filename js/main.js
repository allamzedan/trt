// Reveal on scroll
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('is-visible');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => io.observe(el));


// Stats counter animation
const statCounters = document.querySelectorAll('.stat__num[data-count-target]');
const statsSection = document.querySelector('.stats');
let countersStarted = false;

function animateStatCounter(counter) {
  const target = Number(counter.dataset.countTarget || 0);
  const prefix = counter.dataset.countPrefix || '';
  const suffix = counter.dataset.countSuffix || '';
  const duration = 1400;
  const startTime = performance.now();

  function frame(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = target * eased;

    counter.textContent =
      prefix + Math.round(value).toLocaleString() + suffix;

    if (progress < 1) {
      requestAnimationFrame(frame);
    } else {
      counter.textContent =
        prefix + target.toLocaleString() + suffix;
    }
  }

  requestAnimationFrame(frame);
}

if (statsSection && statCounters.length) {
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersStarted) {
        countersStarted = true;
        statCounters.forEach(animateStatCounter);
        statsObserver.unobserve(statsSection);
      }
    });
  }, { threshold: 0.35 });

  statsObserver.observe(statsSection);
}


// Testimonials slider
const track = document.getElementById('testimonialTrack');
const cards = Array.from(track.children);
const dots = document.getElementById('dots');
const prev = document.querySelector('.arrow--prev');
const next = document.querySelector('.arrow--next');

let index = 0;

function visibleCount() {
  return window.innerWidth <= 760 ? 1 :
         window.innerWidth <= 1100 ? 2 : 3;
}

function maxIndex() {
  return Math.max(0, cards.length - visibleCount());
}

function renderDots() {
  dots.innerHTML = '';
  for (let i = 0; i <= maxIndex(); i++) {
    const b = document.createElement('button');
    b.className = 'dotbtn' + (i === index ? ' active' : '');
    b.type = 'button';
    b.setAttribute('aria-label', 'Go to testimonial set ' + (i + 1));
    b.onclick = () => {
      index = i;
      update();
    };
    dots.appendChild(b);
  }
}

function update() {
  index = Math.min(index, maxIndex());
  const cardWidth = cards[0].getBoundingClientRect().width;
  track.style.transform = `translateX(${-index * cardWidth}px)`;
  renderDots();
}

prev.addEventListener('click', () => {
  index = index <= 0 ? maxIndex() : index - 1;
  update();
  restart();
});

next.addEventListener('click', () => {
  index = index >= maxIndex() ? 0 : index + 1;
  update();
  restart();
});

let timer = setInterval(() => {
  index = index >= maxIndex() ? 0 : index + 1;
  update();
}, 4000);

function restart() {
  clearInterval(timer);
  timer = setInterval(() => {
    index = index >= maxIndex() ? 0 : index + 1;
    update();
  }, 4000);
}


// Use case modal
const useCases = {
  clinic: {
    tag: 'Clinic Website',
    title: 'TRT Clinic Website',
    text: 'A polished medical website for a specialized TRT clinic...',
    points: [
      'Book consultation flow',
      'Doctor-led trust positioning',
      'Service pages for TRT evaluation and treatment'
    ],
    image: 'assets/clinic-design.jpg',
    fallback: 'assets/clinic-design',
    alt: 'TRT clinic website concept preview'
  },
  telemedicine: {
    tag: 'Telehealth Platform',
    title: 'Telemedicine Platform',
    text: 'A scalable online care experience...',
    points: [
      'Digital intake and eligibility screening',
      'Lab review and provider follow-up',
      'Subscription-style care model'
    ],
    image: 'assets/telemedicine-design.jpg',
    fallback: 'assets/telemedicine-design',
    alt: 'Telemedicine platform concept preview'
  },
  wellness: {
    tag: 'Men’s Health Brand',
    title: 'Men’s Health Brand',
    text: 'A content-led authority brand...',
    points: [
      'Educational content hub',
      'Email capture and nurture sequences',
      'Productized health programs'
    ],
    image: 'assets/health-brand-design.jpg',
    fallback: 'assets/health-brand-design',
    alt: 'Men’s health brand concept preview'
  },
  leadgen: {
    tag: 'Lead Generation',
    title: 'Conversion Landing Page',
    text: 'A high-intent landing page...',
    points: [
      'Short qualification form',
      'Call booking and inquiry routing',
      'Paid-search campaign destination'
    ],
    image: 'assets/conversation-design.jpg',
    fallback: 'assets/conversation-design',
    alt: 'Conversion landing page concept preview'
  }
};

const useModal = document.getElementById('useModal');
const useModalImage = document.getElementById('useModalImage');
const useModalTag = document.getElementById('useModalTag');
const useModalTitle = document.getElementById('useModalTitle');
const useModalText = document.getElementById('useModalText');
const useModalPoints = document.getElementById('useModalPoints');
const closeUseModal = document.querySelector('.use-modal__close');

function openUseCase(key) {
  const item = useCases[key];
  if (!item) return;

  useModalTag.textContent = item.tag;
  useModalTitle.textContent = item.title;
  useModalText.textContent = item.text;
  useModalPoints.innerHTML =
    item.points.map(p => `<li>${p}</li>`).join('');

  useModalImage.innerHTML =
    `<img src="${item.image}" alt="${item.alt}"
     onerror="this.onerror=null;this.src='${item.fallback}';">`;

  useModal.classList.add('is-open');
  useModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function hideUseCase() {
  useModal.classList.remove('is-open');
  useModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.querySelectorAll('.use-card')
  .forEach(card =>
    card.addEventListener('click',
      () => openUseCase(card.dataset.use)
    )
  );

closeUseModal.addEventListener('click', hideUseCase);

useModal.addEventListener('click', (e) => {
  if (e.target === useModal) hideUseCase();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && useModal.classList.contains('is-open')) {
    hideUseCase();
  }
});


// Resize handling
window.addEventListener('resize', update);
update();

// Lucide icons
if (window.lucide) {
  lucide.createIcons();
}