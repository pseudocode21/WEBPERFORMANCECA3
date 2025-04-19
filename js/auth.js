$(document).ready(function() {
    // Toggle password visibility
    $('.password-toggle').click(function() {
        const passwordField = $(this).prev('input');
        const type = passwordField.attr('type');
        
        if (type === 'password') {
            passwordField.attr('type', 'text');
            $(this).removeClass('fa-eye-slash').addClass('fa-eye');
        } else {
            passwordField.attr('type', 'password');
            $(this).removeClass('fa-eye').addClass('fa-eye-slash');
        }
    });

    // Form validation for login
    $('#login-form').submit(function(e) {
        let isValid = true;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const email = $('#email').val();
        const password = $('#password').val();

        // Validate email
        if (!emailRegex.test(email)) {
            $('#email').parent().addClass('error');
            isValid = false;
        } else {
            $('#email').parent().removeClass('error');
        }

        // Validate password
        if (password.length < 6) {
            $('#password').parent().addClass('error');
            isValid = false;
        } else {
            $('#password').parent().removeClass('error');
        }

        if (!isValid) {
            e.preventDefault();
        }
    });

    // Form validation for registration
    $('#register-form').submit(function(e) {
        let isValid = true;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\d{10,}$/;
        
        const name = $('#name').val();
        const email = $('#reg-email').val();
        const phone = $('#phone').val();
        const password = $('#reg-password').val();
        const confirmPassword = $('#confirm-password').val();

        // Validate name
        if (name.trim() === '') {
            $('#name').parent().addClass('error');
            isValid = false;
        } else {
            $('#name').parent().removeClass('error');
        }

        // Validate email
        if (!emailRegex.test(email)) {
            $('#reg-email').parent().addClass('error');
            isValid = false;
        } else {
            $('#reg-email').parent().removeClass('error');
        }

        // Validate phone (if provided)
        if (phone !== '' && !phoneRegex.test(phone.replace(/[^0-9]/g, ''))) {
            $('#phone').parent().addClass('error');
            isValid = false;
        } else {
            $('#phone').parent().removeClass('error');
        }

        // Validate password
        if (password.length < 6) {
            $('#reg-password').parent().addClass('error');
            isValid = false;
        } else {
            $('#reg-password').parent().removeClass('error');
        }

        // Validate password confirmation
        if (password !== confirmPassword) {
            $('#confirm-password').parent().addClass('error');
            isValid = false;
        } else {
            $('#confirm-password').parent().removeClass('error');
        }

        // Validate terms checkbox
        if (!$('#terms').is(':checked')) {
            $('#terms').parent().addClass('error');
            isValid = false;
        } else {
            $('#terms').parent().removeClass('error');
        }

        if (!isValid) {
            e.preventDefault();
        }
    });

    // Live validation as user types
    $('.form-group input').on('input', function() {
        const input = $(this);
        const inputId = input.attr('id');
        const value = input.val();

        switch(inputId) {
            case 'email':
            case 'reg-email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (emailRegex.test(value)) {
                    input.parent().removeClass('error');
                }
                break;
            case 'password':
            case 'reg-password':
                if (value.length >= 6) {
                    input.parent().removeClass('error');
                }
                break;
            case 'confirm-password':
                const password = $('#reg-password').val();
                if (value === password) {
                    input.parent().removeClass('error');
                }
                break;
            case 'name':
                if (value.trim() !== '') {
                    input.parent().removeClass('error');
                }
                break;
            case 'phone':
                const phoneRegex = /^\d{10,}$/;
                if (value === '' || phoneRegex.test(value.replace(/[^0-9]/g, ''))) {
                    input.parent().removeClass('error');
                }
                break;
        }
    });

    // Add smooth animations to form elements
    setTimeout(function() {
        $('.auth-left h2, .auth-left p').addClass('slide-in-left');
        $('.auth-right h2, .auth-right form').addClass('slide-in-right');
    }, 100);

    // Social login buttons hover effect
    $('.social-icons a').hover(
        function() {
            $(this).css('transform', 'translateY(-3px)');
        },
        function() {
            $(this).css('transform', 'translateY(0)');
        }
    );

    // Format phone number as user types
    $('#phone').on('input', function() {
        let input = $(this).val().replace(/\D/g, '');
        let formatted = '';
        
        if (input.length > 0) {
            formatted = '(' + input.substring(0, 3);
            
            if (input.length >= 4) {
                formatted += ') ' + input.substring(3, 6);
            }
            
            if (input.length >= 7) {
                formatted += '-' + input.substring(6, 10);
            }
            
            $(this).val(formatted);
        }
    });
}); 