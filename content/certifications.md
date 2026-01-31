---
title: "Certifications & Achievements"
showtoc: false
searchHidden: true
ShowRssButtonInSectionTermList: false
ShowShareButtons: false
---

<style>
.tabs {
  display: flex;
  gap: 0;
  margin-bottom: 2rem;
  border-bottom: 2px solid var(--border);
}
.tab-btn {
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  font-size: 1rem;
  font-weight: 500;
  color: var(--secondary);
  cursor: pointer;
  position: relative;
  transition: color 0.2s;
}
.tab-btn:hover {
  color: var(--primary);
}
.tab-btn.active {
  color: var(--primary);
}
.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--primary);
}
.tab-content {
  display: none;
}
.tab-content.active {
  display: block;
}
.cert-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}
.cert-card {
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  background: var(--entry);
}
.cert-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
}
.cert-card img {
  width: 100%;
  height: 210px;
  object-fit: cover;
}
.cert-card-info {
  padding: 1rem;
}
.cert-card-info h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
}
.cert-card-info p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--secondary);
}
.achievement-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.achievement-item {
  padding: 1.25rem;
  background: var(--entry);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.achievement-item h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
}
.achievement-item p {
  margin: 0;
  color: var(--secondary);
  font-size: 0.95rem;
}
.achievement-item .date {
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: var(--secondary);
}
.modal-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.9);
  z-index: 1000;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  box-sizing: border-box;
}
.modal-overlay.active {
  display: flex;
}
.modal-content {
  max-width: 900px;
  max-height: 90vh;
  background: var(--theme);
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
}
.modal-content img {
  width: 100%;
  max-height: 70vh;
  object-fit: contain;
  background: #000;
}
.modal-details {
  padding: 1.5rem;
}
.modal-details h2 {
  margin: 0 0 0.5rem 0;
}
.modal-details p {
  margin: 0.25rem 0;
  color: var(--secondary);
}
.modal-close {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 2rem;
  color: #fff;
  cursor: pointer;
  z-index: 1001;
  background: rgba(0,0,0,0.5);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}
.modal-close:hover {
  background: rgba(0,0,0,0.8);
}
</style>

<div class="tabs">
<button class="tab-btn active" onclick="switchTab('certifications')">Certifications</button>
<button class="tab-btn" onclick="switchTab('achievements')">Achievements</button>
</div>

<div id="certifications" class="tab-content active">
<div class="cert-grid">
<div class="cert-card" onclick="openModal('/assets/certification/cert-1.jpg', 'Certification Title 1', 'Issuing Organization', 'Month Year')">
<img src="/assets/certification/cert-1.jpg" alt="Certification 1">
<div class="cert-card-info">
<h3>Certification Title 1</h3>
<p>Issuing Organization</p>
</div>
</div>
<div class="cert-card" onclick="openModal('/assets/certification/cert-2.jpg', 'Certification Title 2', 'Issuing Organization', 'Month Year')">
<img src="/assets/certification/cert-2.jpg" alt="Certification 2">
<div class="cert-card-info">
<h3>Certification Title 2</h3>
<p>Issuing Organization</p>
</div>
</div>
<div class="cert-card" onclick="openModal('/assets/certification/cert-3.jpg', 'Certification Title 3', 'Issuing Organization', 'Month Year')">
<img src="/assets/certification/cert-3.jpg" alt="Certification 3">
<div class="cert-card-info">
<h3>Certification Title 3</h3>
<p>Issuing Organization</p>
</div>
</div>
</div>
</div>

<div id="achievements" class="tab-content">
<div class="achievement-list">
<div class="achievement-item">
<h3>Achievement Title 1</h3>
<p>Description of the achievement and what it means.</p>
<div class="date">Month Year</div>
</div>
<div class="achievement-item">
<h3>Achievement Title 2</h3>
<p>Description of the achievement and what it means.</p>
<div class="date">Month Year</div>
</div>
<div class="achievement-item">
<h3>Achievement Title 3</h3>
<p>Description of the achievement and what it means.</p>
<div class="date">Month Year</div>
</div>
</div>
</div>

<div class="modal-overlay" id="certModal" onclick="closeModal(event)">
<span class="modal-close" onclick="closeModal(event)">&times;</span>
<div class="modal-content" onclick="event.stopPropagation()">
<img id="modalImg" src="" alt="Certificate">
<div class="modal-details">
<h2 id="modalTitle"></h2>
<p id="modalOrg"></p>
<p id="modalDate"></p>
</div>
</div>
</div>

<script>
function switchTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(function(el) { el.classList.remove('active'); });
  document.querySelectorAll('.tab-btn').forEach(function(el) { el.classList.remove('active'); });
  document.getElementById(tabId).classList.add('active');
  event.target.classList.add('active');
}
function openModal(imgSrc, title, org, date) {
  document.getElementById('modalImg').src = imgSrc;
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalOrg').textContent = org;
  document.getElementById('modalDate').textContent = date;
  document.getElementById('certModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeModal(event) {
  if (event.target.classList.contains('modal-overlay') || event.target.classList.contains('modal-close')) {
    document.getElementById('certModal').classList.remove('active');
    document.body.style.overflow = '';
  }
}
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    document.getElementById('certModal').classList.remove('active');
    document.body.style.overflow = '';
  }
});
</script>
