import { useState, useEffect } from "react";
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
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
  } from "@chakra-ui/react";
import { MinusIcon, AddIcon, StarIcon } from "@chakra-ui/icons";
import { useAuth } from "./AuthContext.js";

const MealCard = ({
        mealType,
        cusine,
        dishName,
        ingredients,
        recipe,
        nutritionalInformation,
    }) => {
    
    // const [iconColor, setIconColor] = useState("#718096");
    const [isSaved, setIsSaved] = useState(false);
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
    const authContext = useAuth;

    const handleSave = async (meal) => {
        if (!isUserLoggedIn) {
          // Show a popup or redirect to the login page
          return;
        }
      
        try {
            const response = await axios.post('/users/${authContext.user.uid}/profile', meal, {
              headers: {
                'Content-Type': 'application/json',
              },
            });

            if(response.ok) {
                console.log("Meal Saved!");
                setIsSaved((isSaved) => !isSaved);
                // setIconColor((iconColor) => (prevIsSaved ? "#718096" : "#D69E2E"));
            } else {
                console.log(response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error saving meal: ', error.message);
        }
    };

    useEffect(() => {
      // Check if the user is logged in
      setIsUserLoggedIn(!!authContext.user);
    }, [authContext.user, isSaved]);
  
    const onClose = () => {
      // Handle closing of the popup
    };
  

    return (
      <Card flex={1} bg={"#DAF3A4"} height={"250px"} width={"550px"} overflowY="scroll">
        <CardHeader paddingTop={"15px"} paddingBottom={"0px"}>
          <Flex justifyContent={"space-between"}>
            <Text fontSize="medium" fontWeight={"350"}>{mealType} </Text>
            <Box>
                <Tag borderRadius="full" variant="solid" colorScheme="purple">{cusine}</Tag>
                <IconButton icon={<StarIcon />} boxSize={6} color={isSaved ? "#D69E2E" : "#718096"} _hover={{ color: "#D69E2E" }} 
                    aria-label={isSaved ? "Unsave" : "Save"} bg="#DAF3A4" onClick={handleSave} isDisabled={isSaved}/>
            </Box>
          </Flex>
          <AlertDialog isOpen={!isUserLoggedIn} onClose={onClose}>
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Login Required
                </AlertDialogHeader>

                <AlertDialogBody>
                  You must log in before saving meals.
                </AlertDialogBody>

                <AlertDialogFooter>
                  <Button colorScheme="blue" onClick={onClose}>
                    Close
                  </Button>
                  {/* You can add a button to navigate to the login page */}
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
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