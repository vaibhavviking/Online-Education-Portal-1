All Stored Procedures in Database

- Always add Department before adding any student or professor
- Before deleting a course, make sure no student and professor is associated with it
- While deleting a course, no need to manually unassign time slot; It will automatically unassign it 
- Total_Days_Increment() called everytime when class occurs for a course
- Mark Attendance() will be executed for only those students who have pressed the button 
- Execute Remove_All_Student_Courses() once and then execute Update_Student() for all the courses added
- Execute Remove_All_professor_Courses() once and then execute Update_Professor() for all the courses added
