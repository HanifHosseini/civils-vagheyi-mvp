import { JURISDICTIONS, TASKS, DOCUMENTS, SUPPORTING_DOCS, REFERENCE_STANDARDS } from './data.js';

// DOM Elements
const jurisdictionSelect = document.getElementById('jurisdiction-select');
const taskSelect = document.getElementById('task-select');
const documentGrid = document.getElementById('document-grid');
const librarySubtitle = document.getElementById('library-subtitle');
const libraryView = document.getElementById('library-view');
const calcView = document.getElementById('calc-view');
const btnCompute = document.getElementById('btn-compute');
const reportContainer = document.getElementById('report-container');
const reportPreview = document.getElementById('report-preview');
const chatHistory = document.getElementById('chat-history');
const libraryTabs = document.querySelectorAll('.tab-btn');
const pdfSnippet = document.getElementById('pdf-snippet');
const dynamicCalcForm = document.getElementById('dynamic-calc-form');

let currentTab = 'core';

// Initialize Dropdowns
function initDropdowns() {
  // Populate Jurisdictions
  JURISDICTIONS.forEach(j => {
    const option = document.createElement('option');
    option.value = j.id;
    const prefix = j.type === 'municipality' ? '\u00A0\u00A0\u00A0\u2514 ' : '';
    option.textContent = prefix + j.label;
    jurisdictionSelect.appendChild(option);
  });

  // Populate Tasks
  const defaultTask = document.createElement('option');
  defaultTask.value = '';
  defaultTask.textContent = 'Select a Task...';
  taskSelect.appendChild(defaultTask);

  TASKS.forEach(t => {
    const option = document.createElement('option');
    option.value = t.id;
    option.textContent = t.label;
    taskSelect.appendChild(option);
  });
}

// Render Document Cards
function renderDocuments(jurisdictionId) {
  documentGrid.innerHTML = ''; // Clear existing
  
  let sourceData = DOCUMENTS;
  if (currentTab === 'supporting') sourceData = SUPPORTING_DOCS;
  if (currentTab === 'references') sourceData = REFERENCE_STANDARDS;

  let filteredDocs = sourceData;
  if (jurisdictionId !== 'all' && currentTab !== 'references') {
    const selectedJur = JURISDICTIONS.find(j => j.id === jurisdictionId);
    filteredDocs = sourceData.filter(doc => {
      return doc.jurisdiction && (doc.jurisdiction.includes(jurisdictionId) || 
            (selectedJur && doc.jurisdiction.includes(selectedJur.provinceId)));
    });
  }

  if (filteredDocs.length === 0) {
    documentGrid.innerHTML = '<p style="color: var(--text-secondary);">No documents found for this category and jurisdiction.</p>';
  }

  filteredDocs.forEach(doc => {
    const card = document.createElement('div');
    card.className = 'document-card';
    
    // Create tags
    let tagsHtml = '';
    if (doc.jurisdiction) {
      tagsHtml = doc.jurisdiction.map(jId => {
        const jName = JURISDICTIONS.find(j => j.id === jId)?.label || jId;
        return `<span class="doc-tag">${jName}</span>`;
      }).join('');
    }

    card.innerHTML = `
      ${doc.doc_type ? `<div class="doc-type">${doc.doc_type}</div>` : ''}
      <div class="doc-title">${doc.title}</div>
      <div class="doc-publisher">${doc.publisher}</div>
      ${doc.description ? `<div style="font-size: 0.875rem; color: var(--text-secondary); margin-top: 0.5rem;">${doc.description}</div>` : ''}
      ${tagsHtml ? `<div class="doc-tags">${tagsHtml}</div>` : ''}
    `;

    card.addEventListener('click', () => {
      addChatMessage(`Opening document: ${doc.title}`, 'user');
      setTimeout(() => {
        addChatMessage(`I've loaded the document. I can help you find specific clauses or you can select a task from the top right to start a calculation.`, 'ai');
      }, 500);
    });

    documentGrid.appendChild(card);
  });

  const jName = JURISDICTIONS.find(j => j.id === jurisdictionId)?.label || 'All Jurisdictions';
  librarySubtitle.textContent = `Showing ${currentTab} for ${jName}`;
}

// Tab Listeners
libraryTabs.forEach(tab => {
  tab.addEventListener('click', (e) => {
    libraryTabs.forEach(t => t.classList.remove('active'));
    e.target.classList.add('active');
    currentTab = e.target.dataset.tab;
    renderDocuments(jurisdictionSelect.value);
  });
});

// Handle Chat
function addChatMessage(text, sender) {
  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${sender}`;
  bubble.textContent = text;
  chatHistory.appendChild(bubble);
  chatHistory.scrollTop = chatHistory.scrollHeight;
}

// Event Listeners
jurisdictionSelect.addEventListener('change', (e) => {
  const selected = e.target.value;
  renderDocuments(selected);
  addChatMessage(`Switched jurisdiction to: ${e.target.options[e.target.selectedIndex].text.trim()}`, 'user');
});

taskSelect.addEventListener('change', (e) => {
  const selectedTask = e.target.value;
  
  if (selectedTask) {
    // Switch to Calc View
    libraryView.classList.add('hidden');
    calcView.classList.remove('hidden');
    calcView.style.display = 'flex';
    
    const taskName = e.target.options[e.target.selectedIndex].text;
    document.getElementById('calc-title').textContent = taskName;
    
    // Mock data source selection based on jurisdiction
    const currentJur = jurisdictionSelect.value;
    const jurData = JURISDICTIONS.find(j => j.id === currentJur) || {id: 'nl'};
    
    if (jurData.id === 'st-johns') {
      document.getElementById('source-title').textContent = 'Development Design Manual (Div 6) & Stormwater Policy';
      document.getElementById('source-clause').textContent = 'Policy 08-04-20: Pre = Post Detention';
      document.getElementById('source-url').textContent = 'stjohns.ca';
      pdfSnippet.innerHTML = `
        <strong>Policy 08-04-20 Excerpt:</strong><br/>
        "The peak rate of runoff from the development site shall not exceed the pre-development peak rate of runoff for the 1:5, 1:10, 1:25 and 1:100 year return period storm events."<br/><br/>
        [Table 6.2 IDF Curve Data Extracted...]
      `;
      dynamicCalcForm.innerHTML = `
        <div class="form-group">
          <label for="param-pre">Pre-development Area (ha)</label>
          <input type="number" id="param-pre" placeholder="e.g. 2.0" />
        </div>
        <div class="form-group">
          <label for="param-post">Post-development Area (ha)</label>
          <input type="number" id="param-post" placeholder="e.g. 2.0" />
        </div>
        <div class="form-group">
          <label for="param-c-post">Post-development C Value</label>
          <input type="number" id="param-c-post" step="0.01" placeholder="e.g. 0.85" />
        </div>
      `;
    } else {
      document.getElementById('source-title').textContent = 'Guidelines for Design of Water & Sewerage Systems';
      document.getElementById('source-clause').textContent = 'Section 6.2.1 - Runoff Parameters';
      document.getElementById('source-url').textContent = 'gov.nl.ca';
      pdfSnippet.innerHTML = `
        <strong>Section 6.2.1 Excerpt:</strong><br/>
        "The Rational Method is widely used for estimating peak flow rates from small urban areas..."<br/><br/>
        [Table: Typical Runoff Coefficients Extracted...]
      `;
      dynamicCalcForm.innerHTML = `
        <div class="form-group">
          <label for="param-area">Drainage Area (ha)</label>
          <input type="number" id="param-area" placeholder="e.g. 5.2" />
        </div>
        <div class="form-group">
          <label for="param-c">Runoff Coefficient (C)</label>
          <input type="number" id="param-c" step="0.01" placeholder="e.g. 0.65" />
        </div>
      `;
    }

    addChatMessage(`Initiating task: ${taskName}. Extracted relevant parameters from local standards.`, 'ai');
    reportContainer.classList.add('hidden'); // Reset report
  } else {
    // Switch back to Library View
    libraryView.classList.remove('hidden');
    calcView.classList.add('hidden');
    calcView.style.display = 'none';
  }
});

btnCompute.addEventListener('click', () => {
  const currentJur = jurisdictionSelect.value;
  let reportInputs = '';
  let result = 0;
  
  if (currentJur === 'st-johns') {
    const pre = parseFloat(document.getElementById('param-pre')?.value) || 0;
    const post = parseFloat(document.getElementById('param-post')?.value) || 0;
    const cPost = parseFloat(document.getElementById('param-c-post')?.value) || 0;
    result = (post * cPost * 1.5).toFixed(2); // mock diff
    reportInputs = `
      <li>Pre-development Area = ${pre} ha</li>
      <li>Post-development Area = ${post} ha</li>
      <li>Post-dev C Value = ${cPost}</li>
    `;
  } else {
    const area = parseFloat(document.getElementById('param-area')?.value) || 0;
    const c = parseFloat(document.getElementById('param-c')?.value) || 0;
    result = (area * c * 2.78).toFixed(2); // Mock rational method approx
    reportInputs = `
      <li>Drainage Area = ${area} ha</li>
      <li>Runoff Coefficient = ${c}</li>
    `;
  }
  
  const timestamp = new Date().toLocaleString();
  
  reportContainer.classList.remove('hidden');
  reportPreview.innerHTML = `
    <div class="report-header">
      <span>Conforma Engineering AI</span>
      <span>${timestamp}</span>
    </div>
    <h4>Computation Report: ${document.getElementById('calc-title').textContent}</h4>
    <p><strong>Jurisdiction:</strong> ${jurisdictionSelect.options[jurisdictionSelect.selectedIndex].text.trim()}</p>
    <p><strong>Source Cited:</strong> ${document.getElementById('source-title').textContent}, ${document.getElementById('source-clause').textContent}</p>
    <hr style="margin: 1.5rem 0; border: none; border-top: 1px solid #e5e7eb;" />
    <p><strong>Inputs:</strong></p>
    <ul>
      ${reportInputs}
    </ul>
    <br/>
    <p><strong>Computed Results:</strong></p>
    <p>Peak Flow / Detention Req (Mock) = <strong>${result} m³/s</strong></p>
    <p style="margin-top: 2rem; font-size: 0.75rem; color: #9ca3af; text-align: center;">Generated automatically and audit-traceable. Please review before final submission.</p>
  `;

  addChatMessage(`Computation complete. Report generated with audit-traceable citations.`, 'ai');
});

const chatInput = document.getElementById('chat-input');
chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (text) {
      addChatMessage(text, 'user');
      chatInput.value = '';
      
      // Mock AI response
      setTimeout(() => {
        addChatMessage(`I've searched the local guidelines for "${text}". I recommend starting the specific task from the dropdown to run computations based on this.`, 'ai');
      }, 800);
    }
  }
});

// Init
initDropdowns();
renderDocuments('all');
