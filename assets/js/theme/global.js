import 'focus-within-polyfill';

import './global/jquery-migrate';
import './common/select-option-plugin';
import PageManager from './page-manager';
import quickSearch from './global/quick-search';
import currencySelector from './global/currency-selector';
import mobileMenuToggle from './global/mobile-menu-toggle';
import menu from './global/menu';
import foundation from './global/foundation';
import quickView from './global/quick-view';
import cartPreview from './global/cart-preview';
import carousel from './common/carousel';
import svgInjector from './global/svg-injector';
import freeShippingProgress from "./global/free-shipping-progress";


export default class Global extends PageManager {
    onReady() {
        const { cartId, secureBaseUrl } = this.context;
        cartPreview(secureBaseUrl, cartId);
        quickSearch();
        currencySelector(cartId);
        foundation($(document));
        quickView(this.context);
        carousel(this.context);
        menu();
        mobileMenuToggle();
        svgInjector();
        freeShippingProgress(this.context, '');
    }
}




var fstCat = jsContext.categories;
var ShopByVehicle = [
    ...(fstCat[1]), 
    ...(fstCat[4]), 
    ...(fstCat[5]), 
    ...(fstCat[6]),
    ...(fstCat[8]), 
    ...(fstCat[9]),
    ...(fstCat[10]?.children || [])
];
var selectedValue = "";

// Initially hide the reset buttons
$('#resetVehicle, #resetBrand').prop("disabled", true);

// Populate first dropdown (Make)
$.each(ShopByVehicle, function (key, value) {
    $('#make').append(`<option value="${value.url || value.id}">${value.name}</option>`);
});

// When "Make" is selected
$("#make").on("change", function () {
    $('#model').html('<option value="-1">Select Model / Part</option>').prop("disabled", true);
    $('#part').html('<option value="-1">Select Part / Sub Part</option>').prop("disabled", true);

    let makeId = $(this).val();
    let selectedCategory = ShopByVehicle.find(cat => (cat.url || cat.id) == makeId);
    selectedValue = makeId; // Update selected value

    // Show reset button for vehicle selection if an option is selected
    toggleResetVehicleButton();

    if (selectedCategory?.children?.length) {
        $.each(selectedCategory.children, function (key, value) {
            $('#model').append(`<option value="${value.url || value.id}">${value.name}</option>`).prop("disabled", false);
        });
    }
});

// When "Model / Part" is selected
$("#model").on("change", function () {
    $('#part').html('<option value="-1">Select Part / Sub Part</option>').prop("disabled", true).hide(); // Hide by default

    let modelId = $(this).val();
    let selectedModel = ShopByVehicle.find(cat => (cat.url || cat.id) == $("#make").val())?.children?.find(model => (model.url || model.id) == modelId);
    selectedValue = modelId; // Update selected value

    // Show reset button for vehicle selection if an option is selected
    toggleResetVehicleButton();

    if (selectedModel?.children?.length) {
        $.each(selectedModel.children, function (key, value) {
            $('#part').append(`<option value="${value.url || value.id}">${value.name}</option>`).prop("disabled", false).show(); // Show only if options exist
        });
    }
});

// When "Part / Sub Part" is selected
$("#part").on("change", function () {
    selectedValue = $(this).val(); // Update selected value

    // Show reset button for vehicle selection if an option is selected
    toggleResetVehicleButton();
});

// "Find Now" Button Click for Vehicle
$("#findVehicle").on("click", function () {
    if (!selectedValue || selectedValue === "-1") {
        alert("Please select a valid option!");
        return;
    }
    let url = selectedValue;
    window.open(url, "_blank"); // Opens the link in a new tab
});

// "Reset" Button Click for Vehicle
$("#resetVehicle").on("click", function () {
    // Reset Make, Model, and Part dropdowns
    $('#make').val('-1');
    $('#model').html('<option value="-1">Select Model / Part</option>').prop("disabled", true);
    $('#part').html('<option value="-1">Select Part / Sub Part</option>').prop("disabled", true);
    selectedValue = "";

    // Hide reset button after resetting
    $('#resetVehicle').prop("disabled", true);
    toggleResetVehicleButton();  // Ensure reset button is hidden if no options are selected
});

// Universal Part Selection
var UniversalParts = fstCat[11]?.children[3]?.children || []; // Fetch Universal Parts
var selectedUniversalPart = ""; // Variable to store selected universal part

// Populate Universal Part dropdown
$.each(UniversalParts, function (key, value) {
    $('#universalPart').append(`<option value="${value.url || value.id}">${value.name}</option>`);
});

// When Universal Part is selected
$("#universalPart").on("change", function () {
    selectedUniversalPart = $(this).val(); // Update selected universal part

    // Show reset button for universal part if an option is selected
    toggleResetUniversalPartButton();
});

// "Find Now" Button Click for Universal Part
$("#findUniversal").on("click", function () {
    if (!selectedUniversalPart || selectedUniversalPart === "-1") {
        alert("Please select a valid Universal Part!");
        return;
    }
    let url = selectedUniversalPart;
    window.open(url, "_blank"); // Opens the link in a new tab
});

// "Reset" Button Click for Universal Part
$("#resetUniversal").on("click", function () {
    $('#universalPart').val('-1'); // Reset Universal Part dropdown
    selectedUniversalPart = "";

    // Hide reset button after resetting
    $('#resetUniversal').hide();
    toggleResetUniversalPartButton();  // Ensure reset button is hidden if no options are selected
});

// Brand and Part Selection
var BrandParts = fstCat[12]?.children || []; // Assuming index 16 for Brand categories
var selectedBrand = ""; // Variable to store selected brand
var selectedPart = ""; // Variable to store selected part

// Populate Brand dropdown
$.each(BrandParts, function (key, value) {
    $('#selectBrand').append(`<option value="${value.url || value.id}">${value.name}</option>`);
});

// When Brand is selected
$("#selectBrand").on("change", function () {
    $('#selectPart').html('<option value="-1">Select Part</option>').prop("disabled", true).hide(); // Reset Part dropdown and hide
    let brandId = $(this).val();
    let selectedBrandCategory = BrandParts.find(brand => (brand.url || brand.id) == brandId);
    selectedBrand = brandId; // Update selected brand

    // Show reset button for brand selection if an option is selected
    toggleResetBrandButton();

    // If the selected brand has children, populate Part dropdown
    if (selectedBrandCategory?.children?.length) {
        $.each(selectedBrandCategory.children, function (key, value) {
            $('#selectPart').append(`<option value="${value.url || value.id}">${value.name}</option>`).prop("disabled", false).show(); // Show and enable if options exist
        });
    } else {
        // If no children (parts), allow to click "Find Now" with the selected brand
        $('#selectPart').hide(); // Hide Part dropdown
    }
});

// When Part is selected
$("#selectPart").on("change", function () {
    selectedPart = $(this).val(); // Update selected part

    // Show reset button for brand selection if an option is selected
    toggleResetBrandButton();
});

// "Find Now" Button Click for Brand
$("#findBrand").on("click", function () {
    if (!selectedBrand || selectedBrand === "-1") {
        alert("Please select a valid Brand!");
        return;
    }
    // If there's no selected part, we should use the selected brand link
    let url = selectedPart || selectedBrand; // If part is selected, use it, else use the brand
    window.open(url, "_blank"); // Opens the link in a new tab
});

// "Reset" Button Click for Brand
$("#resetBrand").on("click", function () {
    // Reset Brand and Part dropdowns
    $('#selectBrand').val('-1'); // Reset to default option
    $('#selectPart').html('<option value="-1">Select Part</option>').prop("disabled", true); // Reset and hide Part dropdown
    selectedBrand = ""; // Clear selected brand
    selectedPart = ""; // Clear selected part

    // Hide reset button after resetting
    $('#resetBrand').hide();
    toggleResetBrandButton();  // Ensure reset button is hidden if no options are selected
});

// Function to toggle reset button visibility for Vehicle
function toggleResetVehicleButton() {
    if ($('#make').val() !== '-1' || $('#model').val() !== '-1' || $('#part').val() !== '-1') {
        $('#resetVehicle').prop("disabled", false); // Show reset button if any option is selected
    } else {
        $('#resetVehicle').prop("disabled", true); // Hide reset button if no options are selected
    }
}

// Function to toggle reset button visibility for Universal Part
function toggleResetUniversalPartButton() {
    if ($('#universalPart').val() !== '-1') {
        $('#resetUniversal').prop("disabled", false); // Show reset button if a universal part is selected
    } else {
        $('#resetUniversal').prop("disabled", true); // Hide reset button if no universal part is selected
    }
}

// Function to toggle reset button visibility for Brand
function toggleResetBrandButton() {
    if ($('#selectBrand').val() !== '-1' || $('#selectPart').val() !== '-1') {
        $('#resetBrand').prop("disabled", false); // Show reset button if any option is selected in Brand or Part dropdown
    } else {
        $('#resetBrand').prop("disabled", true); // Hide reset button if no options are selected
    }
}
