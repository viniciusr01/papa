import gitlab
import os
import requests
from selenium import webdriver

class GitLab():

    def __init__ (self, GITLAB_DOMAIN, GITLAB_ROOT_USERNAME, GITLAB_ROOT_PASSWORD):
        self.GITLAB_DOMAIN = GITLAB_DOMAIN
        self.GITLAB_ROOT_USERNAME = GITLAB_ROOT_USERNAME
        self.GITLAB_ROOT_PASSWORD = GITLAB_ROOT_PASSWORD

    def createUserGitLab(self, userName, randonPassword):
        driver = webdriver.Chrome()
        driver.get(self.GITLAB_DOMAIN+'/users/sign_in')

        id_box = driver.find_element("name", 'username')
        id_box.send_keys(userName)

        pass_box = driver.find_element("name", 'password')
        pass_box.send_keys(randonPassword)


        login_button = driver.find_element("name", 'commit')
        login_button.submit()
    

    def putUserInGroupGitLab(self, userName):

        res = requests.post(self.GITLAB_DOMAIN+'/oauth/token',
                        data={
                            "grant_type" : "password",
                            "username"   : self.GITLAB_ROOT_USERNAME,
                            "password"   : self.GITLAB_ROOT_PASSWORD
                        })
        
        token = res.json()
        token = token['access_token']
        gl = gitlab.Gitlab(url=self.GITLAB_DOMAIN, oauth_token=token, api_version=4) 

        user = gl.users.list(search=userName)
        idUser = user[0].id

        groups = gl.groups.list()
        group = groups[2]

        members = group.members.list()
        member = group.members.create({'user_id': idUser,
                                        'access_level': gitlab.const.AccessLevel.DEVELOPER})
