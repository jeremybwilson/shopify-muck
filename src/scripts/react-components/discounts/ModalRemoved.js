




































const PropTypes = require( 'prop-types' );


class ModalRemoved extends React.Component {
	constructor( props ){
		super( props );
	}

	render() {
		const { 
			confirmRemoval, 
			removedDiscounts 
		} = this.props;

		const removedItems = removedDiscounts.map( discount => {
			return(
				<li className="modal-removal-item">
					<div className="modal-removal-image" style={{ backgroundImage: `url(${discount.imageUrl || ''} )` }}></div>
					<div className="modal-removal-title">{ discount.title }</div>
				</li>
			);
		});

		
		return (
		  <div className="modal-item removed-discounts">
			<div className="modal-item-message">Your cart no longer meets the requirements for these deals:</div>
			<ul className="modal-item-removal-list">
				{ removedItems }
			</ul>
			<div className="modal-item-buttons">
				<button className="modal-item-btn-confirm" onClick={ confirmRemoval }>OK</button>
			</div>
		  </div>
		);
	}
}


ModalRemoved.propTypes = {
	confirmRemoval: PropTypes.func.isRequired,
	removedDiscounts: PropTypes.array.isRequired
}

module.exports = ModalRemoved;

























































