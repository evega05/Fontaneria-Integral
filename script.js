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

// Intro loader
window.addEventListener('load', function() {
  var intro = document.getElementById('intro');
  if (intro) {
    setTimeout(function() {
      intro.classList.add('hidden');
    }, 1600);
  }
});
