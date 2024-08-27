// src/components/Category.js
import React from 'react';
import CategoryHeader from './CategoryHeader';
import QuestionCell from './QuestionCell';
import './css/Category.css';

function Category({ category, onQuestionClick }) {
  return (
    <React.Fragment key={category.id}>
      <div class="category-column">
        <CategoryHeader name={category.name} />
        {category.Questions.map((question) => (
          <QuestionCell
            key={question.id}
            question={question}
            onClick={() => onQuestionClick(question)}
          />
        ))}
      </div>
    </React.Fragment>
  );
}

export default Category;
