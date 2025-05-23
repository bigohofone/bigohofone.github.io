import React from 'react';
import BaseCard from './BaseCard';
import { formatDate } from '../../utils/contentUtils';

const EducationCard = ({ data, expanded, onToggle }) => (
  <BaseCard
    expanded={expanded}
    onToggle={onToggle}
    description={<p>{data.description}</p>}
  >
    <p className="date">
      {formatDate(data.start_date)} - {formatDate(data.end_date)}{' '}
    </p>
    <h3>{data.institution}</h3>
    <p>{data.degree}</p>
  </BaseCard>
);

export default EducationCard;