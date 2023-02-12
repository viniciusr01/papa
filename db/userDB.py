import psycopg2
from dotenv import load_dotenv
from pathlib import Path
import os

dotenv_path = Path("../backend/.env")
load_dotenv(dotenv_path)


def startConnectionDB():

    try:
        conn = psycopg2.connect(
                host= os.getenv('DATABASE_URL'),
                port = os.getenv('DATABASE_PORT'),
                database= os.getenv('DB'),
                user= os.getenv('DB_USERNAME'),
                password= os.getenv('DB_PASSWORD'))

        cur = conn.cursor()

        return cur, conn
    
    except(Exception, psycopg2.Error) as error:
        print("Failed to connect to the database", error)


    

def closeConnectionDB(cur, conn):
    cur.close()
    conn.close()



def insertUser(username, firstName, lastName, fullName , email):
    
    try:
        cur, conn = startConnectionDB()

        cur.execute('INSERT INTO usuarios (username, firstName, lastName, fullName, email, iscreatedipa, iscreatedgitlab, iscreatedjenkins)'
                    'VALUES (%s, %s, %s, %s, %s, %s, %s, %s)',
                    (username, firstName, lastName, fullName, email, False, False, True)
                    )
        
        conn.commit()

        closeConnectionDB(cur, conn)
    
    except(Exception, psycopg2.Error) as error:
        print("Failed to insert user into database:", error)



def getUser(username):
    try:
        cur, conn = startConnectionDB()

        cur.execute("SELECT * from usuarios WHERE username = %s", (username,))
        
        result = cur.fetchone()
        
        closeConnectionDB(cur, conn)
        return result

        
    
    except(Exception, psycopg2.Error) as error:
        print("Failed to get user from database:", error)