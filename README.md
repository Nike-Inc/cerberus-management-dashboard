# SMaaS's Secret Management Dashboard

## Development
This project has a couple scripts that are integrated into NPM tasks that enable running the Cerberus stack that resides behind the router locally.
The `npm run dev-*` tasks will start the locally webpack server and configure a reverse proxy to point at vault that the scripts will start and bootstrap for you.
The Reverse proxy will either point at API Mock which will run a mocked Cerberus Management Service or it will start CMS and point to that. CMS requires that mysql is installed locally.

### Requirements to run the dashboard stack
1. Install Vault locally `brew install vault`
2. Clone CMS `git clone http://bitbucket.nike.com/scm/cer/react-app-cerberus-management-dashboard.git ../react-app-cerberus-management-dashboard` at the same level as CMD as the scripts assume its located `../react-app-cerberus-management-dashboard`
3. Install MySql locally `brew install mysql`
4. Optionally but recommended install multitail `brew install multitail`

### Run the Cerberus Stack
1. Install dependencies `npm install`
    
    Tail the logs

    * Monitor the logs in logs/ `multitail logs/*` (you have to wait for the logs to exist on first run)
       
    * Start my sql server `mysql.server start`
    
2. Run the start up command
       
    * Start the local webpack server with real CMS `npm run dev`
          
        * The first time you run and any time after you reset the persisted state, you will be prompted for the OneLogin API Key. You can find the key in prod cerberus or in onelogin if you are an admin.

        * If you ever need to reset the persisted state of CMS/Vault run the Gradle task to clear the mysql db `../react-app-cerberus-management-dashboard/gradlew -b ../react-app-cerberus-management-dashboard/build.gradle flywayClean` and delete the Vault local store files `rm -fr ./vault/*`.
    
3. Open `open http://localhost:9000/dashboard/`
4. Develop (Hot Module reloading is on, changes to code will auto refresh the app)
