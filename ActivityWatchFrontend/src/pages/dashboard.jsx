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
    const [showMoreAppsCount, setShowMoreAppsCount] = useState(5);
    const [showMoreWindowsCount, setShowMoreWindowsCount] = useState(5);
    const [showLessApps, setShowLessApps] = useState(false);
    const [showLessWindows, setShowLessWindows] = useState(false);

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
            setActiveTime(response.data);
        } catch (error) {
            console.error("Error fetching active time", error);
        }
    };


    const formatActiveTime = (minutes) => {

        if (minutes >= 60) {
            const hours = Math.floor(minutes / 60);
            const remainingMinutes = minutes % 60;
            return `${hours}h ${remainingMinutes}m`;

        } else {
            return `${minutes}m`;
        }

    };

    const groupActivities = (activities) => {
        const groupedApplications = {};
        const groupedWindows = {};
        activities.forEach((activity) => {
            if (!activity.afk) {
                if (activity.applicationName) {
                    if (!groupedApplications[activity.applicationName]) {
                        groupedApplications[activity.applicationName] = 0;
                    }
                    groupedApplications[activity.applicationName] += 1;
                }

                if (activity.windowTitle) {
                    const cleanedWindowTitle = activity.windowTitle.replace(/^[^a-zA-Z0-9\sĞÜŞİÖÇğüşıöç]*\s*/, '');
                    if (!groupedWindows[cleanedWindowTitle]) {
                        groupedWindows[cleanedWindowTitle] = 0;
                    }
                    groupedWindows[cleanedWindowTitle] += 1;
                }
            }
        });
        const sortedApplications = Object.entries(groupedApplications).sort(([, a], [, b]) => b - a);
        const sortedWindows = Object.entries(groupedWindows).sort(([, a], [, b]) => b - a);
        return {
            groupedApplications: Object.fromEntries(sortedApplications),
            groupedWindows: Object.fromEntries(sortedWindows),
        };
    };

    const { groupedApplications, groupedWindows } = groupActivities(activityData);

    const formatDateForInput = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const formatDateForDisplay = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };

    const handleDateChange = async (direction) => {
        const newDate = new Date(date);
        newDate.setDate(date.getDate() + direction);
        setDate(newDate);
    };

    const handleInputChange = (event) => {
        const newDate = new Date(event.target.value);
        setDate(newDate);
    };

    const handleShowMoreApps = () => {
        setShowMoreAppsCount(prevCount => prevCount + 5);
        setShowLessApps(true);
    };

    const handleShowMoreWindows = () => {
        setShowMoreWindowsCount(prevCount => prevCount + 5);
        setShowLessWindows(true);
    };

    const handleShowLessApps = () => {
        setShowMoreAppsCount(5);
        setShowLessApps(false);
    };

    const handleShowLessWindows = () => {
        setShowMoreWindowsCount(5);
        setShowLessWindows(false);
    };

    return (
        <div className="dashboard-container">
            <div className="header">
                <h2>Activity for {formatDateForDisplay(date)}</h2>
                <p>Host: {host || currentUser}</p>
                <p>{formatActiveTime(activeTime)}</p>
            </div>
            <div className="date-navigation">
                <button onClick={() => handleDateChange(-1)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8" />
                </svg></button>
                <input
                    type="date"
                    className="date-input"
                    value={formatDateForInput(date)}
                    onChange={handleInputChange}
                />
                <button onClick={() => handleDateChange(1)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8" />
                </svg></button>
            </div>
            <div className="content">
                <div className="summary">
                    <h3>Top Applications</h3>
                    {Object.entries(groupedApplications).length > 0 ? (
                        Object.entries(groupedApplications)
                            .slice(0, showMoreAppsCount)
                            .map(([appName, minutes]) => (
                                <Application key={appName} data={{ applicationName: appName, activeTime: minutes }} />
                            ))
                    ) : (
                        <p className="no-data">No Applications</p>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {Object.entries(groupedApplications).length > showMoreAppsCount && (
                            <button className="show-more" onClick={handleShowMoreApps}>
                                Show More
                            </button>
                        )}
                        {showLessApps && (
                            <button className="show-more" onClick={handleShowLessApps}>
                                Show Less
                            </button>
                        )}
                    </div>
                </div>
                <div className="summary">
                    <h3>Top Window Titles</h3>
                    {Object.entries(groupedWindows).length > 0 ? (
                        Object.entries(groupedWindows)
                            .slice(0, showMoreWindowsCount)
                            .map(([windowTitle, minutes]) => (
                                <Window key={windowTitle} data={{ windowTitle, activeTime: minutes }} />
                            ))
                    ) : (
                        <p className="no-data">No Window Titles</p>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {Object.entries(groupedWindows).length > showMoreWindowsCount && (
                            <button className="show-more" onClick={handleShowMoreWindows}>
                                Show More
                            </button>
                        )}
                        {showLessWindows && (
                            <button className="show-more" onClick={handleShowLessWindows}>
                                Show Less
                            </button>
                        )}
                    </div>
                </div>
                <div className="timeline">
                    <Timeline activities={activityData} activeTime={activeTime} />
                </div>
            </div>
        </div>
    );
}
export default Dashboard;



