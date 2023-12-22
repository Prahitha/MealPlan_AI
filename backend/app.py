from flask import Flask, jsonify, render_template, request
from flask_cors import CORS, cross_origin
from config import Config
from openai import OpenAI
import threading
import json
import re

app = Flask(__name__)
CORS(app)

app.config.from_object(Config)
client = OpenAI(api_key=app.config['OPENAI_API_KEY'])

# Set the OpenAI API key from the configuration

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

        generated_output = get_meal_suggestions_from_openai(pantry_items, dietary_preferences, allergies, family_size, cooking_time, days_of_week, meals_for_the_day)

        return jsonify({'status': 'success', 'formatted_output': generated_output})

    except Exception as e:
        return jsonify({'error': str(e)})
    

def process_output(text, days_of_week, meals_for_the_day):
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
            meal_dict['ingredients'] = ingredients,
            meal_dict['recipe'] = recipe,
            meal_dict['nutritionalInformation'] = nutritionalInformation

            current_meal['meals'].append(meal_dict)

    if current_meal:
        formatted_output.append(current_meal)

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
    return generated_plan

if __name__ == '__main__':
    app.run(debug=True)
