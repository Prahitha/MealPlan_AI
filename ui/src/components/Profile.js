import React, { useEffect, useState } from 'react';
import { auth, firestore } from './firebase';
import MealCard from './MealCard';
import { getDocs, collection } from "firebase/firestore";
import Header from "./Header";
import { ChakraProvider, Stack, Grid, GridItem, Center } from "@chakra-ui/react";
import { Meals } from "./Meals";

const Profile = () => {
  const user = auth.currentUser;
  const [savedMeals, setSavedMeals] = useState([]);

  useEffect(() => {
    const fetchSavedMeals = async () => {
      if (user) {
        try {
          console.log(user.uid)
          // Assuming your meals are stored in a 'meals' collection under the user's profile
          const collectionRef = collection(firestore, 'users', user.uid, 'profile');
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
      {/* Grid layout for the Home component */}
      <Grid templateRows="70px auto" gap={4} minHeight="100vh">
        {/* Header component */}
        <GridItem>
          <Header userIdProfile={user.uid} />
        </GridItem>
        {/* Main content area with input form and displayed meal suggestions */}
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
