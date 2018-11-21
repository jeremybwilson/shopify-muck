const PropTypes = require( 'prop-types' );

class ModalItem extends React.Component {
	constructor( props ){
		super( props );

		this.state = {
			disableButtons: false
		}

		this.selectButton = this.selectButton.bind(this);
	}

	selectButton( e ) {
		this.setState({ disableButtons: true });
		const addToCart = e.target.className.indexOf( 'add' ) > -1;
		const { discountId, handleSelection } = this.props;

		handleSelection( discountId, addToCart );
	}

	render() {
		const { disableButtons } = this.state;
		var { 
			handleSelection, 
			imageUrl, 
			message, 
			title 
		} = this.props;

		message = message || "You've earned a free gift!";
		

		return (
		  <div className="modal-item">
			<div className="modal-item-message">{ message }</div>
			<div className="modal-item-image" style={{ backgroundImage: `url(${imageUrl} )` }}></div>
			<div className="modal-item-title">{ title }</div>

			<div className={ `modal-item-buttons ${disableButtons ? 'disable-buttons' : '' }` }>
				<button className="modal-item-btn-add" onClick={ this.selectButton }>Add to Cart</button>
				<button className="modal-item-btn-no"  onClick={ this.selectButton }>No Thanks</button>
			</div>
		  </div>
		);
	}
}


ModalItem.propTypes = {
	discountId: PropTypes.number.isRequired,
	handleSelection: PropTypes.func.isRequired,
	imageUrl: PropTypes.string.isRequired,
	message: PropTypes.string,
	title: PropTypes.string.isRequired
}

module.exports = ModalItem;