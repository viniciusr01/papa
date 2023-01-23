from python_freeipa import ClientMeta
import requests

class FreeIPA:

    def __init__ (self, FREEIPA_DOMAIN, FREEIPA_ROOT_USERNAME, FREEIPA_ROOT_PASSWORD):
        self.FREEIPA_DOMAIN = FREEIPA_DOMAIN
        self.FREEIPA_ROOT_USERNAME = FREEIPA_ROOT_USERNAME
        self.FREEIPA_ROOT_PASSWORD = FREEIPA_ROOT_PASSWORD


    def addUserIPA(self, firstName, lastName, completeName, email, userName, group):
        
        client = ClientMeta(self.FREEIPA_DOMAIN, verify_ssl=False)
        client.login( self.FREEIPA_ROOT_USERNAME, self.FREEIPA_ROOT_PASSWORD)

        user = client.user_add(a_uid= userName, 
                            o_givenname=firstName, 
                            o_sn=lastName, 
                            o_cn=completeName,
                            o_random=True,
                            o_preferredlanguage='EN'
                            )

        return user