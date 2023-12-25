import React, { useState } from "react";
import InputForm from "./InputForm";
import Header from "./Header";

import { ChakraProvider, Stack, Grid, GridItem } from "@chakra-ui/react";
import { Meals } from "./Meals";

function App() {
  const [mealSuggestions, setMealSuggestions] = useState([]);

  return (
    <ChakraProvider>
      <Grid templateRows="70px auto" gap={4} minHeight="100vh">
        <GridItem>
          {/* Header not aligned in the center of the div. Needs work */}
          <Header />
        </GridItem>
        <GridItem bg="#2D303C">
          <Stack gap={20}>
            <InputForm onSubmit={setMealSuggestions} />
            {/* nutritionalInformation in meals needs to be in Flex and span multiple columns if it doesn't all fit in the meal card */}
            <Meals mealSuggestions={mealSuggestions} />
          </Stack>
        </GridItem>
      </Grid>
    </ChakraProvider>
  );
}

export default App;
