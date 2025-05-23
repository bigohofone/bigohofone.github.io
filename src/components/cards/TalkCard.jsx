import React from 'react';
import BaseCard from './BaseCard';
import { formatDate } from '../../utils/contentUtils';

const TalkCard = ({ data, expanded, onToggle }) => (
  <BaseCard
    expanded={expanded}
    onToggle={onToggle}
    description={<p>{data.description}</p>}
  >
    <p className="date">
      {formatDate(data.date)}{' '}
    </p>
    <h3>{data.title}</h3>
    <p>{data.organization}</p>
  </BaseCard>
);

export default TalkCard;