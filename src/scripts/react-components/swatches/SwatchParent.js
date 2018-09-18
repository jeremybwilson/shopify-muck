/*
 * SWATCHES : REACT
 *  - Displays swatch options for a product
 *
 * REQUIRED DATA:
 *  - Root EL(s) need 'data-swatches' as stringified JSON array of swatch objects
 *  - Swatch Object Sample:
 *    {
 *      colorDisplayName: STRING,                    // NAME : Color Name that user sees in tooltip
 *      colorValueName: STRING (word-word),          // NAME : CSS name for color style fallback
 *      productId: STRING,                           // ID : Product ID
 *      productImgUrl: STRING,                       // IMAGE : Product image original (for restoring after hover)
 *      swatchId: STRING (productId-colorValueName), // ID : Swatch : Swatch Color Unique ID
 *      swatchImgUrl: STRING,                        // SWATCH : Image url for swatch (fallback = name as color)    
 *      variantImgUrl: STRING                        // IMAGE : Product Variant Image for that color option
 *    }
 *********************************************/
var SwatchList = require('./SwatchList');
 

// RENDER : Find all swatch elements and render a SwatchList in each element
var buildSwatches = function() {
  const elements = document.getElementsByClassName('react-swatch-list');
  for (const el in elements) {

    // SAFETY : Prevent prototype trips + Ensure 'data-swatches' exists on elem.
    if (elements.hasOwnProperty(el) && elements[el].dataset.swatches) {

      // PARSE : Ensure clean swatchData before handing to components
      try {
        const swatchData = JSON.parse(elements[el].dataset.swatches);
        
        // RENDER : If > 1 color, Render SwatchList into target el
        if ( swatchData.length > 1 ) {
          ReactDOM.render(
            <SwatchList swatchData={ swatchData } />,
            elements[el]
          );
        }
        

      // SAFETY : Malformatted JSON = most common error
      } catch (err) {
        console.log(`Swatch Data malformed, please check 'data-swatches' info on element\n  >${err.message || err}`);
      }
    }
  }
};

module.exports = buildSwatches;