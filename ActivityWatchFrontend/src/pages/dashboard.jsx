import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/css/dashboard.css';
import Window from '../components/window';
import Application from '../components/application';
import Timeline from '../components/timeline';

function Dashboard() {
    const [activityData, setActivityData] = useState([]);
    const [date, setDate] = useState(new Date());
    const [host, setHost] = useState('');
    const [activeTime, setActiveTime] = useState(0);
    const [currentUser, setCurrentUser] = useState('');

    useEffect(() => {
        fetchData();
        fetchActiveTime();
    }, [date]);

    const fetchData = async () => {
        const formattedDate = date.toISOString().split('T')[0];
        try {
            const response = await axios.get(`http://localhost:8080/v1/report/log?date=${formattedDate}`);
            setActivityData(response.data);

            if (response.data.length > 0) {
                setCurrentUser(response.data[0].username);
            }
        } catch (error) {
            console.error('Error fetching activity data', error);
        }
    };

    const fetchActiveTime = async () => {
        const formattedDate = date.toISOString().split('T')[0];
        try {
            const response = await axios.get(`http://localhost:8080/v1/report/active-time/${formattedDate}`);
            setActiveTime(response.data);  // Backend'den alınan aktiflik süresi
        } catch (error) {
            console.error("Error fetching active time", error);
        }
    };

    const formatDate = (date) => {
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    };

    const handleDateChange = async (direction) => {
        const newDate = new Date(date);
        newDate.setDate(date.getDate() + direction);
        setDate(newDate);
    };

    return (
        <div className="dashboard-container">
            <div className="date-navigation">
                <button onClick={() => handleDateChange(-1)}>Previous</button>
                <span>{formatDate(date)}</span>
                <button onClick={() => handleDateChange(1)}>Next</button>
            </div>
            <div className="header">
                <h2>Activity for {formatDate(date)}</h2>
                <p>Host: {host || currentUser}</p>
                <p>Time Active: {activeTime} minutes</p>
            </div>
            <div className="summary">
                <h3>Top Applications</h3>
                {activityData.map((activity) => (
                    <Application key={activity.id} data={activity} />
                ))}
            </div>
            <div className="summary">
                <h3>Top Window Titles</h3>
                {activityData.map((activity) => (
                    <Window key={activity.id} data={activity} />
                ))}
            </div>
            <div className="timeline">
                <Timeline activities={activityData} activeTime={activeTime} />
            </div>
        </div>
    );
}

export default Dashboard;
