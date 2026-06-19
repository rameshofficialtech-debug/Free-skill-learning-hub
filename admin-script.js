const STORAGE_KEY = 'skillHubSubscriptions';
const CURRENT_KEY = 'skillHubCurrentSubscription';

const adminPlanDetails = {
  Monthly: { label:'Monthly Plan', amount:30, months:1 },
  '3 Months': { label:'3 Months Plan', amount:50, months:3 },
  '6 Months': { label:'6 Months Plan', amount:80, months:6 }
};

function readSubscriptions() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch (error) { return []; }
}

function writeSubscriptions(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function addMonths(date, months) {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result.toISOString();
}

function seedDemoSubscriptions() {
  if (localStorage.getItem(STORAGE_KEY) !== null) return;
  const now = new Date();
  const trialEnd = new Date(now); trialEnd.setDate(trialEnd.getDate() + 7);
  const pastTrialStart = new Date(now); pastTrialStart.setDate(pastTrialStart.getDate() - 10);
  const pastTrialEnd = new Date(now); pastTrialEnd.setDate(pastTrialEnd.getDate() - 3);
  writeSubscriptions([
    { id:'DEMO-201', name:'Ananya Rao', email:'ananya@example.com', phone:'9876543210', studentStatus:'College Student', plan:'3 Months', planLabel:'3 Months Plan', amount:50, months:3, verificationStatus:'pending', paymentStatus:'not-required', status:'trial-active', startDate:now.toISOString(), trialStartDate:now.toISOString(), trialEndDate:trialEnd.toISOString(), expiryDate:addMonths(trialEnd,3), autoPay:true },
    { id:'DEMO-202', name:'Arjun Kumar', email:'arjun@example.com', phone:'9123456780', studentStatus:'Recent Graduate', plan:'6 Months', planLabel:'6 Months Plan', amount:80, months:6, verificationStatus:'approved', paymentStatus:'not-required', status:'trial-active', startDate:now.toISOString(), trialStartDate:now.toISOString(), trialEndDate:trialEnd.toISOString(), expiryDate:addMonths(trialEnd,6), autoPay:true },
    { id:'DEMO-203', name:'Priya S', email:'priya@example.com', phone:'9012345678', studentStatus:'Self Learner', plan:'Monthly', planLabel:'Monthly Plan', amount:30, months:1, verificationStatus:'approved', paymentStatus:'required', status:'payment-required', startDate:pastTrialStart.toISOString(), trialStartDate:pastTrialStart.toISOString(), trialEndDate:pastTrialEnd.toISOString(), expiryDate:addMonths(pastTrialEnd,1), autoPay:true }
  ]);
}

function formatDate(value) {
  if (!value) return 'Not available';
  return new Intl.DateTimeFormat('en-IN', { day:'2-digit', month:'short', year:'numeric' }).format(new Date(value));
}

function getAdminState(item) {
  if (['rejected','cancelled','expired'].includes(item.status)) return item.status;
  if ((item.paymentStatus === 'received' || item.status === 'active') && new Date() > new Date(item.expiryDate)) return 'expired';
  if (item.paymentStatus === 'received' || item.status === 'active') return 'active';
  if (item.verificationStatus !== 'approved') return 'pending-verification';
  if (new Date() >= new Date(item.trialEndDate)) return 'payment-required';
  return 'trial-active';
}

function stateLabel(state) {
  return ({ 'pending-verification':'Pending Verification', 'trial-active':'Free Trial Active', 'payment-required':'Payment Required', active:'Active', rejected:'Rejected', cancelled:'Cancelled', expired:'Expired' })[state] || state;
}

function statusBadge(state) {
  return `<span class="status status-${state}">${stateLabel(state)}</span>`;
}

function counts(items) {
  const states = items.map(getAdminState);
  return { total:items.length, active:states.filter(x => x === 'active').length, pending:states.filter(x => x === 'pending-verification').length, expired:states.filter(x => x === 'expired').length };
}

function escapeHtml(value = '') {
  const element = document.createElement('div');
  element.textContent = value;
  return element.innerHTML;
}

function renderOverview() {
  const total = document.getElementById('totalSubscribers');
  if (!total) return;
  const items = readSubscriptions();
  const summary = counts(items);
  total.textContent = summary.total;
  document.getElementById('activeSubscriptions').textContent = summary.active;
  document.getElementById('pendingPayments').textContent = summary.pending;
  document.getElementById('expiredSubscriptions').textContent = summary.expired;
  document.getElementById('recentSubscriptions').innerHTML = items.slice(0,5).map(item => `<tr><td class="student-cell"><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.email)}</small></td><td>${escapeHtml(item.planLabel || item.plan)}</td><td>₹${item.amount}</td><td>${statusBadge(getAdminState(item))}</td><td>${formatDate(item.expiryDate)}</td></tr>`).join('') || '<tr><td colspan="5">No subscription records yet.</td></tr>';
}

function showAdminToast(message) {
  const toast = document.getElementById('adminToast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}

function renderManagement() {
  const body = document.getElementById('subscriptionTableBody');
  if (!body) return;
  const items = readSubscriptions();
  const search = document.getElementById('subscriptionSearch').value.trim().toLowerCase();
  const status = document.getElementById('statusFilter').value;
  const plan = document.getElementById('planFilter').value;
  const filtered = items.filter(item => {
    const state = getAdminState(item);
    const matchesSearch = !search || [item.name,item.email,item.phone].some(value => (value || '').toLowerCase().includes(search));
    return matchesSearch && (status === 'all' || state === status) && (plan === 'all' || item.plan === plan);
  });
  const summary = counts(items);
  document.getElementById('manageTotal').textContent = summary.total;
  document.getElementById('manageActive').textContent = summary.active;
  document.getElementById('managePending').textContent = summary.pending;
  document.getElementById('manageExpired').textContent = summary.expired;
  body.innerHTML = filtered.map(item => {
    const state = getAdminState(item);
    const approved = item.verificationStatus === 'approved';
    return `<tr><td class="student-cell"><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.email)}</small></td><td>${escapeHtml(item.phone || 'Not provided')}</td><td><strong>${escapeHtml(item.planLabel || item.plan)}</strong><small class="table-subtext">₹${item.amount}</small></td><td>${formatDate(item.trialStartDate || item.startDate)}</td><td>${formatDate(item.trialEndDate)}</td><td>${statusBadge(state)}</td><td><div class="actions"><button class="action-btn approve-btn" data-id="${item.id}" data-action="approve" ${approved || ['rejected','cancelled'].includes(state) ? 'disabled' : ''}><i class="fa-solid fa-user-check"></i> Approve Verification</button><button class="action-btn reject-btn" data-id="${item.id}" data-action="reject" ${['rejected','cancelled','active'].includes(state) ? 'disabled' : ''}><i class="fa-solid fa-xmark"></i> Reject</button><button class="action-btn payment-btn" data-id="${item.id}" data-action="payment" ${state !== 'payment-required' ? 'disabled' : ''}><i class="fa-solid fa-indian-rupee-sign"></i> Mark Payment Received</button><button class="action-btn cancel-btn" data-id="${item.id}" data-action="cancel" ${['cancelled','rejected','expired'].includes(state) ? 'disabled' : ''}><i class="fa-solid fa-ban"></i> Cancel Subscription</button></div></td></tr>`;
  }).join('');
  document.getElementById('emptyState').classList.toggle('show', filtered.length === 0);
}

function updateSubscription(id, action) {
  const items = readSubscriptions().map(item => {
    if (item.id !== id) return item;
    if (action === 'approve') return { ...item, verificationStatus:'approved', status:new Date() < new Date(item.trialEndDate) ? 'trial-active' : 'payment-required', paymentStatus:new Date() < new Date(item.trialEndDate) ? 'not-required' : 'required', verifiedAt:new Date().toISOString() };
    if (action === 'reject') return { ...item, verificationStatus:'rejected', status:'rejected' };
    if (action === 'payment') return { ...item, paymentStatus:'received', status:'active', paymentReceivedAt:new Date().toISOString() };
    if (action === 'cancel') return { ...item, status:'cancelled', autoPay:false, cancelledAt:new Date().toISOString() };
    return item;
  });
  writeSubscriptions(items);
  renderManagement();
  renderOverview();
  showAdminToast(({ approve:'Verification approved', reject:'Verification rejected', payment:'Payment marked as received', cancel:'Subscription cancelled' })[action]);
}

seedDemoSubscriptions();
renderOverview();
renderManagement();
['subscriptionSearch','statusFilter','planFilter'].forEach(id => document.getElementById(id)?.addEventListener(id === 'subscriptionSearch' ? 'input' : 'change', renderManagement));
document.getElementById('subscriptionTableBody')?.addEventListener('click', event => { const button = event.target.closest('[data-action]'); if (button && !button.disabled) updateSubscription(button.dataset.id, button.dataset.action); });
document.getElementById('sidebarToggle')?.addEventListener('click', () => document.getElementById('adminSidebar').classList.toggle('open'));
