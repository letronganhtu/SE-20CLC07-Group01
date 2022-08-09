from cgi import print_form
from http.server import HTTPServer, BaseHTTPRequestHandler
import requests
import json
import os
from pathlib import Path
import time
import pyodbc
import PIL.Image as Image # pip install Pillow
import io
import base64
from datetime import datetime
from pathlib import Path
import binascii

def openDatabase():
    conn = pyodbc.connect('Driver={SQL Server};'
                            'Server=NHAN\THIENNHAN;'
                            'Database=FOODAHOLIC_MANAGEMENT;'
                            'Trusted_Connection=yes;')
    cursor = conn.cursor()
    return cursor, conn

def process_image_from_database(img_data):
    '''Data read from database is now in binary'''
    img_data = base64.b64encode(img_data) # convert image data to base64
    '''Data read from database is now in base64 and binary'''
    img_data = img_data.decode()
    '''Data read from database is now in only base64'''
    #img = Image.open(io.BytesIO(img_data))
    #img.show()
    return img_data

def process_image_from_client(img_data):
    '''Data read from database is now in string'''
    img_data = img_data.encode()
    '''Data read from database is now in base64 binary'''
    img_data = base64.b64decode(img_data)
    '''Data read from database is now in binary'''
    #img = Image.open(io.BytesIO(img_data))
    #img.show()
    return img_data

def SignIn(data):
    def queryDatabase(username, password):
        cursor, conn = openDatabase()
        query_command = "SELECT USERNAME, PASSWORD, AVATAR, COVER, ACCOUNTTYPE, AVAILABLE FROM ACCOUNT"
        for row in cursor.execute(query_command):
            if username == row[0] and password == row[1]:
                if (row[2]):
                    avatar = process_image_from_database(row[2])
                else: 
                    avatar = ''
                if (row[3]):
                    cover = process_image_from_database(row[3])
                else:
                    cover = ''
                accounttype = row[4]
                available = row[5]
                return True, avatar, cover, accounttype, available
        return False, None, None, None, None

    def GetUsernameAndPassword(data):
        username = data['uname']
        password = data['psw']
        return username, password

    username, password = GetUsernameAndPassword(data)          
    isExisted, avatar, cover, accounttype, available = queryDatabase(username, password)
    if isExisted == True:
        cursor, conn = openDatabase();
        query_command = "UPDATE ACCOUNT SET STATUS = 'ONLINE' WHERE USERNAME = '{}'".format(username);
        cursor.execute(query_command)
        conn.commit()
        return True, username, avatar, cover, accounttype, available
    else:
        return False, username, avatar, cover, accounttype, available

def checkUsername(username):
    cursor, conn = openDatabase()
    query_command = "SELECT USERNAME FROM ACCOUNT"
    for row in cursor.execute(query_command):
        if username == row[0]:
            return True, username
    return False, username
    
def SignUp(data):
    username = data['uname']
    isExistedAccount, username = checkUsername(username)
    if (isExistedAccount == True):
        return False, username
    password = data['psw']
    firstname = data['firstname']
    surname = data['surname']
    gender = data['gender']
    email = data['email']
    address = data['address']
    phone = data['phone']
    dateOfBirth = data['dateOfBirth']
    current = datetime.now()
    createdTime = str(current.year) + '-' + str(current.month) + '-' + str(current.day) + ' ' + str(current.hour) + ':' + str(current.minute) + ':' + str(current.second)

    default_avatar_path = str(Path(__file__).resolve().parents[1])
    default_avatar_path += '/Images/anonymous_avatar.png'
    default_cover_path = str(Path(__file__).resolve().parents[1])
    default_cover_path += '/Images/default_cover.jpg'

    cursor, conn = openDatabase()
    query_command = "INSERT ACCOUNT(USERNAME, PASSWORD, FIRSTNAME, SURNAME, GENDER, ADDRESS, EMAIL, PHONENUMBER, DATEOFBIRTH, AVATAR, COVER, ACCOUNTTYPE, CREATEDTIME, STATUS, AVAILABLE, ENDOFSUSPENDTIME) VALUES('{}', '{}', N'{}', N'{}', '{}', N'{}', '{}', '{}', '{}', (SELECT * FROM OPENROWSET(BULK N'{}', SINGLE_BLOB) as AVA), (SELECT * FROM OPENROWSET(BULK N'{}', SINGLE_BLOB) as COVER), 'USER', '{}', 'OFFLINE', 1, NULL)".format(username, password, firstname, surname, gender, address, email, phone, dateOfBirth, default_avatar_path, default_cover_path, createdTime)
    print(str(username) + " SIGNED UP SUCCESSFULLY!")
    cursor.execute(query_command)
    conn.commit()
    return True, username

def getProfileInformation(data):
    username = data['uname']
    cursor, conn = openDatabase()
    query_command = "SELECT * FROM ACCOUNT"
    for row in cursor.execute(query_command):
        if row[0] == username:
            avatar = process_image_from_database(row[9])
            cover = process_image_from_database(row[10])
            return True, row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8], avatar, cover, row[11], str(row[12]), row[13], row[14], str(row[15])

'''def saveImageToDisk(img_data, filename):
    def saveImage(data, filepath):
        # The default umask is 0o22 which turns off write permission of group and others
        os.chmod(filepath, 0o777)
        with open(filepath, 'wb') as file:
            file.write(data)
    path = str(Path(__file__).resolve().parents[1])
    path += '/Server/Images/' + filename
    try:
        f = open(path, "x")
        f.close()
    except:
        print("File existed!")
    finally:
        saveImage(img_data, path)
    return path'''

def editProfile(data):
    username = data['uname']
    firstname = data['firstname']
    surname = data['surname']
    gender = data['gender']
    email = data['email']
    address = data['address']
    phone = data['phone']
    dateOfBirth = data['dateOfBirth']
    avatar = data['avatar']
    cover = data['cover']
    cursor, conn = openDatabase()
    avatar = process_image_from_client(avatar)
    cover = process_image_from_client(cover)
    avatar = binascii.hexlify(avatar).decode()
    cover = binascii.hexlify(cover).decode()
    avatar = '0x' + avatar.upper()
    cover = '0x' + cover.upper()
    query_command = "UPDATE ACCOUNT SET FIRSTNAME = N'{}', SURNAME = N'{}', GENDER = '{}', EMAIL = '{}', ADDRESS = '{}', PHONENUMBER = N'{}', DATEOFBIRTH = '{}', AVATAR = {}, COVER = {}  WHERE USERNAME = '{}' AND AVAILABLE = 1".format(firstname, surname, gender, email, address, phone, dateOfBirth, avatar, cover, username);
    cursor.execute(query_command)
    conn.commit()
    return True

def SignOut(data):
    uname = data['uname']
    cursor, conn = openDatabase()
    query_command = "UPDATE ACCOUNT SET STATUS = 'OFFLINE' WHERE USERNAME = '{}'".format(uname);
    cursor.execute(query_command)
    conn.commit()
    return True, uname

def getAnonymousAvatarAndCover(data):
    cursor, conn = openDatabase()
    query_command = "SELECT AVATAR, COVER FROM ACCOUNT WHERE USERNAME='GUEST'"
    for row in cursor.execute(query_command):
        avatar = process_image_from_database(row[0])
        cover = process_image_from_database(row[1])
        return True, avatar, cover
    return False, None, None

def postRecipe(data):
    username = data['username']
    recipe_name = data['recipe-name']
    short_description = data['short-description']
    ingredients = data['ingredients']
    preparationTime = data['preparation-time']
    cookingTime = data['cooking-time']
    steps = data['steps']
    calories = data['calories']
    additional_nutritional_values = data['additional-nutrition-values']
    additional_images = data['additional-images']
    thumbnail = data['thumbnail']
    cursor, conn = openDatabase()
    query_command = "SELECT AVAILABLE FROM ACCOUNT WHERE USERNAME = '{}'".format(username)
    for row in cursor.execute(query_command):
        if row[0] == 0:
            return False

    query_command = "SELECT ID FROM POST"
    countPost = 0
    for row in cursor.execute(query_command):
        countPost = row[0]
    id = countPost + 1
    postingUser = username
    current = datetime.now()
    postingTime = str(current.year) + '-' + str(current.month) + '-' + str(current.day) + ' ' + str(current.hour) + ':' + str(current.minute) + ':' + str(current.second)
    thumbnail = process_image_from_client(thumbnail)
    thumbnail = binascii.hexlify(thumbnail).decode()
    thumbnail = '0x' + thumbnail.upper()
    
    query_command = "INSERT POST VALUES('{}', '{}', '{}', N'{}', '{}', '{}', {}, N'{}', 1)".format(id, postingUser, postingTime, recipe_name, preparationTime, cookingTime, thumbnail, short_description)
    cursor.execute(query_command)
    conn.commit()

    for i in range(len(additional_images)):
        additionalImage = process_image_from_client(additional_images[i])
        additionalImage = binascii.hexlify(additionalImage).decode()
        additionalImage = '0x' + additionalImage.upper()
        query_command = "INSERT POST_IMAGES VALUES('{}', '{}', {})".format(id, i, additionalImage)
        cursor.execute(query_command)
        conn.commit()

    for i in range(len(ingredients)):
        query_command = "INSERT INGREDIENTS VALUES('{}', '{}', N'{}')".format(id, i, ingredients[i])
        cursor.execute(query_command)
        conn.commit()

    for i in range(len(steps)):
        query_command = "INSERT STEPS_TO_COOK VALUES('{}', '{}', N'{}')".format(id, i, steps[i])
        cursor.execute(query_command)
        conn.commit()

    query_command = "INSERT CALORIES VALUES('{}', '{}')".format(id, calories)
    cursor.execute(query_command)
    conn.commit()

    for i in range(len(additional_nutritional_values)):
        query_command = "INSERT AVERAGE_NUTRITION VALUES('{}', '{}', N'{}')".format(id, i, additional_nutritional_values[i])
        cursor.execute(query_command)
        conn.commit()

    return True

def readNewestPosts(data):
    num = data['row']
    cursor, conn = openDatabase()
    query_command = "SELECT P.ID, ACC.AVATAR, P.POSTINGUSER, P.RECIPENAME, P.THUMBNAIL FROM POST P, ACCOUNT ACC WHERE P.POSTINGUSER = ACC.USERNAME AND P.AVAILABLE = 1 AND ACC.AVAILABLE = 1 ORDER BY P.POSTINGTIME DESC"
    countPost = 0
    posts = []
    for row in cursor.execute(query_command):
        if countPost >= num - 1:
            break
        postID = row[0]
        avatar = str(process_image_from_database(row[1]))
        username = row[2]
        recipeName = row[3]
        thumbnail = str(process_image_from_database(row[4]))
        posts.append([postID, avatar, username, recipeName, thumbnail])
    if not posts:
        return False, None
    return True, posts

def viewDetailPost(data):
    postID = data["postID"]
    watchingUser = data["watchingUser"]
    cursor, conn = openDatabase()

    query_command = "SELECT AVAILABLE FROM POST WHERE ID = '{}'".format(postID)
    for row in cursor.execute(query_command):
        if row[0] == 0:
            return False, None, None, None, None, None, None, None, None, None, None, None, None, None, None, None, None, None

    # Get post and posting account
    query_command = "SELECT P.ID, P.POSTINGUSER, ACC.SURNAME + ' ' + ACC.FIRSTNAME AS FULLNAME, ACC.AVATAR, P.RECIPENAME, P.PREPARATIONTIME, P.COOKINGTIME, P.THUMBNAIL, P.SHORT_DESCRIPTION FROM POST P, ACCOUNT ACC WHERE P.AVAILABLE = 1 AND ACC.AVAILABLE = 1 AND P.POSTINGUSER = ACC.USERNAME AND P.ID = {}".format(postID)
    for row in cursor.execute(query_command):
        postingUser = row[1]
        fullname = row[2]
        avatar = str(process_image_from_database(row[3]))
        recipeName = row[4]
        preparationTime = row[5]
        cookingTime = row[6]
        thumbnail = str(process_image_from_database(row[7]))
        shortDescription = row[8]

    # Get ingredients
    query_command = "SELECT ING.INGREDIENT_STRING FROM INGREDIENTS ING, POST P WHERE P.ID = ING.POSTID AND P.ID = '{}' AND P.AVAILABLE = 1".format(postID)
    ingredients = []
    for row in cursor.execute(query_command):
        ingredient = row[0]
        ingredients.append(ingredient)

    # Get steps
    query_command = "SELECT STEPS.DETAILEDSTEP FROM STEPS_TO_COOK STEPS, POST P WHERE P.ID = STEPS.POSTID AND P.ID = '{}' AND P.AVAILABLE = 1".format(postID)
    steps = []
    for row in cursor.execute(query_command):
        step = row[0]
        steps.append(step)

    # Get calories
    query_command = "SELECT CALO.AMOUNT FROM CALORIES CALO, POST P WHERE P.ID = CALO.POSTID AND P.ID = '{}' AND P.AVAILABLE = 1".format(postID)
    calories = 0
    for row in cursor.execute(query_command):
        calories = row[0]

    # Get additional nutrition values
    query_command = "SELECT AVENU.NUTRITION_STRING FROM AVERAGE_NUTRITION AVENU, POST P WHERE P.ID = AVENU.POSTID AND P.ID = '{}' AND P.AVAILABLE = 1".format(postID)
    additional_nutrition_values = []
    for row in cursor.execute(query_command):
        value = row[0]
        additional_nutrition_values.append(value)

    # Get additional images
    query_command = "SELECT PIMG.POST_IMAGE FROM POST_IMAGES PIMG, POST P WHERE P.ID = PIMG.POST_ID AND P.ID = '{}' AND P.AVAILABLE = 1".format(postID)
    additional_images = []
    for row in cursor.execute(query_command):
        additional_images.append(process_image_from_database(row[0]))
    
    # Get like
    query_command = "SELECT LIKEP.TYPEOFLIKE, COUNT(*) AS NUMBER FROM LIKEPOST LIKEP, POST P, ACCOUNT ACC WHERE P.ID = LIKEP.POSTID AND P.ID = '{}' AND LIKEP.TYPEOFLIKE != 'NULL' AND P.AVAILABLE = 1 AND ACC.AVAILABLE = 1 AND LIKEP.STARTUSER = ACC.USERNAME GROUP BY LIKEP.TYPEOFLIKE ORDER BY COUNT(*) DESC".format(postID)
    likes = []
    for row in cursor.execute(query_command):
        type_of_like = row[0]
        number = row[1]
        likes.append([type_of_like, number])

    # Get my like
    query_command = "SELECT LIKEP.TYPEOFLIKE FROM LIKEPOST LIKEP, POST P WHERE LIKEP.POSTID = P.ID AND P.ID = '{}' AND LIKEP.STARTUSER = '{}' AND LIKEP.TYPEOFLIKE != 'NULL' AND P.AVAILABLE = 1".format(postID, watchingUser)
    type_of_my_like = ''
    for row in cursor.execute(query_command):
        type_of_my_like = row[0]
    
    # Get if the user added to their "My Favorites"
    query_command = "SELECT STARTUSER, POSTID FROM MY_FAVORITE WHERE POSTID = '{}' AND STARTUSER = '{}'".format(postID, watchingUser)
    checkAddedToFavorite = False
    favorite = []
    for row in cursor.execute(query_command):
        favorite.append(row)
    if favorite:
        checkAddedToFavorite = True

    # Get comments
    query_command = "SELECT CMT.ID, CMT.STARTUSER, CMT.CONTENT, ACC.AVATAR FROM COMMENT CMT, POST P, ACCOUNT ACC WHERE P.ID = CMT.POSTID AND P.ID = '{}' AND P.AVAILABLE = 1 AND ACC.AVAILABLE = 1 AND ACC.USERNAME = CMT.STARTUSER ORDER BY CMT.COMMENTINGTIME DESC".format(postID)
    comments = []
    for row in cursor.execute(query_command):
        cmt_avatar = str(process_image_from_database(row[3]))
        comment = [row[0], row[1], row[2], cmt_avatar]
        comments.append(comment)

    return True, postingUser, fullname, avatar, recipeName, preparationTime, cookingTime, thumbnail, shortDescription, ingredients, steps, calories, additional_nutrition_values, additional_images, likes, type_of_my_like, checkAddedToFavorite, comments

def addLike(data):
    cursor, conn = openDatabase()
    postID = data['postID']
    startUser = data['startUser']
    type_of_my_like = data["type_of_my_like"]
    current = datetime.now()
    likeTime = str(current.year) + '-' + str(current.month) + '-' + str(current.day) + ' ' + str(current.hour) + ':' + str(current.minute) + ':' + str(current.second)
   
    query_command = "SELECT AVAILABLE FROM POST WHERE ID = '{}'".format(postID)
    for row in cursor.execute(query_command):
        if row[0] == 0:
            return False

    query_command = "SELECT ID FROM LIKEPOST"
    lastLikeID = ''
    for row in cursor.execute(query_command):
        lastLikeID = int(row[0])
    if lastLikeID == '':
        likeID = 1000
    else:
        likeID = lastLikeID + 1
    query_command = "INSERT LIKEPOST VALUES('{}', '{}', '{}', '{}', '{}')".format(likeID, startUser, postID, likeTime, type_of_my_like)
    cursor.execute(query_command)
    conn.commit()
    return True

def unlike(data):
    cursor, conn = openDatabase()
    postID = data['postID']
    startUser = data['startUser']

    query_command = "SELECT AVAILABLE FROM POST WHERE ID = '{}'".format(postID)
    for row in cursor.execute(query_command):
        if row[0] == 0:
            return False

    query_command = "SELECT ID FROM LIKEPOST WHERE STARTUSER = '{}' AND POSTID = '{}'".format(startUser, postID)
    for row in cursor.execute(query_command):
        likeID = row[0]
    query_command = "DELETE FROM LIKEPOST WHERE ID = '{}' AND POSTID = '{}' AND STARTUSER = '{}'".format(likeID, postID, startUser)
    cursor.execute(query_command)
    conn.commit()
    return True

def changeLike(data):
    cursor, conn = openDatabase()
    postID = data['postID']
    startUser = data['startUser']
    type_of_my_like = data['type_of_my_like']

    query_command = "SELECT AVAILABLE FROM POST WHERE ID = '{}'".format(postID)
    for row in cursor.execute(query_command):
        if row[0] == 0:
            return False

    query_command = "UPDATE LIKEPOST SET TYPEOFLIKE = '{}' WHERE POSTID = '{}' AND STARTUSER = '{}'".format(type_of_my_like, postID, startUser)
    cursor.execute(query_command)
    conn.commit()
    return True

def addComment(data):
    postID = data['postID']
    startUser = data['startUser']
    current = datetime.now()
    commentingTime = str(current.year) + '-' + str(current.month) + '-' + str(current.day) + ' ' + str(current.hour) + ':' + str(current.minute) + ':' + str(current.second)
    content = data['content']
    cursor, conn = openDatabase()
    query_command = "SELECT AVAILABLE FROM POST WHERE ID = '{}'".format(postID)
    for row in cursor.execute(query_command):
        if row[0] == 0:
            return False, None

    query_command = "SELECT ID FROM COMMENT"
    countComment = 0
    for row in cursor.execute(query_command):
        countComment += 1
    commentID = 1000 + countComment
    query_command = "INSERT COMMENT VALUES('{}', '{}', '{}', '{}', N'{}', 1)".format(commentID, startUser, postID, commentingTime, content)
    cursor.execute(query_command)
    conn.commit()
    return True, commentID

def search(data):
    input = data['input']
    cursor, conn = openDatabase()
    query_command = "SELECT P.ID, P.POSTINGUSER, ACC.AVATAR, P.RECIPENAME, P.THUMBNAIL, CALO.AMOUNT FROM POST P, ACCOUNT ACC, CALORIES CALO WHERE P.AVAILABLE = 1 AND ACC.AVAILABLE = 1 AND P.POSTINGUSER = ACC.USERNAME AND P.ID = CALO.POSTID AND CHARINDEX(N'{}', P.RECIPENAME) > 0".format(input)
    posts = []
    for row in cursor.execute(query_command):
        postID = row[0]
        postingUser = row[1]
        avatar = str(process_image_from_database(row[2]))
        recipeName = row[3]
        thumbnail = str(process_image_from_database(row[4]))
        calories = row[5]
        posts.append([postID, postingUser, avatar, recipeName, thumbnail, calories])

    return True, posts

def getReportedPosts():
    cursor, conn = openDatabase()
    query_command = "SELECT RP.ID, RP.POSTID, RP.REPORTINGUSER, RP.REASON_TEXT, P.AVAILABLE FROM REPORTED_POST RP, POST P WHERE RP.POSTID = P.ID ORDER BY REPORTINGTIME DESC"
    reportedPosts = []
    deletedPosts = []
    for row in cursor.execute(query_command):
        reportID = row[0]
        postID = row[1]
        reportingUser = row[2]
        reasonText = row[3]
        available = row[4]
        if available == 0:
            deletedPosts.append([reportID, postID])
        elif available == 1:
            reportedPosts.append([reportID, postID, reportingUser, reasonText])
    if len(deletedPosts) > 0:
        for i in range(len(deletedPosts)):
            query_command = "DELETE FROM REPORTED_POST WHERE ID = '{}' AND POSTID = '{}'".format(deletedPosts[i][0], deletedPosts[i][1])
            cursor.execute(query_command)
            conn.commit()
    return True, reportedPosts

def ignoreDeletingPost(data):
    reportID = data['reportID']
    postID = data['postID']
    cursor, conn = openDatabase()

    query_command = "SELECT AVAILABLE FROM POST WHERE ID = '{}'".format(postID)
    checkDeleted = False
    for row in cursor.execute(query_command):
        if row[0] == 0:
            checkDeleted = True
    if checkDeleted == True:
        query_command = "DELETE FROM REPORTED_POST WHERE POSTID = '{}'".format(postID)
        cursor.execute(query_command)
        conn.commit()
        return False

    query_command = "DELETE FROM REPORTED_POST WHERE ID = '{}' AND POSTID = '{}'".format(reportID, postID)
    cursor.execute(query_command)
    conn.commit()
    return True

def addToFavorite(data):
    postID = data['postID']
    watchingUser = data['watchingUser']
    current = datetime.now()
    createdTime = str(current.year) + '-' + str(current.month) + '-' + str(current.day) + ' ' + str(current.hour) + ':' + str(current.minute) + ':' + str(current.second)
    cursor, conn = openDatabase()
    query_command = "SELECT AVAILABLE FROM POST WHERE ID = '{}'".format(postID)
    for row in cursor.execute(query_command):
        if row[0] == 0:
            return False

    query_command = "SELECT ID FROM MY_FAVORITE"
    countFavorite = 0
    for row in cursor.execute(query_command):
        countFavorite = row[0]
    favoriteID = countFavorite + 1
    query_command = "INSERT MY_FAVORITE VALUES('{}', '{}', '{}', '{}')".format(favoriteID, watchingUser, postID, createdTime)
    cursor.execute(query_command)
    conn.commit()
    return True

def removeFromFavorite(data):
    postID = data['postID']
    watchingUser = data['watchingUser']
    cursor, conn = openDatabase()
    query_command = "SELECT AVAILABLE FROM POST WHERE ID = '{}'".format(postID)
    for row in cursor.execute(query_command):
        if row[0] == 0:
            return False

    query_command = "DELETE FROM MY_FAVORITE WHERE STARTUSER = '{}' AND POSTID = '{}'".format(watchingUser, postID)
    cursor.execute(query_command)
    conn.commit()
    return True

def deletePost(data):
    postID = data['postID']
    cursor, conn = openDatabase()

    # SET AVAILABLE TO ZERO
    query_command = "UPDATE POST SET AVAILABLE = 0 WHERE ID = '{}' AND AVAILABLE = 1".format(postID)
    cursor.execute(query_command)
    conn.commit()

    # DELETE THIS POST IN REPORTED_POST
    query_command = "DELETE FROM REPORTED_POST WHERE POSTID = '{}'".format(postID)
    cursor.execute(query_command)
    conn.commit()
    return True

def reportPost(data):
    postID = data['postID']
    reportingUser = data['reportingUser']
    content = data['content']

    cursor, conn = openDatabase()

    query_command = "SELECT AVAILABLE FROM POST WHERE ID = '{}'".format(postID)
    for row in cursor.execute(query_command):
        if row[0] == 0:
            return False

    query_command = "SELECT ID FROM REPORTED_POST"
    countReportedPosts = 0
    for row in cursor.execute(query_command):
        countReportedPosts = row[0]
    reportID = countReportedPosts + 1
    current = datetime.now()
    reportingTime = str(current.year) + '-' + str(current.month) + '-' + str(current.day) + ' ' + str(current.hour) + ':' + str(current.minute) + ':' + str(current.second)

    query_command = "INSERT REPORTED_POST VALUES('{}', '{}', '{}', '{}', '{}')".format(reportID, postID, reportingUser, reportingTime, content)
    cursor.execute(query_command)
    conn.commit()
    return True

def deleteViolatedPost(data):
    reportID = data['reportID']
    postID = data['postID']
    cursor, conn = openDatabase()
    
    query_command = "SELECT AVAILABLE FROM POST WHERE ID = '{}'".format(postID)
    checkDeleted = False
    for row in cursor.execute(query_command):
        if row[0] == 0:
            checkDeleted = True
    if checkDeleted == True:
        query_command = "DELETE FROM REPORTED_POST WHERE POSTID = '{}'".format(postID)
        cursor.execute(query_command)
        conn.commit()
        return False

    # SET AVAILABLE TO ZERO
    query_command = "UPDATE POST SET AVAILABLE = 0 WHERE ID = '{}' AND AVAILABLE = 1".format(postID)
    cursor.execute(query_command)
    conn.commit()

    # DELETE FROM REPORTED_POST
    query_command = "DELETE FROM REPORTED_POST WHERE POSTID = '{}'".format(postID)
    cursor.execute(query_command)
    conn.commit()
    return True

def viewProfile(data):
    username = data['username']
    cursor, conn = openDatabase()
    query_command = "SELECT USERNAME, SURNAME + ' ' + FIRSTNAME AS FULLNAME, AVATAR, AVAILABLE FROM ACCOUNT WHERE USERNAME = '{}'".format(username)
    for row in cursor.execute(query_command):
        username = row[0]
        fullname = row[1]
        avatar = str(process_image_from_database(row[2]))
        available = row[3]
        return True, username, fullname, avatar, available

def getFavoriteRecipes(data):
    startUser = data['username']
    cursor, conn = openDatabase()
    query_command = "SELECT FAV.POSTID, P.POSTINGUSER, ACC.SURNAME + ' '+ ACC.FIRSTNAME AS FULLNAME, ACC.AVATAR, P.RECIPENAME, CALO.AMOUNT, P.THUMBNAIL, ACC.AVAILABLE FROM MY_FAVORITE FAV, POST P, ACCOUNT ACC, CALORIES CALO WHERE FAV.STARTUSER = '{}' AND P.ID = FAV.POSTID AND P.AVAILABLE = 1 AND P.POSTINGUSER = ACC.USERNAME AND P.ID = CALO.POSTID ORDER BY FAV.CREATEDTIME DESC".format(startUser)
    posts = []
    for row in cursor.execute(query_command):
        postID = row[0]
        postingUser = row[1]
        fullname = row[2]
        avatar = str(process_image_from_database(row[3]))
        recipeName = row[4]
        calories = row[5]
        thumbnail = str(process_image_from_database(row[6]))
        available = row[7]
        posts.append([postID, postingUser, fullname, avatar, recipeName, calories, thumbnail, available])
    return True, posts

def getMyRecipes(data):
    username = data['username']
    cursor, conn = openDatabase()
    query_command = "SELECT ID, RECIPENAME, THUMBNAIL, CALO.AMOUNT, ACC.AVAILABLE FROM POST P, CALORIES CALO, ACCOUNT ACC WHERE P.AVAILABLE = 1 AND ACC.AVAILABLE = 1 AND P.POSTINGUSER = ACC.USERNAME AND P.ID = CALO.POSTID AND P.POSTINGUSER = '{}' ORDER BY P.POSTINGTIME DESC".format(username)
    posts = []
    for row in cursor.execute(query_command):
        postID = row[0]
        recipeName = row[1]
        thumbnail = str(process_image_from_database(row[2]))
        calories = row[3]
        available = row[4]
        posts.append([postID, recipeName, thumbnail, calories, available])
    return True, posts

def reportAccount(data):
    reportingUser = data['reportingUser']
    endUser = data['reportedUser']
    content = data['content']

    cursor, conn = openDatabase()

    query_command = "SELECT AVAILABLE FROM ACCOUNT WHERE USERNAME = '{}'".format(endUser)
    for row in cursor.execute(query_command):
        if row[0] == 0:
            return False

    query_command = "SELECT ID FROM REPORTED_ACCOUNT"
    countReportedAccounts = 0
    for row in cursor.execute(query_command):
        countReportedAccounts = row[0]
    reportID = countReportedAccounts + 1
    current = datetime.now()
    reportingTime = str(current.year) + '-' + str(current.month) + '-' + str(current.day) + ' ' + str(current.hour) + ':' + str(current.minute) + ':' + str(current.second)

    query_command = "INSERT REPORTED_ACCOUNT VALUES('{}', '{}', '{}', '{}', '{}')".format(reportID, reportingUser, reportingTime, endUser, content)
    cursor.execute(query_command)
    conn.commit()
    return True

def readReportedAccounts(data):
    cursor, conn = openDatabase()
    query_command = "SELECT ID, ENDUSER, REPORTINGUSER, REASON_TEXT FROM REPORTED_ACCOUNT ORDER BY REPORTINGTIME DESC"
    reportedAccounts = []
    for row in cursor.execute(query_command):
        reportID = row[0]
        reportedUser = row[1]
        reportingUser = row[2]
        reasonText = row[3]
        reportedAccounts.append([reportID, reportedUser, reportingUser, reasonText])
    return True, reportedAccounts

def suspendViolatedAccount(data):
    reportID = data['reportID']
    reportedUser = data['reportedUser']
    cursor, conn = openDatabase()
    
    # SET AVAILABLE TO ZERO
    query_command = "UPDATE ACCOUNT SET AVAILABLE = 0 WHERE USERNAME = '{}' AND AVAILABLE = 1".format(reportedUser)
    cursor.execute(query_command)
    conn.commit()

    # DELETE FROM REPORTED_POST
    query_command = "DELETE FROM REPORTED_ACCOUNT WHERE ENDUSER = '{}'".format(reportedUser)
    cursor.execute(query_command)
    conn.commit()
    return True

def ignoreSuspendingAccount(data):
    reportID = data['reportID']
    reportedUser = data['reportedUser']
    cursor, conn = openDatabase()
    query_command = "DELETE FROM REPORTED_ACCOUNT WHERE ID = '{}' AND ENDUSER = '{}'".format(reportID, reportedUser)
    cursor.execute(query_command)
    conn.commit()
    return True

def readTrendingNowPosts(data):
    cursor, conn = openDatabase()

    # SELECT 4 POSTS WITH MOST LIKES AND HAHA
    query_command = "SELECT TOP 4 P.ID, P.POSTINGTIME, COUNT(*) AS AMOUNT FROM POST P, ACCOUNT ACC, LIKEPOST LIKEP WHERE P.POSTINGUSER = ACC.USERNAME AND P.AVAILABLE = 1 AND ACC.AVAILABLE = 1 AND P.ID = LIKEP.POSTID AND (LIKEP.TYPEOFLIKE = 'LOVE' OR LIKEP.TYPEOFLIKE = 'HAHA') GROUP BY P.ID, P.POSTINGTIME ORDER BY COUNT(*) DESC, P.POSTINGTIME DESC"
    posts = []
    for row in cursor.execute(query_command):
        postID = str(row[0])
        amount_of_like = str(row[1])
        posts.append([postID, amount_of_like, '0', '0', '', '', '', ''])
    maxPosts = len(posts)

    # GET SPECIFIC TYPES OF LIKE OF 4 POSTS
    for i in range(maxPosts):
        query_command = "SELECT P.ID, LIKEP.TYPEOFLIKE, COUNT(*) AS AMOUNT FROM POST P, ACCOUNT ACC, LIKEPOST LIKEP WHERE P.POSTINGUSER = ACC.USERNAME AND P.AVAILABLE = 1 AND ACC.AVAILABLE = 1 AND P.ID = LIKEP.POSTID AND P.ID = '{}' GROUP BY P.ID, LIKEP.TYPEOFLIKE".format(posts[i][0])
        for row in cursor.execute(query_command):
            love = ''
            haha = ''
            if row[1] == 'LOVE':
                love = row[2]
                posts[i][2] = str(love)
            elif row[1] == 'HAHA':
                haha = row[2]
                posts[i][3] = str(haha)

    # GET ALL OTHER INFORMATION
    for i in range(maxPosts):
        query_command = "SELECT P.ID, P.POSTINGUSER, P.RECIPENAME, ACC.AVATAR, P.THUMBNAIL FROM POST P, ACCOUNT ACC WHERE P.POSTINGUSER = ACC.USERNAME AND P.AVAILABLE = 1 AND ACC.AVAILABLE = 1 AND P.ID = '{}'".format(posts[i][0])
        for row in cursor.execute(query_command):
            postingUser = str(row[1])
            recipeName = str(row[2])
            avatar = str(process_image_from_database(row[3]))
            thumbnail = str(process_image_from_database(row[4]))
            posts[i][4] = postingUser
            posts[i][5] = recipeName
            posts[i][6] = avatar
            posts[i][7] = thumbnail
    if not posts:
        return False, None
    return True, posts

def sort(data):
    input = data['input']
    sortContent = data['sortContent']
    cursor, conn = openDatabase()
    sortBy = ''
    if sortContent == 'Newest to Oldest':
        sortBy = 'ORDER BY P.POSTINGTIME DESC'
    elif sortContent == 'Name A-Z':
        sortBy = 'ORDER BY P.RECIPENAME ASC'
    elif sortContent == 'Name Z-A':
        sortBy = 'ORDER BY P.RECIPENAME DESC'
    elif sortContent == 'Calories (High to low)':
        sortBy = 'ORDER BY CALO.AMOUNT DESC'
    elif sortContent == 'Calories (Low to high)':
        sortBy = 'ORDER BY CALO.AMOUNT ASC'

    query_command = "SELECT P.ID, P.POSTINGUSER, ACC.AVATAR, P.RECIPENAME, P.THUMBNAIL, CALO.AMOUNT FROM POST P, ACCOUNT ACC, CALORIES CALO WHERE P.AVAILABLE = 1 AND ACC.AVAILABLE = 1 AND P.POSTINGUSER = ACC.USERNAME AND P.ID = CALO.POSTID AND CHARINDEX(N'{}', P.RECIPENAME) > 0 {}".format(input, sortBy)
    posts = []
    for row in cursor.execute(query_command):
        postID = row[0]
        postingUser = row[1]
        avatar = str(process_image_from_database(row[2]))
        recipeName = row[3]
        thumbnail = str(process_image_from_database(row[4]))
        calories = row[5]
        posts.append([postID, postingUser, avatar, recipeName, thumbnail, calories])
    return True, posts

def changePassword(data):
    username = data['username']
    oldPassword = data['oldPassword']
    newPassword = data['newPassword']
    cursor, conn = openDatabase()
    query_command = "SELECT USERNAME, PASSWORD, AVAILABLE FROM ACCOUNT WHERE USERNAME = '{}' AND PASSWORD = '{}'".format(username, oldPassword)
    account = []
    for row in cursor.execute(query_command):
        account.append(row[0])
        account.append(row[1])
        account.append(row[2])
    if not account:
        return False
    query_command = "UPDATE ACCOUNT SET PASSWORD = '{}' WHERE PASSWORD = '{}' AND AVAILABLE = 1".format(newPassword, oldPassword)
    cursor.execute(query_command)
    conn.commit()
    return True

class Server(BaseHTTPRequestHandler):

    def do_HEAD(self):
        self.send_response(200)
        self.end_headers()

    def do_POST(self):
        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.end_headers()
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        post_data = post_data.decode()
        post_data = json.loads(post_data)
        
        if not(post_data.get("SignIn") is None):
            check, uname, avatar, cover, accounttype, available = SignIn(post_data)
            data = {"SignIn": check, "uname": uname, "avatar": str(avatar), "cover": str(cover), "accounttype": accounttype, "available": available}
            if check == True:
                print(uname + " signed in. ({})".format(accounttype))

        elif not(post_data.get("check-username") is None):
            check, username = checkUsername(post_data['uname'])
            data = {"isExistedAccount": check, "uname": username}

        elif not(post_data.get("SignUp") is None):
            does_sign_up_successfully, username = SignUp(post_data)
            data = {"sign_up_successfully": does_sign_up_successfully, "username": username}

        elif not(post_data.get("ContinueAsGuest") is None):
            check, uname, avatar, cover, accounttype, available = SignIn(post_data)
            data = {"ContinueAsGuest": check, "uname": uname, "avatar": str(avatar), "cover": str(cover), "accounttype": accounttype}

        elif not(post_data.get("SignOut") is None):
            check, uname = SignOut(post_data)
            data = {"SignOut": check, "uname": uname}
            print(uname + " signed out.")

        elif not(post_data.get("GetProfileInformation") is None):
            check, uname, psw, firstname, surname, gender, address, email, phonenumber, dateOfBirth, avatar, cover, accounttype, createdtime, status, available, endofsuspendtime = getProfileInformation(post_data)
            data = {"getProfileInformation": check, "uname": uname, "psw": psw, "firstname": firstname, "surname": surname, "gender": gender, "address": address, "email": email, "phone": phonenumber, "dateOfBirth": dateOfBirth, "avatar": avatar, "cover": cover, "accounttype": accounttype, "createdtime": createdtime, "status": status, "available": available, "endofsuspendtime": endofsuspendtime}

        elif not(post_data.get("EditProfile") is None):
            check = editProfile(post_data)
            data = {"edit_successfully": check}

        elif not(post_data.get("getAnonymousAvatarAndCover") is None):
            check, avatar, cover = getAnonymousAvatarAndCover(post_data)
            data = {"check": check, "avatar": str(avatar), "cover": str(cover)}

        elif not(post_data.get("PostRecipe") is None):
            check = postRecipe(post_data)
            data = {"PostRecipe": check}

        elif not(post_data.get("readNewestDishes") is None):
            check, posts = readNewestPosts(post_data)
            data = {"readNewestDishes": check, "posts": posts}

        elif not(post_data.get("viewDetailPost") is None):
            check, postingUser, fullname, avatar, recipeName, preparationTime, cookingTime, thumbnail, shortDescription, ingredients, steps, calories, additional_nutrition_values, additional_images, likes, type_of_my_like, checkAddedToFavorite, comments = viewDetailPost(post_data)
            data = {"viewDetailPost": check, "postingUser": postingUser, "fullname": fullname, "avatar": avatar, "recipeName": recipeName, "preparationTime": preparationTime, "cookingTime": cookingTime, "thumbnail": thumbnail, "shortDescription": shortDescription, "ingredients": ingredients, "steps": steps, "calories": calories, "additional_nutrition_values": additional_nutrition_values, "additional_images": additional_images, "likes": likes, "type_of_my_like": type_of_my_like, "checkAddedToFavorite": checkAddedToFavorite, "comments": comments}

        elif not(post_data.get("addComment") is None):
            check, commentID = addComment(post_data)
            data = {"addComment": check, "commentID": commentID}

        elif not(post_data.get("addLike") is None):
            check = addLike(post_data)
            data = {"addLike": check}

        elif not(post_data.get("unlike") is None):
            check = unlike(post_data)
            data = {"unlike": check}

        elif not(post_data.get("changeLike") is None):
            check = changeLike(post_data)
            data = {"changeLike": check}

        elif not(post_data.get("search") is None):
            check, posts = search(post_data)
            data = {"search": check, "posts": posts}

        elif not(post_data.get("readReportedPosts") is None):
            check, reportedPosts = getReportedPosts()
            data = {"readReportedPosts": check, "reportedPosts": reportedPosts}

        elif not(post_data.get("addToFavorite") is None):
            check = addToFavorite(post_data)
            data = {"addToFavorite": check}

        elif not(post_data.get("removeFromFavorite") is None):
            check = removeFromFavorite(post_data)
            data = {"removeFromFavorite": check}

        elif not(post_data.get("deletePost") is None):
            check = deletePost(post_data)
            data = {"deletePost": check}

        elif not(post_data.get("reportPost") is None):
            check = reportPost(post_data)
            data = {"reportPost": check}

        elif not(post_data.get("ignoreDeletingPost") is None):
            check = ignoreDeletingPost(post_data)
            data = {"ignoreDeletingPost": check}

        elif not(post_data.get("deleteViolatedPost") is None):
            check = deleteViolatedPost(post_data)
            data = {"deleteViolatedPost": check}

        elif not(post_data.get("viewProfile") is None):
            check, username, fullname, avatar, available = viewProfile(post_data)
            data = {"viewProfile": check, "username": username, "fullname": fullname, "avatar": avatar, 'available': available}

        elif not(post_data.get("getFavoriteRecipes") is None):
            check, posts = getFavoriteRecipes(post_data)
            data = {"getFavoriteRecipes": check, "posts": posts}

        elif not(post_data.get("getMyRecipes") is None):
            check, posts = getMyRecipes(post_data)
            data = {"getMyRecipes": check, "posts": posts}

        elif not(post_data.get("reportAccount") is None):
            check = reportAccount(post_data)
            data = {"reportAccount": check}
        
        elif not(post_data.get("readReportedAccounts") is None):
            check, reportedAccounts = readReportedAccounts(post_data)
            data = {"readReportedAccounts": check, "reportedAccounts": reportedAccounts}

        elif not(post_data.get("suspendViolatedAccount") is None):
            check = suspendViolatedAccount(post_data)
            data = {"suspendViolatedAccount": check}

        elif not(post_data.get("ignoreSuspendingAccount") is None):
            check = ignoreSuspendingAccount(post_data)
            data = {"ignoreSuspendingAccount": check}

        elif not(post_data.get("readTrendingNowPosts") is None):
            check, posts = readTrendingNowPosts(post_data)
            data = {"readTrendingNowPosts": check, "posts": posts}

        elif not(post_data.get("sort") is None):
            check, posts = sort(post_data)
            data = {"sort": check, "posts": posts}
        
        elif not(post_data.get("changePassword") is None):
            check = changePassword(post_data)
            data = {"changePassword": check}

        json_data = json.dumps(data)
        self.wfile.write(bytes(json_data, 'utf-8')) # send data to client

    def do_GET(self):
        if self.path == '/' or self.path == '/index.html':
            self.path = '/templates/index.html'
        try:
            file_to_open = open(self.path[1:]).read()
            self.send_response(200)
        except:
            file_to_open = "404 error: Cannot find your page"
            self.send_response(404)
        self.end_headers()
        self.wfile.write(bytes(file_to_open, 'utf-8'))
        
