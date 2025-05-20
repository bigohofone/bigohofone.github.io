import React from 'react';
import BaseCard from './BaseCard';

const HonerAndAwardCard = ({ data, expanded, onToggle }) => (
  <BaseCard
    expanded={expanded}
    onToggle={onToggle}
    description={<p>{data.description}</p>}
  >
    <p className="date">{data.year}</p>
    <h3>{data.organization}</h3>
    <p>{data.title}</p>
  </BaseCard>
);

export default HonerAndAwardCard;