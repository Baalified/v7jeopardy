// src/components/CategoryHeader.js
import React from 'react';
import "./css/CategoryHeader.css";

function CategoryHeader({ name }) {
  return (
    <div className="category-header">
      {name}
    </div>
  );
}

export default CategoryHeader;
