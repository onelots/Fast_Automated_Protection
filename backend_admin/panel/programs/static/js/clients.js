document.addEventListener('DOMContentLoaded', function() {

    const sidebarToggle = document.getElementById('sidebar-toggle');
    const mobileSidebarToggle = document.getElementById('mobile-sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');

    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
        });
    }

    if (mobileSidebarToggle && sidebar) {
        mobileSidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('mobile-open');
        });
    }

    document.addEventListener('click', function(event) {
        if (sidebar && sidebar.classList.contains('mobile-open')) {
            if (!sidebar.contains(event.target) && event.target !== mobileSidebarToggle) {
                sidebar.classList.remove('mobile-open');
            }
        }
    });

    const generateScriptBtns = document.querySelectorAll('.generate-script-btn');
    const generateScriptModal = document.getElementById('generateScriptModal');
    const closeModalBtn = document.querySelector('.close-modal');
    const cancelScriptBtn = document.getElementById('cancelScriptBtn');
    const generateScriptBtn = document.getElementById('generateScriptBtn');

    if (generateScriptBtns.length > 0 && generateScriptModal) {
        generateScriptBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const clientId = this.getAttribute('data-client-id');

                generateScriptModal.classList.add('open');

                const clientRow = this.closest('.client-row');
                const osText = clientRow.querySelector('.client-os').textContent.trim();
                const osSelect = document.getElementById('scriptOs');

                if (osText.includes('Windows')) {
                    osSelect.value = 'windows';
                } else if (osText.includes('macOS')) {
                    osSelect.value = 'macos';
                } else if (osText.includes('Linux')) {
                    osSelect.value = 'linux';
                }
            });
        });
    }

    function closeModal(modalElement) {
        if (modalElement) {
            modalElement.classList.remove('open');
        }
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            closeModal(generateScriptModal);
        });
    }

    if (cancelScriptBtn) {
        cancelScriptBtn.addEventListener('click', function() {
            closeModal(generateScriptModal);
        });
    }

    window.addEventListener('click', function(event) {
        if (event.target === generateScriptModal) {
            closeModal(generateScriptModal);
        }
        if (event.target === addClientModal) {
            closeModal(addClientModal);
        }
    });

    if (generateScriptBtn) {
        generateScriptBtn.addEventListener('click', function() {
            const os = document.getElementById('scriptOs').value;
            const paths = document.getElementById('backupPaths').value;
            const frequency = document.getElementById('backupFrequency').value;
            const includeSubfolders = document.getElementById('includeSubfolders').checked;
            const compressBackup = document.getElementById('compressBackup').checked;

            alert(`Script generation requested for ${os} with frequency: ${frequency}`);

            closeModal(generateScriptModal);
        });
    }

    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');

    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', function() {
            performSearch(searchInput.value);
        });

        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch(searchInput.value);
            }
        });
    }

    function performSearch(query) {

        console.log('Searching for:', query);

        const clientRows = document.querySelectorAll('.client-row');
        const searchTerm = query.toLowerCase();

        clientRows.forEach(row => {
            const clientName = row.querySelector('.client-fullname').textContent.toLowerCase();
            const clientEmail = row.querySelector('.client-email').textContent.toLowerCase();

            if (clientName.includes(searchTerm) || clientEmail.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    const paginationPages = document.querySelectorAll('.pagination-page');

    if (paginationPages.length > 0) {
        paginationPages.forEach(page => {
            page.addEventListener('click', function() {

                paginationPages.forEach(p => p.classList.remove('active'));

                this.classList.add('active');

                console.log('Page selected:', this.textContent);
            });
        });
    }

    const addClientBtn = document.getElementById('add-client-btn');
    const addClientModal = document.getElementById('addClientModal');
    const closeAddClientModal = document.getElementById('closeAddClientModal');
    const cancelAddClientBtn = document.getElementById('cancelAddClientBtn');
    const submitAddClientBtn = document.getElementById('submitAddClientBtn');
    const addClientForm = document.getElementById('addClientForm');

    const lastBackupInput = document.getElementById('last_backup');
    if (lastBackupInput) {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');

        lastBackupInput.value = `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    if (addClientBtn) {
        addClientBtn.addEventListener('click', function() {
            addClientModal.classList.add('open');
        });
    }

    if (closeAddClientModal) {
        closeAddClientModal.addEventListener('click', function() {
            closeModal(addClientModal);
        });
    }

    if (cancelAddClientBtn) {
        cancelAddClientBtn.addEventListener('click', function() {
            closeModal(addClientModal);
        });
    }

const deleteClientBtns = document.querySelectorAll('.btn-icon[title="Delete Client"]');

if (deleteClientBtns.length > 0) {
    deleteClientBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const clientRow = this.closest('.client-row');
            const clientEmail = clientRow.querySelector('.client-email').textContent.trim();
            const clientName = clientRow.querySelector('.client-fullname').textContent.trim();

            if (confirm(`Are you sure you want to delete client "${clientName}" (Email: ${clientEmail})? This action cannot be undone.`)) {

                fetch('/api/v1/delete_user', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: clientEmail
                    })
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.success) {
                        showNotification(`Client "${clientName}" deleted successfully`, 'success');

                        clientRow.style.transition = 'opacity 0.3s ease';
                        clientRow.style.opacity = '0';
                        setTimeout(() => clientRow.remove(), 300);
                    } else {
                        throw new Error(data.error || 'Unknown error');
                    }
                })
                .catch(error => {
                    showNotification(`Error deleting client: ${error.message}`, 'error');
                });
            }
        });
    });
}

    if (submitAddClientBtn && addClientForm) {
        submitAddClientBtn.addEventListener('click', function() {

            if (addClientForm.checkValidity()) {

                const formData = {
                    username: document.getElementById('username').value,
                    email: document.getElementById('email').value,
                    password: document.getElementById('password').value,
                    os: document.getElementById('os').value,
                    status: document.getElementById('status').value,

                    storage_used: parseFloat(document.getElementById('storage_used').value),
                    storage_total: parseFloat(document.getElementById('storage_total').value)
                };

                console.log('Sending data:', formData);

                fetch('/api/v1/insert_user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                })
                .then(response => {
                    console.log('Response status:', response.status);
                    return response.json();
                })
                .then(data => {
                    console.log('Response data:', data);
                    if (data.id) {

                        showNotification('Client added successfully!', 'success');
                        closeModal(addClientModal);

                        setTimeout(() => {
                            window.location.reload();
                        }, 1500);
                    } else {

                        showNotification('Error adding client: ' + (data.error || 'Unknown error'), 'error');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    showNotification('Error adding client: ' + error.message, 'error');
                });
            } else {

                const firstInvalidField = addClientForm.querySelector(':invalid');
                if (firstInvalidField) {
                    firstInvalidField.focus();
                }
            }
        });
    }

    function showNotification(message, type = 'info') {

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;

        const content = document.createElement('div');
        content.className = 'notification-content';

        let icon = '';
        switch (type) {
            case 'success':
                icon = `<div class="notification-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                </div>`;
                break;
            case 'error':
                icon = `<div class="notification-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                </div>`;
                break;
            default:
                icon = `<div class="notification-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                </div>`;
        }

        content.innerHTML = `
            ${icon}
            <div class="notification-content">
                <div class="notification-title">${type.charAt(0).toUpperCase() + type.slice(1)}</div>
                <div class="notification-message">${message}</div>
            </div>
        `;

        notification.appendChild(content);

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }
});