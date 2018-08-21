var PropTypes = require( 'prop-types' );
var SwatchItem = require( './SwatchItem.js' );

class SwatchList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeSwatchId: null
    };
    this.selectSwatch = this.selectSwatch.bind(this);
  }

  selectSwatch(image_url, price, product_id, swatchId, url) {
  /* SAMPLE : Uncomment this block to see how you can tag divs to change on interaction.
   *          Just be sure you set data-product-image-id={{ product.id }} on the product
   *          image, and data-product-price-id={{ product.id }}
   *
   * const productImg = document.querySelector(`[data-image-product-id="${product_id}"]`);
   * const productPrice = document.querySelector(`[data-product-price-id="${product_id}"]`);
   * productImg.src = image_url;
   * productPrice.innerHTML = price;
   */

   /* SAMPLE : Change url on click. Can also be a simple A tag, but this felt like a 
               better demo of how to make click events in react components
    */
    const origin = window.location.origin;
    window.location.replace( origin + url );
    this.setState({ activeSwatchId: swatchId });
  }


  render() {
    const {swatchData} = this.props; // Destructuring = verbosity saver
    const {activeSwatchId} = this.state; // Destructuring = verbosity saver
    let swatches = null;

    if (swatchData.length > 0) {
      let usedColors = [];
      swatches = swatchData.map( (swatchObj) => {
        const isAlreadyDisplayed = usedColors.find( color => color === swatchObj.color );

        if ( !isAlreadyDisplayed ) {

          usedColors.push( swatchObj.color );
          return ( 
            <SwatchItem
              active={ swatchObj.id === activeSwatchId }
              key={ swatchObj.id }
              selectSwatch={ this.selectSwatch }
              swatchObj={ swatchObj } />
          );
        }
      });
    }

    return (
      <div className="swatch-list">
        { swatches }
      </div>
    );
  }
}

SwatchList.propTypes = {
  swatchData: PropTypes.array.isRequired
}

module.exports = SwatchList;