function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = message;
  container.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(5px)';
  }, 2200);
  setTimeout(() => {
    el.remove();
  }, 2700);
}

document.addEventListener('DOMContentLoaded', () => {
  // Year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Deposit tabs (used in modal + payments page)
  const depositTabs = document.querySelectorAll('[data-deposit-tab]');
  const depositGroups = document.querySelectorAll('[data-deposit-group]');
  if (depositTabs.length && depositGroups.length) {
    depositTabs.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.depositTab;
        depositTabs.forEach(b => b.classList.toggle('active', b === btn));
        depositGroups.forEach(g => {
          g.classList.toggle('hidden-group', g.dataset.depositGroup !== target);
        });
      });
    });
  }

  // Tournament tabs
  const tTabs = document.querySelectorAll('[data-tournament-tab]');
  const tGroups = document.querySelectorAll('[data-tournament-group]');
  if (tTabs.length && tGroups.length) {
    tTabs.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tournamentTab;
        tTabs.forEach(b => b.classList.toggle('active', b === btn));
        tGroups.forEach(g => {
          g.classList.toggle('hidden-group', g.dataset.tournamentGroup !== target);
        });
      });
    });
  }

  // Account dropdown
  const accountCard = document.querySelector('.account-switcher');
  const accountSelect = document.getElementById('account-select');
  const accountBalance = document.getElementById('account-balance');
  const totalBalance = document.getElementById('total-balance');
  if (accountCard && accountSelect && accountBalance) {
    const real = accountCard.dataset.balanceReal || '$0.00';
    const demo = accountCard.dataset.balanceDemo || '$10,000.00';

    const updateAccountUI = () => {
      const v = accountSelect.value;
      if (v === 'demo') {
        accountBalance.textContent = demo;
        if (totalBalance) totalBalance.textContent = demo;
      } else {
        accountBalance.textContent = real;
        if (totalBalance) totalBalance.textContent = real;
      }
    };
    accountSelect.addEventListener('change', updateAccountUI);
    updateAccountUI();
  }

  // AI feed rotation
  const feedList = document.getElementById('ai-feed-list');
  if (feedList) {
    const messages = [
      '[12:00] AI Bot: Scanning BTC, ETH and USDT markets...',
      '[12:05] AI Bot: Risk level set to conservative for this account.',
      '[12:10] AI Bot: Watching support levels on major pairs.',
      '[12:15] AI Bot: No action required – portfolio remains balanced.',
      '[12:20] AI Bot: Preparing next rebalancing window.'
    ];
    let index = 0;

    const renderMessage = () => {
      feedList.innerHTML = '';
      const li = document.createElement('li');
      li.textContent = messages[index];
      feedList.appendChild(li);
    };

    renderMessage();
    setInterval(() => {
      index = (index + 1) % messages.length;
      renderMessage();
    }, 5000);
  }

  // Program modal
  const programModal = document.getElementById('program-modal');
  const programTitle = document.getElementById('program-modal-title');
  const programTagline = document.getElementById('program-modal-tagline');
  const programDetails = document.getElementById('program-modal-details');
  const programButtons = document.querySelectorAll('.btn-program');

  if (programModal && programTitle && programTagline && programDetails && programButtons.length) {
    programButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.dataset.programName || 'AI Program';
        const risk = btn.dataset.programRisk || '';
        const target = btn.dataset.programTarget || '';
        const min = btn.dataset.programMin || '';

        programTitle.textContent = name;
        programTagline.textContent = risk;
        programDetails.innerHTML = '';

        if (target) {
          const li1 = document.createElement('li');
          li1.textContent = `Target return: ${target}`;
          programDetails.appendChild(li1);
        }
        if (min) {
          const li2 = document.createElement('li');
          li2.textContent = `Minimum deposit: ${min}`;
          programDetails.appendChild(li2);
        }
        const li3 = document.createElement('li');
        li3.textContent = 'Funds will be allocated and monitored by the AI bot under this strategy.';
        programDetails.appendChild(li3);

        programModal.classList.remove('hidden');
      });
    });
  }

  // Avatar preview
  const avatarInput = document.getElementById('avatar-input');
  const avatarPreview = document.getElementById('avatar-preview');
  if (avatarInput && avatarPreview) {
    avatarInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        avatarPreview.style.backgroundImage = `url(${ev.target.result})`;
        avatarPreview.classList.add('has-image');
      };
      reader.readAsDataURL(file);
    });
  }

  // Login form logic
  const loginForm = document.getElementById('login-form');
  const demoLoginBtn = document.getElementById('demo-login-btn');
  const goDashboard = () => {
    showToast('Logged in (demo mode)');
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 800);
  };

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Checking credentials (demo)');
      setTimeout(goDashboard, 600);
    });
  }
  if (demoLoginBtn) {
    demoLoginBtn.addEventListener('click', () => {
      goDashboard();
    });
  }

  // Forms feedback – deposit / withdraw / convert / gift card
  document.querySelectorAll('.deposit-form, .withdraw-form, .convert-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Request sent (demo only). Admin will review.');
      form.reset();
    });
  });
});

// Modal helpers
function openDepositModal() {
  const modal = document.getElementById('deposit-modal');
  if (modal) modal.classList.remove('hidden');
}
function closeDepositModal() {
  const modal = document.getElementById('deposit-modal');
  if (modal) modal.classList.add('hidden');
}
function openWithdrawModal() {
  const modal = document.getElementById('withdraw-modal');
  if (modal) modal.classList.remove('hidden');
}
function closeWithdrawModal() {
  const modal = document.getElementById('withdraw-modal');
  if (modal) modal.classList.add('hidden');
}
function openConvertModal() {
  const modal = document.getElementById('convert-modal');
  if (modal) modal.classList.remove('hidden');
}
function closeConvertModal() {
  const modal = document.getElementById('convert-modal');
  if (modal) modal.classList.add('hidden');
}
function closeProgramModal() {
  const modal = document.getElementById('program-modal');
  if (modal) modal.classList.add('hidden');
}
function scrollToWallet() {
  const el = document.getElementById('wallet');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}
