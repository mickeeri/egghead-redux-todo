import React from 'react';
import FilterLink from './FilterLink';

const Footer = () => (
  <p className="filters">
    Show:
    {' '}
    <FilterLink filter="all">
      All
    </FilterLink>
    <span> | </span>
    <FilterLink filter="active">
      Active
    </FilterLink>
    <span> | </span>
    <FilterLink filter="completed">
      Completed
    </FilterLink>
  </p>
);

export default Footer;
