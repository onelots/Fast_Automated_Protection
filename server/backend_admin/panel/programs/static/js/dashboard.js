/**
 * Dashboard specific JavaScript
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
    
    // Initialize charts if on dashboard page
    initializeCharts();
  });
  
  /**
   * Initialize dashboard charts
   */
  function initializeCharts() {
    const weeklyBackupsCanvas = document.getElementById('weeklyBackupsChart');
    const backupDistributionCanvas = document.getElementById('backupDistributionChart');
    
    if (weeklyBackupsCanvas && backupDistributionCanvas) {
      // Fetch chart data
      fetch('/api/chart-data')
        .then(response => response.json())
        .then(data => {
          // Weekly backups chart
          new Chart(weeklyBackupsCanvas, {
            type: 'line',
            data: {
              labels: data.weekly.labels,
              datasets: [{
                label: 'Backups',
                data: data.weekly.data,
                borderColor: '#8b5cf6',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                tension: 0.3,
                fill: true
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  grid: {
                    color: 'rgba(255, 255, 255, 0.05)'
                  },
                  ticks: {
                    color: '#a1a1aa'
                  }
                },
                x: {
                  grid: {
                    display: false
                  },
                  ticks: {
                    color: '#a1a1aa'
                  }
                }
              }
            }
          });
          
          // Backup distribution chart
          new Chart(backupDistributionCanvas, {
            type: 'doughnut',
            data: {
              labels: data.distribution.labels,
              datasets: [{
                data: data.distribution.data,
                backgroundColor: [
                  '#8b5cf6', // Primary (Files)
                  '#ef4444', // Destructive (Databases)
                  '#f59e0b', // Warning (Media)
                  '#3b82f6', // Info (System)
                  '#10b981'  // Success (Other)
                ],
                borderWidth: 1,
                borderColor: '#27272a'
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: {
                    color: '#a1a1aa',
                    padding: 10,
                    usePointStyle: true,
                    pointStyle: 'circle'
                  }
                }
              }
            }
          });
        })
        .catch(error => {
          console.error('Error fetching chart data:', error);
        });
    }
  }