import React, { useState } from "react";
import InputForm from "./InputForm";
import Header from "./Header";

import { ChakraProvider, Stack, Grid, GridItem } from "@chakra-ui/react";
import { Meals } from "./Meals";

function Home() {
  const [mealSuggestions, setMealSuggestions] = useState([]);

  return (
    <ChakraProvider>
      <Grid templateRows="70px auto" gap={4} minHeight="100vh">
        <GridItem>
          <Header />
        </GridItem>
        <GridItem bg="#2D303C">
          <Stack gap={20}>
            <InputForm onSubmit={setMealSuggestions} />
            <Meals mealSuggestions={mealSuggestions} />
          </Stack>
        </GridItem>
      </Grid>
    </ChakraProvider>
  );
}

export default Home;
