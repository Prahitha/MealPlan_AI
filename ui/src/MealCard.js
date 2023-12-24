import React from 'react';

const MealCard = ({ mealSuggestions }) => {
  return (
    <div>
      {mealSuggestions.map((meal, index) => (
        <div key={index}>{meal}</div>
      ))}
    </div>
  );
};

export default MealCard;
