function setupAlerts() {
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(function(alert) {
      setTimeout(function() {
        alert.style.opacity = '0';
        setTimeout(function() {
          alert.style.display = 'none';
        }, 300);
      }, 5000);
    });
  }

  document.addEventListener('DOMContentLoaded', function() {
    setupAlerts();
  });