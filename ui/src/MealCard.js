import { useState } from "react";
import axios from "axios";
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
    Button,
    IconButton,
  } from "@chakra-ui/react";
import { MinusIcon, AddIcon, StarIcon } from "@chakra-ui/icons";
  
const MealCard = ({
        mealType,
        cusine,
        dishName,
        ingredients,
        recipe,
        nutritionalInformation,
    }) => {
    
    const [iconColor, setIconColor] = useState("#718096");
    const [isSaved, setIsSaved] = useState(false);

    const handleSave = async (meal) => {
        try {
            // const response = await axios.post('/{user_id}/profile', meal, {
            //   headers: {
            //     'Content-Type': 'application/json',
            //   },
            // });

            if(true) {
                // change the color of the star icon to yellow from grey
                // add a const and change its state to reflect the saved status
                console.log("Meal Saved!");
                setIsSaved(!isSaved);
                setIconColor(isSaved ? "#D69E2E" : "#718096");
            } else {
                console.log(false);
            }
        } catch (error) {
            console.error('Error saving meal: ', error.message);
        }
    }

    return (
      <Card flex={1} bg={"#DAF3A4"} height={"250px"} width={"550px"} overflowY="scroll">
        <CardHeader paddingTop={"15px"} paddingBottom={"0px"}>
          <Flex justifyContent={"space-between"}>
            <Text fontSize="medium" fontWeight={"350"}>{mealType} </Text>
            <Box>
                <Tag borderRadius="full" variant="solid" colorScheme="purple">{cusine}</Tag>
                <IconButton icon={<StarIcon />} boxSize={6} color={isSaved ? "#D69E2E" : "#718096"} _hover={{ color: "#D69E2E" }} 
                    aria-label={isSaved ? "Unsave" : "Save"} bg="#DAF3A4" onClick={handleSave}/>
            </Box>
          </Flex>
        </CardHeader>
        <CardBody paddingTop={"10px"} paddingBottom={"10px"}>
          <Text fontSize="large" fontWeight={"500"}>
            {dishName}
          </Text>
          <Box>
            <Accordion allowToggle>
              <AccordionItem borderColor="transparent">
                {({ isExpanded }) => (
                  <>
                    <h2>
                      <AccordionButton _expanded={{ bg: '#38A169', borderTopLeftRadius: "5px", borderTopRightRadius: "5px", color: 'white' }}>
                        <Box as="span" flex="1" textAlign="left">
                          Ingredients
                        </Box>
                        {isExpanded ? (
                          <MinusIcon fontSize="12px" />
                        ) : (
                          <AddIcon fontSize="12px" />
                        )}
                      </AccordionButton>
                    </h2>
                    {isExpanded ? (
                        <AccordionPanel bg={"#38A169"} borderBottomLeftRadius={"5px"} borderBottomRightRadius={"5px"} pb={4}>
                        <Box paddingX={4}>
                            <ul pl>
                            {ingredients[0].map(ingredient => (
                                <li>{ingredient}</li>
                            ))}
                            </ul>
                        </Box>
                        </AccordionPanel>
                    ) : (
                        <AccordionPanel pb={4}>
                        <Box paddingX={4}>
                            <ul pl>
                            {ingredients[0].map(ingredient => (
                                <li>{ingredient}</li>
                            ))}
                            </ul>
                        </Box>
                        </AccordionPanel>
                    )}
                  </>
                )}
              </AccordionItem>
            </Accordion>
          </Box>
          <Box>
            <Accordion allowToggle>
              <AccordionItem borderColor="transparent">
                {({ isExpanded }) => (
                  <>
                    <h2>
                      <AccordionButton _expanded={{ bg: '#38A169', borderTopLeftRadius: "5px", borderTopRightRadius: "5px", color: 'white' }}>
                        <Box as="span" flex="1" textAlign="left">
                          Recipe
                        </Box>
                        {isExpanded ? (
                          <MinusIcon fontSize="12px" />
                        ) : (
                          <AddIcon fontSize="12px" />
                        )}
                      </AccordionButton>
                    </h2>
                    {isExpanded ? (
                        <AccordionPanel bg={"#38A169"} borderBottomLeftRadius={"5px"} borderBottomRightRadius={"5px"} pb={4}>
                        <Box paddingX={4}>
                            <ol>
                            {recipe[0].map(step => (
                                <p>{step}</p>
                            ))}
                            </ol>
                        </Box>
                        </AccordionPanel>
                        ) : (
                        <AccordionPanel pb={4}>
                        <Box paddingX={4}>
                            <ol>
                            {recipe[0].map(step => (
                                <p>{step}</p>
                            ))}
                            </ol>
                        </Box>
                        </AccordionPanel>
                    )}
                  </>
                )}
              </AccordionItem>
            </Accordion>
          </Box>
        </CardBody>
        <CardFooter paddingTop={"0px"}>
          <HStack wrap="wrap" gap={1} spacing={4}>
            {nutritionalInformation.map(nutrients => (
              <Tag borderRadius="full" variant="solid" colorScheme="green">
                <TagLabel>{nutrients}</TagLabel>
              </Tag>
            ))}
          </HStack>
        </CardFooter>
      </Card>
    );
  };
  

export default MealCard;