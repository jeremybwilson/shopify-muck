/* REACT COMPONENT : DISCOUNT MANAGERtotal_price ? 
 *
 * ..:: SAMPLES - DISCOUNT CONFIG ::..
 *
 *  #1 - Spend X, Get Y Style
 *		thresholdDiscounts: [{
 *			giftId: 17667671031906, 		// VARIANT ID --- Item being given for free, see docs for formatting rules
 *			inventoryId: 17275313422434,	// INVENTORY ID - Variant ID of full-price orig. item (gift untracked, uses full-cost variant to validate inventory - use gift id if only instance and is tracked)
 *			minSpend: 200					// THRESHOLD ---- Dollar (or current currency) amount to trigger free gift
 *		}]
 *
 *****************************************************************************/ 
const PropTypes = require( 'prop-types' );
const DiscountModal = require( './DiscountModal.js' );
// const DiscountMeter = require( './DiscountMeter.js' ); //Portal'd to cart node


class DiscountManager extends React.Component {
	constructor( props ) {
		super( props );

		// CONFIG : Discount Configuration Manifest
		this.config = {
			thresholdDiscounts: [{
				discountId: 1,					// DISCOUNT ID -- Unique identifier for this discount, so we can tell if its already applied
				giftId: 17667671031906, 		// VARIANT ID --- Item being given for free, see docs for formatting rules
				grantType: 'all',				// GRANT TYPE --- Does user get this gift if higher threshold is met? -- (OPTIONS: 'all' or 'pick')
				inventoryId: 17275313422434,	// INVENTORY ID - Variant ID of full-price original version (gift is untracked usually, uses full-cost variant to see how many left)
				minSpend: 50					// THRESHOLD ---- Dollar (or current currency) amount to trigger free gift
			},
			{
				discountId: 2,					// DISCOUNT ID -- Unique identifier for this discount, so we can tell if its already applied
				giftId: 17667671031906, 		// VARIANT ID --- Item being given for free, see docs for formatting rules
				grantType: 'all',				// GRANT TYPE --- Does user get this gift if higher threshold is met? -- (OPTIONS: 'always' or 'highest')
				inventoryId: 17275313422434,	// INVENTORY ID - Variant ID of full-price original version (gift is untracked usually, uses full-cost variant to see how many left)
				minSpend: 100					// THRESHOLD ---- Dollar (or current currency) amount to trigger free gift
			}]
		};

		// STATE : Current state in manager
		this.state = {
			appliedDiscounts: [],
			cartTotal: 0,
			discountsToApply: []
		};

		// EVENTS : Bind functions to current context
		this.onCartUpdate = this.onCartUpdate.bind( this );
		this.calcCartTotal = this.calcCartTotal.bind( this );
		this.calcThresholdDiscounts = this.calcThresholdDiscounts.bind( this );
	}

	componentDidMount() {
		// TODO : Add initial cart fetch if not already occurring on mount
		$( document ).on( "cartUpdated", this.onCartUpdate );
	}

	componentDidUnmount() {
		$( document ).off( "cartUpdated", this.onCartUpdate );
	}



	onCartUpdate( e ) {
		// console.log( `::: DEBUG : Saw cart update.. \n  Cart Data:\n ${JSON.stringify( e.cart )}` );
		const { thresholdDiscounts } = this.config; // ARRAY : Configured threshold discount objects (if any setup)
		var { appliedDiscounts } = this.state; 		// ARRAY : IDs to Mark as Used (2 grantType "highest" deals met, mark both, but apply highest deal only)
		var discountsToApply = []; 					// ARRAY : Met Discount Objects

		try {
			// TOTAL : Calculate whole dollar (or other currency) amount in cart (comes as "12345" which === "$123.45" )
			// NOTE: Assumes a base10 currency -- last two digits a form of "cents" -- WILL NOT WORK on Yen-type currency
			const cartTotal = this.calcCartTotal( e.cart.total_price );
			

			// TOTAL INCREASED : See if any discounts were met with the increase..
			if ( cartTotal > this.state.cartTotal ) {

				// THRESHOLDS : Calculate Threshold Discounts to Apply
				if ( thresholdDiscounts && thresholdDiscounts.length > 0 ) {
					let discounts = this.calcThresholdDiscounts( cartTotal ); //Returns null if no discounts to apply
					
					// APPLY : Any threshold discounts met that need application?
					if ( discounts ) {
						discountsToApply = discounts.toApply; 						// APPLY : All deals to apply for this cart update
						var merged = appliedDiscounts.concat( discounts.markUsed ); // FLAG  : All deals to flag as used (accounts for multiple met deals set to grantType: "highest" )
                        var dedupe = new Set( merged );
                        appliedDiscounts = Array.from( dedupe ); //Merges + De-dupes the existing state array
					}
				}

				console.log( `::: DEBUG : Discounts to Apply : ${JSON.stringify( discountsToApply )}` );
				console.log( `::: DEBUG : Discounts to Flag : ${JSON.stringify( discountsToFlag )}` );
				this.setState({ appliedDiscounts, cartTotal, discountsToApply });


				// !! TODO #1 : OTHER DISCOUNT TYPES : Add code handling for other types here in future

			
			// TOTAL DECREASED : Calculate if any discounts are no longer met and inform user
			} else {
				// !! TODO #2 : Need function to handle removal of items and checking the unlayering of "highest" grantType discounts applied !!
				// Probably want a flag that figures out if price in cart went down, then re-route it to a thresholdAdjust function
				// so we only have to check removals in the cases of cart total reducing
			}


		}

		catch (err) {
			console.log( `::: ERROR [ DiscountManager -- onCartUpdate() ] : Something went wrong!\n  MSG: ${JSON.stringify( err )}` );
		}
	}

	calcCartTotal( total_price ) {
		// CONVERT : Change cart value to a whole dollar (or other currency) amount
		var dollar, cents, cartTotal, total = JSON.stringify( total_price );
		
		if ( total.length < 3 ) {
			dollar = 0;
			cents = total
		
		} else {
			dollar = total.substring( 0, total.length - 2 );
			cents = total.substring( total.length - 2, total.length );
		}

		cartTotal = JSON.parse( dollar + '.' + cents );
		console.log( `::: DEBUG : Parsed cart total: $${cartTotal}` );
		return cartTotal;
	}

	calcThresholdDiscounts( cartTotal ) {
		const { thresholdDiscounts } = this.config;
		const { appliedDiscounts } = this.state;
		var metDiscounts = [];

		// CHECK : Did we meet any discount thresholds? (Safety, as this evolves..)
		if ( thresholdDiscounts.length > 0 ) {

			// BUILD : ARRAY : Discounts NOT used yet + Past "minSpend" Threshold
			metDiscounts = thresholdDiscounts.filter( rule => {
				const hasBeenUsed = appliedDiscounts.find( used => used === rule.discountId );
				const hasBeenMet = rule.minSpend <= cartTotal;
				return !hasBeenUsed && hasBeenMet;
			});
		}
		return metDiscounts; //Extra protection is all here..
	}



	render() {
		const { appliedDiscounts, cartTotal, discountsToApply } = this.state;

		// DISCOUNTS : Do we have discounts that need application?
		if ( discountsToApply.length > 0 ) {
			console.log( 'We have a discount to apply! -- ' + JSON.stringify( discountsToApply ) );
		
		} else {
			console.log( 'We have not met the current set of rules for a discount...' );
		}


		return (
			<div id="react-discount-modal-wrapper">
				<DiscountModal 
					appliedDiscounts={ appliedDiscounts }
					cartTotal={ cartTotal }
					discountsToApply={ discountsToApply } />
			</div>
		);
	}
}

module.exports = DiscountManager;








































































