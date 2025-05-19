import React from 'react';

const ProjectCard = ({ data }) => (
  <div className="card">
    <h3>{data.name}</h3>
    <p>{data.organization}</p>
    <p>{data.date}</p>
    <p>{data.description}</p>
  </div>
);

export default ProjectCard;