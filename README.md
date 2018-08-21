# shopify-muck
Theme repo for the Muck Boot Shopify store. 


# How Do I Turn This On?

For the initial setup, you'll want Node.js installed globally on your machine as well as the old slate tool v0.14. To simplify this you can run the command below to bootstrap the project for you. 

### Bootstrap Project: 
```
*** Ensure you have Slate (v0.14~) and NPM installed by entering the line below in a terminal window: ***
	> npm -v && slate -v

*** Don't have Node? 
	> Download and Install : https://nodejs.org/en/download ***

*** Don't have slate? 
	> npm i -g @shopify/slate (in terminal window)


*** READY TO BOOTSTRAP PROJECT:
	> npm run bootstrap
```


Next, you'll need to make a config.yml file so that slate knows where to push your theme edits. This is a sample file and you'll need to have someone give you an actual password key. 

### config.yml: 
```
# This file contains the information needed for Shopify to authenticate
# requests and edit/update your remote theme files.
#
# 1. Set up a private app (https://help.shopify.com/api/guides/api-credentials#generate-private-app-credentials)
#    with "Read and write" permissions for "Theme templates and theme assets".
# 2. Replace the required variables for each environment below.
#
# password, theme_id, and store variables are required.
#
# For more information on this config file:
#   Configuration variables | http://shopify.github.io/themekit/configuration/
#   Ignore patterns | http://shopify.github.io/themekit/ignores/

---

development:
  password: 123456789012345678901234567890ab
  theme_id: "PUT YOUR THEME ID HERE"
  store: muckboot-usa.myshopify.com
  ignore_files:
    - settings_data.json # Uncomment this line to avoid resetting theme settings

# production: # KEEP THIS COMMENTED OUT FOR NOW!
#   password: 123456789012345678901234567890ab
#   theme_id: "live"
#   store: muckboot-usa.myshopify.com
#   ignore_files:
#    - settings_data.json # Uncomment this line to avoid resetting theme settings -->
```


Now you can start the project and make new changes:

### Start!
```
npm run start   (runs 'slate deploy && slate watch' )

or 

npm run watch    ( runs 'slate watch' - use if you a deploy isn't needed before beginning to watch for changes)
```



### Package.json NPM Command List:
```
USAGE :
	> npm run ___________ (in a terminal window in the projects root directory)


    "bootstrap":
    	> Installs node modules (npm i)
    	> Bootstraps slate tool to handle ES6 / React with Shim

    "build": 
    	> Complies theme files by running "slate build" under the hood

    "deploy":
    	> Compiles theme files
    	> Deploys theme to Theme ID Configured in the Config.yml file in the project root.

    "start": 
    	> Compiles theme file
    	> Deploys theme to Configured Theme ID
    	> Begins slate watch task and spawns fresh browser window to test changes with.

    "watch": 
    	> Begins watch task without triggering a fresh compile of the theme files
    	> Any new changes will trigger the necessary theme files to re-compile and deploy to the configured theme ID 

```
