/**
 * Clients page specific JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Dashboard sidebar toggle
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
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(event) {
        if (sidebar && sidebar.classList.contains('mobile-open')) {
            if (!sidebar.contains(event.target) && event.target !== mobileSidebarToggle) {
                sidebar.classList.remove('mobile-open');
            }
        }
    });
    
    // Generate Script Modal
    const generateScriptBtns = document.querySelectorAll('.generate-script-btn');
    const generateScriptModal = document.getElementById('generateScriptModal');
    const closeModalBtn = document.querySelector('.close-modal');
    const cancelScriptBtn = document.getElementById('cancelScriptBtn');
    const generateScriptBtn = document.getElementById('generateScriptBtn');
    
    // Open modal when clicking on generate script button
    if (generateScriptBtns.length > 0 && generateScriptModal) {
        generateScriptBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const clientId = this.getAttribute('data-client-id');
                // You can use clientId to fetch client-specific data if needed
                generateScriptModal.classList.add('open');
                
                // Set the OS dropdown based on the client's OS
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
    
    // Close modal functions
    function closeModal() {
        if (generateScriptModal) {
            generateScriptModal.classList.remove('open');
        }
    }
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    if (cancelScriptBtn) {
        cancelScriptBtn.addEventListener('click', closeModal);
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === generateScriptModal) {
            closeModal();
        }
    });
    
    // Generate script button action
    if (generateScriptBtn) {
        generateScriptBtn.addEventListener('click', function() {
            const os = document.getElementById('scriptOs').value;
            const paths = document.getElementById('backupPaths').value;
            const frequency = document.getElementById('backupFrequency').value;
            const includeSubfolders = document.getElementById('includeSubfolders').checked;
            const compressBackup = document.getElementById('compressBackup').checked;
            
            // Here you would typically send this data to the server to generate the script
            // For now, we'll just show an alert
            alert(`Script generation requested for ${os} with frequency: ${frequency}`);
            
            // Close the modal after generating
            closeModal();
        });
    }
    
    // Search functionality
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
        // This would typically send a request to the server
        // For now, we'll just log to console
        console.log('Searching for:', query);
        
        // You could implement client-side filtering here
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
    
    // Pagination functionality
    const paginationPages = document.querySelectorAll('.pagination-page');
    
    if (paginationPages.length > 0) {
        paginationPages.forEach(page => {
            page.addEventListener('click', function() {
                // Remove active class from all pages
                paginationPages.forEach(p => p.classList.remove('active'));
                
                // Add active class to clicked page
                this.classList.add('active');
                
                // Here you would typically fetch the data for the selected page
                console.log('Page selected:', this.textContent);
            });
        });
    }
});