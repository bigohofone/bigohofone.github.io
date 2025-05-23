import React from 'react';
import BaseCard from './BaseCard';
import { formatDate } from '../../utils/contentUtils';

const ExperienceCard = ({ data, expanded, onToggle }) => (
  <BaseCard
    expanded={expanded}
    onToggle={onToggle}
    description={<p>{data.description}</p>}
  >
    <p className="date">
      {formatDate(data.start_date)} - {formatDate(data.end_date)}{' '}
    </p>
    <h3>{data.organization}, {data.location}</h3>
    <p>{data.position}</p>
  </BaseCard>
);

export default ExperienceCard;