import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ImageUploader from './ImageUploader';

function App() {
  const [pantryItems, setPantryItems] = useState('');
  const [dietaryPreferences, setDietaryPreferences] = useState('');
  const [allergies, setAllergies] = useState('');
  const [familySize, setFamilySize] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [daysOfWeek, setDaysOfWeek] = useState('');
  const [mealsForTheDay, setMealsForTheDay] = useState('');
  const [mealSuggestions, setMealSuggestions] = useState([]);
  const [foodItems, setFoodItems] = useState([]);

  useEffect(() => {
    console.log('mealSuggestions updated:', mealSuggestions);
  }, [mealSuggestions]);

  const onFoodItemsReceived = (items) => {
    const updatedPantryItems = [...pantryItems.split(','), ...items].join(', ');
    setPantryItems(updatedPantryItems);
    setFoodItems(items);
  };

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
    } catch (error) {
      console.error('Error generating meal suggestions:', error);
    }
  };

  return (
    <div>
      <ImageUploader onFoodItemsReceived={onFoodItemsReceived} />
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
      {mealSuggestions.formatted_output && Array.isArray(mealSuggestions.formatted_output) && mealSuggestions.formatted_output?.map((day, index) => (
        <div key={index}>
          <h3>{day.day}</h3>
          {day.meals.map((meal, mealIndex) => (
            <div key={mealIndex}>
              <strong>{meal['type']} - {meal['dishName']}</strong><br />
              <p>Ingredients:</p>
              <ul>
                {meal['ingredients'].map((ingredient, ingredientIndex) => (
                  <li key={ingredientIndex}>{ingredient}</li>
                ))}
              </ul>
              <p>Recipe:</p>
              <ul>
                {meal['recipe'].map((step, stepIndex) => (
                  <li key={stepIndex}>{step}</li>
                ))}
              </ul>
              <p>Nutritional Information:</p>
              <p>Calories - {meal['nutritionalInformation'].Calories}, Protein - {meal['nutritionalInformation'].Protein}, Carbs - {meal['nutritionalInformation'].Carbohydrates}, Fat - {meal['nutritionalInformation'].Fat}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default App;
