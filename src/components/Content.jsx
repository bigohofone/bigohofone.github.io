/*
 * Copyright (c) 2025 Wonjun Oh (owj0421@naver.com)
 * All rights reserved.
 *
 * This source code is the property of Wonjun Oh.
 * Unauthorized copying, distribution, or use of this code, in whole or in part, is strictly prohibited.
 */

import React from 'react';
import { ContentConfig } from '../utils/contentConfig';
import { colorPalette } from '../utils/colorUtils';



function ContentElement({ data, Component }) {
    const [expanded, setExpanded] = React.useState(false);
    const handleToggle = () => setExpanded((prev) => !prev);

    return (
        <Component data={data} expanded={expanded} onToggle={handleToggle} />
    );
}


function Content({
    background = '#fff',
    color = '#000',
    contentName,
    contentData,
    Component,
    ref
}) {

    return (
        <div className="content-container" style={{ background, color, borderColor: color }} ref={ref}>
            <div className="content" ref={ref}>
                <h2 className="content-title">{contentName}</h2>
                <div className="content-list">
                    {contentData.length > 0 ? (
                        contentData.map((data, index) => (
                            <ContentElement
                                key={`${contentName}-${index}`}
                                data={data}
                                Component={Component}
                            />
                        ))
                    ) : (
                        <div className="no-data">No data available.</div>
                    )}
                </div>
            </div>
        </div>
    );
}


function Contents({ contentsRef, getContentRef, getCurrentContentKey, scrollToContentKey }) {
    const [contentList, setContentList] = React.useState([]);

    React.useEffect(() => {
        async function fetchContentList() {
            const entries = await Promise.all(
                Object.entries(ContentConfig).map(async ([key, { contentName, contentData, Component }]) => ({
                    key,
                    contentName,
                    contentData: await contentData(),
                    Component,
                }))
            );
            setContentList(entries);
        }
        fetchContentList();
    }, []);

    return (
        <div className="contents-container">
            <div className="contents" ref={contentsRef}>
                {contentList.map(({ key, contentName, contentData, Component }, index) => (
                    <Content
                        key={key}
                        background={colorPalette[index % colorPalette.length].bg}
                        color={colorPalette[index % colorPalette.length].font}
                        contentName={contentName}
                        contentData={contentData}
                        Component={Component}
                        ref={getContentRef(key)}
                    />
                ))}
            </div>
        </div>
    );
}

export default Contents;