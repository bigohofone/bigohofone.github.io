import React from 'react';

const EducationCard = ({ data }) => (
  <div className="card">
    <p className="date">{`${data.start_date[0]}/${data.start_date[1]} - ${data.end_date[0]}/${data.end_date[1]}`}</p>
    <h3>{data.institution}</h3>
    <p>{data.degree}</p>
    
    {data.details.map((d, i) => <p key={i}>{d}</p>)}
  </div>
);

export default EducationCard;