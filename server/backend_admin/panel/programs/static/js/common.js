/**
 * Common JavaScript functions used across the application
 */

// Auto-hide alerts after 5 seconds
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
  
  // Initialize common functionality when DOM is loaded
  document.addEventListener('DOMContentLoaded', function() {
    setupAlerts();
  });