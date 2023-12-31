import unittest
from backend.app import remove_words, process_output, extract_food_items

class UnitTests(unittest.TestCase):
    def test_remove_words(self):
        """
         @brief Test removing words from a string and checking the result.
        """
        text = "This is a sample text."
        words_to_remove = ["sample", "text"]
        result = remove_words(text, words_to_remove)
        self.assertEqual(result, "This is a  .")

    def test_process_output(self):
        """
         @brief Test process_output with a dummy and sample output.
        """
        text = "Day: Monday\nBreakfast\nOmelette\nAmerican\nIngredients:\nEggs\nCheese\nRecipe:\nCook eggs with cheese.\
            \nNutritional Information:\nCalories: 200"
        days_of_week = ["Monday"]
        meals_for_the_day = ["Breakfast"]
        result = process_output(text, days_of_week, meals_for_the_day)
        self.assertEqual(result, [{'day': 'Monday', 'meals': [{'type': ('Breakfast',), 'dishName': ('Omelette',), \
                                    'cuisine': ('American',), 'ingredients': (['Eggs', 'Cheese'],),\
                                    'recipe': (['Cook eggs with cheese.'],), 'nutritionalInformation': ['Calories: 200']}]}])

    def test_extract_food_items(self):
        """
         @brief Test that food items are extracted from text.
        """
        text = "This is a peanut butter and jelly sandwich."

        result = extract_food_items(text)
        self.assertEqual(result, ['peanut butter and jelly'])


# Unittest. main. This is a convenience method for unittest. main.
if __name__ == '__main__':
    unittest.main()
