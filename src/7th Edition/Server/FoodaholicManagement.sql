﻿USE master
GO
IF DB_ID('FOODAHOLIC_MANAGEMENT') IS NOT NULL
	DROP DATABASE FOODAHOLIC_MANAGEMENT
GO
CREATE DATABASE FOODAHOLIC_MANAGEMENT
GO
USE FOODAHOLIC_MANAGEMENT
GO

CREATE TABLE ACCOUNT
(
	USERNAME VARCHAR(20),
	PASSWORD VARCHAR(20),
	FIRSTNAME NVARCHAR(30),
	SURNAME NVARCHAR(30),
	GENDER VARCHAR(6) CHECK (GENDER IN (NULL, 'MALE', 'FEMALE')),
	ADDRESS NVARCHAR(100),
	EMAIL VARCHAR(100),
	PHONENUMBER VARCHAR(12),
	DATEOFBIRTH DATE,
	AVATAR IMAGE,
	COVER IMAGE,
	ACCOUNTTYPE VARCHAR(5) CHECK (ACCOUNTTYPE IN ('USER', 'ADMIN')),
	CREATEDTIME DATETIME,
	STATUS VARCHAR(7) CHECK (STATUS IN ('ONLINE', 'OFFLINE')),
	AVAILABLE BIT,
	ENDOFSUSPENDTIME DATETIME

	CONSTRAINT PK_ACCOUNT
	PRIMARY KEY(USERNAME)
)

CREATE TABLE FOLLOW
(
	ID INT,
	STARTUSER VARCHAR(20),
	ENDUSER VARCHAR(20)

	CONSTRAINT PK_FOLLOW
	PRIMARY KEY(ID)
)

CREATE TABLE MY_FAVORITE
(
	ID INT,
	STARTUSER VARCHAR(20),
	POSTID INT,
	CREATEDTIME DATETIME

	CONSTRAINT PK_FAVORITE
	PRIMARY KEY(ID)
)

CREATE TABLE USERNOTIFICATION
(
	ID INT,
	ENDUSER VARCHAR(20),
	CREATEDTIME DATETIME,
	CONTENT NVARCHAR(500)

	CONSTRAINT PK_USERNOTI
	PRIMARY KEY(ID)
)

CREATE TABLE REPORTED_POST
(
	ID INT,
	POSTID INT,
	REPORTINGUSER VARCHAR(20),
	REPORTINGTIME DATETIME,
	REASON_TEXT NVARCHAR(500),

	CONSTRAINT PK_REPORTEDPOST
	PRIMARY KEY(ID)
)

CREATE TABLE REPORTED_COMMENT
(
	ID INT,
	COMMENTID INT,
	REPORTINGUSER VARCHAR(20),
	REPORTINGTIME DATETIME,
	REASON_TEXT NVARCHAR(500),

	CONSTRAINT PK_REPORTEDCOMMENT
	PRIMARY KEY(ID)
)

CREATE TABLE STEPS_TO_COOK
(
	POSTID INT,
	STEPORDER INT,
	DETAILEDSTEP NVARCHAR(500),

	CONSTRAINT PK_STC
	PRIMARY KEY(POSTID, STEPORDER)
)

CREATE TABLE POST
(
	ID INT,
	POSTINGUSER VARCHAR(20),
	POSTINGTIME DATETIME,
	RECIPENAME NVARCHAR(100),
	PREPARATIONTIME VARCHAR(20),
	COOKINGTIME VARCHAR(20),
	THUMBNAIL IMAGE,
	SHORT_DESCRIPTION NVARCHAR(500),
	AVAILABLE BIT

	CONSTRAINT PK_POST
	PRIMARY KEY(ID)
)

CREATE TABLE POST_IMAGES 
(
	POST_ID INT,
	IMAGE_ORDER INT,
	POST_IMAGE IMAGE

	CONSTRAINT PK_ID
	PRIMARY KEY(POST_ID, IMAGE_ORDER)
)

CREATE TABLE LIKEPOST
(
	ID INT,
	STARTUSER VARCHAR(20),
	POSTID INT,
	LIKETIME DATETIME,
	TYPEOFLIKE VARCHAR(5) CHECK (TYPEOFLIKE IN ('Love', 'Haha', 'Angry', NULL))

	CONSTRAINT PK_LIKEPOST
	PRIMARY KEY(ID)
)

CREATE TABLE REPORTED_ACCOUNT
(
	ID INT,
	REPORTINGUSER VARCHAR(20),
	REPORTINGTIME DATETIME,
	ENDUSER VARCHAR(20),
	REASON_TEXT NVARCHAR(500),

	CONSTRAINT PK_REPORTEDACCOUNT
	PRIMARY KEY(ID)
)

CREATE TABLE INGREDIENTS
(
	POSTID INT,
	INGREDIENTID INT,
	INGREDIENT_STRING NVARCHAR(500),

	CONSTRAINT PK_FOOD
	PRIMARY KEY(POSTID, INGREDIENTID)
)

CREATE TABLE COMMENT
(
	ID INT,
	STARTUSER VARCHAR(20),
	POSTID INT,
	COMMENTINGTIME DATETIME,
	CONTENT NVARCHAR(500),
	AVAILABLE BIT

	CONSTRAINT PK_COMMENT
	PRIMARY KEY(ID)
)

CREATE TABLE CALORIES
(
	POSTID INT,
	AMOUNT INT

	CONSTRAINT PK_CALORIES
	PRIMARY KEY(POSTID)
)
CREATE TABLE AVERAGE_NUTRITION
(
	POSTID INT,
	NUTRITIONID INT,
	NUTRITION_STRING NVARCHAR(500),

	CONSTRAINT PK_AVERAGENUTRITION
	PRIMARY KEY(POSTID, NUTRITIONID)
)

ALTER TABLE CALORIES
ADD 
	CONSTRAINT FK_CALORIES_POST
	FOREIGN KEY(POSTID)
	REFERENCES POST

ALTER TABLE FOLLOW
ADD
	CONSTRAINT FK_FOLLOW_ACCOUNT_STARTUSER
	FOREIGN KEY(STARTUSER)
	REFERENCES ACCOUNT,
	CONSTRAINT FK_FOLLOW_ACCOUNT_ENDUSER
	FOREIGN KEY(ENDUSER)
	REFERENCES ACCOUNT

ALTER TABLE MY_FAVORITE
ADD
	CONSTRAINT FK_FAVORITE_ACCOUNT
	FOREIGN KEY(STARTUSER)
	REFERENCES ACCOUNT,
	CONSTRAINT FK_FAVORITE_POST
	FOREIGN KEY(POSTID)
	REFERENCES POST

ALTER TABLE USERNOTIFICATION
ADD
	CONSTRAINT FK_NOTI_ACCOUNT
	FOREIGN KEY(ENDUSER)
	REFERENCES ACCOUNT

ALTER TABLE REPORTED_POST
ADD
	CONSTRAINT FK_RP_ACCOUNT
	FOREIGN KEY(REPORTINGUSER)
	REFERENCES ACCOUNT,
	CONSTRAINT FK_RP_POST
	FOREIGN KEY(POSTID)
	REFERENCES POST

ALTER TABLE REPORTED_COMMENT
ADD
	CONSTRAINT FK_RC_ACCOUNT
	FOREIGN KEY(REPORTINGUSER)
	REFERENCES ACCOUNT,
	CONSTRAINT FK_RC_COMMENT
	FOREIGN KEY(COMMENTID)
	REFERENCES COMMENT

ALTER TABLE REPORTED_ACCOUNT
ADD
	CONSTRAINT FK_RA_ACCOUNT_REPORTINGUSER
	FOREIGN KEY(REPORTINGUSER)
	REFERENCES ACCOUNT,
	CONSTRAINT FK_RA_ACCOUNT_ENDUSER
	FOREIGN KEY(ENDUSER)
	REFERENCES ACCOUNT

ALTER TABLE STEPS_TO_COOK
ADD
	CONSTRAINT FK_STC_POST
	FOREIGN KEY(POSTID)
	REFERENCES POST

ALTER TABLE POST
ADD
	CONSTRAINT FK_POST_ACCOUNT
	FOREIGN KEY(POSTINGUSER)
	REFERENCES ACCOUNT

ALTER TABLE POST_IMAGES
ADD
	CONSTRAINT FK_POSTIMAGES_POST
	FOREIGN KEY(POST_ID)
	REFERENCES POST

ALTER TABLE LIKEPOST
ADD
	CONSTRAINT FK_LIKE_ACCOUNT
	FOREIGN KEY(STARTUSER)
	REFERENCES ACCOUNT,
	CONSTRAINT FK_LIKE_POST
	FOREIGN KEY(POSTID)
	REFERENCES POST

ALTER TABLE COMMENT
ADD
	CONSTRAINT FK_COMMENT_POST
	FOREIGN KEY(POSTID)
	REFERENCES POST

ALTER TABLE INGREDIENTS
ADD
	CONSTRAINT FK_INGREDIENTS_POST
	FOREIGN KEY(POSTID)
	REFERENCES POST

ALTER TABLE AVERAGE_NUTRITION
ADD
	CONSTRAINT FK_AVERAGE_NUTRITION_POST
	FOREIGN KEY(POSTID)
	REFERENCES POST

--INSERT ACCOUNT
--VALUES('ngthiennhan2002', 'ngthiennhan2002', N'Nhân', N'Nguyễn Thiện', 'TPHCM', 'ngthiennhan2002@gmail.com', '0934058891', '2002-03-15', (SELECT * FROM OPENROWSET(BULK N'D:\test.png', SINGLE_BLOB) as AVA), NULL, 'USER', GETDATE(), 'OFFLINE', 1, NULL)

INSERT ACCOUNT
VALUES('GUEST', 'GUEST', N'GUEST', N'GUEST', NULL, NULL, NULL, NULL, NULL, (SELECT * FROM OPENROWSET(BULK N'D:\Intro2SE\Nhan\Foodaholic-website\18th Edition\Images\anonymous_avatar.png', SINGLE_BLOB) as AVATAR), (SELECT * FROM OPENROWSET(BULK N'D:\Intro2SE\Nhan\Foodaholic-website\18th Edition\Images\default_cover.jpg', SINGLE_BLOB) as COVER), 'USER', NULL, NULL, 1, NULL)


SELECT * FROM ACCOUNT
SELECT * FROM POST
SELECT * FROM POST_IMAGES
SELECT * FROM STEPS_TO_COOK
SELECT * FROM INGREDIENTS
SELECT * FROM CALORIES
SELECT * FROM AVERAGE_NUTRITION
SELECT * FROM LIKEPOST
SELECT * FROM REPORTED_POST
SELECT * FROM MY_FAVORITE
SELECT * FROM REPORTED_ACCOUNT

UPDATE dbo.ACCOUNT
SET AVAILABLe = 0
WHERE USERNAME = 'khoabkb190'