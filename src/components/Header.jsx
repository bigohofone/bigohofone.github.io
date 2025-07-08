/*
 * Copyright (c) 2025 Wonjun Oh (owj0421@naver.com)
 * All rights reserved.
 *
 * This source code is the property of Wonjun Oh.
 * Unauthorized copying, distribution, or use of this code, in whole or in part, is strictly prohibited.
 */

import React from 'react';
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
    <div
      className={`header-item`}
    >
      <div className={`header-item__title`}>
        {title}
      </div>
      <div className={`header-item__content`}>
        {content}
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
                        content="Hello! I'm Wonjun Oh, a passionate software developer with a keen interest in creating innovative solutions. I specialize in web development, backend systems, and cloud technologies. My goal is to build applications that not only meet user needs but also provide a seamless and enjoyable experience. I thrive on challenges and continuously seek opportunities to expand my skills and knowledge in the ever-evolving tech landscape."
                    />
                    <HeaderItem
                        title="Background"
                        content="With a strong foundation in computer science and years of hands-on experience, I have worked on a variety of projects ranging from web applications to backend systems. My expertise lies in building scalable, maintainable, and efficient solutions using modern technologies. I am always eager to learn new things and embrace challenges that push me to grow as a developer. Whether collaborating with a team or working independently, I strive to deliver high-quality results and contribute positively to any project I am involved in."
                    />
                    <HeaderItem
                        title="Background"
                        content="With a strong foundation in computer science and years of hands-on experience, I have worked on a variety of projects ranging from web applications to backend systems. My expertise lies in building scalable, maintainable, and efficient solutions using modern technologies. I am always eager to learn new things and embrace challenges that push me to grow as a developer. Whether collaborating with a team or working independently, I strive to deliver high-quality results and contribute positively to any project I am involved in."
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