$(function () {
  // Main Menu JS
  $(window).scroll(function () {
    if ($(this).scrollTop() < 50) {
      $("nav").removeClass("site-top-nav");
      $("#back-to-top").removeClass("visible");
    } else {
      $("nav").addClass("site-top-nav");
      $("#back-to-top").addClass("visible");
    }
  });

  // Shopping Cart Toggle JS
  $("#shopping-cart").on("click", function (e) {
    e.preventDefault();
    $("#cart-content").toggle("blind", "", 300);
    e.stopPropagation();
  });

  // Close cart when clicking outside
  $(document).on('click', function (e) {
    if (!$(e.target).closest('#cart-content, #shopping-cart').length) {
      $("#cart-content").hide("blind", "", 300);
    }
  });

  // Back-To-Top Button JS
  $("#back-to-top").click(function (event) {
    event.preventDefault();
    $("html, body").animate(
      {
        scrollTop: 0,
      },
      800
    );
  });

  // Delete Cart Item JS
  $(document).on("click", ".btn-delete", function (event) {
    event.preventDefault();
    $(this).closest("tr").fadeOut(300, function() {
      $(this).remove();
      updateTotal();
    });
  });

  // Update Total Price JS
  function updateTotal() {
    let total = 0;
    $("#cart-content tr").each(function () {
      const rowTotal = parseFloat($(this).find("td:nth-child(5)").text().replace("$", ""));
      if (!isNaN(rowTotal)) {
        total += rowTotal;
      }
    });
    $("#cart-content th:nth-child(5)").text("$" + total.toFixed(2));
    $(".tbl-full th:nth-child(6)").text("$" + total.toFixed(2));
  }

  // Add hover effects to food menu items
  $(".food-menu-box").hover(
    function() {
      $(this).find('.img-curve').css('transform', 'scale(1.05)');
    },
    function() {
      $(this).find('.img-curve').css('transform', 'scale(1)');
    }
  );

  // Handle quantity change for food items
  $(document).on("change", ".food-menu-desc input[type='number']", function() {
    const quantity = $(this).val();
    if (quantity < 1) {
      $(this).val(1);
    }
  });
  
  // Order page quantity controls
  $(document).on("click", ".qty-btn.dec", function() {
    const input = $(this).siblings("input");
    let value = parseInt(input.val());
    if (value > 1) {
      input.val(value - 1);
      updateItemPrice($(this).closest("tr"));
    }
  });
  
  $(document).on("click", ".qty-btn.inc", function() {
    const input = $(this).siblings("input");
    let value = parseInt(input.val());
    input.val(value + 1);
    updateItemPrice($(this).closest("tr"));
  });
  
  function updateItemPrice(row) {
    const price = parseFloat(row.find("td:nth-child(4)").text().replace("$", "").trim());
    const quantity = parseInt(row.find("input[type='number']").val());
    const total = price * quantity;
    
    row.find("td:nth-child(6)").text("$ " + total.toFixed(2));
    
    updateOrderTotals();
  }
  
  function updateOrderTotals() {
    let subtotal = 0;
    
    $(".tbl-full tr:not(.subtotal-row):not(.delivery-row):not(.total-row):not(:first-child)").each(function() {
      const rowTotal = parseFloat($(this).find("td:nth-child(6)").text().replace("$", "").trim());
      if (!isNaN(rowTotal)) {
        subtotal += rowTotal;
      }
    });
    
    const deliveryFee = parseFloat($(".delivery-row td:nth-child(6)").text().replace("$", "").trim()) || 2.50;
    const total = subtotal + deliveryFee;
    
    $(".subtotal-row td:nth-child(6)").text("$" + subtotal.toFixed(2));
    $(".total-row th:nth-child(6)").text("$" + total.toFixed(2));
  }
});
