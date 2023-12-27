import React, { useState } from "react";
import InputForm from "./InputForm";
import Header from "./Header";
import { ChakraProvider, Stack, Grid, GridItem } from "@chakra-ui/react";
import { Meals } from "./Meals";

/**
 * Home component is the main component for the application's home page.
 * It includes the header, input form, and displays meal suggestions.
 *
 * @returns {React.ReactNode} The Home component.
 */
function Home() {
  const [mealSuggestions, setMealSuggestions] = useState([]);
  const [userId, setUserId] = useState('');

  return (
    <ChakraProvider>
      {/* Grid layout for the Home component */}
      <Grid templateRows="70px auto" gap={4} minHeight="100vh">
        {/* Header component */}
        <GridItem>
          <Header setUserId={setUserId}/>
        </GridItem>
        {/* Main content area with input form and displayed meal suggestions */}
        <GridItem bg="#2D303C">
          <Stack gap={20}>
            {/* InputForm component for user input */}
            <InputForm onSubmit={setMealSuggestions} />
            {/* Meals component displaying meal suggestions */}
            <Meals mealSuggestions={mealSuggestions} userId={userId} />
          </Stack>
        </GridItem>
      </Grid>
    </ChakraProvider>
  );
}

export default Home;
