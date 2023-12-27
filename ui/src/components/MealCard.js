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
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
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
import { auth, firestore } from './firebase';
import { v4 as uuidv4 } from "uuid";
import { doc, addDoc, setDoc, deleteDoc, collection } from "firebase/firestore";

/**
 * MealCard component renders a card displaying information about a meal, including
 * meal type, cuisine, dish name, ingredients, recipe, and nutritional information.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.mealType - The type of the meal (e.g., breakfast, lunch).
 * @param {string} props.cuisine - The cuisine of the meal.
 * @param {string} props.dishName - The name of the dish.
 * @param {Array} props.ingredients - An array of ingredients for the meal.
 * @param {Array} props.recipe - An array of recipe steps for the meal.
 * @param {Array} props.nutritionalInformation - An array of nutritional information for the meal.
 * @returns {React.ReactNode} The MealCard component.
 */
const MealCard = ({
    mealType,
    cuisine,
    dishName,
    ingredients,
    recipe,
    nutritionalInformation,
    user,
}) => {
    
    const [isSaved, setIsSaved] = useState(false);
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
    const [showLoginError, setShowLoginError] = useState(false);
    const [mealId, setMealId] = useState();
    const authContext = useAuth;
    const userId = user.user || user.uid;
    const userVerified = auth.currentUser;

    const collectionRef = collection(firestore, 'users', userId, 'profile');
    // const user = firebase.auth().currentUser;

    const mealData = {
      mealType,
      cuisine,
      dishName,
      ingredients,
      recipe,
      nutritionalInformation,
  };

    useEffect(() => {
      // Check if the user is logged in
      setIsUserLoggedIn(!!user);
      if (user && !isSaved){
        setMealId(null);
      }
      console.log(mealId);
    }, [user, isSaved]);

    /**
     * Handles saving or unsaving a meal based on the current state.
     */
    const handleSave = async () => {
        if (!isUserLoggedIn) {
          setShowLoginError(true);
          return;
        }

        let mealDocRef;

        if (userVerified) {
          if (isSaved) {
            mealDocRef = doc(collectionRef, mealId);
            await deleteDoc(mealDocRef);
            console.log('Meal unsaved!');
            setIsSaved(false);
            setMealId(null);
          }
          else {
            try {
                mealDocRef = await addDoc(collectionRef, mealData);
                console.log("Meal Saved!");
                setIsSaved(true);
                setMealId(mealDocRef.id);
            } catch (error) {
                console.error('Error saving meal: ', error.message);
            }
          }
        }
    };

    /**
     * Handles the closing of the alert dialog.
     */
    const onClose = () => {
      setShowLoginError(false);
    };
  
    return (
      <>
        <Card flex={1} bg={"#DAF3A4"} height={"250px"} width={"550px"} overflowY="scroll">
            <CardHeader paddingTop={"15px"} paddingBottom={"0px"}>
                <Flex justifyContent={"space-between"}>
                    <Text fontSize="medium" fontWeight={"350"}>{mealType} </Text>
                    <Box>
                        <Tag borderRadius="full" variant="solid" colorScheme="purple">{cuisine}</Tag>
                        <IconButton icon={<StarIcon />} boxSize={6} color={isSaved ? "#D69E2E" : "#718096"} _hover={{ color: "#D69E2E" }} 
                            aria-label={isSaved ? "Unsave" : "Save"} bg="#DAF3A4" onClick={handleSave} />
                    </Box>
                </Flex>
                <AlertDialog isOpen={showLoginError} onClose={onClose}>
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
                                                <ul>
                                                    {ingredients.map(ingredient => (
                                                        <li>{ingredient}</li>
                                                    ))}
                                                </ul>
                                            </Box>
                                        </AccordionPanel>
                                    ) : (
                                        <AccordionPanel pb={4}>
                                            <Box paddingX={4}>
                                                <ul>
                                                    {ingredients.map(ingredient => (
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
                                                    {recipe.map(step => (
                                                        <p>{step}</p>
                                                    ))}
                                                </ol>
                                            </Box>
                                        </AccordionPanel>
                                    ) : (
                                        <AccordionPanel pb={4}>
                                            <Box paddingX={4}>
                                                <ol>
                                                    {recipe.map(step => (
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
    </>
    );
};

export default MealCard;
