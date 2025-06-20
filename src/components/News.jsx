/*
 * Copyright (c) 2025 Wonjun Oh (owj0421@naver.com)
 * All rights reserved.
 *
 * This source code is the property of Wonjun Oh.
 * Unauthorized copying, distribution, or use of this code, in whole or in part, is strictly prohibited.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { NewsContent } from '../utils/contentConfig';
import { formatDate } from '../utils/contentUtils';

function NewsContentElement({
  data
}) {
  return (
    <div
      className={`content-elem`}
      tabIndex={0}
      role="article"
    >
      <div className="news-elem">
        <p className="date">{formatDate(data.date)}{' '}</p>
        <p>{data.news}</p>
      </div>
    </div>
  );
}

function News({
}) {
  const contentName = NewsContent.contentName;
  const [contentData, setContentData] = React.useState([]);
  React.useEffect(() => {
    async function fetchData() {
      const data = await NewsContent.contentData();
      setContentData(data);
    }
    fetchData();
  }, []);

  return (
    <div className='content-container'>
      <nav className='content'>
        <p className='content-title'>{contentName}</p>
        {contentData.length > 0 ? (
            contentData.map((data, index) => (
                <NewsContentElement
                    key={`${contentName}-${index}`}
                    data={data}
                />
            ))
        ) : (
            <div className="no-data">No data available.</div>
        )}
      </nav>
    </div>
  );
}

export default News;