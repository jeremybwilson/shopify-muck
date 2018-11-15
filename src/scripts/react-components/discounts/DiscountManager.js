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
				grantType: 'always',			// GRANT TYPE --- Does user get this gift if higher threshold is met? -- (OPTIONS: 'always' or 'highest')
				inventoryId: 17275313422434,	// INVENTORY ID - Variant ID of full-price original version (gift is untracked usually, uses full-cost variant to see how many left)
				minSpend: 200					// THRESHOLD ---- Dollar (or current currency) amount to trigger free gift
			}]
		};

		// STATE : Current state in manager
		this.state = {
			appliedDiscounts: [],
			cartTotal: 0
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
		const { thresholdDiscounts } = this.config;
		var discountsToApply = [];

		try {
			// CONVERT : Change cart value to a whole dollar (or other currency) amount
			const cartTotal = this.calcCartTotal( e.cart.total_price );
			
			// THRESHOLDS : Calculate Threshold Discounts to Apply
			if ( thresholdDiscounts && thresholdDiscounts.length > 0 ) {
				let discounts = this.calcThresholdDiscounts( cartTotal );
				
				// ADD : Were any thresholds met?
				if ( discounts && discounts.length > 0 ) {
					discountsToApply.push( discounts );
				}
			}

			console.log( `::: DEBUG : Discounts to Apply : ${JSON.stringify( discountsToApply )}` );
 


			// !! TODO #1 : Need to next make a function that sets up the discountsToApply when it has discounts to fulfill before the render
			// this.setState({ cartTotal, discountsToApply });



			// !! TODO #2 : Need function to handle removal of items and checking the unlayering of "highest" grantType discounts applied !!
			// Probably want a flag that figures out if price in cart went down, then re-route it to a thresholdAdjust function
			// so we only have to check removals in the cases of cart total reducing

			

			// !! TODO #3 : OTHER DISCOUNT TYPES : Add code handling for other types here in future
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

		// CHECK : Did we meet any discount thresholds? (Safety, as this evolves..)
		if ( thresholdDiscounts.length > 0 ) {

			// BUILD : ARRAY : Discounts NOT used yet + Past "minSpend" Threshold
			var metThresholds = thresholdDiscounts.filter( rule => {
				const hasBeenUsed = appliedDiscounts.find( used => used === rule.discountId );
				const pastThreshold = rule.minSpend <= cartTotal;
				return !hasBeenUsed && pastThreshold;
			});

			// REDUCE : Obey grantType: 'highest' threshold rule
			if ( metThresholds.length > 0 ) {
				var rulesToCheck = metThresholds.filter( rule => { return rule.grantType === 'highest' });
				var readyDiscounts = metThresholds.filter( rule => { return rule.grantType === 'always' });

				// HIGHEST : Find the highest discount of those set to grantType: 'highest'
				if ( rulesToCheck.length > 0 ) {
					let highest;
					let usedIds = rulesToCheck.map( rule => { return rule.discountId }); // Must account for the lower ones being flagged as "used" so they don't get applied in subsequent cart updates unless the spend is dropped which will be handled by removal function
					
					rulesToCheck.forEach( rule => {
						if ( !highest || highest.minSpend < rule.minSpend ) {
							highest = rule;
						}
					});

					// ADD : Insert our highest discount record 
					readyDiscounts.push( highest );
				}

				// DONE : Return the discounts that need to be applied
				return readyDiscounts;
			}
			return null;
		}
		return null; //Extra protection is all here..
	}



	render() {
		
		const { appliedDiscounts, cartTotal } = this.state;
		var discountsToApply = [];



		// DISCOUNTS : Do we have discounts that need application?
		if ( discountsToApply.length > 0 ) {
			console.log( 'We have a discount to apply! -- ' + JSON.stringify( discountsToApply ) );
		
		} else {
			console.log( 'We have not met the current set of rules for a discount...' );
		}


		return (
			<div id="react-discount-modal-wrapper">
				<DiscountModal />
			</div>
		);
	}
}

module.exports = DiscountManager;








































































