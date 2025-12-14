

import React from 'react';

import { useAppContext } from '../contexts/AppContext.jsx';
import { CVComponent } from '../components/cv/CV.jsx'

export default function Publications() {
  const { locale, width } = useAppContext();

  return (
    <CVComponent />
  );
};