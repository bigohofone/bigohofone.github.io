/*
 * Copyright (c) 2025 Wonjun Oh (owj0421@naver.com)
 * All rights reserved.
 *
 * This source code is the property of Wonjun Oh.
 * Unauthorized copying, distribution, or use of this code, in whole or in part, is strictly prohibited.
 */

import React from 'react';
import ArrowButton from '../common/Icons';
// import ReactMarkdown from 'react-markdown';
function BaseContentItem({
  expanded,
  onToggle,
  children,
  details,
}) {
  return (
    <div
      className={`content-item${expanded ? ' content-item--expanded' : ''}`}
      onClick={onToggle}
      tabIndex={0}
      role="button"
      aria-expanded={expanded}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') onToggle();
      }}
    >
      <div className={`content-item__header${expanded ? ' content-item__header--expanded' : ''}`}>
        <div className="content-item__header-inner">
          {children}
        </div>
        <ArrowButton expanded={expanded} onClick={onToggle} />
      </div>
      <div className={`content-item__details${expanded ? ' content-item__details--expanded' : ''}`}>
        <div className={`content-item__details-inner${expanded ? ' content-item__details-inner--expanded' : ''}`}>
          {details && Object.entries(details).map(([title, content]) => (
            <div key={title} className="content-item__details-section">
              <div className="content-item__details-title">
                <span>{title ?? ''}</span>
              </div>
              <div className="content-item__details-content">
                {Array.isArray(content) ? (
                  content.map((item, idx) => (
                    <div key={idx} className="content-item__details-content-list-item">
                      {item}
                    </div>
                  ))
                ) : (
                  <span>{content !== undefined && content !== null ? String(content) : ''}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BaseContentItem;
