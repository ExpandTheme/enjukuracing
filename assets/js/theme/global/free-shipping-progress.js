import $ from 'jquery';

export default function(context, updatedCartTotal) {



    if(updatedCartTotal){
        var cartTotal = updatedCartTotal;
    }else{
        var cartTotal = context.cartTotal;
    }

    console.log(cartTotal);

    const currency_token = context.money.currency_token;
    const cart_amount = cartTotal;
    const target_amount = 500;
    const cart_amount_remain = target_amount - cart_amount;
    const cart_amount_percent = (cart_amount * 100) / target_amount;

    const shipping_progress_bar = $('[data-shipping-progress="bar"]');
    const shipping_progress_init = $('[data-shipping-progress="init"]');
    const shipping_progress_target = $('[data-shipping-progress="target"]');
    const shipping_progress_remain_amount = $('[data-shipping-progress="remain-amount"]');
    const shipping_progress_remain_label = $('[data-shipping-progress="label"]');

    shipping_progress_target.html(currency_token + target_amount);
    shipping_progress_init.html(currency_token + '0');
    shipping_progress_remain_amount.html(currency_token + cart_amount_remain.toFixed(2));
    shipping_progress_bar.removeClass("red yellow green");

    if (cart_amount_percent <= 20) {
        shipping_progress_bar.addClass("red");
    } else if (cart_amount_percent <= 50) {
        shipping_progress_bar.addClass("yellow");
    } else {
        shipping_progress_bar.addClass("green");
    }

    if (cart_amount_percent >= 100) {
        shipping_progress_bar.css('width', '100%');
        shipping_progress_remain_label.html("Congratulations! You've got Free Shipping!");
    } else {
        shipping_progress_bar.css('width', cart_amount_percent + '%');
        shipping_progress_remain_label.html(`You’re only ${currency_token + cart_amount_remain.toFixed(2)} away from free shipping!`);
    }

}
