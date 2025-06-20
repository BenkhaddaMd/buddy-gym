<link rel="stylesheet" href="README.css" />

## Buddy-gym Django React


## Major Packages used in the backend

1. [Django](https://www.djangoproject.com/)
2. [Django REST Framework](https://www.django-rest-framework.org/)
3. [Django REST Framework Simple JWT](https://django-rest-framework-simplejwt.readthedocs.io/en/latest/)
4. [Djoser](https://djoser.readthedocs.io/en/latest/)
5. [social-auth-app-django](https://python-social-auth.readthedocs.io/en/latest/configuration/django.html)

## Getting Started

### Prerequisites

- [Python 3.8](https://www.python.org/downloads/)
- [Node.js](https://nodejs.org/en/download/)
- [PostgreSQL](https://www.postgresql.org/download/)
- [Google OAuth2 Credentials](https://developers.google.com/identity/protocols/oauth2)
- [Facebook OAuth2 Credentials](https://developers.facebook.com/docs/facebook-login/web)

### Installation

1. Clone the repo

   ```sh
   git clone https://github.com/repo && cd django_react_app
   ```

2. Install Python packages. It is recommended to use a virtual environment.

   ```sh
   virtualenv venv && source venv/bin/activate # Create a virtual environment and activate it
   cd backend && pip install -r requirements.txt
   ```

3. (Optional) Install npm packages. You can skip this step if you don't want to run the frontend separately as the frontend is already built and being served by the backend.

   ```sh
   cd frontend && npm install
   ```

4. Create a `.env` file in backend directory and add the variables as shown in the .env-example file. You will need to add your own values for the variables. You can optionally export the variables as environment variables to your terminal.

5. Create a PostgreSQL database and add the database credentials to the `.env` file or export them as environment variables to your terminal.

6. Run the migrations

   ```sh
   python manage.py migrate
   ```

7. Run the backend server

   ```sh
   python manage.py runserver
   ```

   This will run the backend server on [http://localhost:8000](http://localhost:8000)

8. (Optional) Run the frontend server. You can skip this step if you don't want to run the frontend separately as the frontend is already built and being served by the backend.

   ```sh
   cd frontend && npm start
   ```

   This will run the frontend server on [http://localhost:3000](http://localhost:3000)
