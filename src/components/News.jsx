import React, { useMemo, useState, useRef, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import '../assets/styles/News.css';

// TODO: 뉴스 아이템이 너무 많아지면 로드 시간이 길어질 수 있으므로, 페이지네이션 또는 무한 스크롤 도입 고려
// 사이즈 고정되지 않게 해서 역동적이게 구성
// 사진 넣을 수 있게 구성

const NUM_NEWS = 6;
const MONTH_ORDER = [
  'January','February','March','April','May','June','July',
  'August','September','October','November','December'
];

const hashKey = (news, idx) => {
  const key = `${news.year}-${news.month}-${news.title}-${idx}`;
  let h = 0;
  for (let i = 0; i < key.length; i++) {
    h = (h * 31 + key.charCodeAt(i)) >>> 0;
  }
  return h >>> 0;
};

const useAllNews = (locale) => {
  const newsModules = require.context('../data/news', false, /\.js$/);

  const fileKeys = newsModules.keys().filter((fileName) => {
    const localeMatch = fileName.match(/\.([a-z]{2})\.js$/i);
    return localeMatch ? localeMatch[1] === locale : !fileName.match(/\.([a-z]{2})\.js$/i);
  });

  const newsList = fileKeys.flatMap((fileName) => {
    const module = newsModules(fileName);
    const newsItems = module.default || module;
    const year = fileName.match(/(\d{4})/)?.[0] ?? '';
    return newsItems.map((news) => ({ ...news, year }));
  });

  newsList.sort((a, b) => {
    if (b.year !== a.year) return b.year - a.year;
    return MONTH_ORDER.indexOf(b.month) - MONTH_ORDER.indexOf(a.month);
  });

  return newsList;
};

const groupByYearAndMonth = (newsList) => {
  return newsList.reduce((acc, news) => {
    acc[news.year] ??= {};
    acc[news.year][news.month] ??= [];
    acc[news.year][news.month].push(news);
    return acc;
  }, {});
};

export function News() {
  const { locale } = useAppContext();
  const allNews = useAllNews(locale);

  const containerRef = useRef(null);

  const groupedNews = useMemo(() => groupByYearAndMonth(allNews), [allNews]);

  const years = useMemo(() => Object.keys(groupedNews).sort((a, b) => b - a), [groupedNews]);

  const [selectedYear, setSelectedYear] = useState('all');
  const [expanded, setExpanded] = useState(false);

  const filteredList = useMemo(() => {
    return selectedYear === 'all'
      ? allNews
      : allNews.filter((n) => n.year === selectedYear);
  }, [allNews, selectedYear]);

  // 한 줄에 3개만 보여주고 스크롤로 더 보기 (expanded는 더이상 UI에 사용되지 않음)
  const shownList = filteredList; // 전체를 스트리밍하되, 뷰포트에서 3개가 보이도록 CSS로 제어
  const shownGrouped = useMemo(() => groupByYearAndMonth(shownList), [shownList]);

  return (
    <>
      {/* 연도 토글 및 더보기 버튼 제거 */}
      <div ref={containerRef} className="news-container">
        {Object.keys(shownGrouped)
          .sort((a, b) => b - a)
          .map((year) => (
            <React.Fragment key={year}>
              {Object.keys(shownGrouped[year])
                .sort((a, b) => MONTH_ORDER.indexOf(b) - MONTH_ORDER.indexOf(a))
                .map((month) => (
                  <React.Fragment key={`${year}-${month}`}>
                    {shownGrouped[year][month].map((news, idx) => {
                      const seed = hashKey(news, idx) % 100000; // picsum 시드

                      const lowW = 40;
                      const lowH = 30;
                      const imgLow = `https://picsum.photos/seed/${seed}/${lowW}/${lowH}`;
                      const img2x = `https://picsum.photos/seed/${seed}/${lowW * 2}/${lowH * 2}`;

                      return (
                        <div
                          className="news card"
                          key={`${year}-${month}-${idx}`}
                        >
                          <img
                            className="bg-photo"
                            src={imgLow}
                            srcSet={`${imgLow} 1x, ${img2x} 2x`}
                            alt=""
                            aria-hidden="true"
                            loading="lazy"
                            decoding="async"
                          />

                          <svg className="noise" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 100 100" aria-hidden="true">
                            <filter id={`noise-${year}-${month}-${idx}`}>
                              <feTurbulence 
                                type="fractalNoise"
                                baseFrequency="10"
                                numOctaves="5"
                                seed={idx + 1}
                                stitchTiles="stitch"
                              />
                              <feColorMatrix type="saturate" values="0" />
                              <feComponentTransfer>
                                <feFuncA type="table" tableValues="0 0.5" />
                              </feComponentTransfer>
                            </filter>

                            <rect
                              width="100%"
                              height="100%"
                              filter={`url(#noise-${year}-${month}-${idx})`}
                              fill="white"
                            />
                          </svg>

                          <div className="news__content-wrap">
                            <div className="news__date">{news.year} {news.month}</div>
                            <span className="news__content" dangerouslySetInnerHTML={{ __html: news.title }}/>
                            
                          </div>
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
            </React.Fragment>
          ))}
      </div>
    </>
  );
};