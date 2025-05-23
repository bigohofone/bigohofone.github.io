import React from 'react';
import BaseCard from './BaseCard';
import { formatDate } from '../../utils/contentUtils';

const ProjectCard = ({ data, expanded, onToggle }) => (
  <BaseCard
    expanded={expanded}
    onToggle={onToggle}
    description={<p>{data.description}</p>}
  >
    <p className="date">
      {formatDate(data.start_date)} - {formatDate(data.end_date)}{' '}
    </p>
    <h3>{data.name}</h3>
    <p>{data.organization}</p>
  </BaseCard>
);

export default ProjectCard;