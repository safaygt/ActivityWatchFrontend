import React from 'react';
import '../assets/css/dashboard.css';

function Application({ data }) {
    const backgroundWidth = `${Math.min(data.activeTime, 60)}%`;
    const backgroundColorStyle = {
        backgroundColor: '#cccccc',
        width: backgroundWidth,
        borderRadius: '0.8rem',
        height: 'auto',
        marginBottom: '1rem',
        boxShadow: '0 0.2rem 0.5rem rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0.5rem 1rem',
    };



    const timeStyle = {
        marginTop: '0.5rem',
        color: '#333333',
        fontSize: '1rem',
        whiteSpace: 'nowrap',
    };

    return (
        <div className="application-item">
            <div style={backgroundColorStyle}>
                <p>
                    {data.applicationName}
                </p>

                <p style={timeStyle}>
                    {data.activeTime} minutes
                </p>
            </div>
        </div>
    );
}

export default Application;