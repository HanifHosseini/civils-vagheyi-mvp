import { JURISDICTIONS, TASKS, DOCUMENTS } from './data.js';

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
  
  let filteredDocs = DOCUMENTS;
  if (jurisdictionId !== 'all') {
    // Show docs matching the selected jurisdiction OR the province if a municipality is selected
    const selectedJur = JURISDICTIONS.find(j => j.id === jurisdictionId);
    filteredDocs = DOCUMENTS.filter(doc => {
      return doc.jurisdiction.includes(jurisdictionId) || 
            (selectedJur && doc.jurisdiction.includes(selectedJur.provinceId));
    });
  }

  filteredDocs.forEach(doc => {
    const card = document.createElement('div');
    card.className = 'document-card';
    
    // Create tags
    const tagsHtml = doc.jurisdiction.map(jId => {
      const jName = JURISDICTIONS.find(j => j.id === jId)?.label || jId;
      return `<span class="doc-tag">${jName}</span>`;
    }).join('');

    card.innerHTML = `
      <div class="doc-type">${doc.doc_type}</div>
      <div class="doc-title">${doc.title}</div>
      <div class="doc-publisher">${doc.publisher}</div>
      <div style="font-size: 0.875rem; color: var(--text-secondary); margin-top: 0.5rem;">${doc.description}</div>
      <div class="doc-tags">${tagsHtml}</div>
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
  librarySubtitle.textContent = `Showing documents for ${jName}`;
}

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
    const jurData = JURISDICTIONS.find(j => j.id === currentJur);
    
    document.getElementById('source-title').textContent = jurData.id === 'st-johns' 
      ? 'Development Design Manual (Div 6)'
      : 'Guidelines for Design of Water & Sewerage Systems';
      
    document.getElementById('source-clause').textContent = 'Section 6.2.1 - Runoff Parameters';
    document.getElementById('source-url').textContent = 'stjohns.ca / gov.nl.ca';

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
  const area = parseFloat(document.getElementById('param-1').value) || 0;
  const c = parseFloat(document.getElementById('param-2').value) || 0;
  
  // Fake compute
  const result = (area * c * 2.78).toFixed(2); // Mock rational method approx
  
  reportContainer.classList.remove('hidden');
  reportPreview.innerHTML = `
    <h4>Computation Report: ${document.getElementById('calc-title').textContent}</h4>
    <p><strong>Jurisdiction:</strong> ${jurisdictionSelect.options[jurisdictionSelect.selectedIndex].text.trim()}</p>
    <p><strong>Source Cited:</strong> ${document.getElementById('source-title').textContent}, ${document.getElementById('source-clause').textContent}</p>
    <hr style="margin: 1rem 0; border: none; border-top: 1px solid #ccc;" />
    <p><strong>Inputs:</strong></p>
    <ul>
      <li>Drainage Area = ${area} ha</li>
      <li>Runoff Coefficient = ${c}</li>
    </ul>
    <p><strong>Computed Results:</strong></p>
    <p>Peak Flow (Mock) = <strong>${result} m³/s</strong></p>
    <p style="margin-top: 2rem; font-size: 0.75rem; color: #666;">Generated by Conforma on ${new Date().toLocaleDateString()}</p>
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
