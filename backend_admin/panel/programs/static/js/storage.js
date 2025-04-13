document.addEventListener('DOMContentLoaded', function() {

    initializeStorageCharts();

    const timeRangeSelect = document.getElementById('timeRangeSelect');
    if (timeRangeSelect) {
        timeRangeSelect.addEventListener('change', function() {
            updateStorageUsageChart(this.value);
        });
    }
});

function initializeStorageCharts() {

    const totalStorageCanvas = document.getElementById('totalStorageChart');
    if (totalStorageCanvas) {
        new Chart(totalStorageCanvas, {
            type: 'doughnut',
            data: {
                labels: ['Used', 'Available'],
                datasets: [{
                    data: [50, 50],
                    backgroundColor: [
                        '#8b5cf6',
                        '#e5e7eb'
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

    updateStorageUsageChart('30days');
}

function updateStorageUsageChart(timeRange) {
    const storageUsageCanvas = document.getElementById('storageUsageChart');
    if (!storageUsageCanvas) return;

    const data = generateMockStorageData(timeRange);

    if (window.storageUsageChart) {
        window.storageUsageChart.destroy();
    }

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

function generateMockStorageData(timeRange) {
    let labels = [];
    let filesData = [];
    let foldersData = [];

    switch (timeRange) {
        case '7days':

            for (let i = 6; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));

                filesData.push(Math.round((1500 + Math.random() * 300) * 10) / 10);
                foldersData.push(Math.round((600 + Math.random() * 150) * 10) / 10);
            }
            break;

        case '30days':

            for (let i = 4; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - (i * 7));
                labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));

                const baseFiles = 1400 + (4 - i) * 100;
                const baseFolders = 550 + (4 - i) * 40;
                filesData.push(Math.round((baseFiles + Math.random() * 200) * 10) / 10);
                foldersData.push(Math.round((baseFolders + Math.random() * 100) * 10) / 10);
            }
            break;

        case '90days':

            for (let i = 3; i >= 0; i--) {
                const date = new Date();
                date.setMonth(date.getMonth() - i);
                labels.push(date.toLocaleDateString('en-US', { month: 'short' }));

                const baseFiles = 1200 + (3 - i) * 200;
                const baseFolders = 500 + (3 - i) * 70;
                filesData.push(Math.round((baseFiles + Math.random() * 300) * 10) / 10);
                foldersData.push(Math.round((baseFolders + Math.random() * 150) * 10) / 10);
            }
            break;

        case '1year':

            const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
            for (let i = 0; i < 4; i++) {
                labels.push(quarters[i]);

                const seasonalFactor = i === 2 ? 1.2 : 1;
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