const form = document.querySelector('#signup-form');
const message = document.querySelector('#form-message');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const submitButton = form.querySelector('button[type="submit"]');
  const formData = new FormData(form);
  const email = formData.get('email');
  const password = formData.get('password');

  message.textContent = '';
  message.className = 'form-message';
  submitButton.disabled = true;
  submitButton.textContent = 'Creating account...';

  try {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Signup failed.');
    }

    message.textContent = data.message || 'Signup successful.';
    message.classList.add('success');
    form.reset();
  } catch (error) {
    message.textContent = error.message;
    message.classList.add('error');
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Create Account';
  }
});
