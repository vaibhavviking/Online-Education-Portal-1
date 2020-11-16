The website is hosted in Herokuapp and the link for the same is : https://mysterious-beyond-20244.herokuapp.com/


<h1> Downloading The Project </h1>

For Downloading, using and editing this project from your local machine, we recommend using Visual Studio Code and MySQL Workbench. You should also install Git to clone this project in your local machine.
NodeJS is required to run the server of this project.
<br>
You can install 
<br>
Visual Studio Code from : https://code.visualstudio.com/
<br>
MySQL and MySQL Workbench: https://www.mysql.com/downloads/
<br>
Git:https://git-scm.com/downloads
<br>
NodeJS: https://nodejs.org/en/
<br>
After installing all above softwares/tools
1. Open the folder in your local machine where you want to clone this project
2. Right Click there and select "Open with Code"
3. Visual Studio Code opens up. Open the terminal in VS Code.
4. In the terminal, write following commands and press Enter after each command
   * git init
   * git clone https://github.com/vaibhavviking/Online-Education-Portal.git
     ( After this step, all the project files will get stored in your selected location of local machine )
   * cd o (Then press Tab and then press Enter)
   * npm init
     ( You can be prompted to install other modules like md5. In that case type "npm i --save md5" and press Enter )
   * You also need a 'keys.js' file to get credentials of using the cloud database which is not uploaded in this repository for security reasons. You can mail at any one of the mail ids: cse190001065@iiti.ac.in/ee190002048@iiti.ac.in/cse190001048@iiti.ac.in/cse190001027@iiti.ac.in .       
     You should also use the same credentials to create MySQL instance and access the database (or) You can create your own cloud database and store the credentials in your 'keys.js' file
   * node server
     ( After pressing Enter, you can open 'localhost:5000' in your browser to access the website )
     
<h1>Repository Details</h1>

Database folder: All files related to Database ( You can find details inside the folder in Database_Documentation.md )
<br>
views folder:    All Web pages in .ejs format ( All File names are self explainatory )
<br>
views/css folder:All style sheets of the web pages ( All File names are self explainatory )
<br>
views/images:    All images used in this project
<br>
server.js:       Node.JS file to run the server
<br>
(You may ignore rest other files)

