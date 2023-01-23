from flask import Flask 
from flask_cors import CORS
from flask import request


# Environment variables 
from dotenv import load_dotenv
from pathlib import Path
import os

load_dotenv()
dotenv_path = Path("./.env")

FREEIPA_DOMAIN = os.getenv('FREEIPA_DOMAIN')
FREEIPA_ROOT_USERNAME = os.getenv('FREEIPA_ROOT_USERNAME')
FREEIPA_ROOT_PASSWORD = os.getenv('FREEIPA_ROOT_PASSWORD')
GITLAB_DOMAIN = os.getenv('GITLAB_DOMAIN')
GITLAB_ROOT_USERNAME = os.getenv('GITLAB_ROOT_USERNAME')
GITLAB_ROOT_PASSWORD = os.getenv('GITLAB_ROOT_PASSWORD')


# Technologies
from freeIPA  import FreeIPA
from gitLab import GitLab
IPA = FreeIPA(FREEIPA_DOMAIN, FREEIPA_ROOT_USERNAME, FREEIPA_ROOT_PASSWORD )
GL  = GitLab(GITLAB_DOMAIN, GITLAB_ROOT_USERNAME, GITLAB_ROOT_PASSWORD)


app = Flask("PAPA - Backend")
CORS(app)

@app.route("/")
def home():
    return "<h1>Hello Word</h1>"


@app.route("/addUser", methods = ['POST'])
def addUser():
   
    data = request.get_json()

    # Receive form data from front-end
    firstName = (data['firstName']).capitalize()
    lastName  = (data['lastName']).capitalize()
    completeName = firstName + " " + lastName
    email = data['email']
    userName = data['username']
    group = (data['group']['name']).lower()
    

    # Add user in FreeIPA
    userIPA = IPA.addUserIPA(firstName, lastName, completeName, email, userName, group)
    randonPassword = userIPA['result']['randompassword']
   
    # Authenticate to GitLab to create a user
    GL.createUserGitLab(userName, randonPassword)

    # Put the created user in a group in GitLab
    GL.putUserInGroupGitLab(userName)

    return data



app.run()