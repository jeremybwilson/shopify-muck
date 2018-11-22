const PropTypes = require( 'prop-types' );
const fetch = require( 'isomorphic-fetch' );
const ModalItem = require( './ModalItem.js' );
const ModalRemoved = require( './ModalRemoved.js' );

class DiscountModal extends React.Component {
	constructor( props ) {
		super( props );
		this.state = {
			showModal: false
		}

		this.modalShowHide = this.modalShowHide.bind( this );
		this.getDiscountById = this.getDiscountById.bind( this );
		this.handleSelection = this.handleSelection.bind( this );
		this.addItemToCart = this.addItemToCart.bind( this );
		this.onAddItemError = this.onAddItemError.bind( this );
	}

	componentDidMount() {
		this.modalShowHide();
	}

	componentDidUpdate() {
		this.modalShowHide();
	}



	modalShowHide() {
		const { discountsToApply, doNotShowAgain, removedDiscounts } = this.props;
		
		let showHide = !doNotShowAgain && ( discountsToApply.length > 0 || removedDiscounts.length > 0 )? true : false;
		if ( this.state.showModal !== showHide ) {
			this.setState({ showModal: showHide });
		}
	}

	getDiscountById( discountId ) {
		const { discountsToApply } = this.props;
		return discountsToApply.find( rule => rule.discountId === discountId );
	}

	handleSelection( discountId, addToCart = false ) {
		// FIND : Lookup discount by 'discountId'
		const discount = this.getDiscountById( discountId );
		
		// ADD : If user clicked "Add to Cart"
		if ( addToCart ) {
			this.addItemToCart( discount ); //Cart marks as used once added successfully
		
		// NO THANKS : Mark discount as used
		} else {
			this.props.rejectDiscount( discountId );
		}
	}

	onAddItemError( err ) {
		console.log( `Looks like adding to cart failed, error message:\n${JSON.stringify( err )}` );
		// TODO : Handle errors better here! -- Probably want to set up a message into the template that shows error message
	}

	addItemToCart( discount ) {
		// SUCCESS : Callback for success handling
		const markUsedOnSuccess = () => {
			this.props.markDiscountUsed( discount.discountId );
		};

		// ADD : Use API from ajax-cart.js.liquid to add item to cart!
		ShopifyAPI.addItemById( 
			discount.giftId, 		// Gift ID (must be a Variant ID)
			markUsedOnSuccess,		// Success Callback
			this.onAddItemError, 	// Error Callback
			true					// isGift Flag (adds note property to item so we can hide things like cart quantity modifiers)
		);
	}



	render() {
		const { 
			cartTotal,
			confirmRemoval,
			discountsToApply,
			markDiscountUsed,
			removedDiscounts,
			usedDiscounts
		} = this.props;


		// CHECK : OFFER DISCOUNT : Do we have any discounts to offer the user?
		var modalItems = null;
		if ( discountsToApply.length > 0 ) {
			modalItems = discountsToApply.map( discount => {
				return (
					<ModalItem
						discountId={ discount.discountId }
						handleSelection={ this.handleSelection }
						imageUrl={ discount.imageUrl }
						message={ discount.message }
						title={ discount.title } />
				);
			})
		}

		// CHECK : ALERT REMOVAL : Were any discounts removed for not meeting the requirements? 
		//		   (Hide if offering discounts at same time, subsequent render will kick us into here)
		var removedItems = null;
		if ( !modalItems && removedDiscounts.length > 0 ) {
			removedItems = (
				<ModalRemoved
					confirmRemoval={ confirmRemoval }
					removedDiscounts={ removedDiscounts } />
			);
		}  

		//TODO : Add a div so the user can tap black area to close as well

		return (
			<div id="react-discount-modal" 
				data-component="DiscountModal" 
				className={ this.state.showModal ? 'show-modal' : '' }>

				<div id="react-discount-modal-content">
					{ modalItems }
					{ removedItems }

					<div id="react-discount-do-not-show" 
						onClick={ this.props.enableDoNotShowAgain }>Do not show deals again</div>
				</div>
			</div>
		);
	}
}

DiscountModal.propTypes = {
	cartTotal: PropTypes.number.isRequired,
	discountsToApply: PropTypes.array,
	doNotShowAgain: PropTypes.bool.isRequired,
	enableDoNotShowAgain: PropTypes.func.isRequired,
	markDiscountUsed: PropTypes.func.isRequired,
	rejectDiscount: PropTypes.func.isRequired,
	removedDiscounts: PropTypes.array,
	usedDiscounts: PropTypes.array
}

module.exports = DiscountModal;
































































