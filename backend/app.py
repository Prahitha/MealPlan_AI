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
        dietary_preferences = data.get('dietary_preferences', [])
        allergies = data.get('allergies', [])
        family_size = data.get('family_size', '')
        cooking_time = data.get('cooking_time', '')
        days_of_week = data.get('days_of_week', [])
        meals_for_the_day = data.get('meals_for_the_day', [])
        cuisine = data.get('cuisine', [])

        generated_output = get_meal_suggestions_from_openai(pantry_items, dietary_preferences, allergies, family_size, cooking_time, days_of_week, meals_for_the_day, cuisine)

        return jsonify({'status': 'success', 'formatted_output': generated_output})

    except Exception as e:
        return jsonify({'error': str(e)})
    

def remove_words(text, words_to_remove):
    for word in words_to_remove:
        text = text.replace(word, '')
    return text
    

def process_output(text, days_of_week, meals_for_the_day):
    words_to_remove = ["Meal Type", "Name of the Dish", "Cuisine"]
    text = remove_words(text, words_to_remove)

    # Split the text into lines, trim each line, and remove empty lines
    lines = [line.strip() for line in text.split('\n') if line.strip()]

    # Initialize variables to track the current day and meal
    current_day = None
    current_meal = {}
    inside_ingredients = False
    inside_recipe = False
    inside_nutrition = False
    meals = 0
    nutrients = ['Calories', 'Fat', 'Carbohydrates', 'Fiber', 'Protein']

    formatted_output = []

    # Iterate through the lines
    for i in range(len(lines)):
        # Check if the line matches any day
        if any(day in lines[i] for day in days_of_week):
            if current_meal:
                meal_dict = {}
                meal_dict['type'] = meal_type,
                meal_dict['dishName'] = dish,
                meal_dict['cuisine'] = cuisine,
                meal_dict['ingredients'] = ingredients,
                meal_dict['recipe'] = recipe,
                meal_dict['nutritionalInformation'] = nutritionalInformation

                current_meal['meals'].append(meal_dict)
                formatted_output.append(current_meal)

            current_day = next(day for day in days_of_week if day in lines[i])
            current_meal = {'day': current_day, 'meals': []}
            meals = 0

        # Check if the line contains the word "Ingredients"
        elif "Ingredients" in lines[i]:
            inside_ingredients = True
            inside_recipe = False
            inside_nutrition = False

        elif "Recipe" in lines[i]:
            inside_ingredients = False
            inside_recipe = True
            inside_nutrition = False

        elif "Nutritional Information" in lines[i]:
            inside_ingredients = False
            inside_recipe = False
            inside_nutrition = True

        # Check if the line matches any meal
        elif any(meal in lines[i] for meal in meals_for_the_day):
            meal_type = next(meal for meal in meals_for_the_day if meal in lines[i])
            dish = lines[i + 1]
            cuisine = lines[i + 2].replace(':', '').strip()
            meals += 1

            ingredients = []
            recipe = []
            nutritionalInformation = []

        # Add the line to the ingredients if current_day, current_meal and inside_ingredients are set
        elif current_meal and inside_ingredients:
            ingredients.append(lines[i].replace('-', '').strip())

        # Add the line to the recipe if current_day, current_meal and inside_recipe are set
        elif current_meal and inside_recipe:
            recipe.append(lines[i])

        elif current_meal and inside_nutrition:
            if any(s in lines[i] for s in nutrients):
                nutritionalInformation.append(lines[i].replace('-', '').strip())

        if (meals > 0 and i + 1 < len(lines) and any(meal in lines[i + 1] for meal in meals_for_the_day)) or (i + 1 == len(lines)):
            meal_dict = {}
            meal_dict['type'] = meal_type,
            meal_dict['dishName'] = dish,
            meal_dict['cuisine'] = cuisine,
            meal_dict['ingredients'] = ingredients,
            meal_dict['recipe'] = recipe,
            meal_dict['nutritionalInformation'] = nutritionalInformation

            current_meal['meals'].append(meal_dict)

    formatted_output.append(current_meal)

    return formatted_output


def get_meal_suggestions_from_openai(pantry_items, dietary_preferences, allergies, family_size, cooking_time, days_of_week, meals_for_the_day, cuisine):
    print(pantry_items, dietary_preferences, allergies, family_size, cooking_time, days_of_week, meals_for_the_day, cuisine)
    # Construct a prompt for OpenAI GPT-3
    # prompt = f"Generate meal suggestions for {meals_for_the_day} with ingredients: {', '.join(pantry_items)}. Dietary preferences: {dietary_preferences}. Allergies: {', '.join(allergies)}. Family size: {family_size}. Cooking time: {cooking_time}. Days of Week: {', '.join(days_of_week)}."

    prompt = f"""Generate meal suggestions for the following with nutritional information:
                Pantry items: {', '.join(pantry_items)}
                Dietary preferences: {dietary_preferences}
                Allergies: {', '.join(allergies)}
                Cuisine: {', '.join(cuisine)}
                Family size: {family_size}
                Cooking time: {cooking_time}
                Days of Week: {', '.join(days_of_week)}
                Meals for the day: {', '.join(meals_for_the_day)}
                Note: Do not shorten the response. I need the plan for all the days requested. Dietary preferences and allergies are to be strictly considered. 
                I also want to only use the pantry items listed and no extra items unless they are common like salt, pepper, oil etc. 
                For any extra ingredients that are absolutely necessary, mention them in bold. Assume dietary preferences, allergies and cuisine to be none if not mentioned.
                Consider family size as 3 and cooking time to be 20 minutes if not mentioned.
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
    response = client.chat.completions.create(model="gpt-3.5-turbo", 
                                              messages=[{"role": "user", "content": prompt}],
                                              max_tokens=3000, 
                                              temperature=0.8)

    # Extract the generated text from the response
    generated_plan = response.choices[0].message.content

    formatted_plan = process_output(generated_plan, days_of_week, meals_for_the_day)
    print(formatted_plan)
    return formatted_plan


@app.route('/upload', methods=['POST'])
@cross_origin(origins='*')
def upload_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files.get('image')
    filename = file.filename

    if filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file:
        # Get the root directory of the Flask app
        root_directory = os.path.dirname(os.path.abspath(__file__))

        # Specify the path where you want to save the file in the root directory
        upload_path = os.path.join(root_directory, filename)

        # Save the file
        file.save(upload_path)

    if file:
        try:
            # Use Google Cloud Vision API for text extraction
            vision_client = vision.ImageAnnotatorClient()
            
            with open(upload_path, "rb") as image_file:
                content = image_file.read()

            image = vision.Image(content=content)
            response = vision_client.text_detection(image=image)
            texts = response.text_annotations

            recognized_text = ""
            for text in texts:
                recognized_text += text.description + '\n'

            # Use a regular expression to keep only alphabetic characters
            cleaned_text = re.sub("[^a-zA-Z]", " ", recognized_text)
            
            # Remove extra spaces
            cleaned_text = re.sub(' +', ' ', cleaned_text)

            # Get food items using Nutrition API
            food_items = extract_food_items(cleaned_text)
            # print(food_items)

            # food_items = ['gluten free pasta', 'black beans', 'large eggs', 'zucchini', 'pink lady apple', 'pork loin', 'avocados', 'frozen peas', 'fries', 'beans', 'spinach', 'ham', 'turkey', 'tortilla', 'crushed tomatoes', 'strawberries']
            
            # Return the recognized text
            return food_items
        except Exception as e:
            return jsonify({'error': str(e)}), 500
        

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
