const seedCases = [
  { title: 'Reframing the growth agenda', client: 'Kin Financial', category: 'Growth strategy', labels: ['Revenue growth', 'Stakeholder interviews'], confidence: 92, status: 'active', impact: '$680k', updated: 'Today' },
  { title: 'A service model built for trust', client: 'Verde Health', category: 'Operating model', labels: ['Capability build', 'Journey mapping'], confidence: 86, status: 'review', impact: '$410k', updated: 'Yesterday' },
  { title: 'From consideration to conversion', client: 'Modo Consumer', category: 'Customer & brand', labels: ['Go-to-market', 'Quantitative survey'], confidence: 78, status: 'published', impact: '$295k', updated: '02 Sep' },
  { title: 'Making the complex feel simple', client: 'Atlas Foods', category: 'Digital enablement', labels: ['Retention', 'Competitive scan'], confidence: 68, status: 'review', impact: '$185k', updated: '29 Aug' },
  { title: 'Pricing with permission to grow', client: 'Northstar Energy', category: 'Growth strategy', labels: ['Revenue growth', 'Market sizing'], confidence: 95, status: 'published', impact: '$520k', updated: '25 Aug' },
  { title: 'The operating rhythm reset', client: 'Common Ground', category: 'Operating model', labels: ['Operating efficiency', 'Financial modelling'], confidence: 89, status: 'active', impact: '$340k', updated: '22 Aug' }
];
let cases = JSON.parse(localStorage.getItem('vanta-cases') || 'null') || seedCases;
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const statusLabel = status => status === 'review' ? 'Needs review' : status[0].toUpperCase() + status.slice(1);
const categoryClass = category => category.includes('Growth') ? 'orange-label' : category.includes('Customer') ? 'blue-label' : category.includes('Operating') ? 'green-label' : 'ink-label';
function persist() { localStorage.setItem('vanta-cases', JSON.stringify(cases)); }
function showToast(message) { const toast = $('#toast'); toast.textContent = message; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2600); }
function renderRecent() { $('#recent-cases').innerHTML = cases.slice(0, 4).map(item => `<tr><td><strong>${item.title}</strong><small>${item.client}</small></td><td>${item.category}</td><td><span class="stage ${item.status}">${statusLabel(item.status)}</span></td><td><span class="impact">${item.impact}</span></td><td>${item.updated}</td></tr>`).join(''); }
function renderLibrary() {
  const query = ($('#case-search')?.value || '').toLowerCase();
  const activeFilter = $('.filter-btn.active')?.dataset.filter || 'all';
  const visible = cases.filter(item => {
    const matchesQuery = [item.title, item.client, item.category, ...item.labels].join(' ').toLowerCase().includes(query);
    const matchesFilter = activeFilter === 'all' || item.status === activeFilter;
    return matchesQuery && matchesFilter;
  });
  $('#library-cases').innerHTML = visible.length ? visible.map((item, index) => `<tr><td><input type="checkbox" aria-label="Select ${item.title}"></td><td><strong>${item.title}</strong><small>${item.client}</small></td><td><span class="category-label ${categoryClass(item.category)}">${item.category}</span></td><td>${item.labels.map(label => `<span class="label-chip">${label}</span>`).join('')}</td><td><div class="confidence"><div class="confidence-bar"><span style="width:${item.confidence}%"></span></div><strong>${item.confidence}%</strong></div></td><td><span class="stage ${item.status}">${statusLabel(item.status)}</span></td><td>${item.updated}</td><td><button class="row-menu" aria-label="More options for ${item.title}">...</button></td></tr>`).join('') : '<tr><td colspan="8" class="empty-row">No cases match this view.</td></tr>';
}
function setView(viewName) {
  $$('.view').forEach(view => view.classList.toggle('active', view.id === `${viewName}-view`));
  $$('.nav-item').forEach(item => item.classList.toggle('active', item.dataset.view === viewName));
  const active = $(`.nav-item[data-view="${viewName}"]`); $('#breadcrumb-title').textContent = active ? active.textContent.trim().replace(/\d+$/, '') : 'Overview';
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (viewName === 'library') renderLibrary();
}
function openModal() { $('#case-modal').classList.add('open'); $('#case-modal').setAttribute('aria-hidden', 'false'); setTimeout(() => $('[name="title"]', $('#case-form')).focus(), 50); }
function closeModal() { $('#case-modal').classList.remove('open'); $('#case-modal').setAttribute('aria-hidden', 'true'); $('#case-form').reset(); }
$$('.nav-item').forEach(item => item.addEventListener('click', () => setView(item.dataset.view)));
$$('[data-view-link="library"]').forEach(item => item.addEventListener('click', () => setView('library')));
$('#new-case-btn').addEventListener('click', openModal); $('#library-new-btn').addEventListener('click', openModal); $('#new-label-btn').addEventListener('click', () => showToast('Label editor is ready for your next vocabulary update.')); $('#pipeline-new-btn').addEventListener('click', () => showToast('Opportunity intake opened.')); $('#close-modal').addEventListener('click', closeModal); $('#cancel-modal').addEventListener('click', closeModal); $('#case-modal').addEventListener('click', event => { if (event.target.id === 'case-modal') closeModal(); });
$('#case-form').addEventListener('submit', event => { event.preventDefault(); const data = new FormData(event.target); cases.unshift({ title: data.get('title'), client: data.get('client'), category: data.get('category'), labels: String(data.get('tags') || '').split(',').map(tag => tag.trim()).filter(Boolean).slice(0, 3), confidence: Number(data.get('confidence')) || 0, status: data.get('status'), impact: 'TBD', updated: 'Just now' }); persist(); renderRecent(); renderLibrary(); closeModal(); setView('library'); showToast('Case saved to your local library.'); });
$('#case-search').addEventListener('input', renderLibrary); $$('.filter-btn').forEach(button => button.addEventListener('click', () => { $$('.filter-btn').forEach(item => item.classList.remove('active')); button.classList.add('active'); renderLibrary(); }));
$('#global-search-btn').addEventListener('click', () => { setView('library'); setTimeout(() => $('#case-search').focus(), 80); });
$('#export-btn').addEventListener('click', () => { const blob = new Blob([JSON.stringify(cases, null, 2)], { type: 'application/json' }); const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = 'vanta-case-library.json'; link.click(); URL.revokeObjectURL(link.href); showToast('Case library exported.'); });
document.addEventListener('keydown', event => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); $('#global-search-btn').click(); } if (event.key === 'Escape') closeModal(); });
renderRecent(); renderLibrary();
