# MealPlan_AI

MealPlan AI is a meal planning/suggestion tool powered by OpenAI API using the ingredients that the user currently has. It is build using Flask (backend) and React (Frontend)

<p align="center">  
<img height="150px" src="https://github.com/Prahitha/MealPlan_AI/blob/main/ui/src/components/robot-chef.jpg"/>  
</p>

<br/>

## Features and Interfaces

1. Login/Signup Page
   - Authentication using Firebase

2. Home Page
   - Input form that takes the user inputs
       - Food items extraction from the image of a grocery receipt
           - Google Cloud Vision API: OCR for finding the text in an image 
           - Nutrition API: Extract only food items from the grocery receipt
       - Meal suggestions
           - OpenAI API (GPT-3.5) which uses the user inputs and generates a meal plan based on them
  - Saving the generated meal suggestions
      - These will then be shown on the user profile 

3. Profile Page
   - Displays all the saved meals by the user

<br/>

## Design
<p align="center">
<img width="1084" alt="Screenshot 2023-12-26 at 12 14 19 AM" src="https://github.com/Prahitha/MealPlan_AI/assets/44160152/2b59b561-5df2-4545-9577-7be219d5ff4f" />
</p>
<p align="center">
<img width="448" alt="Screenshot 2023-12-27 at 7 06 19 PM" src="https://github.com/Prahitha/MealPlan_AI/assets/44160152/be59d68f-6c71-42a5-82c7-fea54bb0f95e" />
</p>

<br/>

## Demo
<p align="center">
<video src='https://github.com/Prahitha/MealPlan_AI/assets/44160152/a78add61-c7bb-4085-878f-46f3700f504f' />
</p>

<br/>

## Setup

1. Download/Clone the repo
2. Activate the virtual environment
    <br/> Run `source venv/bin/activate` in the root directory of the app
3. Install all the requirements
    <br/> Run `pip install -r requirements.txt` in the root directory
4. Add your API keys
    - Create a file config.py in the `backend` folder and add the following code with your API keys to it:
      ```
      class Config:
          OPENAI_API_KEY = YOUR_OPENAI_KEY_HERE
          API_NINJAS_FOOD = YOUR_API_NINJAS_KEY_HERE
      ```
    - Create a file vision_api_key.json in the `backend` folder and add the JSON file you get from Google Cloud Vision API when you enable it
5. Running the backend
    - Navigate to the backend folder and run the command python app.py
      ```
      cd backend
      python app.py
      ```
6. Running the frontend
    - Navigate to the ui folder and run the command npm start
      ```
      cd ui
      npm start
      ```

<br/>

## Firebase Setup

- Authentication
<p align="center">
<img width="935" alt="Screenshot 2023-12-27 at 6 09 20 PM" src="https://github.com/Prahitha/MealPlan_AI/assets/44160152/66f8936e-59b2-4a0c-965d-58f87be959d6" />
</p>

- Firestore Database
<p align="center">
<img width="935" alt="Screenshot 2023-12-27 at 6 08 30 PM" src="https://github.com/Prahitha/MealPlan_AI/assets/44160152/27a53ea8-ca69-489c-8e00-73efd76196dc" />
</p>
<p align="center">
<img width="935" alt="Screenshot 2023-12-28 at 1 07 27 AM" src="https://github.com/Prahitha/MealPlan_AI/assets/44160152/fe0fc08f-8373-453a-8274-185094ac7dcd" />
</p>


## Notes

OpenAI API does not always give the output in the format requested in the prompt which makes it harder to structure the JSON properly. The `process_output` function in `backend/app.py` must be flexible to accomodate such outputs too.

<br/>

## Future Work

- Better and more responsive UI
- Shopping list generator for missing ingredients (currently shown in bold in the ingredients section of the card)
- Generate multiple options for every meal and allow the user to sort them based on simplicity, nutritional value and/or time required
- Video tutorials for recipes
  - Can use YouTube API (or any similar API that gives a video based on the name of the dish)
- Set default preferences for a user profile (take them during user sign up)
- Meal suggestions prioritizing items near expiry
