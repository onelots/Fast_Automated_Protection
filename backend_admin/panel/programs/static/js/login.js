document.addEventListener('DOMContentLoaded', function() {

  const togglePassword = document.querySelector('.toggle-password');
  const passwordInput = document.querySelector('#password');

  if (togglePassword && passwordInput) {
    const eyeIcon = document.querySelector('.eye');
    const eyeOffIcon = document.querySelector('.eye-off');

    togglePassword.addEventListener('click', function() {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);

      eyeIcon.classList.toggle('hidden');
      eyeOffIcon.classList.toggle('hidden');
    });
  }
});