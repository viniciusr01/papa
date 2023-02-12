from flask import Flask 
from flask_cors import CORS
from flask import request

import sys
sys.path.insert(0,"..")
from db import userDB

# Environment variables 
from dotenv import load_dotenv
from pathlib import Path
import os

dotenv_path = Path("./.env")
load_dotenv(dotenv_path)

FREEIPA_DOMAIN = os.getenv('FREEIPA_DOMAIN')
FREEIPA_ROOT_USERNAME = os.getenv('FREEIPA_ROOT_USERNAME')
FREEIPA_ROOT_PASSWORD = os.getenv('FREEIPA_ROOT_PASSWORD')
GITLAB_DOMAIN = os.getenv('GITLAB_DOMAIN')
GITLAB_ROOT_USERNAME = os.getenv('GITLAB_ROOT_USERNAME')
GITLAB_ROOT_PASSWORD = os.getenv('GITLAB_ROOT_PASSWORD')


# Services
from services.freeIPA  import FreeIPA
from services.gitLab import GitLab

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
    fullName = firstName + " " + lastName
    email = data['email']
    userName = data['username']
    group = (data['group']['name']).lower()
    
    print(data)
    userDB.insertUser(userName, firstName, lastName, fullName, email)

    return data


@app.route("/createUser", methods = ['GET'])
def createUser():

    #data = request.get_json()
    #userName = data['username']

    userName = 'viniciusr01'
    result = userDB.getUser(userName)
    
    userName = result[0]
    firstName = result[2]
    lastName  = result[3]
    email = result[5]

    # The full name is the same as the username because LDAP uses full name as cn
    fullName = result[0]
 
    # Add user in FreeIPA
    userIPA = IPA.addUserIPA(firstName, lastName, fullName, userName)
    randonPassword = userIPA['result']['randompassword']
   
    # Authenticate to GitLab to create a user
    GL.createUserGitLab(userName, randonPassword)

    #
    # UPDATE USER IN DB
    #

    return "Sucesso ao criar usuário"

    

@app.route("/getProjecstGitLab", methods = ['GET'])
def getProjecsGitLab():
    return GL.getProjecstGitLab()


@app.route("/addUserProject", methods = ['GET'])
def addUserProject():
    
    ## In test
    import gitlab
    username='usera02' 
    idProject=6
    accessLevel= gitlab.const.AccessLevel.DEVELOPER
    print(type(accessLevel))


    return GL.putUserInAProject(username, idProject, accessLevel)
    

app.run()