# shopify-muck
Theme repo for the Muck Boot Shopify store. 


# How Do I Turn This On?

For the initial setup, you'll want Node.js installed globally on your machine as well as the old slate tool v0.14. To simplify this you can run the command below to bootstrap the project for you. 

### Bootstrap Project: 
```
*** Don't have Node?  https://nodejs.org/en/download ***

npm run bootstrap
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
  store: YOUR_STORE_NAME.myshopify.com
  ignore_files:
    - settings_data.json # Uncomment this line to avoid resetting theme settings

# production:
#   password:
#   theme_id: "live"
#   store: YOUR_STORE_NAME.myshopify.com
#   ignore_files:
#    - settings_data.json # Uncomment this line to avoid resetting theme settings -->
```


Now you can start the project and make new changes:

### Sart!
```
npm run start   (runs 'slate deploy && slate watch' )
```
