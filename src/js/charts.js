/**
 * Data Visualization Module
 * Creates charts and dashboards using Chart.js
 */

class DataVisualization {
    constructor() {
        this.charts = {};
        this.init();
    }

    init() {
        // Wait for Chart.js to load
        if (typeof Chart === 'undefined') {
            this.loadChartJs().then(() => this.createCharts());
        } else {
            this.createCharts();
        }
    }

    loadChartJs() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    createCharts() {
        // Skills radar chart
        const skillsCanvas = document.getElementById('skills-chart');
        if (skillsCanvas) {
            this.charts.skills = this.createSkillsChart(skillsCanvas);
        }

        // Projects timeline
        const projectsCanvas = document.getElementById('projects-chart');
        if (projectsCanvas) {
            this.charts.projects = this.createProjectsChart(projectsCanvas);
        }

        // Technology distribution
        const techCanvas = document.getElementById('tech-chart');
        if (techCanvas) {
            this.charts.tech = this.createTechChart(techCanvas);
        }
    }

    createSkillsChart(canvas) {
        return new Chart(canvas, {
            type: 'radar',
            data: {
                labels: ['ABAP', 'Fiori/UI5', 'S/4HANA', 'CDS Views', 'BTP', 'Integration'],
                datasets: [{
                    label: 'Expertise Level',
                    data: [95, 90, 85, 88, 80, 85],
                    fill: true,
                    backgroundColor: 'rgba(0, 112, 243, 0.2)',
                    borderColor: 'rgba(0, 112, 243, 1)',
                    pointBackgroundColor: 'rgba(0, 212, 170, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(0, 112, 243, 1)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        pointLabels: {
                            color: '#e4e8f0',
                            font: {
                                size: 12
                            }
                        },
                        ticks: {
                            display: false
                        },
                        suggestedMin: 0,
                        suggestedMax: 100
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    createProjectsChart(canvas) {
        return new Chart(canvas, {
            type: 'bar',
            data: {
                labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
                datasets: [{
                    label: 'Abgeschlossene Projekte',
                    data: [5, 8, 10, 12, 9, 6],
                    backgroundColor: [
                        'rgba(0, 112, 243, 0.8)',
                        'rgba(0, 112, 243, 0.8)',
                        'rgba(0, 212, 170, 0.8)',
                        'rgba(0, 212, 170, 0.8)',
                        'rgba(0, 112, 243, 0.8)',
                        'rgba(0, 212, 170, 0.8)'
                    ],
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#6b7280'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#6b7280'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    createTechChart(canvas) {
        return new Chart(canvas, {
            type: 'doughnut',
            data: {
                labels: ['ABAP', 'Fiori/UI5', 'Integration', 'Consulting', 'Training'],
                datasets: [{
                    data: [35, 30, 15, 12, 8],
                    backgroundColor: [
                        '#0070f3',
                        '#00d4aa',
                        '#f59e0b',
                        '#8b5cf6',
                        '#ec4899'
                    ],
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '65%',
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: '#e4e8f0',
                            padding: 20,
                            font: {
                                size: 12
                            }
                        }
                    }
                }
            }
        });
    }

    // Update chart data dynamically
    updateChart(chartName, newData) {
        const chart = this.charts[chartName];
        if (chart) {
            chart.data.datasets[0].data = newData;
            chart.update();
        }
    }

    // Destroy all charts (for cleanup)
    destroyAll() {
        Object.values(this.charts).forEach(chart => chart.destroy());
        this.charts = {};
    }
}

// Initialize data visualization
document.addEventListener('DOMContentLoaded', () => {
    window.dataViz = new DataVisualization();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataVisualization;
}
