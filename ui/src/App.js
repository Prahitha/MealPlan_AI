import React, { useState } from 'react';
import InputForm from './InputForm';
import MealCard from './MealCard';
import Header from './Header';

function App() {
  const [mealSuggestions, setMealSuggestions] = useState([]);

  return (
    <div>
      <Header />
      <h1>Meal Planner</h1>
      <InputForm onSubmit={(suggestions) => setMealSuggestions(suggestions)} />
      <MealCard mealSuggestions={mealSuggestions} />
    </div>
  );
}

export default App;
