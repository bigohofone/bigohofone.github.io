import React from 'react';

const HonerAndAwardCard = ({ data }) => (
  <div className="card">
    <p className="date">{data.year}</p>
    <h3>{data.organization}</h3>
    <p>{data.title}</p>
    <p>{data.description}</p>
  </div>
);

export default HonerAndAwardCard;
