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
                    (username, firstName, lastName, fullName, email, False, False, False)
                    )
        
        conn.commit()

        closeConnectionDB(cur, conn)
    
    except(Exception, psycopg2.Error) as error:
        print("Failed to insert user into database:", error)
    
    finally:
        if conn:
            closeConnectionDB(cur, conn)




def getUser(username):
    try:
        cur, conn = startConnectionDB()

        cur.execute("SELECT * from usuarios WHERE username = %s", (username,))
        
        result = cur.fetchone()
        
        closeConnectionDB(cur, conn)
        return result

        
    
    except(Exception, psycopg2.Error) as error:
        print("Failed to get user from database:", error)
    
    finally:
        if conn:
            closeConnectionDB(cur, conn)



def updateUser(userUpdate, userName, firstName, lastName, fullName, email):
    try:
        cur, conn = startConnectionDB()

        cur.execute('''
                        UPDATE usuarios
                        SET 
                            username= %s,
                            firstName=%s,
                            lastName=%s,
                            fullName=%s,
                            email=%s
                        WHERE 
                            username=%s
                    '''
                    ,(userName, firstName, lastName, fullName, email, userUpdate)
                    )

        conn.commit()

        closeConnectionDB(cur, conn)
        
    
    except(Exception, psycopg2.Error) as error:
        print("Failed to update user data in database: ", error)
    
    finally:
        if conn:
            closeConnectionDB(cur, conn)


def deleteUser(usertodelete):
    try:
        cur, conn = startConnectionDB()

        cur.execute('DELETE FROM usuarios WHERE username=%s', (usertodelete,))

        conn.commit()

        closeConnectionDB(cur, conn)
        
    
    except(Exception, psycopg2.Error) as error:
        print("Failed to delete user in database: ", error)
    
    finally:
        if conn:
            closeConnectionDB(cur, conn)


def getAllUsers():
    try:
        cur, conn = startConnectionDB()

        cur.execute("SELECT * from usuarios")
        
        result = cur.fetchall()
        
        closeConnectionDB(cur, conn)
        return result

    
    except(Exception, psycopg2.Error) as error:
        print("Failed to get user from database:", error)
    
    finally:
        if conn:
            closeConnectionDB(cur, conn)
