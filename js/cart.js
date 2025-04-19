$(document).ready(function() {
    // Initialize cart from localStorage if available
    initializeCart();
    
    // Add to cart functionality for food menu items
    $(document).on('submit', '.food-menu-box form', function(e) {
        e.preventDefault();
        
        const $form = $(this);
        const $foodBox = $form.closest('.food-menu-box');
        
        // Get item details
        const item = {
            name: $foodBox.find('h4').text(),
            price: parseFloat($foodBox.find('.food-price').text().replace('$', '')),
            quantity: parseInt($foodBox.find('input[type="number"]').val()),
            image: $foodBox.find('img').attr('src')
        };
        
        // Add item to cart
        addToCart(item);
        
        // Show confirmation message
        showAddedToCartMessage($foodBox);
    });
    
    // Cart toggle functionality
    $('#shopping-cart').on('click', function() {
        // Update cart from localStorage before showing
        initializeCart();
        $('#cart-content').toggle('blind', '', 500);
    });
    
    // Remove item from cart
    $(document).on('click', '.btn-delete', function(e) {
        e.preventDefault();
        const $row = $(this).closest('tr');
        const itemName = $row.find('td:nth-child(2)').text();
        
        // Remove from localStorage
        removeFromCart(itemName);
        
        // Remove row with animation
        $row.fadeOut(300, function() {
            $(this).remove();
            updateTotal();
            
            // Check if cart is empty
            if ($('#cart-content table tr').length <= 2) {
                $('#cart-content table').after('<p class="empty-cart-message">Your cart is empty</p>');
                $('#cart-content .btn-primary').hide();
            }
        });
    });
    
    // Initialize cart from localStorage
    function initializeCart() {
        let cart = getCart();
        
        // Clear existing cart items
        $('#cart-content table tr:not(:first-child):not(:last-child)').remove();
        $('.empty-cart-message').remove();
        
        // Add items from localStorage
        if (cart.length > 0) {
            for (const item of cart) {
                addItemToCartTable(item);
            }
            $('#cart-content .btn-primary').show();
        } else {
            $('#cart-content table').after('<p class="empty-cart-message">Your cart is empty</p>');
            $('#cart-content .btn-primary').hide();
        }
        
        // Update totals
        updateTotal();
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
    
    // Add item to cart
    function addToCart(item) {
        let cart = getCart();
        
        // Check if item already exists
        const existingItemIndex = cart.findIndex(cartItem => cartItem.name === item.name);
        
        if (existingItemIndex !== -1) {
            // Update quantity if item exists
            cart[existingItemIndex].quantity += item.quantity;
            
            // Update row in cart table if visible
            const $existingRow = $(`#cart-content td:contains('${item.name}')`).closest('tr');
            if ($existingRow.length) {
                const newQuantity = cart[existingItemIndex].quantity;
                const itemPrice = cart[existingItemIndex].price;
                
                $existingRow.find('td:nth-child(4)').text(newQuantity);
                $existingRow.find('td:nth-child(5)').text('$ ' + (itemPrice * newQuantity).toFixed(2));
                $existingRow.hide().fadeIn(300);
            }
        } else {
            // Add new item
            cart.push(item);
            
            // Add to cart table if visible
            if ($('#cart-content').is(':visible')) {
                addItemToCartTable(item);
            }
        }
        
        // Save updated cart
        saveCart(cart);
        
        // Update cart display
        updateCartDisplay();
    }
    
    // Remove item from cart
    function removeFromCart(itemName) {
        let cart = getCart();
        
        // Filter out the removed item
        cart = cart.filter(item => item.name !== itemName);
        
        // Save updated cart
        saveCart(cart);
        
        // Update cart display
        updateCartDisplay();
    }
    
    // Add item to cart table
    function addItemToCartTable(item) {
        const itemTotal = (item.price * item.quantity).toFixed(2);
        
        // Create new row
        const newRow = `
            <tr>
                <td><img src="${item.image}" alt="${item.name}" /></td>
                <td>${item.name}</td>
                <td>$ ${item.price.toFixed(2)}</td>
                <td>${item.quantity}</td>
                <td>$ ${itemTotal}</td>
                <td><a href="#" class="btn-delete">&times;</a></td>
            </tr>
        `;
        
        // Add row before the total row
        $(newRow).insertBefore('#cart-content table tr:last-child');
    }
    
    // Update cart totals
    function updateTotal() {
        let total = 0;
        
        // Calculate total
        $('#cart-content table tr:not(:first-child):not(:last-child)').each(function() {
            const rowTotal = parseFloat($(this).find('td:nth-child(5)').text().replace('$', ''));
            if (!isNaN(rowTotal)) {
                total += rowTotal;
            }
        });
        
        // Update total display
        $('#cart-content table tr:last-child th:nth-child(2)').text('$' + total.toFixed(2));
        
        // Update badge count
        updateBadgeCount();
    }
    
    // Update cart display
    function updateCartDisplay() {
        updateTotal();
    }
    
    // Update badge count
    function updateBadgeCount() {
        let totalItems = 0;
        const cart = getCart();
        
        // Count all items directly from localStorage for consistency
        cart.forEach(item => {
            totalItems += item.quantity;
        });
        
        // Update badge
        $('.badge').text(totalItems);
    }
    
    // Show added to cart message
    function showAddedToCartMessage($foodBox) {
        // Remove any existing messages
        $('.added-message').remove();
        
        // Create message
        const $message = $(`
            <div class="added-message">
                <i class="fa fa-check-circle"></i> Added to cart!
            </div>
        `);
        
        // Add message to food box
        $foodBox.append($message);
        
        // Add styles
        $('<style>')
            .text(`
                .added-message {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: rgba(76, 209, 55, 0.9);
                    color: white;
                    padding: 15px 20px;
                    border-radius: 8px;
                    font-weight: 500;
                    animation: fadeInOut 2s ease forwards;
                    z-index: 100;
                    text-align: center;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                }
                .added-message i {
                    margin-right: 5px;
                }
                @keyframes fadeInOut {
                    0% { opacity: 0; }
                    20% { opacity: 1; }
                    80% { opacity: 1; }
                    100% { opacity: 0; }
                }
                .food-menu-box {
                    position: relative;
                }
                .empty-cart-message {
                    padding: 15px;
                    text-align: center;
                    color: #666;
                }
            `)
            .appendTo('head');
        
        // Remove message after animation
        setTimeout(function() {
            $message.remove();
        }, 2000);
    }
    
    // Initialize on load
    updateCartDisplay();
}); 