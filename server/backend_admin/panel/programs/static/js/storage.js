/**
 * Storage page specific JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize storage charts
    initializeStorageCharts();

    // Time range selector for storage usage chart
    const timeRangeSelect = document.getElementById('timeRangeSelect');
    if (timeRangeSelect) {
        timeRangeSelect.addEventListener('change', function() {
            updateStorageUsageChart(this.value);
        });
    }
});

/**
 * Initialize storage charts
 */
function initializeStorageCharts() {
    // Total storage doughnut chart
    const totalStorageCanvas = document.getElementById('totalStorageChart');
    if (totalStorageCanvas) {
        new Chart(totalStorageCanvas, {
            type: 'doughnut',
            data: {
                labels: ['Used', 'Available'],
                datasets: [{
                    data: [50, 50],
                    backgroundColor: [
                        '#8b5cf6', // Primary (Used)
                        '#e5e7eb'  // Light gray (Available)
                    ],
                    borderWidth: 0,
                    cutout: '75%'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.raw + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    // Storage usage over time chart
    updateStorageUsageChart('30days');
}

/**
 * Update storage usage chart based on selected time range
 */
function updateStorageUsageChart(timeRange) {
    const storageUsageCanvas = document.getElementById('storageUsageChart');
    if (!storageUsageCanvas) return;

    // Generate mock data based on time range
    const data = generateMockStorageData(timeRange);

    // Destroy existing chart if it exists
    if (window.storageUsageChart) {
        window.storageUsageChart.destroy();
    }

    // Create new chart
    window.storageUsageChart = new Chart(storageUsageCanvas, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [
                {
                    label: 'Files',
                    data: data.files,
                    borderColor: '#8b5cf6',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    tension: 0.3,
                    fill: true
                },
                {
                    label: 'Folders',
                    data: data.folders,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.3,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        pointStyle: 'circle',
                        padding: 15,
                        color: '#a1a1aa'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.raw + ' GB';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    },
                    ticks: {
                        color: '#a1a1aa',
                        callback: function(value) {
                            return value + ' GB';
                        }
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
}

/**
 * Generate mock storage data based on time range
 */
function generateMockStorageData(timeRange) {
    let labels = [];
    let filesData = [];
    let foldersData = [];
    
    // Generate data based on time range
    switch (timeRange) {
        case '7days':
            // Last 7 days
            for (let i = 6; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
                
                // Random data with some trend
                filesData.push(Math.round((1500 + Math.random() * 300) * 10) / 10);
                foldersData.push(Math.round((600 + Math.random() * 150) * 10) / 10);
            }
            break;
            
        case '30days':
            // Last 30 days (weekly points)
            for (let i = 4; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - (i * 7));
                labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
                
                // Random data with upward trend
                const baseFiles = 1400 + (4 - i) * 100;
                const baseFolders = 550 + (4 - i) * 40;
                filesData.push(Math.round((baseFiles + Math.random() * 200) * 10) / 10);
                foldersData.push(Math.round((baseFolders + Math.random() * 100) * 10) / 10);
            }
            break;
            
        case '90days':
            // Last 90 days (monthly points)
            for (let i = 3; i >= 0; i--) {
                const date = new Date();
                date.setMonth(date.getMonth() - i);
                labels.push(date.toLocaleDateString('en-US', { month: 'short' }));
                
                // Random data with upward trend
                const baseFiles = 1200 + (3 - i) * 200;
                const baseFolders = 500 + (3 - i) * 70;
                filesData.push(Math.round((baseFiles + Math.random() * 300) * 10) / 10);
                foldersData.push(Math.round((baseFolders + Math.random() * 150) * 10) / 10);
            }
            break;
            
        case '1year':
            // Last year (quarterly points)
            const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
            for (let i = 0; i < 4; i++) {
                labels.push(quarters[i]);
                
                // Random data with seasonal variations
                const seasonalFactor = i === 2 ? 1.2 : 1; // Higher in Q3
                const baseFiles = 1000 + i * 250;
                const baseFolders = 400 + i * 100;
                filesData.push(Math.round((baseFiles * seasonalFactor + Math.random() * 400) * 10) / 10);
                foldersData.push(Math.round((baseFolders * seasonalFactor + Math.random() * 200) * 10) / 10);
            }
            break;
    }
    
    return {
        labels: labels,
        files: filesData,
        folders: foldersData
    };
}