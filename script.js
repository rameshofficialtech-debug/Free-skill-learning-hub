// Mobile menu
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
if (menuBtn && navLinks) {
  menuBtn.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('active');
    menuBtn.setAttribute('aria-expanded', String(isOpen));
  });
  navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    menuBtn.setAttribute('aria-expanded', 'false');
  }));
}

const courses = [
  { name:'Web Development', provider:'freeCodeCamp', level:'Beginner', duration:'30 Days', icon:'fa-solid fa-code', link:'https://www.freecodecamp.org/learn/2022/responsive-web-design/' },
  { name:'AI & ML', provider:'Google AI', level:'Beginner', duration:'45 Days', icon:'fa-solid fa-brain', link:'https://grow.google/ai/' },
  { name:'Data Analytics', provider:'IBM SkillsBuild', level:'Beginner', duration:'40 Days', icon:'fa-solid fa-chart-line', link:'https://skillsbuild.org/students/course-catalog/data' },
  { name:'Digital Marketing', provider:'Google Skillshop', level:'Beginner', duration:'20 Days', icon:'fa-solid fa-bullhorn', link:'https://skillshop.withgoogle.com/' },
  { name:'UI/UX Design', provider:'Figma Learn', level:'Beginner', duration:'25 Days', icon:'fa-solid fa-pen-ruler', link:'https://help.figma.com/hc/en-us/categories/360002051613-Designing-with-Figma' },
  { name:'Python', provider:'Kaggle Learn', level:'Beginner', duration:'30 Days', icon:'fa-brands fa-python', link:'https://www.kaggle.com/learn/python' },
  { name:'Java', provider:'Java Learning', level:'Beginner', duration:'35 Days', icon:'fa-brands fa-java', link:'https://dev.java/learn/' }
];

const coursesGrid = document.getElementById('coursesGrid');
if (coursesGrid) {
  coursesGrid.innerHTML = courses.map(item => `
    <article class="course-card reveal clickable-card" data-href="${item.link}" tabindex="0" role="link" title="Visit Official Course">
      <div class="card-badges"><span class="free-tag">Free Course</span><span class="official-badge">${item.provider}</span></div>
      <i class="${item.icon}"></i><h3>${item.name}</h3>
      <div class="course-meta"><span><i class="fa-solid fa-signal"></i> ${item.level}</span><span><i class="fa-regular fa-clock"></i> ${item.duration}</span></div>
      <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="small-btn course-btn">Learn Now <i class="fa-solid fa-arrow-up-right-from-square"></i></a>
    </article>`).join('');
  coursesGrid.hidden = false;
}

const certificates = [
  { name:'Google', title:'Google Certificates', link:'https://grow.google/certificates/' },
  { name:'Microsoft', title:'Microsoft Learn', link:'https://learn.microsoft.com/training/' },
  { name:'IBM', title:'IBM SkillsBuild', link:'https://skillsbuild.org/' },
  { name:'Cisco', title:'Cisco Networking Academy', link:'https://www.netacad.com/' },
  { name:'Meta', title:'Meta Blueprint', link:'https://www.facebook.com/business/learn' },
  { name:'AWS', title:'AWS Skill Builder', link:'https://skillbuilder.aws/' },
  { name:'LinkedIn', title:'LinkedIn Learning', link:'https://www.linkedin.com/learning/' },
  { name:'HubSpot', title:'HubSpot Academy', link:'https://academy.hubspot.com/' }
];

const certGrid = document.getElementById('certGrid');
if (certGrid) {
  certGrid.innerHTML = certificates.map(item => `
    <article class="cert-card reveal clickable-card" data-href="${item.link}" tabindex="0" role="link" title="Visit Official Certificate">
      <div class="logo-placeholder" aria-hidden="true">${item.name.charAt(0)}</div><h3>${item.title}</h3>
      <span class="price-badge free">Free Learning Resources</span>
      <p>Explore courses and certificate opportunities from ${item.name}.</p>
      <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="small-btn certificate-btn">Get Certificate <i class="fa-solid fa-arrow-up-right-from-square"></i></a>
    </article>`).join('');
}

function openCard(card) {
  window.open(card.dataset.href, '_blank', 'noopener,noreferrer');
}
document.addEventListener('click', event => {
  const card = event.target.closest('.clickable-card');
  if (card && !event.target.closest('a')) openCard(card);
});
document.addEventListener('keydown', event => {
  const card = event.target.closest('.clickable-card');
  if (card && (event.key === 'Enter' || event.key === ' ')) {
    event.preventDefault();
    openCard(card);
  }
});

// Smooth reveal animation
const revealElements = document.querySelectorAll('.reveal');
function revealOnScroll() {
  revealElements.forEach(element => {
    if (element.getBoundingClientRect().top < window.innerHeight - 80) element.classList.add('active');
  });
}
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// Simple frontend form actions only
const loginForm = document.getElementById('loginForm');
if (loginForm) loginForm.addEventListener('submit', event => {
  event.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const savedUser = JSON.parse(localStorage.getItem('skillHubUser') || 'null');
  if (!savedUser) localStorage.setItem('skillHubUser', JSON.stringify({ name:email.split('@')[0], email }));
  window.location.href = 'dashboard.html';
});
const registerForm = document.getElementById('registerForm');
if (registerForm) registerForm.addEventListener('submit', event => {
  event.preventDefault();
  const password = document.getElementById('registerPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const feedback = document.getElementById('registerFeedback');
  if (password !== confirmPassword) {
    feedback.textContent = 'Passwords do not match. Please try again.';
    return;
  }
  localStorage.setItem('skillHubUser', JSON.stringify({ name:document.getElementById('registerName').value.trim(), email:document.getElementById('registerEmail').value.trim() }));
  alert('Account created successfully! Please login.');
  window.location.href = 'login.html';
});

document.querySelectorAll('[data-password-target]').forEach(button => button.addEventListener('click', () => {
  const input = document.getElementById(button.dataset.passwordTarget);
  const showing = input.type === 'text';
  input.type = showing ? 'password' : 'text';
  button.innerHTML = `<i class="fa-regular fa-eye${showing ? '' : '-slash'}"></i>`;
  button.setAttribute('aria-label', showing ? 'Show password' : 'Hide password');
}));

document.getElementById('forgotPassword')?.addEventListener('click', event => {
  event.preventDefault();
  alert('Password recovery is a frontend demo. Please contact support for help.');
});

document.querySelectorAll('.demo-google-btn').forEach(button => button.addEventListener('click', () => {
  alert('Google sign-in is a UI demo. No account information is sent.');
}));

const dashboardStudentName = document.getElementById('dashboardStudentName');
if (dashboardStudentName) {
  const savedUser = JSON.parse(localStorage.getItem('skillHubUser') || 'null');
  if (savedUser?.name) dashboardStudentName.textContent = savedUser.name;
}

// Demo subscription flow (localStorage only)
const SUBSCRIPTIONS_KEY = 'skillHubSubscriptions';
const CURRENT_SUBSCRIPTION_KEY = 'skillHubCurrentSubscription';
const checkoutPlanDetails = {
  Monthly: { label: 'Monthly Plan', amount: 30, months: 1, renewal: '₹30 monthly auto-pay' },
  '3 Months': { label: '3 Months Plan', amount: 50, months: 3, renewal: '₹50 every 3 months auto-pay' },
  '6 Months': { label: '6 Months Plan', amount: 80, months: 6, renewal: '₹80 every 6 months auto-pay' }
};

function getSubscriptions() {
  try { return JSON.parse(localStorage.getItem(SUBSCRIPTIONS_KEY)) || []; }
  catch (error) { return []; }
}

function formatSubscriptionDate(value) {
  if (!value) return 'Not available';
  return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value));
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 2600);
}

document.querySelectorAll('[data-copy]').forEach(button => button.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(button.dataset.copy);
    showToast('Payment detail copied');
  } catch (error) {
    const input = document.createElement('textarea');
    input.value = button.dataset.copy;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    input.remove();
    showToast('Payment detail copied');
  }
}));

let selectedCheckoutPlan = 'Monthly';

function updateCheckoutSummary(plan) {
  selectedCheckoutPlan = plan;
  const details = checkoutPlanDetails[plan];
  document.getElementById('summaryPlan').textContent = details.label;
  document.getElementById('summaryAfter').textContent = details.renewal;
}

document.querySelectorAll('.checkout-plan').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.checkout-plan').forEach(item => item.classList.remove('selected'));
  button.classList.add('selected');
  updateCheckoutSummary(button.dataset.plan);
}));

function addMonthsToDate(date, months) {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

function getCurrentSubscription() {
  const currentId = localStorage.getItem(CURRENT_SUBSCRIPTION_KEY);
  return getSubscriptions().find(item => item.id === currentId);
}

function getSubscriptionState(record) {
  if (!record) return 'none';
  if (['rejected', 'cancelled', 'expired'].includes(record.status)) return record.status;
  if (record.paymentStatus === 'received' || record.status === 'active') return 'active';
  if (record.verificationStatus !== 'approved' && new Date() >= new Date(record.trialEndDate)) return 'pending-verification';
  if (new Date() >= new Date(record.trialEndDate)) return 'payment-required';
  return 'trial-active';
}

function activateFreeTrial(event) {
  event.preventDefault();
  const form = document.getElementById('trialForm');
  if (!form.reportValidity()) return;
  const existing = getCurrentSubscription();
  if (existing && !['rejected','cancelled','expired'].includes(getSubscriptionState(existing))) {
    document.getElementById('trialFeedback').textContent = 'You already have a trial or subscription in progress.';
    showToast('A subscription request is already active');
    return;
  }
  const details = checkoutPlanDetails[selectedCheckoutPlan];
  const trialStartDate = new Date();
  const trialEndDate = new Date(trialStartDate);
  trialEndDate.setDate(trialEndDate.getDate() + 7);
  const record = {
    id: `SUB-${Date.now()}`,
    name: document.getElementById('trialName').value.trim(),
    email: document.getElementById('trialEmail').value.trim(),
    phone: document.getElementById('trialPhone').value.trim(),
    studentStatus: document.getElementById('studentStatus').value,
    plan: selectedCheckoutPlan,
    planLabel: details.label,
    amount: details.amount,
    months: details.months,
    paymentMethod: 'UPI AutoPay',
    autoPay: true,
    verificationStatus: 'pending',
    paymentStatus: 'not-required',
    status: 'trial-active',
    startDate: trialStartDate.toISOString(),
    trialStartDate: trialStartDate.toISOString(),
    trialEndDate: trialEndDate.toISOString(),
    expiryDate: addMonthsToDate(trialEndDate, details.months).toISOString()
  };
  const subscriptions = getSubscriptions();
  subscriptions.unshift(record);
  localStorage.setItem(SUBSCRIPTIONS_KEY, JSON.stringify(subscriptions));
  localStorage.setItem(CURRENT_SUBSCRIPTION_KEY, record.id);
  document.getElementById('trialFeedback').textContent = 'Free trial activated. Verification request sent to admin.';
  showToast('Your 1 week free trial is active');
  renderCheckoutRequest(record);
}

document.getElementById('trialForm')?.addEventListener('submit', activateFreeTrial);
document.getElementById('startTrialButton')?.addEventListener('click', () => document.getElementById('trialForm').requestSubmit());

function renderCheckoutRequest(record = getCurrentSubscription()) {
  if (!document.getElementById('currentRequest') || !record) return;
  const details = checkoutPlanDetails[record.plan];
  if (details) {
    selectedCheckoutPlan = record.plan;
    document.querySelectorAll('.checkout-plan').forEach(item => item.classList.toggle('selected', item.dataset.plan === record.plan));
    updateCheckoutSummary(record.plan);
  }
  const state = getSubscriptionState(record);
  const labels = { 'pending-verification':'Pending Verification', 'trial-active':'Free Trial Active', 'payment-required':'Payment Required', active:'Active', rejected:'Verification Rejected', cancelled:'Cancelled', expired:'Expired' };
  document.getElementById('currentRequest').hidden = false;
  document.getElementById('requestStatus').textContent = labels[state] || 'Free Trial Active';
  document.getElementById('requestTrialEnd').textContent = `Trial ends ${formatSubscriptionDate(record.trialEndDate)}`;
  const isApproved = record.verificationStatus === 'approved';
  document.getElementById('paymentLocked').hidden = isApproved;
  document.getElementById('verifiedPayment').hidden = !isApproved;
  document.getElementById('trialEmail').value = record.email || '';
  document.getElementById('trialName').value = record.name || '';
  document.getElementById('trialPhone').value = record.phone || '';
  document.getElementById('studentStatus').value = record.studentStatus || '';
}
renderCheckoutRequest();
window.addEventListener('storage', event => {
  if (event.key === SUBSCRIPTIONS_KEY) {
    renderCheckoutRequest();
    renderDashboardSubscription();
  }
});

function renderDashboardSubscription() {
  const status = document.getElementById('subscriptionStatus');
  if (!status) return;
  const currentId = localStorage.getItem(CURRENT_SUBSCRIPTION_KEY);
  const record = getSubscriptions().find(item => item.id === currentId);
  if (!record) return;
  const today = new Date();
  const trialDays = Math.max(0, Math.ceil((new Date(record.trialEndDate) - today) / 86400000));
  const state = getSubscriptionState(record);
  const stateLabels = { 'pending-verification':'Pending Verification', 'trial-active':'Free Trial Active', 'payment-required':'Payment Required', active:'Active', rejected:'Verification Rejected', cancelled:'Cancelled', expired:'Expired' };
  document.getElementById('currentPlan').textContent = record.planLabel || `${record.plan} Plan`;
  document.getElementById('trialDays').textContent = `${trialDays} day${trialDays === 1 ? '' : 's'}`;
  document.getElementById('expiryDate').textContent = formatSubscriptionDate(record.expiryDate);
  document.getElementById('dashboardPaymentMethod').textContent = record.verificationStatus === 'approved' ? (record.paymentMethod || 'UPI AutoPay') : 'Locked until verification';
  status.textContent = stateLabels[state] || state;
  status.className = `status-badge status-${state}`;
  document.getElementById('dashboardPlanSelect').value = record.plan;
  const canManage = !['rejected','cancelled','expired'].includes(state);
  document.getElementById('dashboardSubscriptionActions').hidden = !canManage;
  document.getElementById('choosePlanBtn').hidden = canManage;
}
renderDashboardSubscription();

document.getElementById('changePlanBtn')?.addEventListener('click', () => {
  const currentId = localStorage.getItem(CURRENT_SUBSCRIPTION_KEY);
  const plan = document.getElementById('dashboardPlanSelect').value;
  const details = checkoutPlanDetails[plan];
  const items = getSubscriptions().map(item => item.id === currentId ? { ...item, plan, planLabel:details.label, amount:details.amount, months:details.months, expiryDate:addMonthsToDate(new Date(item.trialEndDate), details.months).toISOString() } : item);
  localStorage.setItem(SUBSCRIPTIONS_KEY, JSON.stringify(items));
  renderDashboardSubscription();
  window.alert('Subscription plan updated successfully.');
});

document.getElementById('cancelSubscriptionBtn')?.addEventListener('click', () => {
  const currentId = localStorage.getItem(CURRENT_SUBSCRIPTION_KEY);
  if (!currentId || !window.confirm('Cancel this subscription and disable AutoPay?')) return;
  const items = getSubscriptions().map(item => item.id === currentId ? { ...item, status:'cancelled', autoPay:false, cancelledAt:new Date().toISOString() } : item);
  localStorage.setItem(SUBSCRIPTIONS_KEY, JSON.stringify(items));
  renderDashboardSubscription();
  window.alert('Subscription and AutoPay cancelled.');
});
