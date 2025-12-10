import React, { useMemo, useState, useRef, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';

import { useNews } from './useNews.jsx';
import { NewsStyles } from './aboutmeStyles.jsx';


export default function News() {
  const { locale } = useAppContext();
  const newsList = useNews();

  const style = NewsStyles();

  return (
    <div style={style.container}>
        <div style={style.inner}>
            <div style={style.innerTitleContainer}>
                <div style={style.innerTitle}>{locale === 'ko' ? '최근 소식' : 'Recent News'}</div>
            </div>
            <div style={style.innerListContainer}>
                {newsList.map((news, index) => (
                    <div key={index} style={
                        index === 0 
                        ? style.innerListItem_FirstChild 
                        : index === newsList.length - 1 
                        ? style.innerListItem_LastChild 
                        : style.innerListItem
                    }>
                    <div style={style.innerListItemDate}>
                        {locale === 'ko' ? `${news.year} ${news.month}` : `${news.month} ${news.year}`}
                    </div>
                    <div style={style.innerListItemContent}>{news.title}</div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};