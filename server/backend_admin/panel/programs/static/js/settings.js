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

    const settingsNavItems = document.querySelectorAll('.settings-nav-item');
    const settingsSections = document.querySelectorAll('.settings-section');

    if (settingsNavItems.length > 0) {
        settingsNavItems.forEach(item => {
            item.addEventListener('click', function() {
                const targetId = this.getAttribute('data-target');

                settingsNavItems.forEach(navItem => navItem.classList.remove('active'));
                settingsSections.forEach(section => section.classList.remove('active'));

                this.classList.add('active');
                document.getElementById(targetId).classList.add('active');
            });
        });
    }

    const settingsForms = document.querySelectorAll('.settings-form');

    if (settingsForms.length > 0) {
        settingsForms.forEach(form => {
            const saveButton = form.querySelector('.btn-primary');
            const resetButton = form.querySelector('.btn-outline');

            if (saveButton) {
                saveButton.addEventListener('click', function(e) {
                    e.preventDefault();

                    const inputs = form.querySelectorAll('input, select, textarea');
                    const formData = {};

                    inputs.forEach(input => {
                        if (input.type === 'checkbox') {
                            formData[input.id] = input.checked;
                        } else {
                            formData[input.id] = input.value;
                        }
                    });

                    console.log('Saving settings:', formData);

                    showNotification('Settings saved successfully!', 'success');
                });
            }

            if (resetButton) {
                resetButton.addEventListener('click', function(e) {
                    e.preventDefault();

                    form.reset();

                    showNotification('Settings reset to default values.', 'info');
                });
            }
        });
    }

    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const updateAccountBtn = document.querySelector('#account .btn-primary');

    if (newPasswordInput && confirmPasswordInput && updateAccountBtn) {
        updateAccountBtn.addEventListener('click', function(e) {
            if (newPasswordInput.value && newPasswordInput.value !== confirmPasswordInput.value) {
                e.preventDefault();
                showNotification('Passwords do not match!', 'error');
                confirmPasswordInput.focus();
            }
        });
    }
});

function showNotification(message, type = 'info') {

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;

    let icon = '';
    if (type === 'success') {
        icon = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>';
    } else if (type === 'error') {
        icon = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
    } else {
        icon = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
    }

    notification.innerHTML = `
        <div class="notification-icon">${icon}</div>
        <div class="notification-content">${message}</div>
        <button class="notification-close">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 6L6 18M6 6l12 12"></path>
            </svg>
        </button>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('active');
    }, 10);

    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        closeNotification(notification);
    });

    setTimeout(() => {
        closeNotification(notification);
    }, 5000);
}

function closeNotification(notification) {
    notification.classList.remove('active');

    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}