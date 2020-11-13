create database demo;
use heroku_ba6bdaf56728c3e;

/*
Entities
-Account
-Administration
-Student
-Professor
-Department
-Courses
-Time_Slots
-Study_Material

Relationships
-Admin_Account_Relation
-Student_Account_Relation
-Professor_Account_Relation
-Courses_Student_Relation
-Courses_Professor_Relation
-Courses_Time_Slots_Relation
*/

create table Administration(
Admin_ID int,
primary key(Admin_ID)
);
/*drop table Administration*/

create table Account(
User_ID_ varchar(30),
Password_ varchar(100) not null,
Type_ varchar(15) not null, 
check( Type_='student' or Type_='professor' or Type_='admin' ),
primary key(User_ID_)
);
/*drop table Account*/

create table Admin_Account_Relation(
Admin_ID int,
User_ID_ varchar(30),
primary key(User_ID_),
foreign key(Admin_ID) references Administration(Admin_ID) on delete cascade,
foreign key(User_ID_) references Account(User_ID_) on delete cascade
);
/*drop table Admin_Account_Relation*/

create table Department(
Dept_ID int,
D_Name varchar(40) not null,
primary key(Dept_ID)
);
/*drop table Department;*/

create table Programs(
P_Name varchar(10),
primary key(P_Name)
);
/*drop table Programs*/

create table Posts(
P_Name varchar(30),
primary key(P_Name)
);
/*drop table Posts*/

create table Student(
Roll_No int,
S_Name varchar(40),
DOB date,
Gender varchar(1),
Program_Enrolled varchar(10),
Year_Of_Study int,
Department_ID int,
Email varchar(100),
primary key(Roll_No),
foreign key(Department_ID) references Department(Dept_ID),
foreign key(Program_Enrolled) references Programs(P_Name)  
);
/*drop table Student*/

create table Professor(
Employee_ID int,
P_Name varchar(40) not null,
Post varchar(30),
DOB date,
Gender varchar(1),
Department_ID int,
Email varchar(100),
primary key(Employee_ID),
foreign key(Department_ID) references Department(Dept_ID),
foreign key(Post) references Posts(P_Name) 
);
/*drop table Professor*/

create table Student_Account_Relation(
Roll_No int,
User_ID_ varchar(30),
primary key(User_ID_),
foreign key(Roll_No) references Student(Roll_No) on delete cascade,
foreign key(User_ID_) references Account(User_ID_) on delete cascade
);
/*drop table Student_Account_Relation*/

create table Professor_Account_Relation(
Employee_ID int,
User_ID_ varchar(30),
primary key(User_ID_),
foreign key(Employee_ID) references Professor(Employee_ID) on delete cascade,
foreign key(User_ID_) references Account(User_ID_) on delete cascade 
);
/*drop table Professor_Account_Relation*/

create table Courses(
Course_Code varchar(7),
Course_Name varchar(50) not null,
Class_Link varchar(200),
Credits varchar(5) not null,
primary key(Course_Code)
);
/*drop table Courses*/

create table Courses_Student_Relation(
Course_Code varchar(7),
Roll_No int,
Total_Days int,
Days_Attended int,
check(Days_Attended<=Total_Days and Days_Attended>=0 and Total_Days>=0),
primary key(Course_Code,Roll_No),
foreign key(Roll_no) references Student(Roll_No) ,
foreign key(Course_Code) references Courses(Course_Code) 
);
/*drop table Courses_Student_Relation*/

create table Courses_Professor_Relation(
Course_Code varchar(7),
Employee_ID int,
primary key(Course_Code,Employee_ID),
foreign key(Employee_ID) references Professor(Employee_ID),
foreign key(Course_Code) references Courses(Course_Code) 
);
/*drop table Courses_Professor_Relation*/

create table Time_Slots(
Day varchar(20),
Time varchar(5),
primary key(Day,Time)
);
/*drop table Time_Slots*/

create table Courses_Time_Slots_Relation(
Course_Code varchar(7),
Day varchar(20),
Time varchar(5),
primary key(Day,Time,Course_Code),
foreign key(Day,Time) references Time_Slots(Day,Time),
foreign key(Course_Code) references Courses(Course_Code) on delete cascade
);
/*drop table Courses_Time_Slots_Relation*/

create table Study_Material(
Material_No int auto_increment,
Link varchar(200),
Course_Code varchar(7),
Description varchar(100),
primary key(Material_No),
foreign key(Course_Code) references Courses(Course_Code) on delete cascade
);
/*drop table Study_Material*/

create table current_session(
session_id varchar(50),
User_ID varchar(30),
primary key(User_ID)
);
/*drop table current_session*/

create table Attendance_Marked(
Roll_No int,
CID varchar(7),
Time time,
Date date,
primary key(Roll_No, Time),
foreign key(Roll_No) references Student(Roll_No) on delete cascade,
foreign key(CID) references Courses(Course_Code) on delete cascade
);
/*drop table Attendance_Marked*/

create table Sem_Dates(
Starting_Date date,
Ending_Date date,
primary key(Starting_Date, Ending_Date)
);
/*drop table Sem_Dates*/
