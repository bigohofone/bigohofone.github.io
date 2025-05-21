import React from 'react';
import BaseCard from './BaseCard';

const HonerAndAwardCard = ({ data, expanded, onToggle }) => (
  <BaseCard
    expanded={expanded}
    onToggle={onToggle}
    mainImage={data.mainImage}
    description={<p>{data.description}</p>}
  >
    <p className="date">
      {[data.date[0], data.date[1], data.date[2]]
        .filter((val) => val !== undefined && val !== null)
        .join('/')}
    </p>
    <h3>{data.organization}</h3>
    <p>{data.title}</p>
  </BaseCard>
);

export default HonerAndAwardCard;