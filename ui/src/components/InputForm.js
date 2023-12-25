import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Grid,
  GridItem,
  Input,
  Button,
  CheckboxGroup,
  Checkbox,
  Select,
  Stack,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
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
    // const [mealSuggestions, setMealSuggestions] = useState([]);
    const [foodItems, setFoodItems] = useState([]);

    // Better FormControl: user can just type gibberish and it would still work right now
    const trimmedPantry = pantryItems.trim();
    const trimmedCuisine = cuisine.trim();
  
    // useEffect(() => {
    //   console.log('mealSuggestions updated:', mealSuggestions);
    // }, [mealSuggestions]);
  
    const onFoodItemsReceived = (items) => {
      const updatedPantryItems = [...pantryItems.split(','), ...items].join(', ');
      setPantryItems(updatedPantryItems);
      setFoodItems(items);
    };
  
    const generateMealSuggestions = async (e) => {
      // e.preventDefault();
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
        onSubmit(response.data);
      } catch (error) {
        console.error('Error generating meal suggestions:', error);
      }
    };

    const handleSubmit = (e) => {
      // e.preventDefault();
      // Pass formData to the onSubmit function
      generateMealSuggestions();
    };

    return (
      <>
        {/* Form */}
        <FormControl>
          <Grid
            templateRows="repeat(4, 1fr)"
            templateColumns="repeat(3, 1fr)"
            gap={2}
            padding={3}
            h="250px"
          >
            {/* Ingredients List */}
            <GridItem colSpan={3} rowSpan={1} bg="white">
              <FormControl isInvalid={trimmedPantry.length === 0}>
              <Flex align="center">
                {/* This should be a creatable multi select from react-select*/}
                <Input
                  type="text"
                  borderColor="transparent"
                  placeholder="Ingredients List"
                  flex="5/6"
                  value={pantryItems}
                  onChange={e => setPantryItems(e.target.value)}
                />
                {trimmedPantry.length === 0 ? (
                  <FormErrorMessage paddingLeft={"5px"} marginTop={"-3px"}>At least one ingredient is required.</FormErrorMessage>
                ) : (
                  <>
                  </>
                )}
                <ImageUploader onFoodItemsReceived={onFoodItemsReceived} />
              </Flex>
              </FormControl>
            </GridItem>
  
            {/* Dietary Preferences */}
            <GridItem rowSpan={2} colSpan={1} bg="white" padding={2}>
              <FormLabel>Dietary Preferences</FormLabel>
              <Flex direction="row" flexWrap="wrap" gap={3}>
              <CheckboxGroup
                colorScheme="purple"
                value={dietaryPreferences}
                onChange={values => setDietaryPreferences(values)}>
                <Checkbox marginRight="16px" borderColor="#718096" value="Vegan">Vegan</Checkbox>
                <Checkbox marginRight="16px" borderColor="#718096" value="Vegetarian">Vegetarian</Checkbox>
                <Checkbox marginRight="16px" borderColor="#718096" value="Keto">Keto</Checkbox>
                <Checkbox marginRight="16px" borderColor="#718096" value="Kosher">Kosher</Checkbox>
                <Checkbox marginRight="16px" borderColor="#718096" value="Diabetes">Diabetes</Checkbox>
                <Checkbox marginRight="16px" borderColor="#718096" value="Low-carb">Low-carb</Checkbox>
                <Checkbox marginRight="16px" borderColor="#718096" value="Pescatarian">Pescatarian</Checkbox>
                <Checkbox marginRight="16px" borderColor="#718096" value="Gluten-free">Gluten-free</Checkbox>
                <Checkbox marginRight="16px" borderColor="#718096" value="Dairy-free">Dairy-free</Checkbox>
              </CheckboxGroup>
              </Flex>
            </GridItem>
  
            {/* Family Size */}
            <GridItem rowSpan={1} colSpan={1} bg="white" padding={2}>
              <FormLabel hidden>Family Size</FormLabel>
              <Select
                placeholder="Family Size"
                value={familySize}
                onChange={e => setFamilySize(e.target.value)}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="4">4</option>
                <option value="6">6</option>
                <option value="6+">6+</option>
              </Select>
            </GridItem>
  
            {/* Cooking Time */}
            <GridItem rowSpan={1} colSpan={1} bg="white" padding={2}>
              <FormLabel hidden>Cooking Time</FormLabel>
              <Select
                placeholder="Cooking Time"
                value={cookingTime}
                onChange={e => setCookingTime(e.target.value)}>
                <option value="10 minutes">10 minutes</option>
                <option value="20 minutes">20 minutes</option>
                <option value="30 minutes">30 minutes</option>
                <option value="60 minutes">60 minutes</option>
                <option value="Over an hour">Over an hour</option>
              </Select>
            </GridItem>
  
            {/* Meals of the Day */}
            <GridItem rowSpan={1} colSpan={1} bg="white" padding={2}>
            <FormControl isInvalid={mealsForTheDay.length === 0}>
              <FormLabel>Meals of the Day</FormLabel>
              <Flex direction="row" flexWrap="wrap" gap={7}>
              <CheckboxGroup
                colorScheme="purple"
                value={mealsForTheDay}
                onChange={values => setMealsForTheDay(values)}>
                <Checkbox marginRight="8px" borderColor="#718096" value="Breakfast">Breakfast</Checkbox>
                <Checkbox marginRight="8px" borderColor="#718096" value="Lunch">Lunch</Checkbox>
                <Checkbox marginRight="8px" borderColor="#718096" value="Dinner">Dinner</Checkbox>
                <Checkbox marginRight="8px" borderColor="#718096" value="Snack">Snack</Checkbox>
                <Checkbox marginRight="8px" borderColor="#718096" value="Dessert">Dessert</Checkbox>
              </CheckboxGroup>
              {mealsForTheDay.length === 0 ? (
                  <>
                  </>
                ) : (
                  <FormErrorMessage paddingLeft={"5px"} marginTop={"-3px"}>At least one meal is required.</FormErrorMessage>
                )}
              </Flex>
              </FormControl>
            </GridItem>
  
            {/* Days of Week */}
            <GridItem rowSpan={1} colSpan={1} bg="white" padding={2}>
            <FormControl isInvalid={daysOfWeek.length === 0}>
              <FormLabel>Days of Week</FormLabel>
              <Flex direction="row" flexWrap="wrap" gap={3}>
              <CheckboxGroup
                colorScheme="purple"
                value={daysOfWeek}
                onChange={values => setDaysOfWeek(values)}>
                <Checkbox marginRight="16px" borderColor="#718096" value="Monday">Monday</Checkbox>
                <Checkbox marginRight="16px" borderColor="#718096" value="Tuesday">Tuesday</Checkbox>
                <Checkbox marginRight="16px" borderColor="#718096" value="Wednesday">Wednesday</Checkbox>
                <Checkbox marginRight="16px" borderColor="#718096" value="Thursday">Thursday</Checkbox>
                <Checkbox marginRight="16px" borderColor="#718096" value="Friday">Friday</Checkbox>
                <Checkbox marginRight="16px" borderColor="#718096" value="Saturday">Saturday</Checkbox>
                <Checkbox marginRight="16px" borderColor="#718096" value="Sunday">Sunday</Checkbox>
              </CheckboxGroup>
              {daysOfWeek.length === 0 ? (
                  <>
                  </>
                ) : (
                  <FormErrorMessage paddingLeft={"5px"} marginTop={"-3px"}>At least one day is required.</FormErrorMessage>
                )}
              </Flex>
              </FormControl>
            </GridItem>
  
            {/* Allergies */}
            <GridItem rowSpan={1} colSpan={1} bg="white" padding={2}>
              <FormLabel hidden>Allergies</FormLabel>
              {/* This should be a creatable multi select from react-select*/}
              <Input
                type="text"
                placeholder="Allergies"
                value={allergies}
                onChange={e => setAllergies(e.target.value)}
              />
            </GridItem>
  
            <GridItem rowSpan={1} colSpan={1} bg="white" padding={2}>
              {/* Cuisine */}
              <FormControl isInvalid={trimmedCuisine.length === 0}>
              <FormLabel hidden>Cuisine</FormLabel>
              {/* This should be a creatable multi select from react-select*/}
              <Input
                type="text"
                placeholder="Cuisines"
                value={cuisine}
                onChange={e => setCuisine(e.target.value)}
              />
              {/* {console.log(trimmedCuisine.length)} */}
              {trimmedCuisine.length === 0 ? (
                  <FormErrorMessage marginTop={"-1px"}>At least one cuisine is required.</FormErrorMessage>
              ) : (
                  <>
                  </>
              )}
              </FormControl>
            </GridItem>
  
            {/* Generate Button */}
            <GridItem rowSpan={1} colSpan={1}>
              <Button
                type="submit"
                bgColor="#899968"
                size="lg"
                height="100%"
                width="100%"
                borderRadius={0}
                onClick={handleSubmit}
              >
                GENERATE MEAL SUGGESTIONS
              </Button>
            </GridItem>
          </Grid>
        </FormControl>
      </>
    );
};

export default InputForm;