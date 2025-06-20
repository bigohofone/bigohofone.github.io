/*
 * Copyright (c) 2025 Wonjun Oh (owj0421@naver.com)
 * All rights reserved.
 *
 * This source code is the property of Wonjun Oh.
 * Unauthorized copying, distribution, or use of this code, in whole or in part, is strictly prohibited.
 */

import BaseContentElement from './Base';
import { formatDate } from '../../utils/contentUtils';

const AUTHOR_NAME = 'Wonjun Oh';

const formatAuthor = (author, { isFirst = false, markFirst = false, markCorresponding = false } = {}) => {
  const displayName = author === AUTHOR_NAME ? <u>{author}</u> : author;
  return (
    <>
      {displayName}
      {markFirst && isFirst && <sup>*</sup>}
      {markCorresponding && <sup>†</sup>}
    </>
  );
};

const renderAuthors = ({ first_authors = [], co_authors = [], corresponding_authors = [] }) => {
  const authors = [];

  // First authors
  first_authors.forEach((author, idx) => {
    authors.push(
      <span key={`fa-${idx}`}>
        {formatAuthor(author, { isFirst: true, markFirst: true })}
        {idx < first_authors.length - 1 && ', '}
      </span>
    );
  });

  // Co-authors
  if (co_authors.length > 0) {
    if (authors.length > 0) authors.push(', ');
    authors.push(
      <span key="co-authors">{co_authors.join(', ')}</span>
    );
  }

  // Corresponding authors
  corresponding_authors.forEach((author, idx) => {
    if (authors.length > 0) authors.push(', ');
    authors.push(
      <span key={`ca-${idx}`}>
        {formatAuthor(author, { markCorresponding: true })}
      </span>
    );
  });

  return authors;
};

const PaperContentElement = ({ data, expanded, onToggle }) => (
  <BaseContentElement
    expanded={expanded}
    onToggle={onToggle}
    mainImage={data.mainImage}
    description={<p>{data.description}</p>}
  >
    <p>{data.venue}{data.paper_type && <span className="paper-type">{data.paper_type}</span>}</p>
    <h3>
      {data.title}
    </h3>
    <p>
      {renderAuthors({
        first_authors: data.first_authors,
        co_authors: data.co_authors,
        corresponding_authors: data.corresponding_authors
      })}
    </p>
  </BaseContentElement>
);

export default PaperContentElement;


