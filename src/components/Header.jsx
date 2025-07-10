/*
 * Copyright (c) 2025 Wonjun Oh (owj0421@naver.com)
 * All rights reserved.
 *
 * This source code is the property of Wonjun Oh.
 * Unauthorized copying, distribution, or use of this code, in whole or in part, is strictly prohibited.
 */

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { FaEnvelope, FaGithub, FaLinkedin } from 'react-icons/fa';
import { NewsContent } from '../utils/contentConfig';
import { formatDate } from '../utils/contentUtils';


function NewsItem({
  data
}) {
  return (
    <div className="news-item">
        <div className="news-item__date">
            <p className="date">{formatDate(data.date)}{' '}</p>
        </div>
        <div className="news-item__content">
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
    <div className="news-block">
        <div className="news-block__gradient"></div>
        <div className="news-block__items">
            {contentData.length > 0 ? (
                contentData.map((data, index) => (
                    <NewsItem
                        key={`${contentName}-${index}`}
                        data={data}
                    />
                ))
            ) : (
                <div className="no-data">No data available.</div>
            )}
        </div>
    </div>
  );
}

function HeaderItem({
  title,
  content,
}) {
  return (
    <div className="header-item">
      <div className="header-item__title">
        {title}
      </div>
      <div className="header-item__content markdown-body">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
}


const Header = () => (
  <div className="header">
    <div className="header__inner">
      <div className="header-block">
        <div className="header-block__title">
          Who am I?
        </div>
        <div className="header-block__items">
          <HeaderItem
            title="Introduction"
            content={`
안녕하세요! 저는 현재 고려대학교에 재학 중인 오원준입니다.

대화와 소통 그 안에서 발생하는 
            `}
          />
          <HeaderItem
            title="Interests"
            content={`
AI와 세상 사이의 상호작용에 깊은 관심을 가지고 있습니다. 특히, 단순히 세상을 암기하는 수준을 넘어, 그 내재된 가변성과 복잡한 스케일을 인지하고, 상호작용하며 지속적으로 소통하고 성장할 수 있는 ‘인지적 존재’로서의 AGI를 구현하는 것이 제 목표입니다.

이를 위해, 세상을 효과적으로 이해하는 데 기반이 되는 Representation Learning과, 이러한 표현을 바탕으로 상호작용을 가능하게 하는 Cognitive Theory에 관심을 가지고 있습니다.
            `}
          />
          <HeaderItem
            title="Motivation"
            content={`

            `}
          />
          <HeaderItem
            title="Fun Facts!"
            content={`
인공지능뿐만 아니라, 세상을 표현하는 활동에도 관심이 많습니다. 특히 미술, 사진에 흥미를 가지고 있으며, 이를 통해 새로운 시각으로 세상을 바라보는 경험을 좋아합니다.


            `}
          />
        </div>
      </div>
      <div className="header-block">
        <div className="header-block__title">
          News
        </div>
        <News />
      </div>
    </div>
  </div>
);

export default Header;