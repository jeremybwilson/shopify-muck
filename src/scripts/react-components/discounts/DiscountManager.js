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
const Promise = require( 'bluebird' );
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
				message: "For spending over $200, here is your free gift!",
				minSpend: 200,					// THRESHOLD ---- Dollar (or current currency) amount to trigger free gift
				productHandle: 'mens-northwest-territory-socks'

			}/*,
			{
				discountId: 2,					// DISCOUNT ID -- Unique identifier for this discount, so we can tell if its already applied
				giftId: 17667671031906, 		// VARIANT ID --- Item being given for free, see docs for formatting rules
				grantType: 'all',				// GRANT TYPE --- Does user get this gift if higher threshold is met? -- (OPTIONS: 'always' or 'highest')
				inventoryId: 17275313422434,	// INVENTORY ID - Variant ID of full-price original version (gift is untracked usually, uses full-cost variant to see how many left)
				message: "For spending over $200, here is your free gift!",
				minSpend: 100,					// THRESHOLD ---- Dollar (or current currency) amount to trigger free gift
				productHandle: 'mens-northwest-territory-socks'
			}*/]
		};

		// ENABLED : Did the user disable showing the modal?
		const doNotShowAgain = $.cookie( 'BOL_hide_discounts_modal' );

		// LAST SESSION : Do we have any discount data saved from a previous session?
		var savedUsedDiscounts = $.cookie( 'BOL_used_discounts' );
		var savedRejectedDiscounts = $.cookie( 'BOL_rejected_discounts' );

		try {
			if ( savedUsedDiscounts ) { 
				savedUsedDiscounts = JSON.parse( savedUsedDiscounts );
			}
			if ( savedRejectedDiscounts ) { 
				savedRejectedDiscounts = JSON.parse( savedRejectedDiscounts );
			}
		}
		catch( err ) {
			console.log( `DiscountManager : Had trouble parsing the cookies... ${err}` );
		}


		// STATE : Current state in manager
		this.state = {
			cartTotal: 0,
			discountsToApply: [],
			doNotShowAgain: doNotShowAgain || false,
			rejectedDiscounts: savedRejectedDiscounts || [],
			removedDiscounts: [],
			usedDiscounts: savedUsedDiscounts || []
		};

		// EVENTS : Bind functions to current context
		this.onCartUpdate = this.onCartUpdate.bind( this );
		this.calcCartTotal = this.calcCartTotal.bind( this );
		this.removeCartItem = this.removeCartItem.bind( this );
		this.calcThresholdDiscounts = this.calcThresholdDiscounts.bind( this );
		this.confirmRemoval = this.confirmRemoval.bind( this );
		this.enableDoNotShowAgain = this.enableDoNotShowAgain.bind( this );
		this.markDiscountUsed = this.markDiscountUsed.bind( this );
	}

	componentDidMount() {
		$( document ).on( "cartUpdated", this.onCartUpdate ); //Listen for cart updates
	}

	componentDidUnmount() {
		$( document ).off( "cartUpdated", this.onCartUpdate );
	}

	onCartUpdate( e ) {
		const { thresholdDiscounts } = this.config; 		// ARRAY : Configured threshold discount objects (if any setup)
		var { cartTotal, usedDiscounts } = this.state;		// We mod / repush the usedDiscounts arr, hence var
		var discountsToApply = [];

		try {
			// TOTAL : Calculate whole dollar (or other currency) amount in cart (comes as "12345" which === "$123.45" )
			// NOTE: Assumes base10 currency -- last two digits a form of "cents" -- WILL NOT WORK on Yen-type currency
			const newCartTotal = this.calcCartTotal( e.cart.total_price );
			console.log( `Saw a cart update! -- State Total: ${cartTotal} -- New Total: ${newCartTotal}`  );
			

			// INCREASED : See if any discounts were met with the increase..
			if ( newCartTotal > cartTotal ) {
				console.log( '::: CART --> INCREASE :::' );

				// THRESHOLDS : Calculate Threshold Discounts to Apply
				if ( thresholdDiscounts && thresholdDiscounts.length > 0 ) {
					discountsToApply = this.calcThresholdDiscounts( newCartTotal );
				}


				// IN STOCK : Are the 'discountsToApply' in stock? 
				if ( discountsToApply.length > 0 ) {
					var inStockDiscounts = [];

					// ITERATE : Map each discount to check if its gift is available
					Promise.all(
						discountsToApply.map( discount => {
							return this.fetchProduct( discount.productHandle )
								.then( res => {

									// IN STOCK : Do we have in-stock variants?
									if ( res && res.availableVariants ) {
										const inStockObj = res.availableVariants.find( variant => variant.variantId === discount.inventoryId );

										// DISCOUNT IN STOCK? 
										if ( inStockObj ) {
											inStockDiscounts.push( Object.assign( {}, discount, inStockObj ) );
										}
									}
								});
						})

					// UPDATE : Set state to trigger render cycle with discountsToApply populated
					).then( () => {
						this.setState({ 
							cartTotal: newCartTotal, 
							discountsToApply: inStockDiscounts 
						});
					});
				}
			
			// DECREASED : Calculate if any discounts are no longer met and inform user
			} else {
				var discountsToRemove = []; //Array of Discount objects
				console.log( '::: CART --> DECREASE OR SAME ::::' );

				// PRICE CHECK : Did we fall under any thresholds and need to remove a freebie item?
				usedDiscounts.forEach( used => {
					var discountObj = thresholdDiscounts.find( discount => discount.discountId === used.discountId );

					// CHECK : Discount Obj : Check existence in case discount no longer in config
					if ( discountObj && discountObj.minSpend > newCartTotal ) {

						// CART : Find the gift item in the cart, and flag for removal
						// NOTE: Diff in variable style is to show cart properties vs our own
						var line_item = e.cart.items.findIndex( item => item.variant_id === discountObj.giftId ); 
						
						// SAFETY : Ensure item was in cart still
						if ( line_item ) {
							discountObj.line_item = line_item + 1; // +1 as cart.items starts at 1 not 0
							discountsToRemove.push( discountObj );
						}
					}
				});

				// REMOVE : Pull any items that are unmet and alert user to their removal
				if ( discountsToRemove.length > 0 ) {
					var removedDiscounts = [];

					// REMOVE : For each item, call shopify API and await confirmation, then inform user of removal
					Promise.all(
						discountsToRemove.map( discount => {
							return this.removeCartItem( discount.line_item, discount )
								.then( res => {
									
									// SUCCESS : Remove discount from "usedDiscounts" list state
									const removalIndex = usedDiscounts.findIndex( used => used.discountId === discount.discountId );
									const removed = usedDiscounts.splice( removalIndex, 1 ); // Remove 1 key from 'usedDiscounts' @ removalIndex

									// FLAG : Mark what discounts were removed to inform user
									removedDiscounts.push( removed[0] );
								})
								.catch( err => {
									const theError = err ? err : 'Server failed to supply an error object from Shopify side.';
									console.log( `Error Removing Deal Item: ${JSON.stringify( theError )}` );
								});
						})
					).then( res => {
						// NOTE : Each individual removal resolution call then pulls that ID from the usedDiscounts array above in the promise.all

						// SAVE : Save our data in cookie and state
		    			$.cookie( 'BOL_used_discounts', JSON.stringify( usedDiscounts ), { expires: 60 } );
						this.setState({ 
							cartTotal: newCartTotal,
							removedDiscounts,
							usedDiscounts
						});
					})
				}
			}
		}

		catch (err) {
			const theError = err ? err : 'Error object was not captured, entered the catch for [onCartUpdate] in DiscountManager';
			console.log( `::: ERROR [ DiscountManager -- onCartUpdate() ] : Something went wrong!\n  MSG: ${JSON.stringify( theError )}` );
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
		const { rejectedDiscounts, usedDiscounts } = this.state;
		var metDiscounts = [];

		// CHECK : Did we meet any discount thresholds? (Safety, as this evolves..)
		if ( thresholdDiscounts.length > 0 ) {

			// BUILD : ARRAY : Discounts NOT used yet + Past "minSpend" Threshold
			metDiscounts = thresholdDiscounts.filter( rule => {
				const hasBeenUsed = usedDiscounts.find( used => used.discountId === rule.discountId );
				const hasBeenRejected = rejectedDiscounts.find( reject => reject.discountId === rule.discountId );
				const hasBeenMet = rule.minSpend <= cartTotal;
				return !hasBeenUsed && !hasBeenRejected && hasBeenMet;
			});
		}
		return metDiscounts; //Extra protection is all here..
	}

	confirmRemoval() {
		// CONFIRMED : Clear out the "removedDiscounts" array since we've informed the user now
		this.setState( state => {
	    	return { removedDiscounts: [] };
	    });
	}

	fetchProduct( productHandle ) {
		return fetch( `/products/${productHandle}?view=availability` )
			.then( res => {
		        if ( res.status >= 400 ) {
		            throw new Error( "Bad res from server" );
		        }
		        return res.json();
		    })
		    .then( productJson => {
		        return productJson;
			})
			.catch( err => {
				const theError = error && error.message ? error.message : error || 'Request failed for an unknown reason with no error object returned..';
				console.log( `[ DiscountModal -- fetchProduct() ] : Failed request :\n${ theError }` );
				throw new Error( theError );
			});
	}

	removeCartItem( line_item, discount ) {
		return new Promise(function (resolve, reject) {
			console.log( '::: DEBUG : Submitting item for removal...' );

			// SUCCESS : Callback for success handling
			const onSuccess = ( cart ) => {
				console.log( '::: DEBUG : SUCCESS : Resolving Removal Function' );
				resolve( discount );
			};

			// FAILED : Callback for failure handling
			const onFailure = (XMLHttpRequest, textStatus) => {
				console.log( '::: DEBUG : FAILURE : Rejecting Removal Function: ' );
				reject( XMLHttpRequest, textStatus );
			};

			// REMOVE : Use API from ajax-cart.js.liquid to set item quantity to 0 for a removal
			ShopifyAPI.changeItem( 
				line_item, 	// LINE ITEM : Which cart item is being removed
				0,			// AMOUNT : Set quantity to 0 to remove an item
				onSuccess,	// SUCCESS : Callback Handler for Successful Updates
				onFailure	// FAILED : Callback handler for failed updates
			);
		});
	}

	enableDoNotShowAgain() {
		$.cookie( 'BOL_hide_discounts_modal','true', { expires: 90 } ); //Expire in days
		this.setState({ doNotShowAgain: true });
	}

	markDiscountUsed( discountId ) {
		var { usedDiscounts } = this.state;
		console.log( `::: DEBUG : Checking if discount is marked used already : ${discountId}` );
		
		// CHECK : If not present, add to the list
		var isAlreadyMarked = usedDiscounts.find( used => used.discountId === discountId );
		if ( !isAlreadyMarked ) {
			console.log( `::: DEBUG : Marking Discount as Used : ${discountId}` );

			// UPDATE : Create new array to for state-based render update
			this.setState( state => {
				// USED : Update the used list with our fully-built discount obj (includes image_url)
				const appliedDiscount = state.discountsToApply.find( discount => discount.discountId === discountId );
		    	const updatedUsedList = appliedDiscount ? state.usedDiscounts.concat( [ appliedDiscount ] ) : state.usedDiscounts;
		    	
		    	// TO APPLY : Remove the now applied discount from the manifest of those to apply still
		    	const updatedApplyList = state.discountsToApply.filter( discount => discount.discountId !== discountId );
		    	const discountsToApply = [].concat( updatedApplyList );

		    	// SAVE : Save our data before updating the app, in case user leaves site
		    	$.cookie( 'BOL_used_discounts', JSON.stringify( updatedUsedList ), { expires: 60 } );
		    	
		    	return { 
		    		discountsToApply,
		    		usedDiscounts: updatedUsedList
		    	};
		    });
		}
	}

	rejectDiscount( discountId ) {

	}



	render() {
		const { 
			cartTotal, 
			discountsToApply, 
			doNotShowAgain, 
			removedDiscounts, 
			usedDiscounts 
		} = this.state;


		// DISCOUNTS : Do we have discounts that need application?
		if ( discountsToApply.length > 0 ) {
			console.log( '::: DEBUG : We have discounts to apply : ' + JSON.stringify( discountsToApply ) );
		
		} else {
			console.log( '::: DEBUG : No discount rules were met for the current cart...' );
		}


		return (
			<div id="react-discount-manager" data-component="DiscountManager">
				<DiscountModal 
					cartTotal={ cartTotal }
					confirmRemoval={ this.confirmRemoval }
					discountsToApply={ discountsToApply }
					doNotShowAgain={ doNotShowAgain }
					enableDoNotShowAgain ={ this.enableDoNotShowAgain }
					markDiscountUsed={ this.markDiscountUsed }
					removedDiscounts={ removedDiscounts }
					usedDiscounts={ usedDiscounts } />
			</div>
		);
	}
}

module.exports = DiscountManager;








































































