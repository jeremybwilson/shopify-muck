// Override Settings
var bcSfFilterSettings = {
    general: {
       limit: bcSfFilterConfig.custom.products_per_page,
        // Optional
        loadProductFirst: true,
        refineByHorizontalPosition: 'top'
    },
    selector: {
        products: '#product-loop'
    }
};

var bcSfFilterTemplate = {
    'saleLabelHtml': '<div class="sale-item icn">' + bcSfFilterConfig.label.sale + '</div>',
    'soldOutLabelHtml': '<div class="so icn">' + bcSfFilterConfig.label.sold_out + '</div>',
    'newLabelHtml': '<div class="new icn">' + bcSfFilterConfig.label.new + '</div>',
    'vendorHtml': '<p>{{itemVendorLabel}}</p>',

    // Grid Template
    'productGridItemHtml':  '<div class="product-index {{itemGridWidthClass}}" data-alpha="{{itemTitle}}" data-price="{{itemPriceAttr}}">' +
                                '<div class="prod-container">' +
                                    '{{itemNewLabel}}' +
                                    '{{itemSaleLabel}}' +
                                    '{{itemSoldoutLabel}}' +
                                    '{{itemPreorderLabel}}' +

                                    '<div class="prod-image">' +
                                        '<a href="{{itemUrl}}" title="{{itemTitle}}">' +
                                        '<div class="reveal">' +
                                            '<img src="{{itemThumbUrl}}" alt="{{itemTitle}}" />' +
                                            '{{itemFlipImage}}' +
                                        '</div>' +
                                    '</div>' +
                                '</div>' +

                                '<div class="product-info">' +
                                    '{{itemSwatch}}' +
                                    '<a class="product-title-wrap" href="{{itemUrl}}"> ' +
                                        '{{itemVendor}}' +
                                        '<h3 class="product-title">{{itemTitle}}</h3>' +
                                    '</a>' +
                                    '<div class="product-price-wrap">{{itemPrice}}</div>' +
                                '</div>' +
                                '{{itemQuickview}}' +
                            '</div>',

    // Pagination Template
    'previousHtml': '<a href="{{itemUrl}}"><i class="fa fa-angle-left" aria-hidden="true"></i></a>',
    'nextHtml': '<a href="{{itemUrl}}"><i class="fa fa-angle-right" aria-hidden="true"></i></a>',
    'pageItemHtml': '<a href="{{itemUrl}}">{{itemTitle}}</a>',
    'pageItemSelectedHtml': '<span class="current">{{itemTitle}}</span>',
    'pageItemRemainHtml': '{{itemTitle}}',
    'paginateHtml': '<span class="count"></span>{{previous}}{{pageItems}}{{next}}',
  
    // Sorting Template
    'sortingHtml': '<h4 class="sort-label">' + bcSfFilterConfig.label.sorting + '</h4><select class="styled-select">{{sortingItems}}</select>'
};



BCSfFilter.prototype.buildProductGridItem = function(data, index, totalProduct) {
    /*** Prepare data ***/
    var images = data.images_info;
     // Displaying price base on the policy of Shopify, have to multiple by 100
    var soldOut = !data.available; // Check a product is out of stock
    var onSale = data.compare_at_price_min > data.price_min; // Check a product is on sale
    var priceVaries = data.price_min != data.price_max; // Check a product has many prices
    // Get First Variant (selected_or_first_available_variant)
    var firstVariant = data['variants'][0];
    if (getParam('variant') !== null && getParam('variant') != '') {
        var paramVariant = data.variants.filter(function(e) { return e.id == getParam('variant'); });
        if (typeof paramVariant[0] !== 'undefined') firstVariant = paramVariant[0];
    } else {
        for (var i = 0; i < data['variants'].length; i++) {
            if (data['variants'][i].available) {
                firstVariant = data['variants'][i];
                break;
            }
        }
    }
    /*** End Prepare data ***/
  
    // Get Template
    var itemHtml = bcSfFilterTemplate.productGridItemHtml;

    // Add itemGridWidthClass
    var itemGridWidthClass = '';
    switch (bcSfFilterConfig.custom.products_per_row) {
        case 2: itemGridWidthClass = 'desktop-6 tablet-3 mobile-half'; break;
        case 3: itemGridWidthClass = 'desktop-4 tablet-2 mobile-half'; break;
        case 4: itemGridWidthClass = 'desktop-3 tablet-2 mobile-half'; break;
        default: break;
    }
    itemHtml = itemHtml.replace(/{{itemGridWidthClass}}/g, itemGridWidthClass);

    // Add Label
    var itemNewLabelHtml = '';
    var itemSaleLabelHtml = '';
    var itemSoldoutLabelHtml = '';
    if (!soldOut) {
        var newLabel = data.collections.filter(function(e) { return e.handle == 'new'; });
        itemNewLabelHtml = typeof newLabel[0] != 'undefined' ? bcSfFilterTemplate.newLabelHtml : '';

        if (onSale) {
            itemSaleLabelHtml = bcSfFilterTemplate.saleLabelHtml;
        }
    } else {
        itemSoldoutLabelHtml = bcSfFilterTemplate.soldOutLabelHtml;
    }
    itemHtml = itemHtml.replace(/{{itemNewLabel}}/g, itemNewLabelHtml);
    itemHtml = itemHtml.replace(/{{itemSaleLabel}}/g, itemSaleLabelHtml);
    itemHtml = itemHtml.replace(/{{itemSoldoutLabel}}/g, itemSoldoutLabelHtml);
    itemHtml = itemHtml.replace(/{{itemPreorderLabel}}/g, '');

    // Add Thumbnail
    var itemThumbUrl = images.length > 0 ? this.optimizeImage(images[0]['src']) : bcSfFilterConfig.general.no_image_url;
    itemHtml = itemHtml.replace(/{{itemThumbUrl}}/g, itemThumbUrl);
    
    // Add Flip Image
    var itemFlipImageHtml = '';
    if (bcSfFilterConfig.custom.image_flip && images.length > 1) {
        itemFlipImageHtml = '<div class="hidden">';
        itemFlipImageHtml += '<img src="' + this.optimizeImage(images[1]['src']) + '" alt="{{itemTitle}}" />';
        itemFlipImageHtml += '</div>';
    }
    itemHtml = itemHtml.replace(/{{itemFlipImage}}/g, itemFlipImageHtml);

    // Add Vendor
    var itemVendorHtml = bcSfFilterConfig.custom.vendor_enable ? bcSfFilterTemplate.vendorHtml.replace(/{{itemVendorLabel}}/g, data.vendor) : '';
    itemHtml = itemHtml.replace(/{{itemVendor}}/g, itemVendorHtml);

    // Add price
    var itemPriceHtml = '';
    if (onSale) {
        itemPriceHtml += '<div class="was">' + this.formatMoney(data.compare_at_price_min, this.moneyFormat) + '</div>';
        itemPriceHtml += '<div class="onsale">' + this.formatMoney(data.price_min, this.moneyFormat) + '</div>';
        
    } else {
        itemPriceHtml += '<div class="prod-price">';
        
        if (priceVaries) {
            itemPriceHtml += bcSfFilterConfig.label.from_price + ' ' + this.formatMoney(data.price_min, this.moneyFormat) + ' - ' + this.formatMoney(data.price_max, this.moneyFormat);
        } else {
            itemPriceHtml += this.formatMoney(data.price_min, this.moneyFormat);
        }
        
        itemPriceHtml += '</div>';
    }
    itemHtml = itemHtml.replace(/{{itemPrice}}/g, itemPriceHtml);

    // Add Quick view
    var itemQuickviewHtml = '';
    if (bcSfFilterConfig.custom.quick_view_enable) {
        itemQuickviewHtml += '<a class="fancybox.ajax product-modal" href="{{itemUrl}}?view=quick">' + bcSfFilterConfig.label.quick_view + '</a>';
    }
    itemHtml = itemHtml.replace(/{{itemQuickview}}/g, itemQuickviewHtml);

    // Add variant
    var itemSwatchHtml = '';
    if (bcSfFilterConfig.custom.alternate_colors) {
        var optionIndex = data.options_with_values.findIndex(function(e) { return (e.name).toLowerCase() == 'color' || (e.name).toLowerCase() == 'colour'; });
        var options = data.options_with_values.filter(function(e) { return (e.name).toLowerCase() == 'color' || (e.name).toLowerCase() == 'colour'; });
        if (typeof options[0] !== 'undefined') {
            itemSwatchHtml += '<div class="col-swatch">';
            itemSwatchHtml += '<ul class="' + this.slugify(options[0]['name']) + 'options " data-option-index="' + optionIndex + '">';
            for (var k = 0; k < options[0]['values'].length; k++) {
                var option = options[0]['values'][k];
                var value = option['title'];
                var imageIndex = option['image'];
                var variantImage = '';
                if (typeof data['images'][imageIndex] !== 'undefined') {
                    variantImage = this.optimizeImage(data['images'][imageIndex]['src']);
                }
                var color = value.split(' ').length > 1 ? value.split(' ')[1] : value;
                itemSwatchHtml += '<li data-option-title="' + value + '" data-href="' + variantImage + '" class="color ' + this.slugify(value) + '">';
                if (color == 'white') {
                    itemSwatchHtml += '<span style="border: 1px solid #ccc; background-color: ' + color + '; background-image: url(' + bcSfFilterConfig.general.asset_url.replace('bc-sf-filter.js', this.slugify(value) + '.png') + ')"></span>';
                } else {
                    itemSwatchHtml += '<span style="background-color: ' + color + '; background-image: url(' + bcSfFilterConfig.general.asset_url.replace('bc-sf-filter.js', this.slugify(value) + '.png') + ')"></span>';
                }
                itemSwatchHtml += '</li>';
            }
            itemSwatchHtml += '</ul></div>';
        }
    }
    itemHtml = itemHtml.replace(/{{itemSwatch}}/g, itemSwatchHtml);
  
    // Add main attribute
    itemHtml = itemHtml.replace(/{{itemPriceAttr}}/g, data.price_min);
    itemHtml = itemHtml.replace(/{{itemId}}/g, data.id);
    itemHtml = itemHtml.replace(/{{itemTitle}}/g, data.title);
    itemHtml = itemHtml.replace(/{{itemHandle}}/g, data.handle);
    itemHtml = itemHtml.replace(/{{itemUrl}}/g, this.buildProductItemUrl(data));

    return itemHtml;
}

// Build Pagination
BCSfFilter.prototype.buildPagination = function(totalProduct) {
    // Get page info
    var currentPage = parseInt(this.queryParams.page);
    var totalPage = Math.ceil(totalProduct / this.queryParams.limit);

    // If it has only one page, clear Pagination
    if (totalPage == 1) {
        jQ(this.selector.pagination).html('');
        return false;
    }

    if (this.getSettingValue('general.paginationType') == 'default') {
        var paginationHtml = bcSfFilterTemplate.paginateHtml;

        // Build Previous
        var previousHtml = (currentPage > 1) ? bcSfFilterTemplate.previousHtml : '';
        previousHtml = previousHtml.replace(/{{itemUrl}}/g, this.buildToolbarLink('page', currentPage, currentPage - 1));
        paginationHtml = paginationHtml.replace(/{{previous}}/g, previousHtml);

        // Build Next
        var nextHtml = (currentPage < totalPage) ? bcSfFilterTemplate.nextHtml : '';
        nextHtml = nextHtml.replace(/{{itemUrl}}/g, this.buildToolbarLink('page', currentPage, currentPage + 1));
        paginationHtml = paginationHtml.replace(/{{next}}/g, nextHtml);

        // Create page items array
        var beforeCurrentPageArr = [];
        for (var iBefore = currentPage - 1; iBefore > currentPage - 3 && iBefore > 0; iBefore--) {
            beforeCurrentPageArr.unshift(iBefore);
        }
        if (currentPage - 4 > 0) {
            beforeCurrentPageArr.unshift('...');
        }
        if (currentPage - 4 >= 0) {
            beforeCurrentPageArr.unshift(1);
        }
        beforeCurrentPageArr.push(currentPage);

        var afterCurrentPageArr = [];
        for (var iAfter = currentPage + 1; iAfter < currentPage + 3 && iAfter <= totalPage; iAfter++) {
            afterCurrentPageArr.push(iAfter);
        }
        if (currentPage + 3 < totalPage) {
            afterCurrentPageArr.push('...');
        }
        if (currentPage + 3 <= totalPage) {
            afterCurrentPageArr.push(totalPage);
        }

        // Build page items
        var pageItemsHtml = '';
        var pageArr = beforeCurrentPageArr.concat(afterCurrentPageArr);
        for (var iPage in pageArr) {
            if (pageArr[iPage] == '...') {
                pageItemsHtml += bcSfFilterTemplate.pageItemRemainHtml;
            } else {
                pageItemsHtml += (pageArr[iPage] == currentPage) ? bcSfFilterTemplate.pageItemSelectedHtml : bcSfFilterTemplate.pageItemHtml;
            }
            pageItemsHtml = pageItemsHtml.replace(/{{itemTitle}}/g, pageArr[iPage]);
            pageItemsHtml = pageItemsHtml.replace(/{{itemUrl}}/g, this.buildToolbarLink('page', currentPage, pageArr[iPage]));
        }
        paginationHtml = paginationHtml.replace(/{{pageItems}}/g, pageItemsHtml);

        jQ(this.selector.pagination).html(paginationHtml);
    }
};

// Build Sorting
BCSfFilter.prototype.buildFilterSorting = function() {
    if (bcSfFilterTemplate.hasOwnProperty('sortingHtml')) {
        jQ(this.selector.topSorting).html('');

        var sortingArr = this.getSortingList();
        if (sortingArr) {
            // Build content 
            var sortingItemsHtml = '';
            for (var k in sortingArr) {
                sortingItemsHtml += '<option value="' + k +'">' + sortingArr[k] + '</option>';
            }
            var html = bcSfFilterTemplate.sortingHtml.replace(/{{sortingItems}}/g, sortingItemsHtml);
            jQ(this.selector.topSorting).html(html);

            // Set current value
            jQ(this.selector.topSorting + ' select').val(this.queryParams.sort);
        }
    }
};

// Build additional attributes of product items
BCSfFilter.prototype.buildExtrasProductList = function(data) {
    if ($(window).width() >= 980) {
        $('.product-index').hover(function(){ 
            $(this).children('.product-modal').show();
        }, function(){ 
            $(this).children('.product-modal').hide(); 
        })
        // Call Fancybox for product modal + stop scroll to top 
        $('.product-modal').fancybox({
            helpers: {
                overlay: {
                    locked: false
                }
            }
        });    
    }
};

// Build Additional Elements
BCSfFilter.prototype.buildAdditionalElements = function(data, eventType) {

    // RESULTS COUNT : Render number of results in current collection 
    var resultsDiv = document.getElementById( 'results-count' );
    resultsDiv.innerHTML = data.total_product + " Results";


    // Build number of products (BoostCommerce Code)
    var from = this.queryParams.page == 1 ? this.queryParams.page : (this.queryParams.page - 1) * this.queryParams.limit + 1;
    var to = from + data.products.length - 1;
    jQ(this.selector.bottomPagination).find('.count').html(bcSfFilterConfig.label.showing_items + ' ' + from + '-' + to + ' ' +  bcSfFilterConfig.label.pagination_of + ' ' + data.total_product);


    // FILTER SELECTION COUNTS : Indicates how many filters in each set are selected
    var updateFilterCounts = function() {
        var ui = {
            filterSetWraps: '.bc-sf-filter-option-block-list', //Generated by filter js, DON'T store dom reference here
            filterHeaderText: '.bc-sf-filter-block-title span', // Text for filter headers, appending the count here
            selectedInputs: 'input.selected'
        }
        
        // SETS : If we have them, find the selected items in each and set a data-attr for the current count
        var filterSets = $( ui.filterSetWraps ) || [];
        filterSets.each( function() {
            var selections = $(this).find( ui.selectedInputs ) || [];

            // COUNT : If selections, count & store to data-selected-filter-count prop
            if ( selections.length > 0 ) {
                $(this).attr( 'data-selected-filter-count', selections.length ); //SET : Parent Set Wrapper block, used by 'clear' button styles
                $(this).find( ui.filterHeaderText ).attr( 'data-selected-filter-count', selections.length ); // SET : Actual Span so CSS can read value to show
            }
        });
    }

    updateFilterCounts();
};

    // Build Default layout
function buildDefaultLink(a,b){var c=window.location.href.split("?")[0];return c+="?"+a+"="+b}BCSfFilter.prototype.buildDefaultElements=function(a){if(bcSfFilterConfig.general.hasOwnProperty("collection_count")&&jQ("#bc-sf-filter-bottom-pagination").length>0){var b=bcSfFilterConfig.general.collection_count,c=parseInt(this.queryParams.page),d=Math.ceil(b/this.queryParams.limit);if(1==d)return jQ(this.selector.pagination).html(""),!1;if("default"==this.getSettingValue("general.paginationType")){var e=bcSfFilterTemplate.paginateHtml,f="";f=c>1?bcSfFilterTemplate.hasOwnProperty("previousActiveHtml")?bcSfFilterTemplate.previousActiveHtml:bcSfFilterTemplate.previousHtml:bcSfFilterTemplate.hasOwnProperty("previousDisabledHtml")?bcSfFilterTemplate.previousDisabledHtml:"",f=f.replace(/{{itemUrl}}/g,buildDefaultLink("page",c-1)),e=e.replace(/{{previous}}/g,f);var g="";g=c<d?bcSfFilterTemplate.hasOwnProperty("nextActiveHtml")?bcSfFilterTemplate.nextActiveHtml:bcSfFilterTemplate.nextHtml:bcSfFilterTemplate.hasOwnProperty("nextDisabledHtml")?bcSfFilterTemplate.nextDisabledHtml:"",g=g.replace(/{{itemUrl}}/g,buildDefaultLink("page",c+1)),e=e.replace(/{{next}}/g,g);for(var h=[],i=c-1;i>c-3&&i>0;i--)h.unshift(i);c-4>0&&h.unshift("..."),c-4>=0&&h.unshift(1),h.push(c);for(var j=[],k=c+1;k<c+3&&k<=d;k++)j.push(k);c+3<d&&j.push("..."),c+3<=d&&j.push(d);for(var l="",m=h.concat(j),n=0;n<m.length;n++)"..."==m[n]?l+=bcSfFilterTemplate.pageItemRemainHtml:l+=m[n]==c?bcSfFilterTemplate.pageItemSelectedHtml:bcSfFilterTemplate.pageItemHtml,l=l.replace(/{{itemTitle}}/g,m[n]),l=l.replace(/{{itemUrl}}/g,buildDefaultLink("page",m[n]));e=e.replace(/{{pageItems}}/g,l),jQ(this.selector.pagination).html(e)}}if(bcSfFilterTemplate.hasOwnProperty("sortingHtml")&&jQ(this.selector.topSorting).length>0){jQ(this.selector.topSorting).html("");var o=this.getSortingList();if(o){var p="";for(var q in o)p+='<option value="'+q+'">'+o[q]+"</option>";var r=bcSfFilterTemplate.sortingHtml.replace(/{{sortingItems}}/g,p);jQ(this.selector.topSorting).html(r);var s=void 0!==this.queryParams.sort_by?this.queryParams.sort_by:this.defaultSorting;jQ(this.selector.topSorting+" select").val(s),jQ(this.selector.topSorting+" select").change(function(a){window.location.href=buildDefaultLink("sort_by",jQ(this).val())})}}};

    // Customize data to suit the data of Shopify API
BCSfFilter.prototype.prepareProductData=function(data){for(var k=0;k<data.length;k++){data[k]['images']=data[k]['images_info'];if(data[k]['images'].length>0){data[k]['featured_image']=data[k]['images'][0]}else{data[k]['featured_image']={src:bcSfFilterConfig.general.no_image_url,width:'',height:'',aspect_ratio:0}}data[k]['url']='/products/'+data[k].handle;var optionsArr=[];for(var i=0;i<data[k]['options_with_values'].length;i++){optionsArr.push(data[k]['options_with_values'][i]['name'])}data[k]['options']=optionsArr;data[k]['price_min']*=100,data[k]['price_max']*=100,data[k]['compare_at_price_min']*=100,data[k]['compare_at_price_max']*=100;data[k]['price']=data[k]['price_min'];data[k]['compare_at_price']=data[k]['compare_at_price_min'];data[k]['price_varies']=data[k]['price_min']!=data[k]['price_max'];var firstVariant=data[k]['variants'][0];if(getParam('variant')!==null&&getParam('variant')!=''){var paramVariant=data.variants.filter(function(e){return e.id==getParam('variant')});if(typeof paramVariant[0]!=='undefined')firstVariant=paramVariant[0]}else{for(var i=0;i<data[k]['variants'].length;i++){if(data[k]['variants'][i].available){firstVariant=data[k]['variants'][i];break}}}data[k]['selected_or_first_available_variant']=firstVariant;for(var i=0;i<data[k]['variants'].length;i++){var variantOptionArr=[];var count=1;var variant=data[k]['variants'][i];var variantOptions=variant['merged_options'];if(Array.isArray(variantOptions)){for(var j=0;j<variantOptions.length;j++){var temp=variantOptions[j].split(':');data[k]['variants'][i]['option'+(parseInt(j)+1)]=temp[1];data[k]['variants'][i]['option_'+temp[0]]=temp[1];variantOptionArr.push(temp[1])}data[k]['variants'][i]['options']=variantOptionArr}data[k]['variants'][i]['compare_at_price']=parseFloat(data[k]['variants'][i]['compare_at_price'])*100;data[k]['variants'][i]['price']=parseFloat(data[k]['variants'][i]['price'])*100}data[k]['description']=data[k]['content']=data[k]['body_html']}return data};