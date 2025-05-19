import React from 'react';

const ExperienceCard = ({ data }) => (
  <div className="card">
    <h3>{data.organization}, {data.location}</h3>
    <p>{data.position}</p>
    <p>{`${data.start_date[0]}/${data.start_date[1]} - ${data.end_date[0]}/${data.end_date[1]}`}</p>
    <p>{data.description}</p>
  </div>
);

export default ExperienceCard;