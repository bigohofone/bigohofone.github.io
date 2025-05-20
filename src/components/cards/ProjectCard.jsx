import React from 'react';
import BaseCard from './BaseCard';

const ProjectCard = ({ data, expanded, onToggle }) => (
  <BaseCard
    expanded={expanded}
    onToggle={onToggle}
    description={<p>{data.description}</p>}
  >
    <p className="date">{data.year}</p>
    <h3>{data.name}</h3>
    <p>{data.organization}</p>
  </BaseCard>
);

export default ProjectCard;