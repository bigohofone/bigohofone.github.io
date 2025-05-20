import React from 'react';

const ProjectCard = ({ data }) => (
  <div className="card">
    <p className="date">{data.year}</p>
    <h3>{data.name}</h3>
    <p>{data.organization}</p>
    <p>{data.description}</p>
  </div>
);

export default ProjectCard;