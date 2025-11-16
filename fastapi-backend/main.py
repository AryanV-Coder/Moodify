from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
import base64
import os
import json
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Allow CORS for frontend apps
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.5-flash")

@app.get("/start-server")
def start_server():
    print("✅ Server Started Successfully !!")
    return {"status":"success"}

@app.post("/mood-analysis")
async def mood_analysis(image : UploadFile = File(None)):
    if image is not None:
        image_data = await image.read()
        encoded_image = base64.b64encode(image_data).decode('utf-8')
        prompt = [  
            {
                "role": "user",
                "parts": [
                    {
                        "text": """You are an advanced mood detection AI assistant with emotional intelligence. Your task is to carefully analyze the facial expression, body language, and overall demeanor of the person in the provided image to determine their emotional state.

CLASSIFICATION RULES:
You must classify the mood into EXACTLY ONE of these four categories:

1. HAPPY - The person displays positive, joyful emotions such as:
   - Genuine smiling or laughing
   - Bright, open facial expression with relaxed features
   - Joyful demeanor and positive energy
   - Cheerful body language and upright posture
   - Sparkling or warm eyes

2. SAD - The person displays negative, melancholic, or sorrowful emotions such as:
   - Frowning or downturned mouth
   - Tears, watery eyes, or red eyes
   - Slumped posture or downcast gaze
   - Somber or dejected expression
   - Low energy or withdrawn demeanor

3. LOVE - The person displays romantic, affectionate, or warm emotions such as:
   - Soft, dreamy facial expression
   - Gentle smile with warm, tender eyes
   - Romantic or affectionate gestures
   - Heart-shaped hand gestures or loving poses
   - Peaceful, content expression with warmth

4. ENERGETIC - The person displays high energy, excitement, or enthusiasm such as:
   - Wide eyes and animated expression
   - Dynamic or active posture
   - Enthusiastic gestures or movements
   - Vibrant and lively demeanor
   - Intense focus or excitement

IMPORTANT OUTPUT FORMAT:
You MUST return your response as a valid JSON object with EXACTLY this structure:
{
    "mood": "CATEGORY_NAME",
    "comment": "Your personalized comment here with emojis"
}

CRITICAL JSON FORMATTING RULES:
- Use ONLY double quotes (") for both keys and values
- The "comment" field MUST use \\n (backslash-n) for line breaks, NOT actual line breaks
- Do NOT include any newline characters inside the JSON structure
- Do NOT wrap the JSON in markdown code blocks (no ```)
- Do NOT include any text before or after the JSON object
- The JSON must be valid and parseable by standard JSON parsers
- All special characters must be properly escaped

JSON REQUIREMENTS:
- Use double quotes for both keys and string values
- The "mood" value must be ONE of: HAPPY, SAD, LOVE, or ENERGETIC (in CAPITAL LETTERS)
- The "comment" should be a warm, personalized message with EXACTLY 5 LINES that:
  * Each line should be short and impactful (5-15 words per line)
  * Lines should relate to the detected mood and be fun/engaging
  * Include relevant emojis throughout (2-3 emojis per line, 10-15 emojis total)
  * Mix encouragement, humor, and mood-related observations
  * Separate lines with \\n (backslash followed by n, NOT actual line breaks)
  * Feels natural, human-like, and uplifting
- Ensure the JSON is properly formatted and parseable

CORRECT EXAMPLE OUTPUTS (copy this exact format):

{"mood": "HAPPY", "comment": "Your smile is lighting up the whole room! 😊✨💫\\nThat positive energy is absolutely contagious! 🌟😄\\nKeep spreading those good vibes everywhere! 🎉💖\\nThe world definitely needs more of your happiness! 🌈🌻\\nYou're radiating pure joy today! 🚀💛✨"}

{"mood": "SAD", "comment": "I can see you're going through a tough time. 💙😔\\nIt's totally okay to feel this way sometimes. 🌧️💭\\nRemember, storms don't last forever! 🌈☀️\\nYou're stronger than you think, trust me! 💪❤️\\nBrighter and better days are just around the corner! 🌅✨🦋"}

{"mood": "LOVE", "comment": "Your eyes are absolutely glowing with warmth! 💕😊✨\\nLove looks so beautiful on you right now! ❤️🌹\\nThose tender feelings are truly precious! 💝💖\\nCherish every moment of this magical emotion! 🥰✨\\nKeep your heart open and let love flow! 💗🦋🌟"}

{"mood": "ENERGETIC", "comment": "Wow, your energy is absolutely electric today! ⚡🔥💥\\nThat enthusiasm is ready to conquer the world! 🚀💪\\nYou're vibrating on a whole different frequency! 🎸✨\\nChannel that power into something amazing! 🌟🎯\\nNothing can stop you with this kind of energy! 💯🔥🎉"}"""
                    }
                ]
            },
            {
                "role": "user",
                "parts": [
                    {
                        "mime_type": "image/png",
                        "data": encoded_image
                    }
                ]
            }
        ]
        
        response = model.generate_content(prompt)
        response_text = response.text.strip()
        
        # Remove markdown code blocks if present
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.startswith("```"):
            response_text = response_text[3:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]
        response_text = response_text.strip()
        
        try:
            # First try to parse as-is (in case AI returns valid JSON)
            mood_data = json.loads(response_text)
        except json.JSONDecodeError:
            # If that fails, try replacing newlines and parsing again
            try:
                response_text = response_text.replace('\n', '\\n')
                mood_data = json.loads(response_text)
            except json.JSONDecodeError as e:
                print(f"❌ JSON Parse Error: {e}")
                print(f"Raw response: {response_text}")
                # Return default response instead of raising error
                return {
                    "status": "success",
                    "mood": "HAPPY",
                    "comment": "Oops! Something went wrong with our mood analyzer! 😅🔧\\nBut hey, let's stay positive anyway! 😊✨\\nEnjoy some great music while we fix things! 🎵💫\\nYour mood matters, even if tech is moody! 😄🎶\\nKeep smiling and jamming on! 🌟💖🎉"
                }
        
        try:
            
            # Validate the response structure
            if "mood" not in mood_data or "comment" not in mood_data:
                print("❌ Invalid JSON structure: missing required fields")
                return {
                    "status": "success",
                    "mood": "HAPPY",
                    "comment": "Oops! Something went wrong with our mood analyzer! 😅🔧\\nBut hey, let's stay positive anyway! 😊✨\\nEnjoy some great music while we fix things! 🎵💫\\nYour mood matters, even if tech is moody! 😄🎶\\nKeep smiling and jamming on! 🌟💖🎉"
                }
            
            # Validate mood category
            valid_moods = ["HAPPY", "SAD", "LOVE", "ENERGETIC"]
            if mood_data["mood"].upper() not in valid_moods:
                print(f"❌ Invalid mood category: {mood_data['mood']}")
                return {
                    "status": "success",
                    "mood": "HAPPY",
                    "comment": "Oops! Something went wrong with our mood analyzer! 😅🔧\\nBut hey, let's stay positive anyway! 😊✨\\nEnjoy some great music while we fix things! 🎵💫\\nYour mood matters, even if tech is moody! 😄🎶\\nKeep smiling and jamming on! 🌟💖🎉"
                }
            
            # Ensure mood is uppercase
            mood_data["mood"] = mood_data["mood"].upper()
            
            print(f"✅ Mood Analysis: {mood_data['mood']}")
            print(f"✅ Comment: {mood_data['comment']}")
            
            return {
                "status": "success",
                "mood": mood_data["mood"],
                "comment": mood_data["comment"]
            }
            
        except KeyError as e:
            print(f"❌ Missing required field: {e}")
            # Return default response
            return {
                "status": "success",
                "mood": "HAPPY",
                "comment": "Oops! Something went wrong with our mood analyzer! 😅🔧\\nBut hey, let's stay positive anyway! 😊✨\\nEnjoy some great music while we fix things! 🎵💫\\nYour mood matters, even if tech is moody! 😄🎶\\nKeep smiling and jamming on! 🌟💖🎉"
            }
        except Exception as e:
            print(f"❌ Unexpected Error: {e}")
            # Return default response instead of raising error
            return {
                "status": "success",
                "mood": "HAPPY",
                "comment": "Oops! Something went wrong with our mood analyzer! 😅🔧\\nBut hey, let's stay positive anyway! 😊✨\\nEnjoy some great music while we fix things! 🎵💫\\nYour mood matters, even if tech is moody! 😄🎶\\nKeep smiling and jamming on! 🌟💖🎉"
            }
    else :
        print("🛑 NOTHING RECIEVED")
        raise HTTPException(status_code = 400, detail = "Nothing Recieved")