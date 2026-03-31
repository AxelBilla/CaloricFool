CREATE TABLE Settings(
   SettingID INT,
   Unit INT,
   PRIMARY KEY(SettingID)
);

CREATE TABLE Users(
   UserID INT,
   Nickname VARCHAR(50),
   Email VARCHAR(100),
   Password VARCHAR(50),
   TokenID VARCHAR(50),
   SettingID INT NOT NULL,
   PRIMARY KEY(UserID),
   FOREIGN KEY(TokenID) REFERENCES Tokens(TokenID),
   FOREIGN KEY(SettingID) REFERENCES Settings(SettingID)
);


CREATE TABLE Informations(
   InformationID INT,
   BodyType INT,
   Age INT,
   Weight FLOAT,
   Height FLOAT,
   UpdateDate TIMESTAMP,
   UserID INT NOT NULL,
   PRIMARY KEY(InformationID),
   FOREIGN KEY(UserID) REFERENCES Users(UserID)
);

CREATE TABLE Consumptions(
   EntryID INT,
   Gram FLOAT,
   Kcal FLOAT,
   Comment VARCHAR(150),
   TimeOf TIMESTAMP,
   UserID INT NOT NULL,
   PRIMARY KEY(EntryID),
   FOREIGN KEY(UserID) REFERENCES Users(UserID)
);

CREATE TABLE Activities(
   EntryID INT,
   Duration FLOAT,
   BurnRate FLOAT,
   Comment VARCHAR(150),
   TimeOf TIMESTAMP,
   UserID INT NOT NULL,
   PRIMARY KEY(EntryID),
   FOREIGN KEY(UserID) REFERENCES Users(UserID)
);

CREATE TABLE Tokens(
   TokenID VARCHAR(50),
   CreationDate TIMESTAMP,
   Expiration_Date TIMESTAMP,
   PRIMARY KEY(TokenID)
);


---

--ID 1 = KG, ID 2 = LBS
INSERT INTO Settings VALUES(1, 0) -- ID = 1; Unit = 0

INSERT INTO Users VALUES(3, 'John', 'john.vault@gmail.com', 'Xk4cn,AL9q;a', 1) -- ID = 3; Nickname = 'John'; Email = 'john.vault@gmail.com'; Password = 'Xk4cn,AL9q;a'; Settings = 1

INSERT INTO Informations VALUES(2, 1, 18, 62.4, 167.0, '2025-02-20 14:00:01', 1) -- ID = 2; BodyType = 1; Age = 18 (years); Weight = 62.4 (kg); Height = 167.0, UpdateDate = '2025-02-20 14:00:01'; User = 1

INSERT INTO Consumptions VALUES(6, 0.0, 0.0 '', '2025-02-20 14:00:00', 1) -- ID = 6; Gram = 120.0; Kcal = 350.0 (per 100g); Comment = ''; TimeOf = '2025-02-20 14:00:00'; User = 1

INSERT INTO Activities VALUES(4, 100.0, 350.0, 'Lake Run x10', '2025-02-20 12:34:56', 1) -- ID = 4; Duration = 100.0 (minutes); BurnRate = 350.0 (kcal/h); Comment = 'Lake Run x10'; TimeOf = '2025-02-20 12:34:56'; User = 1


---

INSERT INTO Settings VALUES(1, 0); --Already in
INSERT INTO Settings VALUES(2, 1); --Already in

INSERT INTO Users VALUES(1, 'Mary', 'mary@mary.com', 'notcrypted-placeholder', 1);
INSERT INTO Users VALUES(2, 'Violet', 'violet.vermeille@purple.org', 'notcrypted-placeholder', 2);
INSERT INTO Users VALUES(3, 'Karim', 'karimunder@gmail.com', 'notcrypted-placeholder', 1);
INSERT INTO Users VALUES(4, 'Wagner', 'weisnt.wagner@bundesregierung.de', 'notcrypted-placeholder', 2);
INSERT INTO Users VALUES(5, 'Krognir', 'mychemicalemail@microsoft.com', 'notcrypted-placeholder', 1);
INSERT INTO Users VALUES(6, 'ZeBladMastur2015', 'fortnitegod1284@gmail.com', 'notcrypted-placeholder', 2);
INSERT INTO Users VALUES(7, '69Nice420', 'ilovebethesda@proton.me', 'notcrypted-placeholder', 1);
INSERT INTO Users VALUES(8, 'Mirabelle', 'mirabelle.durieux@outlook.fr', 'notcrypted-placeholder', 2);
INSERT INTO Users VALUES(9, 'qwerty', 'compost@qwest.xyz', 'notcrypted-placeholder', 1);
INSERT INTO Users VALUES(10, 'test', 'testest@tst.to', 'notcrypted-placeholder', 2);

INSERT INTO Informations VALUES(1, 0, 24, 62.4, 167.0, '2025-02-20 14:23:18', 1);
INSERT INTO Informations VALUES(2, 0, 24, 60.4, 167.0, '2025-03-20 08:04:12', 1);
INSERT INTO Informations VALUES(3, 0, 19, 71.2, 154.0, '2025-02-12 16:18:21', 2);
INSERT INTO Informations VALUES(4, 1, 35, 82.8, 187.0, '2025-01-09 12:03:05', 3);
INSERT INTO Informations VALUES(5, 1, 54, 97.3, 179.0, '2024-06-12 15:28:19', 4);
INSERT INTO Informations VALUES(6, 1, 55, 94.7, 179.0, '2025-06-12 23:54:47', 4);
INSERT INTO Informations VALUES(7, 1, 47, 129.1, 218.0, '2023-11-23 17:45:29', 5);
INSERT INTO Informations VALUES(8, 1, 10, 45.1, 132.0, '2024-06-18 21:37:14', 6);
INSERT INTO Informations VALUES(9, 0, 32, 128.9, 174.5, '2025-07-28 16:23:51', 7);
INSERT INTO Informations VALUES(10, 0, 33, 120.3, 174.3, '2025-09-02 23:12:32', 7);
INSERT INTO Informations VALUES(11, 0, 33, 112.0, 174.0, '2025-10-14 05:46:54', 7);
INSERT INTO Informations VALUES(12, 0, 74, 69.8, 156.0, '2025-01-30 11:10:35', 8);
INSERT INTO Informations VALUES(13, 0, 74, 63.2, 154.9, '2025-03-22 17:45:01', 8);
INSERT INTO Informations VALUES(14, 0, 1, 10.0, 100.0, '2000-01-01 00:00:00', 9);
INSERT INTO Informations VALUES(15, 1, 99, 999.9, 999.9, '2999-12-31 23:59:59', 10);


INSERT INTO Consumptions VALUES(1, 120.0, 548.5, 'Chocolate Chips Cookies x8', '2025-02-20 14:25:00', 1);
INSERT INTO Consumptions VALUES(2, 300.0, 468.2, 'Big Mac x2', '2025-02-20 14:50:00', 1);

INSERT INTO Consumptions VALUES(3, 450.0, 368.4, 'Whole Pineapple x1', '2025-02-12 16:12:21', 2);
INSERT INTO Consumptions VALUES(4, 5890.0, 428.0, 'Regina Pizza x10', '2025-02-12 16:18:20', 2);

INSERT INTO Consumptions VALUES(5, 1000.0, 2.0, 'A block of dirt x1', '2025-01-09 11:03:05', 3);
INSERT INTO Consumptions VALUES(6, 448.2, 25.0, 'Bees x128', '2025-01-09 12:03:04', 3);

INSERT INTO Consumptions VALUES(7, 300.0, 500.0, 'Military Ration x1', '2024-06-12 15:38:19', 4);
INSERT INTO Consumptions VALUES(8, 700.0, 50.0, 'Sunflowers x2', '2025-06-12 23:54:42', 4);

INSERT INTO Consumptions VALUES(9, 0.5, 999.9, 'Soul x500', '2023-11-22 17:45:29', 5);
INSERT INTO Consumptions VALUES(10, 90000.0, 432.3, 'Goat x2', '2023-11-24 17:45:29', 5);

INSERT INTO Consumptions VALUES(11, 180.0, 554.2, 'Kinder Bueno x2', '2024-05-18 21:37:14', 6);
INSERT INTO Consumptions VALUES(12, 230.0, 345.5, 'Doritos x1', '2024-08-18 21:37:14', 6);

INSERT INTO Consumptions VALUES(13, 1000.0, 240.0, 'Monster x4', '2025-07-28 16:23:51', 7);
INSERT INTO Consumptions VALUES(14, 200.0, 360.0, 'Pastas x2', '2025-10-14 05:46:54', 7);

INSERT INTO Consumptions VALUES(15, 80.0, 534.2, 'Apple Pie x1', '2025-03-01 17:45:01', 8);
INSERT INTO Consumptions VALUES(16, 150.0, 321.7, 'Roasted Beef x1', '2025-03-22 17:45:02', 8);

INSERT INTO Consumptions VALUES(17, 0.1, 0.1, 'Carbon x1', '2000-01-01 00:00:00', 9);
INSERT INTO Consumptions VALUES(18, 1.2, 1.2, 'Ferrium x1', '2000-01-01 00:00:01', 9);

INSERT INTO Consumptions VALUES(19, 1.0, 999999999.9, 'Francium x999', '2999-12-31 23:59:57', 10);
INSERT INTO Consumptions VALUES(20, 9999999999.9, 20.0, 'Burj Khalifa x1', '2999-12-31 23:59:58', 10);



INSERT INTO Activities VALUES(1, 60.0, 360.0, 'Walk around the lake', '2025-02-20 14:25:00', 1);
INSERT INTO Activities VALUES(2, 120.0, 600.0, 'Run in the forest', '2025-02-20 14:50:00', 1);

INSERT INTO Activities VALUES(3, 45.0, 150.0, 'Yoga Session', '2025-02-12 16:12:21', 2);
INSERT INTO Activities VALUES(4, 28.0, 200.0, 'Daily Squats', '2025-02-12 16:18:20', 2);

INSERT INTO Activities VALUES(5, 5.0, 100.0, 'Jumping Jacks', '2025-01-09 11:03:05', 3);
INSERT INTO Activities VALUES(6, 5.0, 85.0, 'Side Bends', '2025-01-09 12:03:04', 3);

INSERT INTO Activities VALUES(7, 12.0, 120.0, 'Dumbell Front Raises', '2024-06-12 15:38:19', 4);
INSERT INTO Activities VALUES(8, 30.0, 360.0, '2.5km Treadmill Walk', '2025-06-12 23:54:42', 4);

INSERT INTO Activities VALUES(9, 8.0, 150.0, 'Lunges', '2023-11-22 17:45:29', 5);
INSERT INTO Activities VALUES(10, 12.0, 200.0, 'Weight Lifting', '2023-11-24 17:45:29', 5);

INSERT INTO Activities VALUES(11, 2.0, 500.0, 'Running away from a serial killer', '2024-05-18 21:37:14', 6);
INSERT INTO Activities VALUES(12, 15.0, 200.0, 'Holding up a dead body', '2024-08-18 21:37:14', 6);

INSERT INTO Activities VALUES(13, 30.0, 886.0, 'Flying through the sky', '2025-07-28 16:23:51', 7);
INSERT INTO Activities VALUES(14, 120.0, 1200.0, 'Fighting alien invaders', '2025-10-14 05:46:54', 7);

INSERT INTO Activities VALUES(15, 360.0, 550.0, 'Marathon', '2025-03-01 17:45:01', 8);
INSERT INTO Activities VALUES(16, 963.0, 2.0, 'Watching TV', '2025-03-22 17:45:02', 8);

INSERT INTO Activities VALUES(17, 9630.0, 0.01, 'Praising the lord', '2000-01-01 00:00:00', 9);
INSERT INTO Activities VALUES(18, 9630.0, 0.01, 'Praising the devil', '2000-01-01 00:00:01', 9);

INSERT INTO Activities VALUES(19, 160.0, 0.000000001, 'Starting World Hunger', '2999-12-31 23:59:57', 10);
INSERT INTO Activities VALUES(20, 5822400.0, 43268.0, 'Ending World Hunger', '2999-12-31 23:59:58', 10);