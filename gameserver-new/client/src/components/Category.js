// src/components/Category.js
import React from 'react';
import CategoryHeader from './CategoryHeader';
import QuestionCell from './QuestionCell';

function Category({ category, onQuestionClick }) {
  return (
    <div className="category-column">
      <CategoryHeader name={category.name} />
      {category.Questions.map((question) => (
        <QuestionCell
          key={question.id}
          question={question}
          onClick={() => onQuestionClick(question)}
        />
      ))}
    </div>
  );
}

export default Category;
