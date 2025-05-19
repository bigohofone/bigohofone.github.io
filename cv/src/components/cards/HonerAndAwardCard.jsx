import React from 'react';

const HonerAndAwardCard = ({ data }) => (
  <div className="card">
    <h3>{data.organization}</h3>
    <p>{data.title}</p>
    <p>{data.year}</p>
    <p>{data.description}</p>
  </div>
);

export default HonerAndAwardCard;
