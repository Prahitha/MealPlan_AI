from flask import Flask, jsonify, render_template, request
from flask_cors import CORS, cross_origin
from config import Config
from openai import OpenAI
from PIL import Image
from google.cloud import vision
import threading
import re
import os
import requests
import json


app = Flask(__name__)
CORS(app)

# Set the OpenAI API key from the configuration
app.config.from_object(Config)
client = OpenAI(api_key=app.config['OPENAI_API_KEY'])
food_api = app.config['API_NINJAS_FOOD']

# Ensure you set the path to your GCP service account key JSON file
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = r"vision_api_key.json"


# Mutex for thread safety
thread_lock = threading.Lock()

@app.route('/', methods=['GET'])
def hello():
    return jsonify(message="Hello, Flask!")


@app.route('/home', methods=['POST'])
def index():
    return render_template('index.html')


@app.route('/generate_text', methods=['POST'])
@cross_origin(origins='*')
def generate_text():
    # Retrieve input data from the UI
    try:
        data = request.get_json()

        pantry_items = data.get('pantry_items', [])
        dietary_preferences = data.get('dietary_preferences', '')
        allergies = data.get('allergies', [])
        family_size = data.get('family_size', '')
        cooking_time = data.get('cooking_time', '')
        days_of_week = data.get('days_of_week', [])
        meals_for_the_day = data.get('meals_for_the_day', '')

        generated_output = [
                            {
                                "day": "Monday",
                                "meals": [
                                {
                                    "type": "Breakfast",
                                    "dishName": "Yogurt Parfait with Fresh Fruits",
                                    "cusine": "American",
                                    "ingredients": [
                                    "Yogurt (2 cups)",
                                    "Strawberries (1 cup, sliced)",
                                    "Apples (1, diced)",
                                    "Cereal (1 cup)"
                                    ],
                                    "recipe": [
                                    "In individual bowls, layer yogurt, sliced strawberries, diced apples, and cereal.",
                                    "Repeat the layers until the bowl is filled.",
                                    "Serve immediately."
                                    ],
                                    "nutritionalInformation": {
                                    "Calories": 300,
                                    "Protein": 10,
                                    "Carbohydrates": 45,
                                    "Fat": 8,
                                    "Fiber": 6
                                    }
                                },
                                {
                                    "type": "Lunch",
                                    "dishName": "Spinach and Tomato Penne",
                                    "cuisine": "Italian",
                                    "ingredients": [
                                    "Penne (2 cups, cooked)",
                                    "Spinach (2 cups, chopped)",
                                    "Tomatoes (2, diced)",
                                    "Onions (1, chopped)",
                                    "Garlic (2 cloves, minced)",
                                    "Vegetable Stock (1 cup)",
                                    "Cheese (1/2 cup, shredded)"
                                    ],
                                    "recipe": [
                                    "In a pan, sauté onions and garlic until golden brown.",
                                    "Add chopped spinach and diced tomatoes, cook until spinach wilts.",
                                    "Pour in vegetable stock and let it simmer.",
                                    "Toss in cooked penne and mix well.",
                                    "Top with shredded cheese and let it melt.",
                                    "Serve hot."
                                    ],
                                    "nutritionalInformation": {
                                    "Calories": 400,
                                    "Protein": 15,
                                    "Carbohydrates": 60,
                                    "Fat": 10,
                                    "Fiber": 8
                                    }
                                }
                                ]
                            },
                            {
                                "day": "Tuesday",
                                "meals": [
                                {
                                    "type": "Breakfast",
                                    "dishName": "Apple Cinnamon Rice Pudding",
                                    "cuisine": "Indian",
                                    "ingredients": [
                                    "Rice (1 cup, cooked)",
                                    "Milk (2 cups)",
                                    "Apples (2, grated)",
                                    "Cinnamon (1 teaspoon)"
                                    ],
                                    "recipe": [
                                    "In a saucepan, combine cooked rice and milk. Bring to a simmer.",
                                    "Add grated apples and cinnamon, stir well.",
                                    "Simmer until the mixture thickens.",
                                    "Remove from heat and let it cool slightly before serving."
                                    ],
                                    "nutritionalInformation": {
                                    "Calories": 350,
                                    "Protein": 9,
                                    "Carbohydrates": 60,
                                    "Fat": 7,
                                    "Fiber": 4
                                    }
                                },
                                {
                                    "type": "Lunch",
                                    "dishName": "Vegetable Stir-Fry with Rice Noodles",
                                    "cuisine": "Chinese",
                                    "ingredients": [
                                    "Rice Noodles (2 cups, cooked)",
                                    "Spring Mix (2 cups)",
                                    "Carrots (2, julienned)",
                                    "Scallions (4, chopped)",
                                    "Soy Sauce (2 tablespoons)"
                                    ],
                                    "recipe": [
                                    "In a wok, stir-fry carrots and scallions until slightly tender.",
                                    "Add spring mix and cooked rice noodles, stir-fry for a few more minutes.",
                                    "Pour soy sauce over the mixture and toss until well combined.",
                                    "Serve hot."
                                    ],
                                    "nutritionalInformation": {
                                    "Calories": 380,
                                    "Protein": 10,
                                    "Carbohydrates": 70,
                                    "Fat": 5,
                                    "Fiber": 6
                                    }
                                }
                                ]
                            },
                            {
                                "day": "Wednesday",
                                "meals": [
                                {
                                    "type": "Breakfast",
                                    "dishName": "Lemon Ricotta Pancakes",
                                    "cuisine": "American",
                                    "ingredients": [
                                    "Cereal (1 cup, crushed)",
                                    "Milk (1 cup)",
                                    "Lemons (2, zest and juice)",
                                    "Eggs (2)",
                                    "Cheese (1/2 cup, ricotta)"
                                    ],
                                    "recipe": [
                                    "In a bowl, mix crushed cereal, milk, lemon zest, lemon juice, eggs, and ricotta cheese.",
                                    "Heat a griddle and pour batter to make pancakes.",
                                    "Cook until bubbles form, flip, and cook the other side.",
                                    "Serve with a drizzle of honey."
                                    ],
                                    "nutritionalInformation": {
                                    "Calories": 380,
                                    "Protein": 15,
                                    "Carbohydrates": 45,
                                    "Fat": 15,
                                    "Fiber": 3
                                    }
                                },
                                {
                                    "type": "Lunch",
                                    "dishName": "Tomato and Spinach Salad with Walnut Dressing",
                                    "cuisine": "Greek",
                                    "ingredients": [
                                    "Spinach (3 cups)",
                                    "Tomatoes (2, sliced)",
                                    "Walnuts (1/4 cup, chopped)",
                                    "Olive Oil (2 tablespoons)",
                                    "Lemon Juice (1 tablespoon)",
                                    "Cilantro (2 tablespoons, chopped)"
                                    ],
                                    "recipe": [
                                    "In a large bowl, combine spinach and sliced tomatoes.",
                                    "In a small bowl, whisk together olive oil, lemon juice, and chopped cilantro.",
                                    "Drizzle the dressing over the salad and toss gently.",
                                    "Sprinkle chopped walnuts on top before serving."
                                    ],
                                    "nutritionalInformation": {
                                    "Calories": 320,
                                    "Protein": 8,
                                    "Carbohydrates": 15,
                                    "Fat": 25,
                                    "Fiber": 5
                                    }
                                }
                                ]
                            }
                            ]

        # generated_output = get_meal_suggestions_from_openai(pantry_items, dietary_preferences, allergies, family_size, cooking_time, days_of_week, meals_for_the_day)

        return jsonify({'status': 'success', 'formatted_output': generated_output})

    except Exception as e:
        return jsonify({'error': str(e)})
    

def remove_words_case_insensitive(text, words_to_remove):
    text_lower = text.lower()
    for word in words_to_remove:
        text_lower = text_lower.replace(word.lower(), '')
    return text_lower
    

def process_output(text, days_of_week, meals_for_the_day):
    words_to_remove = ["Day", "Meal Type", "Name of the Dish", "Cuisine"]
    text = remove_words_case_insensitive(text, words_to_remove)

    # Split the text into lines, trim each line, and remove empty lines
    lines = [line.strip() for line in text.split('\n') if line.strip()]

    # Initialize variables to track the current day and meal
    current_day = None
    current_meal = {}
    inside_ingredients = False
    inside_recipe = False
    inside_nutrition = False
    meals = 0

    formatted_output = []

    # Iterate through the lines
    for i in range(len(lines)):
        # Check if the line matches any day
        if any(day in lines[i] for day in days_of_week):
            if current_meal:
                meal_dict = {}
                meal_dict['meal_type'] = meal_type,
                meal_dict['dish'] = dish,
                meal_dict['ingredients'] = ingredients,
                meal_dict['recipe'] = recipe,
                meal_dict['nutritionalInformation'] = nutritionalInformation

                current_meal['meals'].append(meal_dict)
                formatted_output.append(current_meal)

            current_day = next(day for day in days_of_week if day in lines[i])
            current_meal = {'day': current_day, 'meals': []}
            meals = 0
            print(formatted_output)

        # Check if the line contains the word "Ingredients"
        elif "Ingredients:" in lines[i]:
            inside_ingredients = True
            inside_recipe = False
            inside_nutrition = False

        elif "Recipe:" in lines[i]:
            inside_ingredients = False
            inside_recipe = True
            inside_nutrition = False

        elif "Nutritional Information:" in lines[i]:
            inside_ingredients = False
            inside_recipe = False
            inside_nutrition = True

        # Check if the line matches any meal
        elif any(meal in lines[i] for meal in meals_for_the_day):
            meal_type = next(meal for meal in meals_for_the_day if meal in lines[i])
            dish = lines[i + 1]
            cuisine = lines[i + 2]
            meals += 1

            ingredients = []
            recipe = []
            nutritionalInformation = []

        # Add the line to the ingredients if current_day, current_meal and inside_ingredients are set
        elif current_meal and inside_ingredients:
            ingredients.append(lines[i])

        # Add the line to the recipe if current_day, current_meal and inside_recipe are set
        elif current_meal and inside_recipe:
            recipe.append(lines[i])

        elif current_meal and inside_nutrition:
            nutritionalInformation.append(lines[i])

        if meals > 0 and any(meal in lines[i + 1] for meal in meals_for_the_day):
            meal_dict = {}
            meal_dict['meal_type'] = meal_type,
            meal_dict['dish'] = dish,
            meal_dict['cuisine'] = cuisine,
            meal_dict['ingredients'] = ingredients,
            meal_dict['recipe'] = recipe,
            meal_dict['nutritionalInformation'] = nutritionalInformation

            current_meal['meals'].append(meal_dict)

    if current_meal:
        formatted_output.append(current_meal)

    print(formatted_output)

    return formatted_output


def get_meal_suggestions_from_openai(pantry_items, dietary_preferences, allergies, family_size, cooking_time, days_of_week, meals_for_the_day):
    # Construct a prompt for OpenAI GPT-3
    # prompt = f"Generate meal suggestions for {meals_for_the_day} with ingredients: {', '.join(pantry_items)}. Dietary preferences: {dietary_preferences}. Allergies: {', '.join(allergies)}. Family size: {family_size}. Cooking time: {cooking_time}. Days of Week: {', '.join(days_of_week)}."

    prompt = f"""Generate meal suggestions for the following with nutritional information:
                Pantry items: {', '.join(pantry_items)}
                Dietary preferences: {dietary_preferences}
                Allergies: {', '.join(allergies)}
                Family size: {family_size}
                Cooking time: {cooking_time}
                Days of Week: {', '.join(days_of_week)}
                Meals for the day: {meals_for_the_day}
                Note: Do not shorten the response. I need the plan for all the days requested. Dietary preferences and allergies are to be strictly considered. 
                I also want to only use the pantry items listed and no extra items unless they are common like salt, pepper, oil etc. 
                For any extra ingredients that are absolutely necessary, mention them in bold.
                I want the output to be in the following structure:
                Day
                Meal Type
                Name of the Dish
                Cuisine
                Ingredients:
                Ingredient1 (Quantity)
                Recipe
                Nutritional Information"""

    # Make a request to OpenAI GPT-3
    # response = client.chat.completions.create(model="gpt-3.5-turbo", 
    #                                           messages=[{"role": "user", "content": prompt}],
    #                                           max_tokens=3000, 
    #                                           temperature=0.8)

    # Extract the generated text from the response
    # generated_plan = response.choices[0].message.content

    generated_plan = """
                    Monday

                    Breakfast
                    Fruit and Yogurt Parfait
                    Ingredients:
                    - Yogurt (2 cups)
                    - Apples (diced, 1 cup)
                    - Strawberries (sliced, 1 cup)
                    - Cereal (1 cup)
                    - Honey (2 tablespoons)
                    Recipe:
                    1. In a bowl, layer yogurt, diced apples, sliced strawberries, and cereal.
                    2. Drizzle honey on top.
                    Nutritional Information:
                    - Calories: 350
                    - Protein: 12g
                    - Carbohydrates: 65g
                    - Fat: 7g

                    Lunch
                    Vegetarian Penne Primavera
                    Ingredients:
                    - Penne (2 cups, cooked)
                    - Tomatoes (diced, 1 cup)
                    - Spinach (1 cup)
                    - Onions (sliced, 1/2 cup)
                    - Vegetable Stock (1 cup)
                    - Olive Oil (1 tablespoon)
                    - Garlic (minced, 2 cloves)
                    - Cheese (grated, 1/2 cup)
                    - Salt and Pepper to taste
                    Recipe:
                    1. In a pan, sauté garlic and onions in olive oil until golden.
                    2. Add tomatoes, spinach, and vegetable stock. Cook until veggies are tender.
                    3. Toss in cooked penne, cheese, salt, and pepper. Mix well.
                    Nutritional Information:
                    - Calories: 450
                    - Protein: 15g
                    - Carbohydrates: 65g
                    - Fat: 12g

                    Tuesday

                    Breakfast
                    Yogurt with Fresh Fruit and Walnuts
                    Ingredients:
                    - Yogurt (2 cups)
                    - Apples (sliced, 1 cup)
                    - Strawberries (sliced, 1 cup)
                    - Walnuts (chopped, 1/4 cup)
                    - Honey (2 tablespoons)
                    Recipe:
                    1. In a bowl, combine yogurt, sliced apples, sliced strawberries, and chopped walnuts.
                    2. Drizzle honey on top.
                    Nutritional Information:
                    - Calories: 380
                    - Protein: 10g
                    - Carbohydrates: 55g
                    - Fat: 15g

                    Lunch
                    Vegetarian Rice Noodle Stir-Fry
                    Ingredients:
                    - Rice Noodles (2 cups, cooked)
                    - Carrots (julienned, 1 cup)
                    - Scallions (chopped, 1/2 cup)
                    - Cilantro (chopped, 1/4 cup)
                    - Soy Sauce (2 tablespoons)
                    - Olive Oil (1 tablespoon)
                    - Garlic (minced, 2 cloves)
                    - Salt and Pepper to taste
                    Recipe:
                    1. In a wok, sauté garlic in olive oil until fragrant.
                    2. Add julienned carrots, chopped scallions, and cooked rice noodles.
                    3. Pour soy sauce and toss until well combined. Season with salt and pepper.
                    4. Garnish with chopped cilantro.
                    Nutritional Information:
                    - Calories: 420
                    - Protein: 8g
                    - Carbohydrates: 75g
                    - Fat: 9g

                    Wednesday

                    Breakfast
                    Cereal and Fresh Fruit Bowl
                    Ingredients:
                    - Cereal (2 cups)
                    - Milk (1 cup)
                    - Apples (diced, 1 cup)
                    - Strawberries (sliced, 1 cup)
                    Recipe:
                    1. In a bowl, combine cereal, diced apples, and sliced strawberries.
                    2. Pour milk over the mixture.
                    Nutritional Information:
                    - Calories: 320
                    - Protein: 9g
                    - Carbohydrates: 65g
                    - Fat: 5g

                    Lunch
                    Spring Mix Salad with Lemon Vinaigrette
                    Ingredients:
                    - Spring Mix (3 cups)
                    - Tomatoes (sliced, 1 cup)
                    - Onions (sliced, 1/2 cup)
                    - Lemon Juice (2 tablespoons)
                    - Olive Oil (1 tablespoon)
                    - Salt and Pepper to taste
                    Recipe:
                    1. In a large bowl, combine spring mix, sliced tomatoes, and sliced onions.
                    2. In a small bowl, whisk together lemon juice, olive oil, salt, and pepper to make the vinaigrette.
                    3. Drizzle the vinaigrette over the salad and toss well.
                    Nutritional Information:
                    - Calories: 180
                    - Protein: 5g
                    - Carbohydrates: 20g
                    - Fat: 10g
                     """
    days_of_week = ['Monday', 'Tuesday', 'Wednesday']
    meals_for_the_day = ['Breakfast', 'Lunch']

    formatted_plan = process_output(generated_plan, days_of_week, meals_for_the_day)
    print(formatted_plan)
    return generated_plan


@app.route('/upload', methods=['POST'])
@cross_origin(origins='*')
def upload_image():
    # if 'image' not in request.files:
    #     return jsonify({'error': 'No file part'}), 400

    # file = request.files.get('image')
    # filename = file.filename

    # if filename == '':
    #     return jsonify({'error': 'No selected file'}), 400
    
    # if file:
    #     # Get the root directory of the Flask app
    #     root_directory = os.path.dirname(os.path.abspath(__file__))

    #     # Specify the path where you want to save the file in the root directory
    #     upload_path = os.path.join(root_directory, filename)

    #     # Save the file
    #     file.save(upload_path)

    # if file:
    #     try:
    #         # Use Google Cloud Vision API for text extraction
    #         vision_client = vision.ImageAnnotatorClient()
            
    #         with open(upload_path, "rb") as image_file:
    #             content = image_file.read()

    #         image = vision.Image(content=content)
    #         response = vision_client.text_detection(image=image)
    #         texts = response.text_annotations

    #         recognized_text = ""
    #         for text in texts:
    #             recognized_text += text.description + '\n'

    #         # Use a regular expression to keep only alphabetic characters
    #         cleaned_text = re.sub("[^a-zA-Z]", " ", recognized_text)
            
    #         # Remove extra spaces
    #         cleaned_text = re.sub(' +', ' ', cleaned_text)

    #         # Get food items using Nutrition API
    #         food_items = extract_food_items(cleaned_text)
    #         print(food_items)
            
            food_items = ['gluten free pasta', 'black beans', 'large eggs', 'zucchini', 'pink lady apple', 'pork loin', 'avocados', 'frozen peas', 'fries', 'beans', 'spinach', 'ham', 'turkey', 'tortilla', 'crushed tomatoes', 'strawberries']

            # Return the recognized text
            return food_items
        # except Exception as e:
        #     return jsonify({'error': str(e)}), 500
        

def extract_food_items(text):
    query = '"' + text + '"'
    api_url = 'https://api.api-ninjas.com/v1/nutrition?query={}'.format(query)
    response = requests.get(api_url, headers={'X-Api-Key': food_api})
    
    if response.status_code == requests.codes.ok:
        item_names = set()
        json_object = json.loads(response.content)
        for item in json_object:
            item_names.add(item['name'])
        
        return list(item_names)
    else:
        print("Error:", response.status_code, response.text)

if __name__ == '__main__':
    app.run(debug=True)
