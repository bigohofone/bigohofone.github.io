import React from 'react';
import BaseCard from './BaseCard';

const EducationCard = ({ data, expanded, onToggle }) => (
  <BaseCard
    expanded={expanded}
    onToggle={onToggle}
    description={<p>{data.description}</p>}
  >
    <p className="date">
      {[
        [data.start_date[0], data.start_date[1]].filter(v => v != null).join('/'),
        [data.end_date[0], data.end_date[1]].filter(v => v != null).join('/')
      ]
        .filter(v => v) // 빈 문자열 제거
        .join(' - ')}
    </p>
    <h3>{data.institution}</h3>
    <p>{data.degree}</p>
  </BaseCard>
);

export default EducationCard;