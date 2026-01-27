import React, { useState, useEffect } from 'react';
import '../assets/styles/layout.css';

const CoreLayout = ({ children, sidebar, dock }) => {
    const [showBottomFade, setShowBottomFade] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollHeight = document.documentElement.scrollHeight;
            const scrollTop = window.scrollY;
            const clientHeight = window.innerHeight;

            // Check if there's more than 20px of content left to scroll
            const canScrollMore = scrollHeight > scrollTop + clientHeight + 20;
            setShowBottomFade(canScrollMore);
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleScroll);
        handleScroll(); // Initial check

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
        };
    }, [children]); // Re-run when children change (content might change height)

    return (
        <div className="core-layout">
            <aside className="core-layout-sidebar-container">
                {sidebar}
            </aside>
            <main className="core-layout-main">
                {children}
                <div className={`core-layout-bottom-fade ${showBottomFade ? 'active' : ''}`} />
            </main>
            {dock && (
                <>
                    {dock}
                </>
            )}
        </div>
    );
};

export default CoreLayout;
