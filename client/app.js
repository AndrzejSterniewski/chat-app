const socket = io();

const loginForm = document.getElementById('welcome-form');
const messagesSection = document.getElementById('messages-section');
const messagesList = document.getElementById('messages-list');
const addMessageForm = document.getElementById('add-messages-form');
const userNameInput = document.getElementById('username');
const messageContentInput = document.getElementById('message-content');

let userName;

socket.on('message', ({ author, content }) => addMessage(author, content));

loginForm.addEventListener('submit', (e) => {
    login(e);
});
addMessageForm.addEventListener('submit', (e) => {
    sendMessage(e);
});

const login = (e) => {
    e.preventDefault();
    if (!userNameInput.value) {
        alert('field is empty');
    }
    else {
        userName = userNameInput.value;
        loginForm.classList.remove('show');
        messagesSection.classList.add('show');
        socket.emit('join', userName);
    }
};

const addMessage = (author, content) => {
    const message = document.createElement('li');
    message.classList.add('message');
    message.classList.add('message--received');
    // if (author === userName) message.classList.add('message--self');
    if (author === userName) {
        message.classList.add('message--self')
    } else if (author === 'Chat-Bot') {
        message.classList.add('chat--bot')
    };
    message.innerHTML = `
      <h3 class="message__author">${userName === author ? 'You' : author}</h3>
      <div class="message__content">
        ${content}
      </div>
    `;
    messagesList.appendChild(message);
};

const sendMessage = (e) => {
    e.preventDefault();

    let messageContent = messageContentInput.value;

    if (!messageContent.length) {
        alert('You have to type something!');
    }
    else {
        addMessage(userName, messageContentInput.value);
        socket.emit('message', { author: userName, content: messageContent })
        messageContentInput.value = '';
    }
}