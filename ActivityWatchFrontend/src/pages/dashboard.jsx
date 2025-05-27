import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../assets/css/dashboard.css';
import Window from '../components/window';
import Application from '../components/application';
import Timeline from '../components/timeline';
import html2pdf from 'html2pdf.js';
import { Save } from 'lucide-react';

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
    const [firstActivityTime, setFirstActivityTime] = useState(null);
    const [calculatedEndTime, setCalculatedEndTime] = useState(null);
    const dashboardRef = useRef(null);
    const [viewMode, setViewMode] = useState('daily');

    useEffect(() => {
        fetchData();
        fetchActiveTime();
    }, [date, viewMode]);

    const handleViewModeChange = () => {
        const newMode = viewMode === 'daily' ? 'monthly' : 'daily';
        setViewMode(newMode);
        setDate(new Date());
    };

    const fetchData = async () => {
        try {
            let response;
            if (viewMode === 'daily') {
                const formattedDate = date.toISOString().split('T')[0];
                response = await axios.get(`http://localhost:8080/v1/report/log?date=${formattedDate}`);
            } else {
                const year = date.getFullYear();
                const month = date.getMonth() + 1;
                response = await axios.get(`http://localhost:8080/v1/report/log/monthly?year=${year}&month=${month}`);
            }
            setActivityData(response.data);
            if (response.data.length > 0) {
                setCurrentUser(response.data[0].username);

                // First activity
                const earliest = response.data[response.data.length - 1];
                const firstDate = new Date(earliest.date);
                if (!isNaN(firstDate.getTime())) {
                    firstDate.setMinutes(firstDate.getMinutes() - 1);
                    setFirstActivityTime(firstDate);
                } else {
                    setFirstActivityTime(null);
                }

                // Last activity
                const latest = response.data[0];
                const lastDate = new Date(latest.date);
                if (!isNaN(lastDate.getTime())) {
                    setCalculatedEndTime(lastDate);
                } else {
                    setCalculatedEndTime(null);
                }
            } else {
                setFirstActivityTime(null);
                setCalculatedEndTime(null);
            }
        } catch (error) {
            console.error('Error fetching activity data', error);
            setFirstActivityTime(null);
            setCalculatedEndTime(null);
        }
    };

    const fetchActiveTime = async () => {
        try {
            let response;
            if (viewMode === 'daily') {
                const formattedDate = date.toISOString().split('T')[0];
                response = await axios.get(`http://localhost:8080/v1/report/active-time/${formattedDate}`);
            } else {
                const year = date.getFullYear();
                const month = date.getMonth() + 1;
                response = await axios.get(`http://localhost:8080/v1/report/active-time/monthly?year=${year}&month=${month}`);
            }
            setActiveTime(response.data);
        } catch (error) {
            console.error('Error fetching active time', error);
        }
    };

    const formatActiveTime = (minutes) => {
        if (minutes >= 60) {
            const hours = Math.floor(minutes / 60);
            const remaining = minutes % 60;
            return `${hours}h ${remaining}m`;
        }
        return `${minutes}m`;
    };

    const formatTime = (dateObj) => {
        if (!dateObj || isNaN(dateObj.getTime())) return 'N/A';
        const hh = String(dateObj.getHours()).padStart(2, '0');
        const mm = String(dateObj.getMinutes()).padStart(2, '0');
        return `${hh}:${mm}`;
    };

    const formatDateForInput = (date) => {
        const Y = date.getFullYear();
        const M = String(date.getMonth() + 1).padStart(2, '0');
        if (viewMode === 'daily') {
            const D = String(date.getDate()).padStart(2, '0');
            return `${Y}-${M}-${D}`;
        }
        return `${Y}-${M}`;
    };

    const formatDateForDisplay = (d) => {
        if (!d || isNaN(d.getTime())) return 'N/A';
        if (viewMode === 'daily') {
            const D = String(d.getDate()).padStart(2, '0');
            const M = String(d.getMonth() + 1).padStart(2, '0');
            const Y = d.getFullYear();
            return `${D}.${M}.${Y}`;
        } else {
            const months = [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ];
            return `${months[d.getMonth()]} ${d.getFullYear()}`;
        }
    };

    const formatDayMonthYear = (d) => {
        if (!d || isNaN(d.getTime())) return 'N/A';
        const D = String(d.getDate()).padStart(2, '0');
        const M = String(d.getMonth() + 1).padStart(2, '0');
        const Y = d.getFullYear();
        return `${D}.${M}.${Y}`;
    };

    const handleDateChange = (dir) => {
        const nd = new Date(date);
        if (viewMode === 'daily') {
            nd.setDate(nd.getDate() + dir);
        } else {
            nd.setMonth(nd.getMonth() + dir);
        }
        setDate(nd);
    };

    const handleInputChange = (e) => {
        const parts = e.target.value.split('-').map(Number);
        if (viewMode === 'daily') {
            setDate(new Date(parts[0], parts[1] - 1, parts[2]));
        } else {
            setDate(new Date(parts[0], parts[1] - 1, 1));
        }
    };

    const groupActivities = (acts) => {
        const apps = {}, wins = {};
        acts.forEach(a => {
            if (!a.afk) {
                if (a.applicationName) apps[a.applicationName] = (apps[a.applicationName] || 0) + 1;
                if (a.windowTitle) {
                    const t = a.windowTitle.replace(/^[^\wĞÜŞİÖÇğüşıöç]+/, '');
                    wins[t] = (wins[t] || 0) + 1;
                }
            }
        });
        const ga = Object.fromEntries(Object.entries(apps).sort((a, b) => b[1] - a[1]));
        const gw = Object.fromEntries(Object.entries(wins).sort((a, b) => b[1] - a[1]));
        return { groupedApplications: ga, groupedWindows: gw };
    };

    const { groupedApplications, groupedWindows } = groupActivities(activityData);

    const generatePDF = () => {
        if (!dashboardRef.current) return;
        const opt = {
            margin: [10, 10, 10, 10],
            filename: `activity_report_${formatDateForDisplay(date).replace(/\s+/g, '_')}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a2', orientation: 'portrait' }
        };
        html2pdf().from(dashboardRef.current).set(opt).outputPdf('blob')
            .then(blob => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url; a.download = opt.filename;
                document.body.appendChild(a); a.click(); document.body.removeChild(a);
                URL.revokeObjectURL(url);
            })
            .catch(err => console.error('PDF error', err));
    };

    return (
        <div className="dashboard-container" ref={dashboardRef}>
            <div className="header">
                <h2>Activity for {formatDateForDisplay(date)}</h2>
                <p>Host: {host || currentUser}</p>
                <p className="time-display-item active-time">
                    Active Time: {formatActiveTime(activeTime)}
                </p>
                <p className="time-display-item start-time">
                    Start / End:{' '}
                    {viewMode === 'daily'
                        ? formatTime(firstActivityTime)
                        : formatDayMonthYear(firstActivityTime)
                    } /{' '}
                    {viewMode === 'daily'
                        ? formatTime(calculatedEndTime)
                        : formatDayMonthYear(calculatedEndTime)
                    }</p>

                <div className="pdf-button-container">
                    <button onClick={generatePDF} className="save-pdf-button" title="Save as PDF">
                        <Save className="h-4 w-4" /> Save as PDF
                    </button>
                </div>
                <div className="date-navigation">
                    <div className="flex-spacer"></div>

                    <div className="date-controls-group">
                        <button onClick={() => handleDateChange(-1)}>←</button>
                        {viewMode === 'daily'
                            ? <input
                                type="date"
                                className="date-input"
                                value={formatDateForInput(date)}
                                onChange={handleInputChange}
                            />
                            : <input
                                type="month"
                                className="date-input"
                                value={formatDateForInput(date)}
                                onChange={handleInputChange}
                            />
                        }
                        <button onClick={() => handleDateChange(1)}>→</button>
                    </div>
                    <button onClick={handleViewModeChange} className="view-mode-toggle-button">
                        {viewMode === 'daily' ? 'Switch to Monthly View' : 'Switch to Daily View'}
                    </button>
                </div>



            </div>

            <div className="content">
                <div className="summary">
                    <h3>Top Applications</h3>
                    {Object.entries(groupedApplications).length > 0 ?
                        Object.entries(groupedApplications)
                            .slice(0, showMoreAppsCount)
                            .map(([app, mins]) => (
                                <Application key={app} data={{ applicationName: app, activeTime: mins }} />
                            ))
                        : <p className="no-data">No Applications</p>}
                    <div style={{ display: 'flex', gap: 10 }}>
                        {Object.entries(groupedApplications).length > showMoreAppsCount &&
                            <button className="show-more" onClick={() => { setShowMoreAppsCount(c => c + 5); setShowLessApps(true); }}>
                                Show More
                            </button>
                        }
                        {showLessApps &&
                            <button className="show-more" onClick={() => { setShowMoreAppsCount(5); setShowLessApps(false); }}>
                                Show Less
                            </button>
                        }
                    </div>
                </div>
                <div className="summary">
                    <h3>Top Window Titles</h3>
                    {Object.entries(groupedWindows).length > 0 ?
                        Object.entries(groupedWindows)
                            .slice(0, showMoreWindowsCount)
                            .map(([wt, mins]) => (
                                <Window key={wt} data={{ windowTitle: wt, activeTime: mins }} />
                            ))
                        : <p className="no-data">No Window Titles</p>}
                    <div style={{ display: 'flex', gap: 10 }}>
                        {Object.entries(groupedWindows).length > showMoreWindowsCount &&
                            <button className="show-more" onClick={() => { setShowMoreWindowsCount(c => c + 5); setShowLessWindows(true); }}>
                                Show More
                            </button>
                        }
                        {showLessWindows &&
                            <button className="show-more" onClick={() => { setShowMoreWindowsCount(5); setShowLessWindows(false); }}>
                                Show Less
                            </button>
                        }
                    </div>
                </div>
                <div className="timeline">
                    <Timeline activities={activityData} viewMode={viewMode} currentDate={date} />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
