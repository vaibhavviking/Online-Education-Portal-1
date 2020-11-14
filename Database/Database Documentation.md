Entities used in database
1.  Administration
2.  Account
3.  Student
4.  Professor
5.  Department
6.  Courses
7.  Time_Slots
8.  Study_Material
9.  Attendance_Marked
10. Session
11. Posts
12. Programs
13. Sem_Dates
14. Requested_Courses

Relations used in database
1.  Admin_Account_Relation
2.  Student_Account_Relation
3.  Professor_Account_Relation
4.  Courses_Student_Relation
5.  Courses_Professor_Relation
6.  Courses_Time_Slots_Relation

Stored Procedures stored in database
1.  Insert_Admin (Admin_ID, User_ID, Password, Email, @duplicate_key)
2.  Delete_Admin (Admin_ID)
3.  Retrieve_ID (User_ID, Password, @ID)
4.  Change_Password (User_ID, Current_Password, New_Password, @m)
5.  Insert_Dept (Dept_ID, Dept_Name, @did)
6.  Delete_Dept (Dept_ID, @rif)
7.  Insert_Student (Roll_No, Student Name, DOB, Gender, Program, Year of Study, Dept ID, Email, User_ID, Password, @did, @rif, @inv)
8.  Delete_Student (Roll_No)
9.  Insert_Professor (Employee_ID, Professor_Name, DOB, Gender, Post, Dept_ID, Email, User_ID, Password, @did, @rif, @inv)
10. Delete_Professor (Employee_ID)
11. Insert_Course (Course_Code, Course_Name, Class_link, Credits, @did)
12. Delete_Course (Course_Code, @rif)
13. Add_Student_Course (Course_Code, Roll_No, Total Class Days, Days Attended, @did, @rif, @inv)
14. Remove_Student_Course (Roll_No, Course_Code)
15. Add_Professor_Course (Course_Code, Employee_ID, @did, @rif)
16. Remove_Professor_Course (Employee_ID, Course_Code)
17. Insert_Time_Slot (Day, Time, @did)
18. Insert_Study_Material (Link, Course_Code, @rif)
19. Delete_Study_Material (Material no.)
20. Assign_Time_Slot (Course_Code, Day, Time, @rif)
21. Unassign_Time_Slot (Course_Code, Day, Time)
22. Student_Time_Table (Roll_No)
23. Professor_Time_Table (Employee_ID)
24. Total_Days_Increment ()
25. Mark_Attendance (Roll_No, Course_Code, Time, Date, @did)
26. Check_Attendance (Course_Code)
27. Get_Student_Courses (Roll_No)
28. Get_Professor_Courses (Employee_ID)
29. Get_Student_Links (Roll_No)
30. Get_Professor_Links (Employee_ID)
31. Insert_Session (Session_ID, USer_ID, @rif)
32. Delete_Session (User_ID)
33. Attendance_In_Professor (Course_Code, Date)
34. Retrieve_Student_Study_Material (Roll_No)
35. Retrieve_Professor_Study_Material (Employee_ID)
36. Update_Department (Dept ID, Department Name)
37. Remove_All_Student_Courses (Roll No)
38. Update_Student_After_Sem (Roll No, Name, DOB, Gender, Program, Year Of Study, Dept ID, Email, Course ID, @did, @rif, @inv)
39. Remove_All_Professor_Courses (Employee ID)
40. Update_Professor (Employee ID, Name, DOB, Gender, Post, Dept ID, Email, Course ID, @did, @rif, @inv)
41. Update_Courses (Course Code, Course Name, Class Link, Credits)
42. Insert_Post(Post Name, @did)
43. Insert_Program(Program name, @did)
44. Delete_Post(Post Name, @rif)
45. Delete_Program(Program Name, @rif) 
46. Update_Student_In_Sem (Roll No, Name, DOB, Gender, Program, Year Of Study, Dept ID, Email, @did, @rif, @inv)
47. Set_Sem_Dates (Starting Date, Ending Date, @inv)
48. Attendance_In_Students (Roll_No, Course_Code)
49. Retrieve_Email (User_ID, @email)
50. Request_Course (Roll No, Course Code)
51. Request_Course_List (Roll No)

** DOB: Date of Birth in YYYY-MM-DD format

