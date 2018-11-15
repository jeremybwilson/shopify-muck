/*
 * DISCOUNTS : REACT
 *  - Handles discounts based on things like...
 *      "Spend $___ and get Product Y for Free / Discounted" (currently)
 *      "Buy 4 items, pick free gift from list" (Stretch goal)
 *
 *  - DOES NOT handle Coupon Code stuff, "Buy 2 get 1 free" are done via shopify scripts (For now)
 *
 * REQUIRED DATA:
 *  - Root EL with ID "react-discounts" in root of theme layout
 *
 *
 * OPTIONAL DATA:
 *  - Element with ID "react-discount-meter" in the cart slideout (or wherever)
 *
 *********************************************/
const DiscountManager = require('./DiscountManager.js');


// PARENT : Initialize discounts manager + Render into Root el
$(document).ready( function(){
  
  // SAFETY : I can haz DOM Node?
  const rootEl = document.getElementById('react-discounts');
  if ( rootEl ) {
    console.log( 'found render target for parent...' );

    // RENDER : Use ReactDOM to render DiscountManager into the div
    ReactDOM.render(
      <DiscountManager />,
      rootEl
    );
  
  // SAFETY : No DOM Node : Report node is missing, but script was invoked still
  } else {
    console.log('React-Discounts is being invoked, but was unable to locate the "react-discounts" DOM Node..');
  }
});