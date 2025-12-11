

import React from 'react';

import { useAppContext } from '../contexts/AppContext.jsx';
import { ResumeComponent } from '../components/resume/Resume.jsx'

export default function Publications() {
  const { locale, width } = useAppContext();

  return (
    <ResumeComponent />
  );
};