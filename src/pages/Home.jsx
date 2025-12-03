import React from 'react';

import { useAppContext } from '../contexts/AppContext';

import { ID } from '../components/ID';
import { News } from '../components/News';
import { Title } from '../components/Title';
import { AboutMe } from '../components/AboutMe';
import { DownloadLinks } from '../components/DownloadLinks';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

const Home = () => {

  const { locale } = useAppContext();

  return (
    <>
      <ID />

      {/* <div style={{ height: '8rem' }}></div> */}
      <AboutMe />

      {/* <div style={{ background: 'rgba(0, 0, 0, 0.05)' }}> */}
        <div style={{ height: '4rem' }}></div>
        <Title title={locale === 'ko' ? '바로가기' : 'Shortcuts'} />
        <DownloadLinks />
        <div style={{ height: '4rem' }}></div>
      {/* </div> */}

      <div style={{ height: '4rem' }}></div>
      <Title title={locale === 'ko' ? '최근소식'  : 'Recent News'} />
      <News />

      {/* <div style={{ height: '8rem' }}></div>
      <Title title={locale === 'ko' ? '연락처' : 'Contact'} />
      <Contact /> */}
    </>
  );
};

export default Home;