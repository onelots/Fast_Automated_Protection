/**
 * Reports page specific JavaScript
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
    
    // Initialize charts
    initializeCharts();
    
    // Filter actions
    const applyFiltersBtn = document.getElementById('applyFilters');
    const exportReportBtn = document.getElementById('exportReport');
    const dateRangeSelect = document.getElementById('dateRange');
    const clientFilterSelect = document.getElementById('clientFilter');
    const statusFilterSelect = document.getElementById('statusFilter');
    
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function() {
            const dateRange = dateRangeSelect ? dateRangeSelect.value : 'last7days';
            const clientFilter = clientFilterSelect ? clientFilterSelect.value : 'all';
            const statusFilter = statusFilterSelect ? statusFilterSelect.value : 'all';
            
            // Here you would typically send a request to the server to get filtered data
            console.log('Applying filters:', { dateRange, clientFilter, statusFilter });
            
            // For demo purposes, we'll just reload the charts with random data
            initializeCharts();
        });
    }
    
    if (exportReportBtn) {
        exportReportBtn.addEventListener('click', function() {
            // Here you would typically trigger a download of the report
            alert('Exporting report...');
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

/**
 * Initialize charts for the reports page
 */
function initializeCharts() {
    const backupHistoryCanvas = document.getElementById('backupHistoryChart');
    const backupStatusCanvas = document.getElementById('backupStatusChart');
    
    if (backupHistoryCanvas) {
        const ctx = backupHistoryCanvas.getContext('2d');
        
        // Generate random data for the chart
        const labels = ['May 9', 'May 10', 'May 11', 'May 12', 'May 13', 'May 14', 'May 15'];
        const successData = labels.map(() => Math.floor(Math.random() * 10) + 10);
        const failedData = labels.map(() => Math.floor(Math.random() * 3));
        
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Successful',
                        data: successData,
                        backgroundColor: '#22c55e',
                        borderColor: '#22c55e',
                        borderWidth: 1
                    },
                    {
                        label: 'Failed',
                        data: failedData,
                        backgroundColor: '#ef4444',
                        borderColor: '#ef4444',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        stacked: true,
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#a1a1aa'
                        }
                    },
                    y: {
                        stacked: true,
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)'
                        },
                        ticks: {
                            color: '#a1a1aa'
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: '#a1a1aa',
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    }
                }
            }
        });
    }
    
    if (backupStatusCanvas) {
        const ctx = backupStatusCanvas.getContext('2d');
        
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Completed', 'Failed', 'In Progress'],
                datasets: [{
                    data: [118, 9, 0],
                    backgroundColor: [
                        '#22c55e',
                        '#ef4444',
                        '#3b82f6'
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
    }
}