import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement
} from 'chart.js';
import '../assets/css/dashboard.css';

ChartJS.register(CategoryScale, LinearScale, BarElement);

function Timeline({ activities, viewMode, currentDate }) {
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const [options, setOptions] = useState({});

    useEffect(() => {
        if (viewMode === 'daily') {
            // — unchanged daily logic —
            const hours = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
            let activeTimes = new Array(hours.length).fill(0);
            let colors = new Array(hours.length).fill('rgba(169,169,169,0.2)');

            activities?.forEach(a => {
                const h = new Date(a.date).getHours();
                const idx = hours.indexOf(h);
                if (idx !== -1 && !a.afk) {
                    activeTimes[idx]++;
                    colors[idx] = 'rgba(75,192,192,0.8)';
                }
            });

            activeTimes = activeTimes.map(v => Math.min(v, 60));

            setChartData({
                labels: hours,
                datasets: [{
                    data: activeTimes,
                    backgroundColor: colors,
                    borderColor: 'rgba(75,192,192,1)',
                    borderWidth: 1
                }]
            });

            setOptions({
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: { display: true, text: 'Hours' },
                        ticks: { padding: 5, offset: true, labelOffset: 8 }
                    },
                    y: {
                        title: { display: true, text: 'Active Time (minutes)' },
                        suggestedMax: 60,
                        ticks: {
                            stepSize: 15, min: 0, max: 60,
                            callback: v => v % 15 === 0 ? (v === 60 ? '1h' : v + 'm') : null
                        }
                    }
                },
                plugins: { legend: { display: false } }
            });

        } else {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            const daysInMonth = new Date(year, month + 1, 0).getDate();

            const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
            const activeTimes = new Array(daysInMonth).fill(0);

            activities?.forEach(a => {
                if (!a.afk) {
                    const d = new Date(a.date).getDate();
                    activeTimes[d - 1]++;
                }
            });

            setChartData({
                labels: days,
                datasets: [{
                    data: activeTimes,
                    backgroundColor: 'rgba(75,192,192,0.8)',
                    borderColor: 'rgba(75,192,192,1)',
                    borderWidth: 1
                }]
            });

            setOptions({
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: { display: true, text: 'Days' },
                        ticks: {
                            padding: 5,
                            autoSkip: true,
                            maxTicksLimit: 15
                        }
                    },
                    y: {
                        title: { display: true, text: 'Active Time (hours)' },
                        min: 0, max: 12 * 60,
                        ticks: {
                            stepSize: 120,
                            callback: v => v % 120 === 0 ? (v / 60) + 'h' : null
                        }
                    }
                },
                plugins: { legend: { display: false } }
            });
        }
    }, [activities, viewMode, currentDate]);

    return (
        <div className="canvas-container">
            <Bar data={chartData} options={options} height={400} width={400} />
        </div>
    );
}

export default Timeline;
