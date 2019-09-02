import React from 'react';

class Dashboard extends React.Component {
    render() {
        return (
            <div>
                Node.js version :  {process.versions.node},
                Chromium version : {process.versions.chrome},
                and Electron : {process.versions.electron}.
            </div>
        );
    }
}

export default Dashboard;
