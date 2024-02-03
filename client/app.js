const socket = require('socket.io');
const io = socket(server);

const loginForm = document.getElementById('welcome-form');
const messagesSection = document.getElementById('messages-section');
const messagesList = document.getElementById('messages-list');
const addMessageForm = document.getElementById('add-messages-form');
const userNameInput = document.getElementById('username');
const messageContentInput = document.getElementById('message-content');

userName = '';

socket.on('message', ({ author, content }) => addMessage(author, content));

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    login();
});

const login = () => {
    if (!userNameInput.value) {
        alert('field is empty');
    }
    else {
        userName = userNameInput.value;
        loginForm.classList.remove('show');
        messagesSection.classList.add('show');
    }
};

const addMessage = (author, content) => {
    const message = document.createElement('li');
    message.classList.add('message');
    message.classList.add('message--received');
    if (author === userName) message.classList.add('message--self');
    message.innerHTML = `
      <h3 class="message__author">${userName === author ? 'You' : author}</h3>
      <div class="message__content">
        ${content}
      </div>
    `;
    messagesList.appendChild(message);
};

addMessageForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!messageContentInput.value) {
        alert('field is empty');
    } else {
        addMessage(userName, messageContentInput.value);
        messageContentInput.value = '';
    }
});

const sendMessage = (e) => {
    e.preventDefault();

    let messageContent = messageContentInput.value;

    if (!messageContent.length) {
        alert('You have to type something!');
    }
    else {
        addMessage(userName, messageContent);
        socket.emit('message', { author: userName, content: messageContent })
        messageContentInput.value = '';
    }
}