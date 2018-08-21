var PropTypes = require( 'prop-types' );

class SwatchItem extends React.Component {
  constructor(props) {
    super(props);
    this.callSelectSwatch = this.callSelectSwatch.bind(this);
  }

  // SWAP IMAGE : Simple
  callSelectSwatch() {
    const {selectSwatch, swatchObj: {id, image_url, price, product_id, url}} = this.props;
    selectSwatch(image_url, price, product_id, id, url);
  }


  render() {
    const {active, swatchObj} = this.props; // Destructuring for verbosity
    const isActive = active ? 'active' : '';
    const swatchClasses = `swatch-item ${swatchObj.color} ${isActive}`;
    const swatchColorStyle = {
      backgroundColor: swatchObj.color
    }

    return (
      <div
        style={ swatchColorStyle }
        className={ swatchClasses }
        data-swatch-data={ this.props.swatchObj }
        onClick={ this.callSelectSwatch }></div>
    );
  }
}

SwatchItem.propTypes = {
  active: PropTypes.bool.isRequired,
  selectSwatch: PropTypes.func.isRequired,
  swatchObj: PropTypes.shape({
    color: PropTypes.string.isRequired,
    image_url: PropTypes.string.isRequired,
    product_id: PropTypes.string.isRequired,
  })
};

module.exports = SwatchItem;