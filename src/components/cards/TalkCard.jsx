import React from 'react';
import BaseCard from './BaseCard';

const TalkCard = ({ data, expanded, onToggle }) => (
  <BaseCard
    expanded={expanded}
    onToggle={onToggle}
    description={<p>{data.description}</p>}
  >
    <p className="date">{`${data.date[0]}/${data.date[1]}`}</p>
    <h3>{data.title}</h3>
    <p>{data.organization}</p>
  </BaseCard>
);

export default TalkCard;