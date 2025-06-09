from django.shortcuts import render
import uuid
from rest_framework import status
import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response
import json
import firebase_admin
from firebase_admin import credentials, firestore
from django.conf import settings
import datetime
from functools import wraps
from firebase_admin import auth



import google.generativeai as genai

# --- Initialize Firebase ---
if not firebase_admin._apps:
    cred = credentials.Certificate('credentials/firebase.json')
    firebase_admin.initialize_app(cred)
db = firestore.client()

# --- Configure Google Gemini ---

genai.configure(api_key=settings.GOOGLE_API_KEY)
YOUTUBE_API_KEY=settings.YOUTUBE_API_KEY
print("youtube",YOUTUBE_API_KEY)
# Initialize the Gemini model

model = genai.GenerativeModel('gemini-2.0-flash')


def firebase_auth_required(func):
    @wraps(func)
    def wrapper(request,*args,**kwargs):
        auth_header=request.headers.get('Authorization')

        if not auth_header:
            return Response(  {"error": "Authorization header missing."},
                status=status.HTTP_401_UNAUTHORIZED)
         
        try:
              token=auth_header.split(' ')[1]

        except IndexError:
            return Response(
                {"error": "Token format invalid. Expected 'Bearer <token>'."},
                status=status.HTTP_401_UNAUTHORIZED
            )      

        try:
            decoded_token = auth.verify_id_token(token)
            request.firebase_user = decoded_token
            request.uid = decoded_token['uid']
            return func(request, *args, **kwargs)
        except auth.InvalidIdTokenError:
            return Response(
                {"error": "Invalid Firebase ID token."},
                status=status.HTTP_401_UNAUTHORIZED
            )
        except Exception as e:
            # Catch other potential errors during verification
            print(f"Firebase verification error: {e}")
            return Response(
                {"error": "Authentication failed."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    return wrapper

@api_view(['POST'])
@firebase_auth_required
def generate_roadmap(request):
    uid = request.uid
    language = request.data.get('language')

    if not language:
        return Response({"error": "language is required"}, status=status.HTTP_400_BAD_REQUEST)


    prompt = f"""
        Create a structured learning roadmap in JSON format for {language}.
        Include 4–6 milestones. Each milestone should have:
        - A title
        - generate duration days also
        - A list of 3–5 topics
        Each topic can optionally have subtopics ("children"), which are a list of named subtopics..
        Use this format:

        {{
        "title": "{language} duration days ",
        "milestones": [
            {{
            "title": "Milestone 1",
            "topics": [
                {{
                "name": "Topic 1",
                "children": [
                    {{"name": "Subtopic 1"}},
                    {{"name": "Subtopic 2"}}
                ]
                }},
            ]
            }}
        ]
        }}
    """

    try:

        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=0.7,

                response_mime_type="application/json"
            )
        )

        roadmap_json = response.text
        parsed_data = {} # Initialize parsed_data
        try:
            parsed_data = json.loads(roadmap_json)
            
            # If the LLM returned a list containing the object, extract the first element
            if isinstance(parsed_data, list):
                if parsed_data: 
                    roadmap_data = parsed_data[0] 
                    if not isinstance(roadmap_data, dict):
                        raise ValueError("Parsed data is a list, but its first element is not a dictionary.")
                else:
                    raise ValueError("Parsed data is an empty list.")
            elif isinstance(parsed_data, dict):
                roadmap_data = parsed_data 
            else:
                raise ValueError("Parsed data is neither a dictionary nor a list.")
            
            
        except json.JSONDecodeError as e:
                print(f"CRITICAL ERROR: JSONDecodeError even with JSON mode. Raw response: {roadmap_json}. Error: {e}")
                return Response({"error": f"Invalid JSON returned from model and failed extraction: {e}"}, status=500)


        # Store the roadmap data in Firestore
        if uid and language:
            document_id = f"{uid}_{language}"
            id=str(uuid.uuid4())
            # Create a dictionary to save, including the generated roadmap and metadata
            roadmap_to_save = {
                **roadmap_data,  
                "id":id,
                'uid': uid,      
                'language': language, # 
                'timestamp': firestore.SERVER_TIMESTAMP 
            }

            db.collection('roadmaps').document(document_id).set(roadmap_to_save)

        return Response({"roadmap": roadmap_data}, status=201) # Return the generated roadmap, not necessarily the saved one


    except Exception as e:
        print(f"Error generating roadmap: {e}")
        return Response({"error": str(e)}, status=500)
    

@api_view(['GET'])
@firebase_auth_required
def get_user_data(request,uid,):

    if request.uid != uid:
        return Response(
            {"error": "Unauthorized access to other user's roadmaps."},
            status=status.HTTP_403_FORBIDDEN
        )
    if not uid :
          return Response ({"error":"UID is Required"})    
    try:
          user_data=db.collection("roadmaps")

          query=user_data.where("uid",'==',uid)

          docs=query.stream()

          user_roadmap=[]

          for doc in docs:
            #    doc-----> <google.cloud.firestore_v1.base_document.DocumentSnapshot object at 0x1168fdbe0>
               roadmap_data=doc.to_dict()
            
               user_roadmap.append(roadmap_data)

          if user_roadmap:
                return Response({"roadmaps": user_roadmap}, status=status.HTTP_200_OK)
          else:
            return Response({"message": "No roadmaps found for this user."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
          print(f"Error fetching user roadmaps: {e}")
          return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
     

@api_view(['DELETE'])
def delete_roadmap(request,roadmap_id):
      if not roadmap_id:
        return Response({"error": "Roadmap ID is required for deletion."}, status=status.HTTP_400_BAD_REQUEST)
      try:
           roadmap=db.collection('roadmaps')
           query=roadmap.where("id",'==',roadmap_id)
           docs=list(query.stream())
           if len(docs)==0:
                return Response({"message":"Roadmap Not Found"})
           elif len(docs)>1:
                return Response({"message":"Multiple Roadmaps Found with same ID"})
           doc_to_delete_ref = docs[0].reference
           doc_to_delete_ref.delete()
           return Response({"message": f"Roadmap with ID '{roadmap_id}' deleted successfully."}, status=status.HTTP_200_OK)
      except Exception as e:
        print(f"Error deleting roadmap: {e}")
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
      

@api_view(['POST'])    
@firebase_auth_required  
def get_youtube_videos(request):
    topic=request.data.get('topic')
    video_duration='medium'
    if not topic:
            return Response({"error":"Topic s required "},status=400)
    search_url="https://www.googleapis.com/youtube/v3/search"
    params = {
        "part": "snippet",
        "q": topic+"Tutorial",
        "maxResults": 5,
        "type": "video",
        "videoDuration":video_duration,
        "key": YOUTUBE_API_KEY
    }
    try:
         res=requests.get(search_url,params=params)
         res.raise_for_status()
         videos=res.json().get("items",[])
         results=[{
                 "title": video["snippet"]["title"],
                "url": f"https://www.youtube.com/watch?v={video['id']['videoId']}",
                "type": "video",
                "description": video["snippet"]["description"]
         } for video in videos]
         return Response({"resources": results}, status=200)
    
    except requests.exceptions.RequestException as e:
        print("YouTube API Error:", e)
        return Response({"error": "Failed to fetch YouTube resources."}, status=500)
