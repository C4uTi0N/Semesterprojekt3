var socket = io('http://localhost:3000');

ChatManager('#chat1');
ChatManager('#chat2');
ChatManager('#chat3');
ChatManager('#chat4');

function ChatManager(chatId) {
    function renderMessage(message) {
        $(chatId).children('.messages').append('<div id = "message"><strong>' + message.user +
            '</strong>: <p>' + message.message + '</div>');
    };

    socket.on(`receivedMessage${chatId}`, data => {
        renderMessage(data);
    });

    socket.on(`previousMessages${chatId}`, function (messages) {
        for (message of messages) {
            renderMessage(message);
        }
    });

    console.log(chatId);
    $(chatId).submit(function (event) {
        event.preventDefault();
        console.log(event);

        var user = $(chatId + ' input[name=username]').val();
        var message = $(chatId + ' input[name=message]').val();

        if (user.length && message.length) {
            var messageObject = {
                user: user,
                message: message
            };

            renderMessage(messageObject);
            socket.emit(`sendMessage${chatId}`, messageObject);
            console.log("Message sent!")

            $('input[name=username]').val("");
            $('input[name=message]').val("");
        }
    });
}

function ChatToggle(chatId) {
    if (chatId == 'chat1') {
        document.getElementById('chat1').style.visibility = "visible";
        document.getElementById('chat2').style.visibility = "hidden";
        document.getElementById('chat3').style.visibility = "hidden";
        document.getElementById('chat4').style.visibility = "hidden";
        console.log("Toggled læringsteknologi")
    }

    if (chatId == 'chat2') {
        document.getElementById('chat1').style.visibility = "hidden";
        document.getElementById('chat2').style.visibility = "visible";
        document.getElementById('chat3').style.visibility = "hidden";
        document.getElementById('chat4').style.visibility = "hidden";
        console.log("Toggled hw-&-robotteknologi")
    }

    if (chatId == 'chat3') {
        document.getElementById('chat1').style.visibility = "hidden";
        document.getElementById('chat2').style.visibility = "hidden";
        document.getElementById('chat3').style.visibility = "visible";
        document.getElementById('chat4').style.visibility = "hidden";
        console.log("Toggle web-programmering")
    }

    if (chatId == 'chat4') {
        document.getElementById('chat1').style.visibility = "hidden";
        document.getElementById('chat2').style.visibility = "hidden";
        document.getElementById('chat3').style.visibility = "hidden";
        document.getElementById('chat4').style.visibility = "visible";
        console.log("Toggle 3d-programmering")
    }
}