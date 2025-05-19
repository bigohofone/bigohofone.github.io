import React from 'react';

const formatAuthor = (author, isFirst, markFirst, markCorresponding) => {
  const name = author === 'Wonjun Oh' ? <u>{author}</u> : author;

  return (
    <>
      {name}
      {markFirst && isFirst && <sup>*</sup>}
      {markCorresponding && <sup>†</sup>}
    </>
  );
};

const PaperCard = ({ data }) => {
  const { title, tag, first_authors, co_authors, corresponding_authors, venue, year } = data;

  return (
    <div className="card">
      <h3>
        {title}
        <span className="tag">{tag}</span>
      </h3>
      <p>
        {first_authors.map((author, idx) => (
          <span key={`fa-${idx}`}>
            {formatAuthor(author, true, true, false)}
            {idx < first_authors.length - 1 && ', '}
          </span>
        ))}
        {co_authors.length > 0 && `, ${co_authors.join(', ')}`}
        {corresponding_authors.map((author, idx) => (
          <span key={`ca-${idx}`}>
            {`, `}
            {formatAuthor(author, false, false, true)}
          </span>
        ))}
      </p>
      <p>{venue} {year}</p>
    </div>
  );
};

export default PaperCard;