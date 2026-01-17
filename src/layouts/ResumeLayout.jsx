import React from 'react';
import Sidebar from '../features/resume/components/Sidebar';
import NavigationDock from '../features/resume/components/NavigationDock';
// Import new CSS
import '../assets/styles/wonjunoh_resume.css';

const ResumeLayout = ({ children }) => {
    return (
        <div className="wonjunoh-resume-layout">
            <Sidebar />
            <main className="wonjunoh-resume-main">
                {children}
            </main>
            <NavigationDock />
        </div>
    );
};

export default ResumeLayout;
