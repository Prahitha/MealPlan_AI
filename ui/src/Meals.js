import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Flex,
    Tag,
    TagLabel,
    HStack,
    Text,
    Box,
    Stack,
    Grid,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    GridItem,
  } from "@chakra-ui/react";
  import { MealCard } from "./MealCard";
  
  export const Meals = ({ mealSuggestions }) => {
    return (
      <Stack padding={4}>
        {mealSuggestions.formatted_output && Array.isArray(mealSuggestions.formatted_output) && mealSuggestions.formatted_output?.map(({ day, meals }) => {
          return (
            <Stack key={day}>
              <Text fontSize="lg" color={"white"}>
                {day}
              </Text>
              <Grid
                templateColumns={`repeat(${meals.length > 2 ? 3 : 2}, 1fr)`}
                gap={2}
              >
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
                    <GridItem>
                      <MealCard
                        key={index}
                        mealType={type}
                        cusine={cuisine}
                        dishName={dishName}
                        recipe={recipe}
                        nutritionalInformation={nutritionalInformation}
                        ingredients={ingredients}
                      />
                    </GridItem>
                  )
                )}
              </Grid>
            </Stack>
          );
        })}
      </Stack>
    );
  };
  