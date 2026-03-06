import React from 'react';
import HeaderShortcutDock from '../components/headerShortcutDock';

const BlogPage = () => {
    return (
        <main style={{ position: 'fixed', width: '100vw', minHeight: '100vh', margin: 0, padding: 0 }}>
            {/* <HeaderShortcutDock /> */}
            <div style={{ width: '100%', height: 'calc(100vh - 4rem)' }}>
                <iframe
                    title="Notion Blog"
                    src="https://bigohofone.notion.site/ebd//2eb3a2cf091b804f9abaff7c1c33c88c?v=2eb3a2cf091b80d18221000ca27137e5"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allowFullScreen
                />
            </div>
        </main>
    );
};

export default BlogPage;
