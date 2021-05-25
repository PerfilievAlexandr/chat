const loginForm = document.getElementById('login-form');
const loginBtn = document.getElementById('login-btn');
const registrationForm = document.getElementById('registration');
const registrationBtn = document.getElementById('registration-btn');
const logoutBtn = document.getElementById('logout');

if (registrationForm) {
  registrationForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();

    fetch('/registration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({
        name: this.name.value,
        email: this.email.value,
        password: this.password.value,
      })
    });
  });
}

if (loginForm) {
  loginForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();

    fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({
        email: this.email.value,
        password: this.password.value,
      })
    })
      .then((res) => {
        // window.location.reload(true);
      })
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', (evt) => {
    evt.preventDefault();

    fetch('/logout', { method: 'POST' });
  })
}

