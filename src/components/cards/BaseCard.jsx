/*
 * Copyright (c) 2025 Wonjun Oh (owj0421@naver.com)
 * All rights reserved.
 *
 * This source code is the property of Wonjun Oh.
 * Unauthorized copying, distribution, or use of this code, in whole or in part, is strictly prohibited.
 */

import React from 'react';
import PropTypes from 'prop-types';
// import ReactMarkdown from 'react-markdown';

function ArrowButton({ expanded, ArrowIcon, onClick }) {
  return (
    <button
      className="arrow-btn"
      onClick={e => {
        e.stopPropagation();
        onClick();
      }}
      aria-label={expanded ? '접기' : '더보기'}
      style={{
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        fontSize: '2rem',
        transition: 'transform 0.2s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 0,
        padding: '0 0 0 1rem',
      }}
      tabIndex={-1}
      type="button"
    >
      {ArrowIcon ? (
        <ArrowIcon expanded={expanded} />
      ) : (
        <span
          className="material-symbols-outlined"
          style={{
            fontSize: '2rem',
            fontVariationSettings: "'FILL' 0, 'wght' 200, 'GRAD' 0, 'opsz' 24",
            display: 'inline-block',
            transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
            margin: 0,
          }}
        >
          arrow_forward
        </span>
      )}
    </button>
  );
}

ArrowButton.propTypes = {
  expanded: PropTypes.bool.isRequired,
  ArrowIcon: PropTypes.elementType,
  onClick: PropTypes.func.isRequired,
};

// 태그 리스트 렌더링 컴포넌트
function TagList({ tags }) {
  return (
    <div className="card-tags">
      {tags.map((tag, idx) => (
        <div className="tag" key={idx}>
          {tag}
        </div>
      ))}
    </div>
  );
}

TagList.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string),
};

// 상세 설명(마크다운) 컴포넌트
function DetailsSection({ description }) {
  if (!description) {
    return <div className="dummy-text">No description available</div>;
  }
  return (
    // <ReactMarkdown className="card-detail-markdown">
    //   {description}
    // </ReactMarkdown>
    <div className="card-detail-markdown">
      {description}
    </div>
  );
}

DetailsSection.propTypes = {
  description: PropTypes.string,
};

function BaseCard({
  expanded,
  onToggle,
  children,
  mainImage,
  description,
  tags,
  ArrowIcon = null,
  sectionName,
}) {
  return (
    <div
      className={`card${expanded ? ' expanded' : ''}`}
      onClick={onToggle}
      tabIndex={0}
      role="button"
      aria-expanded={expanded}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') onToggle();
      }}
    >
      <div className="card-header-container">
        <div className="card-header">
          <div className="card-header-content">{children}</div>
          <ArrowButton expanded={expanded} ArrowIcon={ArrowIcon} onClick={onToggle} />
        </div>
      </div>
      <div className={`card-detail-container${expanded ? ' expanded' : ''}`}>
        <div className={`card-detail${expanded ? ' expanded' : ''}`}>
          <div className="card-detail-item">
            <div className="card-detail-item title">Desc.</div>
            <div className="card-detail-item content">
              <DetailsSection description={description} />
            </div>
          </div>
          {Array.isArray(tags) && tags.length > 0 && (
            <div className="card-detail-item">
              <div className="card-detail-item title">Tags</div>
              <div className="card-detail-item content">
                <TagList tags={tags} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

BaseCard.propTypes = {
  expanded: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  children: PropTypes.node,
  mainImage: PropTypes.string,
  description: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
  ArrowIcon: PropTypes.elementType,
  sectionName: PropTypes.string,
};

export default BaseCard;