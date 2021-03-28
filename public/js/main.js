const chatMessages = document.querySelector('.chat-messages');
const chatForm = document.getElementById("chat-form");
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// GET username and room from  URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix : true
});

console.log(username ,room);

const socket = io();

// Join chatroom
socket.emit('joinRoom', {username,room});


socket.on('roomUsers', ({room, users}) => {
  outputRoomName(room);
  outputUsers(users);
})


// Message from the Server. Here we catch whatever is coming from server. At Frontend.
socket.on("message", (message) => {
//   console.log(message);
  outputMessage(message);


    // Scroll Down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});


// Message Submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Get message text
  const msg = e.target.elements.msg.value;

  // Emitting the message to the server
  socket.emit("chatMessage", msg);

   // Clear Input
   e.target.elements.msg.value = '';
   e.target.elements.msg.focus();
});

// Output Message to DOM
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta"> ${message.username} <span>${message.time}</span></p>
                    <p class="text">
                       ${message.text}
                    </p>`;

    document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room){
  roomName.innerHTML = room;
}


// Add users to DOM
function outputUsers(users){
  userList.innerHTML = `
  ${users.map(user => `<li> ${user.username} </li>`).join('')}
  `;
}