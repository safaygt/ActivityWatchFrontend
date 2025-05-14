import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement } from 'chart.js';
import '../assets/css/dashboard.css';

ChartJS.register(CategoryScale, LinearScale, BarElement);

function Timeline({ activities, activeTime }) {
    const [chartData, setChartData] = useState({
        labels: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
        datasets: [
            {
                label: 'Activity Timeline',
                data: [], // Start with an empty array
                backgroundColor: [], // Start with an empty array
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    });

    useEffect(() => {
        const hours = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
        let activeTimes = new Array(19).fill(0);
        let colors = new Array(19).fill('rgba(169, 169, 169, 0.2)');

        if (activities && activities.length > 0) {
            activities.forEach((activity) => {
                const activityDate = new Date(activity.date);
                const hour = activityDate.getHours();
                const index = hours.indexOf(hour);
                if (index !== -1) {
                    if (!activity.afk) {
                        activeTimes[index] += 1;
                        colors[index] = 'rgba(75, 192, 192, 0.8)';
                    }
                }
            });
        }

        activeTimes = activeTimes.map(time => Math.min(time, 60));

        setChartData((prevState) => ({
            ...prevState,
            datasets: [
                {
                    ...prevState.datasets[0],
                    data: activeTimes,
                    backgroundColor: colors,
                },
            ],
        }));
    }, [activities]);

    return (
        <div className="canvas-container">
            <Bar
                data={chartData}
                options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Hours',
                            },
                            ticks: {
                                padding: 5,
                                offset: true,
                                labelOffset: 8,
                            },
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Active Time (minutes)',
                            },
                            suggestedMax: 60,
                            ticks: {
                                stepSize: 15,
                                min: 0,
                                max: 60,
                                callback: function (value) {
                                    if (value % 15 === 0) {
                                        return value === 60 ? '1h' : value + 'm';
                                    }
                                    return null;
                                },
                            },
                        },
                    },
                }}
            />
        </div>
    );
}
export default Timeline;