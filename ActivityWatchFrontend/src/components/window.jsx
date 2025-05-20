import React from 'react';

function Window({ data }) {
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

    const formatActiveTime = (minutes) => {

        if (minutes >= 60) {
            const hours = Math.floor(minutes / 60);
            const remainingMinutes = minutes % 60;
            return `${hours}h ${remainingMinutes}m`;

        } else {
            return `${minutes}m`;
        }

    };



    const timeStyle = {
        marginTop: '0.5rem',
        color: '#333333',
        fontSize: '1rem',
        whiteSpace: 'nowrap',
    };

    return (
        <div className="window-item">
            <div style={backgroundColorStyle}>
                <p>
                    {data.windowTitle}
                </p>

                <p style={timeStyle}>
                    {formatActiveTime(data.activeTime)}
                </p>
            </div>
        </div>
    );
}

export default Window;
