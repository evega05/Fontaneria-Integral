// Hamburger menu
var hamburger = document.getElementById('hamburger');
var mobileMenu = document.getElementById('mobile-menu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', function() {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });
  mobileMenu.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function() {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });
}

// Animated counters
function animateCounter(el) {
  var target = parseInt(el.getAttribute('data-target'));
  if (!target) return;
  var suffix = el.querySelector('.stat-suffix') ? el.querySelector('.stat-suffix').outerHTML : '';
  var duration = 1800;
  var start = Date.now();
  el.innerHTML = '0' + suffix;
  var timer = setInterval(function() {
    var elapsed = Date.now() - start;
    var progress = Math.min(elapsed / duration, 1);
    var ease = 1 - Math.pow(1 - progress, 3);
    el.innerHTML = Math.round(ease * target) + suffix;
    if (progress >= 1) clearInterval(timer);
  }, 16);
}
var statsSection = document.querySelector('.stats-section');
if (statsSection) {
  var counted = false;
  new IntersectionObserver(function(entries) {
    if (entries[0].isIntersecting && !counted) {
      counted = true;
      document.querySelectorAll('.stat-num[data-target]').forEach(animateCounter);
    }
  }, {threshold: 0.3}).observe(statsSection);
}

// FAQ accordion
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.faq-q').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var item = this.closest('.faq-item');
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(function(i) {
        i.classList.remove('open');
        i.querySelector('.faq-a').style.maxHeight = '0';
      });
      if (!isOpen) {
        item.classList.add('open');
        item.querySelector('.faq-a').style.maxHeight = item.querySelector('.faq-a-inner').scrollHeight + 'px';
      }
    });
  });
});

// Hero video autoplay fallback (iOS Low Power Mode / Android data saver block autoplay)
var heroVideo = document.querySelector('.hero-video');
if (heroVideo) {
  var tryPlayHeroVideo = function() {
    heroVideo.muted = true;
    var playPromise = heroVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(function() {});
    }
  };
  tryPlayHeroVideo();
  document.addEventListener('touchstart', tryPlayHeroVideo, { once: true, passive: true });
  document.addEventListener('click', tryPlayHeroVideo, { once: true });
}

// Intro loader
window.addEventListener('load', function() {
  var intro = document.getElementById('intro');
  if (intro) {
    setTimeout(function() {
      intro.classList.add('hidden');
    }, 1600);
  }
});

// Modals
function openModal(id) {
  var el = document.getElementById(id);
  if (el) { el.classList.add('active'); document.body.style.overflow = 'hidden'; }
}
function closeModal(id) {
  var el = document.getElementById(id);
  if (el) { el.classList.remove('active'); document.body.style.overflow = ''; }
}
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('modal-overlay')) {
    closeModal(e.target.id);
  }
});
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.active').forEach(function(m) {
      closeModal(m.id);
    });
  }
});

/* =========================================
   MULTI-STEP MODAL LOGIC & TRACKING
   ========================================= */
let mpCurrentStep = 1;
const mpTotalSteps = 4;
let mpData = {
  servicio: '',
  descripcion: '',
  municipio: '',
  urgente: false,
  nombre: '',
  telefono: ''
};

function openPresupuestoModal(e) {
  if(e) e.preventDefault();
  // Reset state
  mpCurrentStep = 1;
  mpData = { servicio: '', descripcion: '', municipio: '', urgente: false, nombre: '', telefono: '' };
  
  // UI resets
  document.querySelectorAll('.mp-service-card').forEach(c => c.classList.remove('selected'));
  document.getElementById('mp-desc').value = '';
  document.getElementById('mp-municipio').value = '';
  document.getElementById('mp-urgente').checked = false;
  document.getElementById('mp-nombre').value = '';
  document.getElementById('mp-telefono').value = '';
  
  updateMpUI();
  openModal('modal-presupuesto');
}

function selectService(cardElement, serviceName) {
  document.querySelectorAll('.mp-service-card').forEach(c => c.classList.remove('selected'));
  cardElement.classList.add('selected');
  mpData.servicio = serviceName;
  checkNextButton();
}

function nextStep() {
  if (mpCurrentStep === 1) {
    if (!mpData.servicio) return;
  } else if (mpCurrentStep === 2) {
    mpData.descripcion = document.getElementById('mp-desc').value;
    mpData.municipio = document.getElementById('mp-municipio').value;
    mpData.urgente = document.getElementById('mp-urgente').checked;
  } else if (mpCurrentStep === 3) {
    mpData.nombre = document.getElementById('mp-nombre').value;
    mpData.telefono = document.getElementById('mp-telefono').value;
    if (!mpData.telefono) return;
    
    submitPresupuesto();
  }
  
  if (mpCurrentStep < mpTotalSteps) {
    mpCurrentStep++;
    updateMpUI();
  }
}

function prevStep() {
  if (mpCurrentStep > 1) {
    mpCurrentStep--;
    updateMpUI();
  }
}

function updateMpUI() {
  const header = document.getElementById('mp-header');
  const footer = document.getElementById('mp-footer');
  
  if (mpCurrentStep === 4) {
    header.style.display = 'none';
    footer.style.display = 'none';
  } else {
    header.style.display = 'block';
    footer.style.display = 'flex';
    document.getElementById('mp-step-num').textContent = mpCurrentStep;
    
    const titles = ["Servicio", "Descripción", "Contacto"];
    document.getElementById('mp-title').textContent = titles[mpCurrentStep - 1];
    
    for (let i = 1; i <= 3; i++) {
      const bar = document.getElementById('mp-bar-' + i);
      if (i <= mpCurrentStep) bar.classList.add('active');
      else bar.classList.remove('active');
    }
  }

  for (let i = 1; i <= 4; i++) {
    const stepEl = document.getElementById('mp-step-' + i);
    if (i === mpCurrentStep) stepEl.classList.add('active');
    else stepEl.classList.remove('active');
  }

  const btnBack = document.getElementById('mp-btn-back');
  if (mpCurrentStep === 1) btnBack.style.visibility = 'hidden';
  else btnBack.style.visibility = 'visible';

  checkNextButton();
}

function checkNextButton() {
  const btnNext = document.getElementById('mp-btn-next');
  if (mpCurrentStep === 1) {
    btnNext.disabled = !mpData.servicio;
  } else if (mpCurrentStep === 2) {
    btnNext.disabled = false;
  } else if (mpCurrentStep === 3) {
    const tel = document.getElementById('mp-telefono').value;
    btnNext.disabled = tel.trim().length < 9;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const telInput = document.getElementById('mp-telefono');
  if(telInput) {
    telInput.addEventListener('input', checkNextButton);
  }
});

/* =========================================
   TRACKING & HOOKS PARA EL FUTURO DASHBOARD
   ========================================= */

function submitPresupuesto() {
  console.log("=== NUEVO LEAD RECOPILADO (Modal) ===");
  console.log(mpData);
  console.log("Aquí se enviaría al Panel de Control (API Backend).");
}

function trackWhatsAppClick() {
  console.log("=== TRACK: Clic en Botón de WhatsApp ===");
}

function trackPhoneCall() {
  console.log("=== TRACK: Clic en Botón de Llamada Telefónica ===");
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href^="https://wa.me"]').forEach(link => {
    link.addEventListener('click', trackWhatsAppClick);
  });
  
  document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    if (!link.classList.contains('open-modal-btn')) {
      link.addEventListener('click', trackPhoneCall);
    }
  });
});
