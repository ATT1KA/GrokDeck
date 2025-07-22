import decky_plugin
from openai import OpenAI
import speech_recognition as sr
import pyttsx3

class Plugin:
    async def voice_interact(self, api_key, system_prompt="You are a helpful AI assistant."):
        try:
            # Initialize recognizer and TTS engine
            recognizer = sr.Recognizer()
            tts_engine = pyttsx3.init()
            tts_engine.setProperty('rate', 150)  # Adjust speed if needed
            tts_engine.setProperty('volume', 1.0)

            # Listen for voice input
            with sr.Microphone() as source:
                decky_plugin.logger.info("Listening...")
                audio = recognizer.listen(source, timeout=5, phrase_time_limit=10)
            
            # Recognize speech (offline with PocketSphinx)
            user_input = recognizer.recognize_sphinx(audio)
            decky_plugin.logger.info(f"User said: {user_input}")

            # Call Grok API
            client = OpenAI(base_url="https://api.x.ai/v1", api_key=api_key)
            response = client.chat.completions.create(
                model="grok-beta",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_input}
                ],
                temperature=0.7,
                max_tokens=512
            )
            ai_response = response.choices[0].message.content
            decky_plugin.logger.info(f"Grok response: {ai_response}")

            # Speak the response
            tts_engine.say(ai_response)
            tts_engine.runAndWait()

            return {"status": "success", "response": ai_response}
        
        except Exception as e:
            decky_plugin.logger.error(f"Error: {str(e)}")
            return {"status": "error", "message": str(e)}