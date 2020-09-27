create database demo;
use demo;

create table Administration(
Admin_ID varchar(30),
primary key(Admin_ID)
);
/*drop table Administration*/

create table Account(
Username varchar(30),
Password_ varchar(30) not null,
Type_ varchar(15) not null, 
check( Type_='student' or Type_='professor' or Type_='admin' ),
primary key(Username)
);
/*drop table Account*/

create table Student(
Roll_No int,
S_Name varchar(40),
Program_Enrolled varchar(4),
Year_Of_Study int,
Department_ID int,
check ( Program_Enrolled='B.Tech' or Program_Enrolled='M.Tech' or Program_Enrolled='PhD' or Program_Enrolled='MS' or Program_Enrolled='M.Sc'),
primary key(Roll_No),
foreign key(Department_ID) references Department(Dept_ID)
);
/*drop table Student*/

create table Department(
Dept_ID int,
D_Name varchar(40) not null,
primary key(Dept_ID)
);
/*drop table Department;*/

create table Professor(
Employee_ID int,
P_Name varchar(40) not null,
Post varchar(30),
Department_ID int,
primary key(Employee_ID),
foreign key(Department_ID) references Department(Dept_ID)
);
/*drop table Professor*/

create table Courses(
Course_Code varchar(7),
Course_Name varchar(50) not null,
Class_Link varchar(200),
Credits varchar(5) not null,
primary key(Course_Code)
);
/*drop table Courses*/

create table Time_Slots(
Day_ varchar(10),
Time_ varchar(10),
primary key(Day_,Time_)
);
/*drop table Time_Slots*/

create table Study_Material(
Material_No int,
Link varchar(200),
primary key(Material_No)
);
/*drop table Study_Material*/

