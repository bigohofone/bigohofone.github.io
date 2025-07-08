/*
 * Copyright (c) 2025 Wonjun Oh (owj0421@naver.com)
 * All rights reserved.
 *
 * This source code is the property of Wonjun Oh.
 * Unauthorized copying, distribution, or use of this code, in whole or in part, is strictly prohibited.
 */

import React, { useState, useEffect, useCallback, memo, forwardRef } from 'react';
import { ContentConfig } from '../utils/contentConfig';
import { colorPalette } from '../utils/colorUtils';

const ContentItem = memo(({ data, Component }) => {
    const [expanded, setExpanded] = useState(false);
    const handleToggle = useCallback(() => setExpanded(prev => !prev), []);
    return (
        <Component
            data={data}
            expanded={expanded}
            onToggle={handleToggle}
        />
    );
});

const ContentBlock = forwardRef(({ index, contentName, contentData, Component }, ref) => {
    
    // const { bg: background, font: color } = colorPalette[index % colorPalette.length];

    return (
        <div
            className="content-block"
            // style={{ background, color }}
            ref={ref}
        >
            <div className="content-block__inner">
                <div className="content-block__title">
                    {contentName}
                </div>
                <div className="content-block__items">
                    {Array.isArray(contentData) && contentData.length > 0 ? (
                        contentData.map((data, idx) => (
                            <ContentItem
                                key={`${contentName}-${idx}`}
                                data={data}
                                Component={Component}
                            />
                        ))
                    ) : (
                        <div className="content-block__no-data">No data available.</div>
                    )}
                </div>
            </div>
        </div>
    );
});

function Content({ contentSectionRef, getContentBlockRef }) {
    const [contentList, setContentList] = useState([]);

    useEffect(() => {
        let isMounted = true;
        (async () => {
            const entries = await Promise.all(
                Object.entries(ContentConfig).map(async ([key, { contentName, contentData, Component }]) => ({
                    key,
                    contentName,
                    contentData: await contentData(),
                    Component,
                }))
            );
            if (isMounted) setContentList(entries);
        })();
        return () => { isMounted = false; };
    }, []);

    return (
        <main className="content" ref={contentSectionRef}>
            {contentList.map(({ key, contentName, contentData, Component }, index) => (
                <ContentBlock
                    key={key}
                    index={index}
                    contentName={contentName}
                    contentData={contentData}
                    Component={Component}
                    ref={getContentBlockRef(key)}
                />
            ))}
        </main>
    );
}

export default Content;
