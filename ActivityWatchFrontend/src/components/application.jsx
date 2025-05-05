import React from 'react';

function Application({ data }) {
    return (
        <div>
            <p>{data.applicationName}</p>
        </div>
    );
}

export default Application;
