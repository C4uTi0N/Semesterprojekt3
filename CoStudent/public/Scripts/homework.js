var socket = io('http://localhost:3000');

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