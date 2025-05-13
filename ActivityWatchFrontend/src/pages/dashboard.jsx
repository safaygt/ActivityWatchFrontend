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
    const [showMoreApps, setShowMoreApps] = useState(false);
    const [showMoreWindows, setShowMoreWindows] = useState(false);

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

        // Sort applications and windows by active time (minutes) in descending order
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

    return (
        <div className="dashboard-container">
            <div className="header">
                <h2>Activity for {formatDateForDisplay(date)}</h2>
                <p>Host: {host || currentUser}</p>
                <p>Time Active: {activeTime} minutes</p>
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
                        Object.entries(groupedApplications).slice(0, showMoreApps ? undefined : 5).map(([appName, minutes]) => (
                            <Application key={appName} data={{ applicationName: appName, activeTime: minutes }} />
                        ))
                    ) : (
                        <p className="no-data">No Applications</p>
                    )}

                    {Object.entries(groupedApplications).length > 5 && (
                        <button className="show-more" onClick={() => setShowMoreApps(!showMoreApps)}>
                            {showMoreApps ? (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-double-up" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M1.646 9.646a.5.5 0 0 1 .708 0L8 3.707l5.646 5.647a.5.5 0 0 1 .708-.708l-6-6a.5.5 0 0 1-.708 0l-6 6a.5.5 0 0 1 0 .708z" />
                                        <path fillRule="evenodd" d="M1.646 13.646a.5.5 0 0 1 .708 0L8 7.707l5.646 5.647a.5.5 0 0 1 .708-.708l-6-6a.5.5 0 0 1-.708 0l-6 6a.5.5 0 0 1 0 .708z" />
                                    </svg>
                                    Show Less

                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-double-down" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M1.646 6.646a.5.5 0 0 1 .708 0L8 12.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708" />
                                        <path fillRule="evenodd" d="M1.646 2.646a.5.5 0 0 1 .708 0L8 8.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708" />
                                    </svg>
                                    Show More

                                </>
                            )}
                        </button>
                    )}
                </div>

                <div className="summary">
                    <h3>Top Window Titles</h3>
                    {Object.entries(groupedWindows).length > 0 ? (
                        Object.entries(groupedWindows).slice(0, showMoreWindows ? undefined : 5).map(([windowTitle, minutes]) => (
                            <Window key={windowTitle} data={{ windowTitle, activeTime: minutes }} />
                        ))
                    ) : (
                        <p className="no-data">No Window Titles</p>
                    )}

                    {Object.entries(groupedWindows).length > 5 && (
                        <button className="show-more" onClick={() => setShowMoreWindows(!showMoreWindows)}>
                            {showMoreWindows ? (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-double-up" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M1.646 9.646a.5.5 0 0 1 .708 0L8 3.707l5.646 5.647a.5.5 0 0 1 .708-.708l-6-6a.5.5 0 0 1-.708 0l-6 6a.5.5 0 0 1 0 .708z" />
                                        <path fillRule="evenodd" d="M1.646 13.646a.5.5 0 0 1 .708 0L8 7.707l5.646 5.647a.5.5 0 0 1 .708-.708l-6-6a.5.5 0 0 1-.708 0l-6 6a.5.5 0 0 1 0 .708z" />
                                    </svg>
                                    Show Less

                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-double-down" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M1.646 6.646a.5.5 0 0 1 .708 0L8 12.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708" />
                                        <path fillRule="evenodd" d="M1.646 2.646a.5.5 0 0 1 .708 0L8 8.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708" />
                                    </svg>
                                    Show More

                                </>
                            )}
                        </button>
                    )}
                </div>

                <div className="timeline">
                    <Timeline activities={activityData} activeTime={activeTime} />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;