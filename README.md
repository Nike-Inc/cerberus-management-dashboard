# Cerberus Management Dashboard

This project is a self-service web UI for administration of [Safe Deposit Boxes (SDBs)](http://engineering.nike.com/cerberus/docs/architecture/vault#safe-deposit-box-sdb),
access control, and data in Cerberus. It is implemented as a React single-page application (SPA).

To learn more about the dashboard and view screenshots, please see the [documentation](http://engineering.nike.com/cerberus/docs/user-guide/dashboard).

To learn more about Cerberus, please visit the [Cerberus website](http://engineering.nike.com/cerberus/).

## Development
This project has a couple scripts that are integrated into NPM tasks that enable running the Cerberus stack that resides behind the router locally.
The `npm run dev-*` tasks will start the locally webpack server and configure a reverse proxy to point at vault that the scripts will start and bootstrap for you.
The Reverse proxy will either point at API Mock which will run a mocked Cerberus Management Service or it will start CMS and point to that. CMS requires that mysql is installed locally.

### Requirements to run the dashboard stack
1. Install Vault locally `brew install vault`
2. (you can skip this if you just want to use mocks `npm run dev-mock`) Clone CMS `git clone https://github.com/Nike-Inc/cerberus-management-service.git ../cerberus-management-service` at the same level as CMD as the scripts assume its located `../cerberus-management-service`
3. (you can skip this if you just want to use mocks `npm run dev-mock`) Follow the instructions in CMS to get it running locally
4. Optionally but recommended install multitail `brew install multitail`

### Run the Cerberus Stack for dashboard dev
1. Install dependencies `npm install`
    
    Tail the logs

    * Monitor the logs in logs/ `multitail logs/*`
    
    If running with real cms
    
    * Start my sql server `mysql.server start`
    
2. Run the start up command
    
    Choose one
    
    * Start the local webpack server with mocked CMS `npm run dev-mock`
    * Start the local webpack server with real CMS `npm run dev-real`
    
3. Open `open http://localhost:9000/dashboard/`
4. Develop (Hot Module reloading is on, changes to code will auto refresh the app)
