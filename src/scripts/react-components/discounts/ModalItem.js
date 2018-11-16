




































const PropTypes = require( 'prop-types' );


class ModalItem extends React.Component {
  render() {
    const { imageUrl, name, variantId } = this.props;
    
    return (
      <div className="modal-item">
      	<div className="modal-item-image" style={{ backgroundImage: imageUrl }}></div>
      	<div className="modal-item-name">{ name }</div>
      	<button className="modal-item-add-btn">Add to Cart</button>
      </div>
    );
  }
}


ModalItem.propTypes = {
	imageUrl: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	variantId: PropTypes.number.isRequired
}

module.exports = ModalItem;

























































