# SHOPIFY-MUCK
Theme repo for the Muck Boot Shopify store. This theme features the ability to use react components as well as ES6, and was built using the Fashionopolism theme as a base!


# How Do I Turn This On?

For the initial setup, you'll want Node.js installed globally on your machine as well as the old slate tool v0.14 (not v1.x). To simplify this you can run the command below to bootstrap the project for you. 

### BOOTSTRAP PROJECT: 
```
* Ensure you have Slate (v0.14~) and NPM installed by entering the line below in a terminal window: ***
	> npm -v && slate -v


* Don't have Node? 
	> Download and Install : https://nodejs.org/en/download ***


* Don't have slate? 
	> npm i -g @shopify/slate (in terminal window)


* READY TO BOOTSTRAP PROJECT:
	> npm run bootstrap
```
 
 
 

Next, you'll need to make a config.yml file so that slate knows where to push your theme edits. This is a sample file and you'll need to have someone give you an actual password key. 

## CONFIG: Copy this into new file, update fields and save as "config.yml"
```
# This file contains the information needed for Shopify to authenticate
# requests and edit/update your remote theme files.
#
# 1. In the Shopify Store's Admin panel, click the "Apps" link on the left, then in the bottom of the page select "Manage Private Apps". From there, open or create a new token called "BOL-Development" and copy its Password key.
# 2. Replace the required variables for each environment below into a new file and save it with the name "config.yml" in the project root.
#
# NOTE : password, theme_id, and store variables are required!
#
# For more information on this config file:
#   Configuration variables | http://shopify.github.io/themekit/configuration/
#   Ignore patterns | http://shopify.github.io/themekit/ignores/



development:
  password: 123456789012345678901234567890ab
  theme_id: "PUT YOUR THEME ID HERE" #Needs the quotes around the ID value
  store: muckboot-usa.myshopify.com
  ignore_files:
    - settings_data.json # Uncomment this line to avoid resetting theme settings - COPY THIS FROM A THEME IF YOU DONT HAVE LOCALLY!ß

# production: # KEEP THIS COMMENTED OUT FOR NOW!
#   password: 123456789012345678901234567890ab
#   theme_id: "live"
#   store: muckboot-usa.myshopify.com
#   ignore_files:
#    - settings_data.json # Uncomment this line to avoid resetting theme settings
```
 
 

 


## START! : Now you can start the project and make new changes
```
> npm run start   ( runs 'slate deploy && slate watch' )

        or 

> npm run watch   ( runs 'slate watch' - use if you haven't changed any files since last deploying, saves a few mins of time. )
```
 

 
 
## Package.json NPM Command List:
```
USAGE :
  > npm run ___________ (in a terminal window in the projects root directory)


    "bootstrap":
    	1. Installs node modules (npm i)
    	2. Bootstraps slate tool to handle ES6 / React with Shim

    "build": 
    	1. Complies theme files by running "slate build" under the hood

    "deploy":
    	1. Compiles theme files
    	2. Deploys theme to Theme ID Configured in the Config.yml file in the project root.

    "start": 
    	1. Compiles theme file
    	2. Deploys theme to Configured Theme ID
    	3. Begins slate watch task and spawns fresh browser window to test changes with.

    "watch": 
    	1. Begins watch task without triggering a fresh compile of the theme files
    	2. Any new changes will trigger the necessary theme files to re-compile and deploy to the configured theme ID 

```
 
 
 

## ABOUT: This Theme supports most ES6 conventions and require() statements to facilitate file segmentation.
 
_There are two examples of React component usage in the theme.js, on the branch "react-examples" (on Master, commented out, also)._

```
 /* REACT - FOREWORD
 *
 *   You probably notice that "React" and "ReactDOM" are not imported in the 
 *   top of this theme file. They are included as libraries globally in our
 *   <HEAD> tag of "theme.liquid" so we don't need to continually write
 *   the "var React = require('react')" statements into every component!
 * 
 *   The goal is to make each component self contained, and embedded into its
 *   respective template or section by invoking them directly on that 
 *   section's JS Portion of the Theme.SectionName blocks. (See "Product" for
 *   a example #2 that illustrates this.) Global components can be invoked in a
 *   ready block anywhere in theme otherwise.
 *
 *   Lastly, React Components in Shopify are meant to help, but not replace,
 *   common liquid and JS architecture in the theme. React will excel at 
 *   global components like "Compare Tool" and feel cumbersome on other things.
 *   State-heavy features are where you will find it most useful.
 *   
 *****************************************************************************/
 ```
 
 
 
 
### REACT EXAMPLE #1 : Simple, Globally visible component rendered onto the main theme layout
```javascript
// FILE : /src/scripts/theme.js


  /* REACT - EXAMPLE #1 - Pull in the React Component Parent Script!
   *
   * GLOBAL-COMPONENT : 
   *     Simple React-Component Rendered into our "Theme.Liquid" template's
   *     DOM Node with ID "example-global-react"
   *
   * RELATED FILES :
   *    / scripts / react-components / ExampleParent.js <-- Parent Component, Renders example.js into DOM Node
   *    / scripts / react-components / Example.js <-------- React Component we want to show
   *    / layout / theme.liquid <-------------------------- Dom node to render into setup here
   *
   *  Here, we are requiring in the parent component for our "Example" feature.
   *  React components will always have a single root parent built via invoking
   *  ReactDOM.render() into a DOM Node. Open 'ExploreParent.js' to learn more. 
   *****************************************************************************/
  
  require('./react-components/example/ExampleParent.js');

```

```liquid
// FILE : /src/layout/theme.liquid


    ... (content before this)
    {% endif %}
  {% endif %}



  {% comment %}
  REACT - EXAMPLE #1 - Component Root Element! 
    
    This <div> tag serves as the location that our react component will render into. 
    It can be passed liquid data by using simple liquid template standards to insert data into 
    a data-attribute on the DOM element. Here we stubbed some fake data, but you get the idea.
  {% endcomment %} 

  <div id="example-global-react" data-info-passed-to-react='{ "name": "greg" }'></div>
  


  {% if template == 'index' or template contains 'blog' or template contains 'list-collections' %}
    {{ content_for_layout }}
    ... etc
```

```javascript
// FILE : /src/scripts/example/ExampleParent.js

  /* REACT - EXAMPLE #1 - Parent React Component!
   *
   * GLOBAL-COMPONENT : 
   *     This parent component invokes the ReactDOM.render() method to render
   *     its children components.
   *
   *  Here, this parent component waits for the dom to be ready, and then if its 
   *  target elem is present on the page, will require in its react component 
   *  "Example.js" and renders it into the DOM Element.
   *****************************************************************************/

  /* 
  1. Wait for DOM Ready:
      Its good practice to wrap parent components (not just react ones) in ready, 
      but its also not always necessary (on PDP pages perhaps for example), or 
      when importing parent components into a block already wrapped in ready().
  */
  $(document).ready(function(){ 

    // 2. Find our Global Div Element
    const rootEl = document.getElementById('example-global-react');

    // 3. Ensure element is present and has some prop data for us to ingest
    if ( rootEl && rootEl.dataset.infoPassedToReact ) {
      
      // 4. Import our Root-level React component
      var ExampleReactComponent = require('./Example.js');

      // 5. Use ReactDOM to render react components into a DOM Node
      ReactDOM.render(
        <ExampleReactComponent data={ rootEl.dataset.infoPassedToReact } />,
        rootEl
      );
    }
  });
```

```javascript
// FILE : /src/scripts/example/Example.js


  /* REACT - EXAMPLE #1
   *
   * GLOBAL-COMPONENT : 
   *     Simple React-Component Rendered into our "Theme.Liquid" template's
   *     DOM Node with ID "example-global-react"
   *
   *  This component waits for the dom to be ready, and then if its target elem
   *  is present on the page, will require in its react component "Example.js" 
   *  and render it into the element.
   *****************************************************************************/

  module.exports = class ExampleReactComponent extends React.Component {
    render() {
      const data = JSON.parse(this.props.data);
      const {name} = data;
      
      return (
        <h2 id="example-react" className="example-react">
          { `COMPONENT : ${name}` }
        </h2>
      );
    }
  }

```


<br>

### REACT EXAMPLE #2 : Swatch Picker Rendered onto Product Template (PDP)
```
// FILE : shopify-muck/src/scripts/theme.js

    /* REACT - EXAMPLE #2
     *
     * PAGE-SPECIFIC COMPONENT : 
     *     Swatch-Picker react component that appears only on the product template
     *     if given the proper DOM Nodes to render into ( see 'SwatchParent.js' for
     *     the node name being rendered into)
     *
     * RELATED FILES :
     *    / scripts / react-components / swatches / SwatchParent.js <-- Parent, renders React component root into DOM Node
     *    / scripts / react-components / swatches / SwatchList.js <---- List Container for Swatch Circles
     *    / scripts / react-components / swatches / SwatchItem.js <---- Actual swatch circle single template
     *    / snippets / component-react-swatches.liquid <-- DOM Node 'include'-able snippet
     *    / sections / product-template.liquid <---------- Template we include snippet into
     *
     *  Here, we require in the parent component for our "React-Swatches" feature.
     *  React components will always have a single root parent built via invoking
     *  ReactDOM.render() into a DOM Node. Open 'SwatchParent.js' to learn more. 
     *****************************************************************************/
    
    require('./react-components/swatches/SwatchParent.js');

```
