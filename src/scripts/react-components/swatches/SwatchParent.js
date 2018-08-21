/*
 * SWATCHES : REACT
 *
 *  Displays swatch options for a product
 *********************************************/
var SwatchList = require('./SwatchList');
 
// RENDER : Find all swatch elements and render a SwatchList in each element
const elements = document.getElementsByClassName('react-swatch-list');
for (const el in elements) {

  // SAFETY : Prevent prototype trips + Ensure 'data-swatches' exists on elem.
  if (elements.hasOwnProperty(el) && elements[el].dataset.swatches) {

    // PARSE : Ensure clean swatchData before handing to components
    let swatchData = [];
    try {
      swatchData = JSON.parse(elements[el].dataset.swatches);
    } catch (err) {
      console.log(`Swatch Data was malformed, please check 'data-swatches' info on element\n  >${err.message || err}`);
    }

    // RENDER : Render the Swatch List component into the target el
    // THOUGHT : Should this be inside the try catch or will it cause weirdness?
    ReactDOM.render(
      <SwatchList swatchData={ swatchData } />,
      elements[el]
    );
  }
}