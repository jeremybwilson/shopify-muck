





































const PropTypes = require( 'prop-types' );
const fetch = require( 'isomorphic-fetch' );
const ModalItem = require( './ModalItem.js' );

class DiscountModal extends React.Component {
	constructor( props ) {
		super( props );

		// this.fetchProduct = this.fetchProduct.bind( this );
	}

	// fetchProduct( productHandle ) {
	// 	fetch( `/products/${productHandle}.json` )
	// 		.then( res => {
	// 	        if ( res.status >= 400 ) {
	// 	            throw new Error( "Bad res from server" );
	// 	        }
	// 	        return res.json();
	// 	    })
	// 	    .then( productJson => {
	// 	        return productJson;
	// 		})
	// 		.catch( err => {
	// 			const theError = error && error.message ? error.message : error || 'Request failed for an unknown reason with no error object returned..';
	// 			console.log( `[ DiscountModal -- fetchProduct() ] : Failed request :\n${ theError }` );
	// 			throw new Error( theError );
	// 		});
	// }

	addToCart( variantId ) {

	}

	render() {
		const { 
			appliedDiscounts,
			cartTotal,
			discountsToApply,
			updateAppliedDiscounts
		} = this.props;

		var showModal = false;
		var modalItems = null;

		// CHECK : Do we have discounts to offer the user?
		if ( discountsToApply.length > 0 ) {
			showModal = true;
			modalItems = discountsToApply.map( discount => {
				return (
					<ModalItem 
						imageUrl={ discount.imageUrl }
						name={ discount.name }
						variantId={ discount.variantId } />
				);
			})
		}

		return (
			<div id="react-discount-modal" className={ showModal ? 'show-modal' : 'hide-modal' }>
				{ modalItems }
			</div>
		);
	}
	
}

DiscountModal.propTypes = {
	appliedDiscounts: PropTypes.array,
	cartTotal: PropTypes.number.isRequired,
	discountsToApply: PropTypes.array,
	updateAppliedDiscounts: PropTypes.func.isRequired
}

module.exports = DiscountModal;
































































