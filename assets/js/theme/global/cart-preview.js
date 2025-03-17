import 'foundation-sites/js/foundation/foundation';
//import 'foundation-sites/js/foundation/foundation.dropdown';
import utils from '@bigcommerce/stencil-utils';

export const CartPreviewEvents = {
    close: 'closed.fndtn.dropdown',
    open: 'opened.fndtn.dropdown',
};


export default function (secureBaseUrl, cartId) {
    const loadingClass = 'is-loading';
    const $cart = $('[data-cart-preview]');
    const $cartDropdown = $('#cart-preview-dropdown');
    const $cartLoading = $('<div class="loadingOverlay"></div>');

    const $body = $('body');

    $(".et-overlay-side-cart").on("click", function(){
        $(this).removeClass('active');
        $('.et-sidecart').removeClass('active');
        $('body').removeClass("body-overflow");
    });
    
    $('[data-close-sidecart]').on("click", function(e){
        e.preventDefault();
        $('.et-overlay-side-cart').removeClass('active');
        $('.et-sidecart').removeClass('active');
        $('body').removeClass("body-overflow");
    });

    

    if (window.ApplePaySession) {
        $cartDropdown.addClass('apple-pay-supported');
    }

    $body.on('cart-quantity-update', (event, quantity) => {
        $cart.attr('aria-label', (_, prevValue) => prevValue.replace(/\d+/, quantity));

        if (!quantity) {
            $cart.addClass('navUser-item--cart__hidden-s');
        } else {
            $cart.removeClass('navUser-item--cart__hidden-s');
        }

        $('.cart-quantity')
            .text(quantity)
            .toggleClass('countPill--positive', quantity > 0);
        if (utils.tools.storage.localStorageAvailable()) {
            localStorage.setItem('cart-quantity', quantity);
        }

    });

    $cart.on('click', event => {

        const options = {
            template: 'common/cart-preview',
        };

        // Redirect to full cart page
        //
        // https://developer.mozilla.org/en-US/docs/Browser_detection_using_the_user_agent
        // In summary, we recommend looking for the string 'Mobi' anywhere in the User Agent to detect a mobile device.
        // if (/Mobi/i.test(navigator.userAgent)) {
        //     return event.stopPropagation();
        // }

        $('.et-sidecart, .et-overlay-side-cart').addClass('active');
        $("body").addClass("body-overflow");

        event.preventDefault();
        $cartDropdown
            .addClass(loadingClass)
            .html($cartLoading);
        $cartLoading
            .show();


        utils.api.cart.getContent(options, (err, response) => {
            
            setTimeout(function() { 


                var buttonPlus  = $(".et-custom-qty__btn-plus");
                var buttonMinus = $(".et-custom-qty__btn-minus");
                buttonPlus.on("click", function(){
                    var $n = $(this).parent().find(".et-custom-qty__input");
                    var $nN = $(this).parent().find(".et-custom-qty__input").val();
                    $n.val(Number($n.val())+1 );
                    var currentVal = ++$nN;
                    var updateId = $(this).attr('data-id');
                    utils.api.cart.itemUpdate(updateId, currentVal ,(err,response) =>{
                        if(response.data.status === 'succeed'){
                            utils.api.cart.getCartQuantity({ baseUrl: secureBaseUrl, cartId },(err, response) =>{
                                $('.cart-quantity').html(response);
                            });
                            const options2 = {
                                template: 'common/cart-preview',
                            };
                            utils.api.cart.getContent(options2, (err, response2) => {
                                $cartDropdown.removeClass(loadingClass).html(response2);
                                $cartLoading.hide();
                            });
                            $cart.trigger("click");
                        }
                    });
                });
                buttonMinus.on("click", function(){
                    var $n = $(this).parent().find(".et-custom-qty__input");
                    var amount = Number($n.val());
                    var $nN = $(this).parent().find(".et-custom-qty__input").val();
                    var currentVal = --$nN;
                    if (amount > 1) {
                        $n.val(amount-1);
                    }
                    var updateId = $(this).attr('data-id');
                    utils.api.cart.itemUpdate(updateId, currentVal ,(err,response) =>{
                        if(response.data.status === 'succeed'){
                            utils.api.cart.getCartQuantity({ baseUrl: secureBaseUrl, cartId },(err, response) =>{
                                $('.cart-quantity').html(response);
                            });
                            const options2 = {
                                template: 'common/cart-preview',
                            };
                            utils.api.cart.getContent(options2, (err, response2) => {
                                $cartDropdown.removeClass(loadingClass).html(response2);
                                $cartLoading.hide();
                            });
                            $cart.trigger("click");
                        }
                    });

                });

                $('.et-custom-qty__btn-plus').on("click", function(){

                    // $cartDropdown.addClass(loadingClass).html($cartLoading);
                    // $cartLoading.show();

                     
                });

                $(".et-productViewSKU").each(function(){
                    let getsku = $(this).attr('data-ajax-sku');
                    const result = getsku.split('_')[0];
                    $(this).text(result);
                });

                
                $(".et-remove-cart-item").on('click', function(){
                    $cartDropdown
                        .addClass(loadingClass)
                        .html($cartLoading);
                    $cartLoading
                        .show();

                    var removeId = $(this).attr('data-id');
                    utils.api.cart.itemRemove(removeId,(err,response) =>{

                        if(response.data.status === 'succeed'){
                            utils.api.cart.getCartQuantity({ baseUrl: secureBaseUrl, cartId },(err, response) =>{
                                $('.cart-quantity').html(response);
                            });
                            const options2 = {
                                template: 'common/cart-preview',
                            };
                            utils.api.cart.getContent(options2, (err, response2) => {
                                $cartDropdown.removeClass(loadingClass).html(response2);
                                $cartLoading.hide();
                            });
                            $cart.trigger("click");
                        }
                    });

                });
            }, 400);

            $cartDropdown
                .removeClass(loadingClass)
                .html(response);
            $cartLoading
                .hide();
        });
    });

    let quantity = 0;

    if (cartId) {


        // Get existing quantity from localStorage if found
        if (utils.tools.storage.localStorageAvailable()) {
            if (localStorage.getItem('cart-quantity')) {
                quantity = Number(localStorage.getItem('cart-quantity'));
                $body.trigger('cart-quantity-update', quantity);
            }
        }

        // Get updated cart quantity from the Cart API
        const cartQtyPromise = new Promise((resolve, reject) => {
            utils.api.cart.getCartQuantity({ baseUrl: secureBaseUrl, cartId }, (err, qty) => {
                if (err) {
                    // If this appears to be a 404 for the cart ID, set cart quantity to 0
                    if (err === 'Not Found') {
                        resolve(0);
                    } else {
                        reject(err);
                    }
                }
                resolve(qty);
            });
        });

        // If the Cart API gives us a different quantity number, update it
        cartQtyPromise.then(qty => {
            quantity = qty;
            $body.trigger('cart-quantity-update', quantity);
        });
    } else {
        $body.trigger('cart-quantity-update', quantity);
    }
}
