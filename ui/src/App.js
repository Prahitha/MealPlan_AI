import React, { useState, useEffect } from 'react';
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

      console.log('API Response:', response.data);

      setMealSuggestions(response.data);

      console.log('mealSuggestions updated:', mealSuggestions);

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
      {mealSuggestions && mealSuggestions.map((day, index) => (
        <div key={index}>
          <h3>{day.Day}</h3>
          {day.Meals.map((meal, mealIndex) => (
            <div key={mealIndex}>
              <strong>{meal['Meal Type']} - {meal['Name of the dish']}</strong><br />
              <p>Ingredients:</p>
              <ul>
                {meal['Ingredients used with quantity required'].map((ingredient, ingredientIndex) => (
                  <li key={ingredientIndex}>{ingredient.Ingredient} - {ingredient.Quantity}</li>
                ))}
              </ul>
              <p>Recipe:</p>
              <ul>
                {meal['Recipe in steps'].map((step, stepIndex) => (
                  <li key={stepIndex}>{step}</li>
                ))}
              </ul>
              <p>Nutritional Information:</p>
              <p>Calories - {meal['Nutritional Information'].Calories}, Protein - {meal['Nutritional Information'].Protein}, Carbs - {meal['Nutritional Information'].Carbohydrates}, Fat - {meal['Nutritional Information'].Fat}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default App;
