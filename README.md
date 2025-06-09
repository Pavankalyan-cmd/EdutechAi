# EduStack AI 

## Project Overview

EduStack AI is an intelligent application designed to create personalized learning roadmaps for students based on their selected programming path (Python Full Stack, Java Full Stack, or Python with AI). This project focuses on two key features: generating dynamic learning roadmaps using a Large Language Model (LLM) and integrating relevant learning resources, specifically fetching YouTube videos.The application will also schedule classes for students.

## Implemented Features

### 1. Personalized Learning Roadmap Generation
The bot generates a personalized learning roadmap based on the student's selected programming path. This roadmap includes:
* Key topics to learn 
* Recommended resources (tutorials, articles, videos) 
* [Milestones and projects 

The roadmap generation is powered by the Google Gemini 1.5 Flash Large Language Model.

**Technology Used:**
* **LLM:** Google Gemini 1.5 Flash

### 2. YouTube Video Integration
To enrich the learning experience,This includes fetching relevant YouTube videos as part of the recommended resources within the learning roadmap. This ensures students have access to up-to-date and engaging video content.

## Technical Stack

### Frontend
* [cite_start]**Framework:** React.js 
* [cite_start]**HTML/CSS:** For structuring and styling the web application 
* **Authentication:** Firebase Authentication
* **HTTP Client:** Axios
* **Styling:** Bootstrap
* **Routing:** React Router DOM
* **Roadmap Visualization:** React Flow Tree

### Backend
* [cite_start]**Language:** Python (using Django) 
* **Framework:** Django (version 3.2 or higher)
* [cite_start]**API:** Django REST Framework 
* **CORS Management:** `django-cors-headers`
* **LLM Integration:** `google-generativeai`
* [cite_start]**Google API Client:** `google-api-python-client` (for YouTube data fetching and Google Calendar API integration )
* **Authentication & Database Integration:** `firebase-admin` (for integration with Firebase services)
* [cite_start]**Web Scraping:** Beautiful Soup or Scrapy (Python) for fetching data from the web 

### Database
* [cite_start]**NoSQL Database:** Firestore Database (from Firebase) 

## Folder Structure
```
Backend/
└── edutech/
    ├── api/
    │   ├── migrations/
    │   ├── __init__.py
    │   ├── admin.py
    │   ├── apps.py
    │   ├── models.py
    │   ├── serializers.py
    │   ├── tests.py
    │   └── views.py
    ├── credentials/
    │   └── firebase.json
    ├── edutech/
    │   ├── __pycache__/
    │   ├── __init__.py
    │   ├── asgi.py
    │   ├── settings.py
    │   ├── urls.py
    │   └── wsgi.py
    ├── .env
    ├── db.sqlite3
    ├── manage.py
    ├── path/
    │   └── to/
    │       └── venv/
    │           ├── bin/
    │           ├── include/
    │           └── lib/
    ├── .gitignore
    ├── pyvenv.cfg
    └── requirments.txt
```
```
frontend/
└── edutech/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── Accordion/
    │   │   │   ├── Accordion.css
    │   │   │   └── Accordion.jsx
    │   │   ├── button/
    │   │   │   └── button.jsx
    │   │   ├── Header/
    │   │   │   ├── header.css
    │   │   │   └── Header.jsx
    │   │   └── RoadMaptree/
    │   │       └── RoadMaptree.jsx
    │   ├── contexts/
    │   │   └── AuthConetxts.js
    │   ├── layouts/
    │   ├── Pages/
    │   │   ├── Dashboard/
    │   │   │   └── Dashboard.jsx
    │   │   ├── LandingPage/
    │   │   │   ├── LandingPage.css
    │   │   │   └── LandingPage.jsx
    │   │   ├── Login/
    │   │   │   ├── Login.css
    │   │   │   └── Login.jsx
    │   │   ├── mainrouterpage/
    │   │   │   └── Mainpage.jsx
    │   │   ├── Resources/
    │   │   │   └── index.jsx
    │   │   ├── RoadMap/
    │   │   │   ├── RoadMap.css
    │   │   │   └── index.jsx
    │   │   └── Signup/
    │   │       ├── Signup.css
    │   │       └── Signup.jsx
    │   ├── services/
    │   │   └── services.js
    │   ├── App.css
    │   ├── App.js
    │   ├── App.test.js
    │   ├── firebase.js
    │   ├── index.css
    │   └── index.js
    ├── .gitignore
    ├── package-lock.json
    ├── package.json
    └── README.md
```

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Python 3.8+
* Node.js and npm (or yarn)
* Firebase project setup with Firestore and Authentication enabled.
* Google API Key (for Gemini 1.5 Flash and YouTube Data API)

### Backend Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd Backend/edutech
    ```
2.  **Create a virtual environment:**
    ```bash
    python -m venv venv
    ```
3.  **Activate the virtual environment:**
    * On Windows: `.\venv\Scripts\activate`
    * On macOS/Linux: `source venv/bin/activate`
4.  **Install backend dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
5.  **Set up Firebase credentials:**
    Place your `firebase.json` file (obtained from your Firebase project settings) into the `Backend/edutech/credentials/` directory.
6.  **Set up Environment Variables:**
    Create a `.env` file in the `Backend/edutech/` directory with your Google API Key for Gemini and YouTube Data API.
    ```
    GOOGLE_API_KEY="YOUR_GOOGLE_API_KEY"
    ```
7.  **Apply database migrations:**
    ```bash
    python manage.py migrate
    ```
8.  **Run the Django development server:**
    ```bash
    python manage.py runserver
    ```
    The backend will typically run on `http://127.0.0.1:8000/`.

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend/edutech
    ```
2.  **Install frontend dependencies:**
    ```bash
    npm install # or yarn install
    ```
3.  **Configure Firebase:**
    Ensure your `src/firebase.js` file contains your Firebase project configuration details (API Key, Auth Domain, Project ID, etc.).
4.  **Start the React development server:**
    ```bash
    npm start # or yarn start
    ```
    The frontend will typically open in your browser at `http://localhost:3000/`.

## Usage

The user interface is where students interact with the bot.

1.  **User Registration and Login**: Students can create an account using email or social media logins and securely log in.
2.  **Profile Management**: Users can view and edit their profiles, including learning preferences. A short quiz can assess their current skill level to tailor the roadmap accordingly.
3.  **Programming Path Selection**: Students select their desired programming path (Python Full Stack, Java Full Stack, or Python with AI). Brief descriptions of what each path entails, including key skills and potential career outcomes, are provided.
4.  **Personalized Learning Roadmap Display**: A dynamic roadmap is displayed with milestones, topics, and resources. Visual indicators (e.g., progress bars) show how much of the roadmap has been completed.
5.  **Resource Access**: Users can access learning materials, including links to tutorials, articles, videos, and coding exercises. The option to download resources for offline access is also available.
6.  **Class Scheduling**: Students can schedule classes based on their availability , integrating with a calendar API to set class times  and send reminders via email or SMS.
7.  **Interactive Learning Tools (Planned)**: While not fully implemented, the project aims to include interactive quizzes and assessments to test knowledge , and hands-on coding challenges to practice skills.
8.  **Feedback and Support**: Users can provide feedback on lessons and resources , and access FAQs, tutorials, and a contact form for additional support.
9.  **Progress Tracking**: The bot tracks the student's progress through the roadmap, allowing for adjustments based on their learning pace and feedback.
10. **Notifications**: Users receive alerts for new resources, upcoming classes, or feedback responses , and regular updates on user progress and achievements.

