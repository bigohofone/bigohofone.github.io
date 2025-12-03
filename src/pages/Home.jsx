import React from 'react';

import { useAppContext } from '../contexts/AppContext';

import { ID } from '../components/ID';
import { News } from '../components/News';
import { Title } from '../components/Title';
import { AboutMe } from '../components/AboutMe';
import { DownloadLinks } from '../components/DownloadLinks';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Contact } from '../components/Contact';

const Home = () => {

  const { locale } = useAppContext();

  return (
    <>
      <Header />
      <ID />

      {/* <div style={{ height: '8rem' }}></div> */}
      <AboutMe />

      {/* <div style={{ height: '8rem' }}></div> */}
      <Title title={locale === 'ko' ? '바로가기' : 'Shortcuts'} />
      <DownloadLinks />

      <div style={{ height: '8rem' }}></div>
      <Title title={locale === 'ko' ? '최근소식'  : 'Recent News'} />
      <News />

      <div style={{ height: '8rem' }}></div>
      <Title title={locale === 'ko' ? '연락처' : 'Contact'} />
      <Contact />
      
      <div style={{ height: '8rem' }}></div>
      <Footer />
    </>
  );
};

export default Home;