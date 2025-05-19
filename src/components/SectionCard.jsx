import React from 'react';
import { SECTIONS } from './sectionConfig';

const SectionCard = ({ section, data }) => {
  const sectionConfig = SECTIONS[section]; // 섹션에 해당하는 설정 가져오기

  if (!sectionConfig || !sectionConfig.component) {
    return null; // 지원되지 않는 섹션일 경우
  }

  const CardComponent = sectionConfig.component; // 컴포넌트 가져오기

  return <CardComponent data={data} />; // 컴포넌트를 렌더링
};

export default SectionCard;