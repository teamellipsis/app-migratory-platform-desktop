import React from 'react';

class Home extends React.Component {
    render() {
        return (
            <p>
                Node.js version :  {process.versions.node},
                Chromium version : {process.versions.chrome},
                and Electron : {process.versions.electron}.
            </p>
        );
    }
}

export default Home;
