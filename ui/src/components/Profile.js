import React, { useEffect, useState } from 'react';
import { auth, firestore } from './firebase';
import MealCard from './MealCard';
import { getDocs, collection } from "firebase/firestore";
import Header from "./Header";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChakraProvider, Stack, Grid, GridItem, Center } from "@chakra-ui/react";
import { Meals } from "./Meals";

/**
 * Profile component displays the user's profile page, including saved meals.
 *
 * @returns {React.ReactNode} The Profile component.
 */
const Profile = () => {
  const location = useLocation();
  const user = location.pathname.split("/")[2];
  const [savedMeals, setSavedMeals] = useState([]);

  useEffect(() => {
    const fetchSavedMeals = async () => {
      if (user) {
        try {
          // Assuming your meals are stored in a 'meals' collection under the user's profile
          const collectionRef = collection(firestore, 'users', user, 'profile');
          const mealsSnapshot = await getDocs(collectionRef);
          const mealsData = mealsSnapshot.docs.map(doc => doc.data());
          setSavedMeals(mealsData);
        } catch (error) {
          console.error('Error fetching saved meals: ', error.message);
        }
      }
    };

    fetchSavedMeals();
  }, [user]);

  return (
    <ChakraProvider>
      {/* Grid layout for the Profile component */}
      <Grid templateRows="70px auto" gap={4} minHeight="100vh">
        {/* Header component */}
        <GridItem>
          <Header userIdProfile={user.uid} />
        </GridItem>
        {/* Main content area with displayed saved meals */}
        <GridItem bg="#2D303C">
          {/* Render MealCard components for each saved meal */}
          <Center>
            <Stack padding={4}>
              <Grid templateColumns={`repeat(${savedMeals.length > 2 ? 3 : savedMeals.length}, 1fr)`} gap={2}>
                {savedMeals.map((meal, index) => (
                  <MealCard
                    key={index}
                    mealType={meal.mealType}
                    cuisine={meal.cuisine}
                    dishName={meal.dishName}
                    ingredients={meal.ingredients}
                    recipe={meal.recipe}
                    nutritionalInformation={meal.nutritionalInformation}
                    user={user}
                  />
                ))}
              </Grid>
            </Stack>
          </Center>
        </GridItem>
      </Grid>
    </ChakraProvider>
  );
};

export default Profile;
