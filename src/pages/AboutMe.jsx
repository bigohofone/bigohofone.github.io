import React from 'react';

import { useAppContext } from '../contexts/AppContext.jsx';

import Intro from '../components/aboutme/Intro.jsx';
import Description from '../components/aboutme/Description.jsx';
import News from '../components/aboutme/News.jsx';

const AboutMe = () => {
  const { locale } = useAppContext();

  return (
    <>
      <Intro />
      <Description />
      <News />
    </>
  );
};

export default AboutMe;