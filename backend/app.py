from flask import Flask, jsonify, render_template, request
from flask_cors import CORS, cross_origin
from config import Config
from openai import OpenAI
import threading
import json

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

        print("here")

        generated_output = get_meal_suggestions_from_openai(pantry_items, dietary_preferences, allergies, family_size, cooking_time, days_of_week, meals_for_the_day)

        return jsonify({'status': 'success', 'formatted_output': generated_output})

    except Exception as e:
        return jsonify({'error': str(e)})


def get_meal_suggestions_from_openai(pantry_items, dietary_preferences, allergies, family_size, cooking_time, days_of_week, meals_for_the_day):
    # Construct a prompt for OpenAI GPT-3
    prompt = f"Generate meal suggestions for {meals_for_the_day} with ingredients: {', '.join(pantry_items)}. Dietary preferences: {dietary_preferences}. Allergies: {', '.join(allergies)}. Family size: {family_size}. Cooking time: {cooking_time}. Days of Week: {', '.join(days_of_week)}."

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
                For any extra ingredients that are absolutely necessary, mention them in bold
                I want the output to be in the following structure:
                Day
                Meal Type
                Name of the dish
                Ingredients used
                Recipe in steps with quantity required
                Nutritional Information"""

    # Make a request to OpenAI GPT-3
    response = client.chat.completions.create(model="gpt-3.5-turbo", 
                                              messages=[{"role": "user", "content": prompt}],
                                              max_tokens=3000, 
                                              temperature=0.8)

    # Extract the generated text from the response
    generated_plan = response.choices[0].message.content

    # Return the generated text (need to process it further)
    return generated_plan

if __name__ == '__main__':
    app.run(debug=True)
