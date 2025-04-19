/**
 * Authentication JavaScript - Handles Login & Register Form interactivity
 */

document.addEventListener('DOMContentLoaded', function() {
  // Toggle password visibility
  const togglePasswordButtons = document.querySelectorAll('.toggle-password');
  
  togglePasswordButtons.forEach(button => {
    button.addEventListener('click', function() {
      const passwordInput = this.previousElementSibling;
      
      // Toggle password visibility
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        this.classList.remove('fa-eye-slash');
        this.classList.add('fa-eye');
      } else {
        passwordInput.type = 'password';
        this.classList.remove('fa-eye');
        this.classList.add('fa-eye-slash');
      }
    });
  });
  
  // Form animations for input fields
  const inputFields = document.querySelectorAll('.input-group input');
  
  inputFields.forEach(input => {
    // Add focus animation
    input.addEventListener('focus', function() {
      this.parentElement.classList.add('focused');
    });
    
    // Remove focus animation if empty
    input.addEventListener('blur', function() {
      if (this.value === '') {
        this.parentElement.classList.remove('focused');
      }
    });
    
    // Check if input has value on load
    if (input.value !== '') {
      input.parentElement.classList.add('focused');
    }
  });
  
  // Form validation
  const forms = document.querySelectorAll('.auth-form form');
  
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      let isValid = true;
      const inputs = this.querySelectorAll('input[required]');
      
      // Validate all required fields
      inputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          showError(input, 'This field is required');
        } else {
          clearError(input);
          
          // Email validation
          if (input.type === 'email' && !isValidEmail(input.value)) {
            isValid = false;
            showError(input, 'Please enter a valid email address');
          }
          
          // Password validation on register form
          if (input.type === 'password' && input.placeholder === 'Password' && 
              input.value.length < 6 && document.querySelector('.register')) {
            isValid = false;
            showError(input, 'Password must be at least 6 characters long');
          }
        }
      });
      
      // Password confirmation check (only on register page)
      const registerForm = document.querySelector('.register');
      if (registerForm) {
        const password = registerForm.querySelector('input[placeholder="Password"]');
        const confirmPassword = registerForm.querySelector('input[placeholder="Confirm Password"]');
        
        if (password.value !== confirmPassword.value) {
          isValid = false;
          showError(confirmPassword, 'Passwords do not match');
        }
      }
      
      // If valid, show success message and redirect (for demo purposes)
      if (isValid) {
        // Show success animation
        const formContainer = this.closest('.auth-form');
        formContainer.innerHTML = '<div class="success-message">' +
                                 '<i class="fa fa-check-circle"></i>' +
                                 '<h3>Success!</h3>' +
                                 '<p>You will be redirected shortly...</p>' +
                                 '</div>';
        
        // Redirect after delay (simulating server response)
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 2000);
      }
    });
  });
  
  // Helper functions
  function showError(input, message) {
    // Remove any existing error
    clearError(input);
    
    // Create error message
    const errorElement = document.createElement('div');
    errorElement.className = 'input-error';
    errorElement.textContent = message;
    
    // Add error styling to input
    input.classList.add('error');
    
    // Insert error after input group
    input.parentElement.appendChild(errorElement);
  }
  
  function clearError(input) {
    // Remove error class from input
    input.classList.remove('error');
    
    // Remove error message if exists
    const errorElement = input.parentElement.querySelector('.input-error');
    if (errorElement) {
      errorElement.remove();
    }
  }
  
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  // Add CSS for form validation feedback
  const style = document.createElement('style');
  style.textContent = `
    .input-group .input-error {
      color: #e74c3c;
      font-size: 12px;
      margin-top: 5px;
      position: absolute;
      bottom: -18px;
    }
    
    .input-group input.error {
      border-color: #e74c3c !important;
    }
    
    .success-message {
      text-align: center;
      padding: 30px;
      animation: fadeIn 0.5s ease-in-out;
    }
    
    .success-message i {
      font-size: 60px;
      color: #2ecc71;
      margin-bottom: 15px;
    }
    
    .success-message h3 {
      color: #2ecc71;
      margin-bottom: 10px;
    }
  `;
  document.head.appendChild(style);
}); 