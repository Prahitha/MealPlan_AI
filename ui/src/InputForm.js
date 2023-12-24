import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Button,
  CheckboxGroup,
  Checkbox,
  Select,
} from '@chakra-ui/react';
// import Select from 'react-select';
import axios from 'axios';
import ImageUploader from "./ImageUploader";

const InputForm = ({onSubmit}) => {

    const [pantryItems, setPantryItems] = useState('');
    const [dietaryPreferences, setDietaryPreferences] = useState([]);
    const [allergies, setAllergies] = useState('');
    const [familySize, setFamilySize] = useState('');
    const [cookingTime, setCookingTime] = useState('');
    const [daysOfWeek, setDaysOfWeek] = useState([]);
    const [mealsForTheDay, setMealsForTheDay] = useState([]);
    const [cuisine, setCuisine] = useState('');
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
  
    const generateMealSuggestions = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post('http://127.0.0.1:5000/generate_text', {
          pantry_items: pantryItems.split(',').map(item => item.trim()),
          dietary_preferences: dietaryPreferences,
          allergies: allergies.split(',').map(allergy => allergy.trim()),
          family_size: familySize,
          cooking_time: cookingTime,
          days_of_week: daysOfWeek,
          meals_for_the_day: mealsForTheDay,
          cuisine: cuisine.split(',').map(cuisine => cuisine.trim()),
        });
  
        console.log('API Response:', response.data);
        setMealSuggestions(response.data);
      } catch (error) {
        console.error('Error generating meal suggestions:', error);
      }
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      // Pass formData to the onSubmit function
      onSubmit(mealSuggestions);
    };

    return (
      <Box>
        {/* Form */}
        <FormControl p={4} onSubmit={handleSubmit}>
          {/* Ingredients List */}
          <Flex align="center">
          {/* This should be a creatable multi select from react-select*/}
            <Input type="text" placeholder="Ingredients List" flex="5/6" value={pantryItems} onChange={(e) => setPantryItems(e.target.value)} />
            <ImageUploader onFoodItemsReceived={onFoodItemsReceived} />
          </Flex>

          {/* Dietary Preferences */}
          <FormLabel mt={4}>Dietary Preferences</FormLabel>
          <CheckboxGroup colorScheme="green" value={dietaryPreferences} onChange={(values) => setDietaryPreferences(values)} >
            <Checkbox value="Vegan">Vegan</Checkbox>
            <Checkbox value="Vegetarian">Vegetarian</Checkbox>
            <Checkbox value="Keto">Keto</Checkbox>
            <Checkbox value="Kosher">Kosher</Checkbox>
            <Checkbox value="Diabetes">Diabetes</Checkbox>
            <Checkbox value="Low-carb">Low-carb</Checkbox>
            <Checkbox value="Pescatarian">Pescatarian</Checkbox>
            <Checkbox value="Gluten-free">Gluten-free</Checkbox>
            <Checkbox value="Dairy-free">Dairy-free</Checkbox>
          </CheckboxGroup>

          {/* Allergies */}
          <FormLabel mt={4}>Allergies</FormLabel>
          {/* This should be a creatable multi select from react-select*/}
            <Input type="text" placeholder="Allergies" value={allergies} onChange={(e) => setAllergies(e.target.value)} />

          {/* Family Size */}
          <FormLabel mt={4}>Family Size</FormLabel>
          <Select placeholder='Select option' value={familySize} onChange={(e) => setFamilySize(e.target.value)} >
          <option value='1'>1</option>
          <option value='2'>2</option>
          <option value='4'>4</option>
          <option value='6'>6</option>
          <option value='6+'>6+</option>
          </Select>

          {/* Meals of the Day */}
          <FormLabel mt={4}>Meals of the Day</FormLabel>
          <CheckboxGroup colorScheme="blue" value={mealsForTheDay} onChange={(values) => setMealsForTheDay(values)} >
            <Checkbox value="Breakfast">Breakfast</Checkbox>
            <Checkbox value="Lunch">Lunch</Checkbox>
            <Checkbox value="Dinner">Dinner</Checkbox>
            <Checkbox value="Snack">Snack</Checkbox>
            <Checkbox value="Dessert">Dessert</Checkbox>
          </CheckboxGroup>

          {/* Cuisine */}
          <FormLabel mt={4}>Cuisine</FormLabel>
          {/* This should be a creatable multi select from react-select*/}
            <Input type="text" placeholder="Cuisines" value={cuisine} onChange={(e) => setCuisine(e.target.value)} />

          {/* Cooking Time */}
          <FormLabel mt={4}>Cooking Time</FormLabel>
          <Select placeholder='Select option' value={cookingTime} onChange={(e) => setCookingTime(e.target.value)} >
          <option value='10 minutes'>10 minutes</option>
          <option value='20 minutes'>20 minutes</option>
          <option value='30 minutes'>30 minutes</option>
          <option value='60 minutes'>60 minutes</option>
          <option value='Over an hour'>Over an hour</option>
          </Select>

          {/* Days of Week */}
          <FormLabel mt={4}>Days of Week</FormLabel>
          <CheckboxGroup colorScheme="purple" value={daysOfWeek} onChange={(values) => setDaysOfWeek(values)} >
            <Checkbox value="Monday">Monday</Checkbox>
            <Checkbox value="Tuesday">Tuesday</Checkbox>
            <Checkbox value="Wednesday">Wednesday</Checkbox>
            <Checkbox value="Thursday">Thursday</Checkbox>
            <Checkbox value="Friday">Friday</Checkbox>
            <Checkbox value="Saturday">Saturday</Checkbox>
            <Checkbox value="Sunday">Sunday</Checkbox>
          </CheckboxGroup>

          {/* Generate Button */}
          <Button type="submit" mt={4} colorScheme="teal" onClick={generateMealSuggestions} >
            Generate
          </Button>
        </FormControl>
      </Box>
    )
}

export default InputForm;