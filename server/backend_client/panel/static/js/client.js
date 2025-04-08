document.addEventListener('DOMContentLoaded', function() {

    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');

    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            sidebar.classList.toggle('mobile-open');
        });
    }

    document.addEventListener('click', function(event) {
        if (sidebar && sidebar.classList.contains('mobile-open')) {
            if (!sidebar.contains(event.target) && event.target !== sidebarToggle) {
                sidebar.classList.remove('mobile-open');
            }
        }
    });

    const userMenuBtn = document.getElementById('user-menu-btn');
    const userDropdown = document.getElementById('user-dropdown');

    if (userMenuBtn && userDropdown) {
        userMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            userDropdown.classList.toggle('show');
        });

        document.addEventListener('click', function(event) {
            if (userDropdown.classList.contains('show') && !userDropdown.contains(event.target)) {
                userDropdown.classList.remove('show');
            }
        });
    }

    const refreshBtn = document.getElementById('refresh-btn');

    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            showNotification('Actualisation des données...', 'info');

            setTimeout(() => {
                showNotification('Données actualisées avec succès', 'success');
            }, 1500);
        });
    }

    const backupNowBtn = document.getElementById('backup-now-btn');

    if (backupNowBtn) {
        backupNowBtn.addEventListener('click', function() {
            showNotification('Démarrage de la sauvegarde...', 'info');

            setTimeout(() => {
                showNotification('Sauvegarde en cours...', 'info');

                setTimeout(() => {
                    showNotification('Sauvegarde terminée avec succès', 'success');
                }, 3000);
            }, 1500);
        });
    }

    const notification = document.getElementById('notification');
    const notificationMessage = document.querySelector('.notification-message');
    const notificationClose = document.querySelector('.notification-close');

    function showNotification(message, type = 'info') {

        notificationMessage.textContent = message;

        notification.className = 'notification';
        notification.classList.add(type);

        const notificationIcon = document.querySelector('.notification-icon');

        switch (type) {
            case 'success':
                notificationIcon.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                `;
                break;
            case 'error':
                notificationIcon.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                `;
                break;
            case 'warning':
                notificationIcon.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                        <line x1="12" y1="9" x2="12" y2="13"></line>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                `;
                break;
            default:
                notificationIcon.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                `;
        }

        notification.classList.add('show');

        setTimeout(() => {
            notification.classList.remove('show');
        }, 5000);
    }

    if (notificationClose) {
        notificationClose.addEventListener('click', function() {
            notification.classList.remove('show');
        });
    }

    function fetchClientData() {

        console.log('Fetching client data...');

        setTimeout(() => {
            console.log('Client data fetched successfully');
        }, 1000);
    }

    function initClientDashboard() {
        fetchClientData();

        const restoreButtons = document.querySelectorAll('.table-actions button[title="Restaurer"]');
        const detailButtons = document.querySelectorAll('.table-actions button[title="Détails"]');

        restoreButtons.forEach(button => {
            button.addEventListener('click', function() {
                const row = this.closest('tr');
                const date = row.querySelector('.cell-main').textContent;

                showNotification(`Préparation de la restauration de la sauvegarde du ${date}...`, 'info');

                setTimeout(() => {
                    showNotification(`Restauration en cours...`, 'info');

                    setTimeout(() => {
                        showNotification(`Restauration terminée avec succès`, 'success');
                    }, 3000);
                }, 1500);
            });
        });

        detailButtons.forEach(button => {
            button.addEventListener('click', function() {
                const row = this.closest('tr');
                const date = row.querySelector('.cell-main').textContent;
                const type = row.querySelector('td:nth-child(2)').textContent;
                const size = row.querySelector('td:nth-child(3)').textContent;

                showNotification(`Détails de la sauvegarde du ${date} (${type}, ${size})`, 'info');
            });
        });
    }

    initClientDashboard();

    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get('message');
    const type = urlParams.get('type');

    if (message) {
        showNotification(decodeURIComponent(message), type || 'info');
    }
});