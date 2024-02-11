document.addEventListener('DOMContentLoaded', function () {
    showOptions();
    displayEventList();
});

function showOptions() {
    document.getElementById('options').style.display = 'block';
    document.getElementById('organizerForm').style.display = 'none';
    document.getElementById('participantForm').style.display = 'none';
}

function showOrganizerForm() {
    document.getElementById('options').style.display = 'none';
    document.getElementById('organizerForm').style.display = 'block';
    document.getElementById('participantForm').style.display = 'none';
}

function showParticipantForm() {
    document.getElementById('options').style.display = 'none';
    document.getElementById('organizerForm').style.display = 'none';
    document.getElementById('participantForm').style.display = 'block';
}

function registerEvent() {
    const eventName = document.getElementById('eventNameOrganizer').value;
    const eventDate = document.getElementById('eventDateOrganizer').value;
    const venue = document.getElementById('venueOrganizer').value;

    if (!eventName || !eventDate || !venue) {
        alert('Please fill in all fields');
        return;
    }

    fetch('/api/registerEvent', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventName, eventDate, venue }),
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        displayEventList();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while registering the event. Please try again.');
    });
}

function displayEventList() {
    fetch('/api/getEvents')
    .then(response => response.json())
    .then(data => {
        const eventList = document.getElementById('eventList');
        eventList.innerHTML = '';

        data.forEach(event => {
            const listItem = document.createElement('li');
            const button = document.createElement('button');
            button.textContent = `Register for ${event.venue} - ${event.eventDate}`;
            button.className = 'btn btn-primary';
            button.onclick = function () {
                registerParticipantForEvent(event);
            };
            listItem.appendChild(button);
            eventList.appendChild(listItem);
        });
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while fetching the list of events. Please try again.');
    });
}

function registerParticipantForEvent(event) {
    const participantName = prompt('Enter your name:');
    if (!participantName) {
        alert('Registration canceled. Please enter your name.');
        return;
    }

    fetch('/api/registerParticipant', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ participantName, eventDate: event.eventDate, venue: event.venue }),
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        displayParticipantList();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while registering the participant. Please try again.');
    });
}

function displayParticipantList() {
    fetch('/api/getParticipants')
    .then(response => response.json())
    .then(data => {
        const participantList = document.getElementById('participantList');
        participantList.innerHTML = '';

        data.forEach(participant => {
            const listItem = document.createElement('li');
            listItem.textContent = `${participant.participantName} - ${participant.venue} - ${participant.eventDate}`;
            listItem.className = 'list-group-item';
            participantList.appendChild(listItem);
        });
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while fetching the list of participants. Please try again.');
    });
}
