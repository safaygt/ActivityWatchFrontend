import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement);

function Timeline({ activities }) {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Activity Timeline',
                data: [],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    });

    useEffect(() => {
        const times = activities.map((activity) => {
            return activity.date.getHours();
        });
        setChartData((prevState) => ({
            ...prevState,
            labels: [...new Set(times)],
            datasets: [
                {
                    ...prevState.datasets[0],
                    data: times,
                },
            ],
        }));
    }, [activities]);

    return <Bar data={chartData} />;
}

export default Timeline;
