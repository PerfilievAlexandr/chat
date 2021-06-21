const socket = io();

window.onload = () => {
  const input = document.querySelector('#message');
  const btn = document.querySelector('#messageBtn');
  const messagesBlock = document.querySelector('.messagesBlock');
  const alertBlock = document.querySelector('.alertBlock');

  const showStatus = (status, message) => {
    document.querySelector('[data-status]').innerHTML = message || status;
    document.querySelector('[data-status]').setAttribute('data-status', status);
  }

  const addMessage = (message, user) => {
    const string = document.createElement("p");
    const text = document.createTextNode(`${user}: ${message}`);
    string.appendChild(text);
    messagesBlock.appendChild(string);
  }

  const addNewUserAlert = (message) => {
    const string = document.createElement("p");
    const text = document.createTextNode(message);
    string.appendChild(text);
    alertBlock.appendChild(string);

    setTimeout(() => {
      string.remove();
    }, 7000)
  };

  socket.on('error', (message) => {
    console.error(message);
    showStatus('error', message);
  });

  ['connect', 'disconnect', 'reconnect', 'reconnecting', 'reconnect_failed'].forEach((event) => {
    socket.on(event, () => {
      showStatus(event);
    })
  });

  socket.on('logout', () => {
    socket.disconnect();
    window.location.reload();
  });

  btn.addEventListener('click', () => {
    const message = input.value;

    if (input.value) {
      socket.emit('newMessage', message);
      input.value = ''
    }
  })


  socket.on('message', ({ message, user }) => {
    if (message && user) {
      addMessage(message, user)
    }
  });

  socket.on('newConnection', (user) => {
    if (user) {
      addNewUserAlert(user)
    }
  });
}

