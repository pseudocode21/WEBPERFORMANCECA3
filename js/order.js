$(document).ready(function() {
    // Initialize order page with items from localStorage
    initializeOrderPage();
    
    // Listen for custom cart update events
    document.addEventListener('cartUpdated', function() {
        initializeOrderPage();
    });
    
    // Update totals based on current quantities
    function updateTotals() {
        let subtotal = 0;
        
        // Calculate subtotal from all items
        $('.order-item').each(function() {
            const price = parseFloat($(this).find('.order-item-price').text().replace('$', ''));
            if (!isNaN(price)) {
                subtotal += price;
            }
        });
        
        // Calculate tax, delivery fee, and final total
        const TAX_RATE = 0.05; // 5%
        const DELIVERY_FEE = 2.50;
        const tax = subtotal * TAX_RATE;
        const total = subtotal + tax + DELIVERY_FEE;
        
        // Update display
        $('.order-total-row:eq(0) span:eq(1)').text('$' + subtotal.toFixed(2));
        $('.order-total-row:eq(2) span:eq(1)').text('$' + tax.toFixed(2));
        $('.order-total-row.final span:eq(1)').text('$' + total.toFixed(2));
        
        // Update cart badge count
        updateCartBadge();
    }
    
    // Update the cart badge with total quantity
    function updateCartBadge() {
        let totalItems = 0;
        const cart = getCart();
        
        // Count items directly from localStorage
        cart.forEach(item => {
            totalItems += item.quantity;
        });
        
        // Update badge
        $('.badge').text(totalItems);
    }
    
    // Initialize order page with cart items
    function initializeOrderPage() {
        const cart = getCart();
        
        // Clear existing items
        $('.order-items').empty();
        
        if (cart.length === 0) {
            // Show empty cart message
            $('.order-items').html('<p class="empty-cart">Your cart is empty. <a href="foods.html">Browse foods</a> to add items.</p>');
        } else {
            // Add cart items to order page
            for (const item of cart) {
                addItemToOrderPage(item);
            }
        }
        
        // Update totals
        updateTotals();
        
        console.log("Order page initialized with cart items: ", cart);
    }
    
    // Get cart from localStorage
    function getCart() {
        return JSON.parse(localStorage.getItem('foodCart')) || [];
    }
    
    // Save cart to localStorage
    function saveCart(cart) {
        localStorage.setItem('foodCart', JSON.stringify(cart));
        
        // Dispatch a custom event to notify other pages
        const event = new Event('cartUpdated');
        document.dispatchEvent(event);
    }
    
    // Add item to order page
    function addItemToOrderPage(item) {
        const orderItem = `
            <div class="order-item" data-name="${item.name}">
                <div class="order-item-img">
                    <img src="${item.image}" alt="${item.name}" />
                </div>
                <div class="order-item-info">
                    <div class="order-item-name">${item.name}</div>
                    <div class="order-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                    <div class="order-item-quantity">
                        <button class="quantity-btn decrease">-</button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-btn increase">+</button>
                    </div>
                </div>
                <div class="order-item-remove">
                    <i class="fa fa-trash"></i>
                </div>
            </div>
        `;
        
        $('.order-items').append(orderItem);
    }
    
    // Update cart item quantity
    function updateCartItemQuantity(itemName, newQuantity) {
        let cart = getCart();
        
        // Find the item
        const itemIndex = cart.findIndex(item => item.name === itemName);
        
        if (itemIndex !== -1) {
            // Update quantity
            cart[itemIndex].quantity = newQuantity;
            
            // Update price in order item
            const itemPrice = cart[itemIndex].price;
            const $orderItem = $(`.order-item[data-name="${itemName}"]`);
            $orderItem.find('.order-item-price').text('$' + (itemPrice * newQuantity).toFixed(2));
            
            // Save updated cart
            saveCart(cart);
            
            // Update totals
            updateTotals();
        }
    }
    
    // Remove item from cart
    function removeCartItem(itemName) {
        let cart = getCart();
        
        // Filter out the removed item
        cart = cart.filter(item => item.name !== itemName);
        
        // Save updated cart
        saveCart(cart);
        
        // Check if cart is empty
        if (cart.length === 0) {
            $('.order-items').html('<p class="empty-cart">Your cart is empty. <a href="foods.html">Browse foods</a> to add items.</p>');
        }
        
        // Update totals
        updateTotals();
    }
    
    // Increase quantity
    $(document).on('click', '.quantity-btn.increase', function() {
        const quantitySpan = $(this).siblings('.quantity-value');
        let quantity = parseInt(quantitySpan.text());
        const newQuantity = quantity + 1;
        quantitySpan.text(newQuantity);
        
        // Update in localStorage
        const itemName = $(this).closest('.order-item').data('name');
        updateCartItemQuantity(itemName, newQuantity);
        
        // Add animation effect
        $(this).closest('.order-item').fadeOut(100).fadeIn(100);
    });
    
    // Decrease quantity
    $(document).on('click', '.quantity-btn.decrease', function() {
        const quantitySpan = $(this).siblings('.quantity-value');
        let quantity = parseInt(quantitySpan.text());
        if (quantity > 1) {
            const newQuantity = quantity - 1;
            quantitySpan.text(newQuantity);
            
            // Update in localStorage
            const itemName = $(this).closest('.order-item').data('name');
            updateCartItemQuantity(itemName, newQuantity);
            
            // Add animation effect
            $(this).closest('.order-item').fadeOut(100).fadeIn(100);
        }
    });
    
    // Remove item
    $(document).on('click', '.order-item-remove', function() {
        const $orderItem = $(this).closest('.order-item');
        const itemName = $orderItem.data('name');
        
        $orderItem.slideUp(300, function() {
            $(this).remove();
            
            // Remove from localStorage
            removeCartItem(itemName);
        });
    });
    
    // Payment method selection
    $('.payment-method').on('click', function() {
        $('.payment-method').removeClass('active');
        $(this).addClass('active');
    });
    
    // Form submission
    $('form').on('submit', function(e) {
        e.preventDefault();
        
        // Check if there are items in the order
        if ($('.order-item').length === 0) {
            alert('Please add items to your order before proceeding.');
            return;
        }
        
        // Form validation
        if (validateForm()) {
            // Show order confirmation modal
            showOrderConfirmation();
            
            // Clear cart after successful order
            localStorage.removeItem('foodCart');
        }
    });
    
    // Validate form
    function validateForm() {
        let valid = true;
        $('form input, form textarea').each(function() {
            if ($(this).prop('required') && !$(this).val().trim()) {
                $(this).addClass('error');
                valid = false;
            } else {
                $(this).removeClass('error');
            }
        });
        
        if (!valid) {
            alert('Please fill in all required fields.');
        }
        
        return valid;
    }
    
    // Show order confirmation
    function showOrderConfirmation() {
        // Create modal HTML
        const modal = `
            <div class="order-modal">
                <div class="order-modal-content">
                    <div class="order-modal-header">
                        <h3>Order Confirmation</h3>
                        <span class="close-modal">&times;</span>
                    </div>
                    <div class="order-modal-body">
                        <div class="confirmation-icon">
                            <i class="fa fa-check-circle"></i>
                        </div>
                        <p>Thank you for your order!</p>
                        <p>Your order has been placed successfully.</p>
                        <p>Order details have been sent to your email.</p>
                        <p>Estimated delivery time: 30-45 minutes</p>
                    </div>
                    <div class="order-modal-footer">
                        <button class="btn-primary" id="continue-shopping">Continue Shopping</button>
                    </div>
                </div>
            </div>
        `;
        
        // Add modal to body
        $('body').append(modal);
        
        // Add modal styles
        $('<style>')
            .text(`
                .order-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.7);
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: fadeIn 0.3s ease;
                }
                .order-modal-content {
                    background: white;
                    border-radius: 15px;
                    width: 90%;
                    max-width: 500px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                    animation: slideIn 0.4s ease;
                    overflow: hidden;
                }
                .order-modal-header {
                    padding: 20px;
                    border-bottom: 1px solid #eee;
                    position: relative;
                }
                .order-modal-header h3 {
                    margin: 0;
                    color: #333;
                }
                .close-modal {
                    position: absolute;
                    right: 20px;
                    top: 20px;
                    font-size: 24px;
                    cursor: pointer;
                    color: #999;
                    transition: all 0.3s ease;
                }
                .close-modal:hover {
                    color: rgb(226, 74, 74);
                }
                .order-modal-body {
                    padding: 30px;
                    text-align: center;
                }
                .confirmation-icon {
                    font-size: 60px;
                    color: #4cd137;
                    margin-bottom: 20px;
                    animation: pulse 2s infinite;
                }
                .order-modal-body p {
                    margin-bottom: 10px;
                    color: #666;
                    font-size: 16px;
                }
                .order-modal-body p:first-of-type {
                    font-size: 22px;
                    color: #333;
                    font-weight: 600;
                    margin-bottom: 15px;
                }
                .order-modal-footer {
                    padding: 20px;
                    text-align: center;
                    border-top: 1px solid #eee;
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideIn {
                    from { transform: translateY(-50px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                    100% { transform: scale(1); }
                }
                .empty-cart {
                    text-align: center;
                    padding: 30px 0;
                    color: #666;
                }
                .empty-cart a {
                    color: rgb(226, 74, 74);
                    font-weight: 500;
                }
                .error {
                    border-color: rgb(226, 74, 74) !important;
                    box-shadow: 0 0 0 3px rgba(226, 74, 74, 0.2) !important;
                }
            `)
            .appendTo('head');
        
        // Close modal events
        $('.close-modal, #continue-shopping').on('click', function() {
            $('.order-modal').fadeOut(300, function() {
                $(this).remove();
                window.location.href = 'foods.html';
            });
        });
    }
    
    // Watch for localStorage changes
    window.addEventListener('storage', function(e) {
        if (e.key === 'foodCart') {
            initializeOrderPage();
        }
    });
}); 