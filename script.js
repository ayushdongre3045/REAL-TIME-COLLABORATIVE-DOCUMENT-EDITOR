// Mock data for documents
let documents = [
    { id: 1, title: 'Welcome Document', content: 'Welcome to the collaborative editor!' },
    { id: 2, title: 'Meeting Notes', content: 'Team meeting discussion points...' }
];

let currentDocument = null;
let collaborators = new Map();

// Initialize the editor
document.addEventListener('DOMContentLoaded', () => {
    renderDocumentsList();
    setupEditor();
    setupToolbar();
    simulateCollaborators();
});

function renderDocumentsList() {
    const documentsList = document.getElementById('documentsList');
    documentsList.innerHTML = documents.map(doc => `
        <div class="document-item ${currentDocument?.id === doc.id ? 'active' : ''}" 
             data-id="${doc.id}">
            ${doc.title}
        </div>
    `).join('');

    // Add click handlers
    documentsList.querySelectorAll('.document-item').forEach(item => {
        item.addEventListener('click', () => loadDocument(Number(item.dataset.id)));
    });
}

function loadDocument(id) {
    currentDocument = documents.find(doc => doc.id === id);
    if (currentDocument) {
        document.getElementById('documentTitle').value = currentDocument.title;
        document.getElementById('editor').innerHTML = currentDocument.content;
        renderDocumentsList();
    }
}

function setupEditor() {
    const titleInput = document.getElementById('documentTitle');
    const editor = document.getElementById('editor');
    const newDocBtn = document.getElementById('newDocBtn');

    titleInput.addEventListener('input', (e) => {
        if (currentDocument) {
            currentDocument.title = e.target.value;
            renderDocumentsList();
        }
    });

    editor.addEventListener('input', (e) => {
        if (currentDocument) {
            currentDocument.content = e.target.innerHTML;
        }
    });

    newDocBtn.addEventListener('click', createNewDocument);

    // Load first document by default
    if (documents.length > 0 && !currentDocument) {
        loadDocument(documents[0].id);
    }
}

function setupToolbar() {
    document.querySelectorAll('.formatting-tools button').forEach(button => {
        button.addEventListener('click', () => {
            const command = button.dataset.command;
            if (command === 'createLink') {
                const url = prompt('Enter the URL:');
                if (url) document.execCommand(command, false, url);
            } else {
                document.execCommand(command, false, null);
            }
        });
    });
}

function createNewDocument() {
    const newDoc = {
        id: Date.now(),
        title: 'Untitled Document',
        content: ''
    };
    documents.unshift(newDoc);
    renderDocumentsList();
    loadDocument(newDoc.id);
}

// Simulate collaborative cursors
function simulateCollaborators() {
    const editorRect = document.getElementById('editor').getBoundingClientRect();
    const collaborators = [
        { id: 1, name: 'John', color: '#4dabf7' },
        { id: 2, name: 'Alice', color: '#40c057' }
    ];

    collaborators.forEach(user => {
        createCollaboratorCursor(user);
        simulateRandomMovement(user, editorRect);
    });
}

function createCollaboratorCursor(user) {
    const cursor = document.createElement('div');
    cursor.className = 'remote-cursor';
    cursor.innerHTML = `
        <div class="cursor-label" style="background: ${user.color}">${user.name}</div>
        <svg width="16" height="16" viewBox="0 0 16 16" style="fill: ${user.color}">
            <path d="M0,0 L16,8 L8,10 L6,16 L0,0"></path>
        </svg>
    `;
    document.body.appendChild(cursor);
    collaborators.set(user.id, cursor);
}

function simulateRandomMovement(user, bounds) {
    const cursor = collaborators.get(user.id);
    
    setInterval(() => {
        const x = bounds.left + Math.random() * bounds.width;
        const y = bounds.top + Math.random() * bounds.height;
        
        cursor.style.transform = `translate(${x}px, ${y}px)`;
    }, 2000);
}