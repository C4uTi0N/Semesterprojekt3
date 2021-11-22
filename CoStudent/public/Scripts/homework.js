var socket = io('http://localhost:3000');

/*
ChatManager('#chat1');
ChatManager('#chat2');
ChatManager('#chat3');
ChatManager('#chat4');

function ChatManager(weekId) {
    function renderMessage(message) {
        $(weekId).children('.messages').append('<div id = "message"><strong>' + message.user +
            '</strong>: <p>' + message.message + '</div>');
    };

    socket.on(`receivedMessage${weekId}`, data => {
        renderMessage(data);
    });

    socket.on(`previousMessages${weekId}`, function (messages) {
        for (message of messages) {
            renderMessage(message);
        }
    });

    console.log(weekId);
    $(weekId).submit(function (event) {
        event.preventDefault();
        console.log(event);

        var user = $(weekId + ' input[name=username]').val();
        var message = $(weekId + ' input[name=message]').val();

        if (user.length && message.length) {
            var messageObject = {
                user: user,
                message: message
            };

            renderMessage(messageObject);
            socket.emit(`sendMessage${weekId}`, messageObject);
            console.log("Message sent!")

            $('input[name=username]').val("");
            $('input[name=message]').val("");
        }
    });
}
*/

function WeekToggle(weekId) {
    if (weekId == 'lastWeek') {
        document.getElementById('lastWeek').style.visibility = "visible";
        document.getElementById('thisWeek').style.visibility = "hidden";
        document.getElementById('nextWeek').style.visibility = "hidden";
        console.log("Toggled lastWeek")
    }

    if (weekId == 'thisWeek') {
        document.getElementById('lastWeek').style.visibility = "hidden";
        document.getElementById('thisWeek').style.visibility = "visible";
        document.getElementById('nextWeek').style.visibility = "hidden";
        console.log("Toggled thisWeek")
    }

    if (weekId == 'nextWeek') {
        document.getElementById('lastWeek').style.visibility = "hidden";
        document.getElementById('thisWeek').style.visibility = "hidden";
        document.getElementById('nextWeek').style.visibility = "visible";
        console.log("Toggle nextWeek")
    }
}