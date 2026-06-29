const form = document.querySelector('#login-form');
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
  submitButton.textContent = 'Logging in...';

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed.');
    }

    message.textContent = data.message || 'Login successful.';
    message.classList.add('success');
  } catch (error) {
    message.textContent = error.message;
    message.classList.add('error');
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Login';
  }
});
