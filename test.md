steps....

first of all we need to create a heroku app (create account and go to dashboard then create a app with a unique name)

1. curl https://cli-assets.heroku.com/install-ubuntu.sh | sh

2. heroku login

3. heroku git:clone -a <leeyet-api-test> // cloning with accosiated heroku app

4. cd <api-leeyet> // move to the project directory

5. add the `Procfile` file and text the run command on it; syntax => {web:<command>} example =>{web:npm start}, {web:web:node app.js}

6. git add . // add project for commit

7. git commit -am "1.o version" // commit the project to git

8. git push heroku master // upload the commited master branch to heroku server

9. verify the app by clicking the open app button on (dashboard > app > open app); use the link in the url ==========> https://leeyet-api-test.herokuapp.com

update the change...

1.  make the necessary update and verify,and make sure currently app is working perfect

2.  git status // to see the updated items

3.  git add . // add project for commt

4.  git commit -m "1.1 version" // commit the project to master branch

5.  git push heroku master // upload the commited master branch to heroku server
