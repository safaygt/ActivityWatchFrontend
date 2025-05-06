import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement } from 'chart.js';
import '../assets/css/timeline.css';

ChartJS.register(CategoryScale, LinearScale, BarElement);

function Timeline({ activities, activeTime }) {
    console.log("Aktiflik süresi: ", activeTime);  // Backend'den alınan aktiflik süresi

    const [chartData, setChartData] = useState({
        labels: [],  // X ekseni için saat dilimleri
        datasets: [
            {
                label: 'Activity Timeline',
                data: [],  // Y ekseninde aktif süre verileri
                backgroundColor: [],  // Çubuk renkleri
                borderColor: 'rgba(75, 192, 192, 1)',  // Çubuğun kenar rengi
                borderWidth: 1,
            },
        ],
    });

    useEffect(() => {
        if (activities && activities.length > 0) {
            const hours = [6, 8, 10, 12, 14, 16, 18, 20, 22];  // Saat dilimlerinin listesi
            let activeTimes = new Array(9).fill(0);  // Saat dilimleri için aktiflik verisi
            let colors = new Array(9).fill('rgba(169, 169, 169, 0.2)');  // Varsayılan çubuk renkleri

            activities.forEach((activity) => {
                const activityDate = new Date(activity.date);
                const hour = activityDate.getHours();

                const index = hours.indexOf(hour);
                if (index !== -1) {
                    // Yalnızca AFK olmayan aktiviteleri hesaba katıyoruz
                    if (!activity.isAfk) {
                        activeTimes[index] += 1;  // Burada her etkinlik için 1 dakika ekliyoruz
                        colors[index] = 'rgba(75, 192, 192, 0.8)';  // Rengi değiştir
                    }
                }
            });

            // Y eksenindeki aktiflik sürelerinin 60 dakikayı geçmemesi sağlanacak
            activeTimes = activeTimes.map(time => Math.min(time, 60));  // Maksimum 60 dakika

            setChartData((prevState) => ({
                ...prevState,
                labels: hours,  // X ekseninde saat dilimleri
                datasets: [
                    {
                        ...prevState.datasets[0],
                        data: activeTimes,  // Y ekseninde aktiflik süreleri
                        backgroundColor: colors,  // Her saat dilimi için renkler
                    },
                ],
            }));
        } else {
            setChartData({
                labels: [],
                datasets: [
                    {
                        label: 'Activity Timeline',
                        data: [],
                        backgroundColor: [],
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                    },
                ],
            });
        }
    }, [activities]);  // Yalnızca activities değiştiğinde tetiklenecek

    return (
        <div className="canvas-container">
            {activities.length > 0 && (
                <Bar
                    data={chartData}
                    options={{
                        responsive: true,
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: 'Hours',  // Saat dilimlerini gösteren başlık
                                },
                            },
                            y: {
                                title: {

                                    display: true,
                                    text: 'Active Time (minutes)',  // Aktiflik süresini gösteren başlık
                                },
                                ticks: {
                                    stepSize: 1,
                                    min: 0,
                                    max: 60,
                                    callback: function (value) {
                                        const minutes = [0, 15, 30, 45, 60]
                                        // Yalnızca 0, 15, 30, 45, 60 değerleri için etiket göster
                                        if (value % 15 === 0) {

                                            return value + 'm';  // 0m, 15m, 30m, 45m, 60m
                                        }
                                        return null;  // Diğer değerler için etiket gösterme
                                    },
                                },
                            },

                        },
                    }}
                />
            )}
        </div>
    );
}

export default Timeline;
