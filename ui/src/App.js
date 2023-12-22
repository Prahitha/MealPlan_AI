import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [pantryItems, setPantryItems] = useState('');
  const [dietaryPreferences, setDietaryPreferences] = useState('');
  const [allergies, setAllergies] = useState('');
  const [familySize, setFamilySize] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [daysOfWeek, setDaysOfWeek] = useState('');
  const [mealsForTheDay, setMealsForTheDay] = useState('');
  const [mealSuggestions, setMealSuggestions] = useState([]);

  const generateMealSuggestions = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/generate_text', {
        pantry_items: pantryItems.split(',').map(item => item.trim()),
        dietary_preferences: dietaryPreferences,
        allergies: allergies.split(',').map(allergy => allergy.trim()),
        family_size: familySize,
        cooking_time: cookingTime,
        days_of_week: daysOfWeek.split(',').map(day => day.trim()),
        meals_for_the_day: mealsForTheDay,
      });

      setMealSuggestions(response.data);
    } catch (error) {
      console.error('Error generating meal suggestions:', error);
    }
  };

  return (
    <div>
      <h1>Meal Planner</h1>
      <label>
        Pantry Items:
        <input type="text" value={pantryItems} onChange={(e) => setPantryItems(e.target.value)} />
      </label>
      <br />
      <label>
        Dietary Preferences:
        <input type="text" value={dietaryPreferences} onChange={(e) => setDietaryPreferences(e.target.value)} />
      </label>
      <br />
      <label>
        Allergies:
        <input type="text" value={allergies} onChange={(e) => setAllergies(e.target.value)} />
      </label>
      <br />
      <label>
        Family Size:
        <input type="text" value={familySize} onChange={(e) => setFamilySize(e.target.value)} />
      </label>
      <br />
      <label>
        Cooking Time:
        <input type="text" value={cookingTime} onChange={(e) => setCookingTime(e.target.value)} />
      </label>
      <br />
      <label>
        Days of Week:
        <input type="text" value={daysOfWeek} onChange={(e) => setDaysOfWeek(e.target.value)} />
      </label>
      <br />
      <label>
        Meals for the Day:
        <input type="text" value={mealsForTheDay} onChange={(e) => setMealsForTheDay(e.target.value)} />
      </label>
      <br />
      <button onClick={generateMealSuggestions}>Generate Meal Suggestions</button>

      <h2>Generated Meal Suggestions</h2>
      <ul>
        {mealSuggestions.map((suggestion, index) => (
          <li key={index}>
            <strong>{suggestion.day} - {suggestion.meal_type}</strong><br />
            Dish: {suggestion.dish_name}<br />
            Ingredients: {suggestion.ingredients.join(', ')}<br />
            Recipe: {suggestion.recipe}<br />
            Nutritional Information: Calories - {suggestion.nutritional_info.calories}, Protein - {suggestion.nutritional_info.protein}, Carbs - {suggestion.nutritional_info.carbs}, Fat - {suggestion.nutritional_info.fat}<br />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
