import React from 'react';
import FilterLink from './FilterLink';

const Footer = () => (
  <p className="filters">
    Show:
    {' '}
    <FilterLink filter="SHOW_ALL">
      All
    </FilterLink>
    <span> | </span>
    <FilterLink filter="SHOW_ACTIVE">
      Active
    </FilterLink>
    <span> | </span>
    <FilterLink filter="SHOW_COMPLETED">
      Completed
    </FilterLink>
  </p>
);

export default Footer;
