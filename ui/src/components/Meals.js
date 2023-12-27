// Importing necessary Chakra UI components and custom MealCard component
import {
  Center,
  Text,
  Stack,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import MealCard from "./MealCard";

// Functional component Meals responsible for rendering formatted meal suggestions
export const Meals = ({ mealSuggestions, userId }) => {
  return (
    // Centering the content in the parent container
    <Center>
      {/* Stack for organizing the layout and providing padding */}
      <Stack padding={4}>
        {/* Checking if mealSuggestions is available and is an array before mapping through it */}
        {mealSuggestions.formatted_output &&
          Array.isArray(mealSuggestions.formatted_output) &&
          mealSuggestions.formatted_output?.map(({ day, meals }) => {
            return (
              // Stack for each day's meal suggestions
              <Stack key={day}>
                {/* Displaying the day in a larger font with white color */}
                <Text fontSize="lg" color={"white"}>
                  {day}
                </Text>
                {/* Grid layout for displaying meal cards */}
                <Grid
                  // Adjusting the number of columns based on the number of meals
                  templateColumns={`repeat(${meals.length > 2 ? 3 : 2}, 1fr)`}
                  gap={2}
                >
                  {/* Mapping through individual meals to display MealCard components */}
                  {meals.map(
                    (
                      {
                        type,
                        dishName,
                        cuisine,
                        ingredients,
                        recipe,
                        nutritionalInformation,
                      },
                      index
                    ) => (
                      <GridItem key={index}>
                        {/* Rendering individual MealCard component for each meal */}
                        <MealCard
                          key={index}
                          mealType={type}
                          cuisine={cuisine}
                          dishName={dishName}
                          recipe={recipe}
                          nutritionalInformation={nutritionalInformation}
                          ingredients={ingredients}
                          user={userId}
                        />
                      </GridItem>
                    )
                  )}
                </Grid>
              </Stack>
            );
          })}
      </Stack>
    </Center>
  );
};
