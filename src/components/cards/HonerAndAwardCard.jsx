import React from 'react';
import BaseCard from './BaseCard';
import { formatDate } from '../../utils/contentUtils';

const HonerAndAwardCard = ({ data, expanded, onToggle }) => (
  <BaseCard
    expanded={expanded}
    onToggle={onToggle}
    mainImage={data.mainImage}
    description={<p>{data.description}</p>}
  >
    <p className="date">
      {formatDate(data.date)}{' '}
    </p>
    <h3>{data.organization}</h3>
    <p>{data.title}</p>
  </BaseCard>
);

export default HonerAndAwardCard;