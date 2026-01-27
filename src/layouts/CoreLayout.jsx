import React from 'react';
import '../assets/styles/layout.css';

const CoreLayout = ({ children, sidebar, dock }) => {
    return (
        <div className="core-layout">
            <aside className="core-layout-sidebar-container">
                {sidebar}
            </aside>
            <main className="core-layout-main">
                {children}
            </main>
            {dock && (
                // <div className="core-layout-dock-container">
                <>
                    {dock}
                </>
                // </div>
            )}
        </div>
    );
};

export default CoreLayout;
