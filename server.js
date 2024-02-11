const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const registeredEvents = [];
const registeredParticipants = [];

app.use(express.static(path.join(__dirname, 'public')));

// ...

app.post('/api/registerEvent', (req, res) => {
    const { eventName, eventDate, venue } = req.body;

    if (isEventClash(eventDate, venue)) {
        return res.status(400).json({ error: 'Another event is already scheduled for the selected date and venue. Please choose another date or venue.' });
    }

    registeredEvents.push({ eventName, eventDate, venue });

    res.status(201).json({ success: true, message: 'Event registered successfully.' });
});

// ...


app.get('/api/getEvents', (req, res) => {
    res.json(registeredEvents);
});

app.post('/api/registerParticipant', (req, res) => {
    const { participantName, eventDate, venue } = req.body;

    if (isParticipantRegistered(participantName, eventDate, venue)) {
        return res.status(400).json({ error: 'You are already registered for this event.' });
    }

    registeredParticipants.push({ participantName, eventDate, venue });

    res.status(201).json({ success: true, message: 'Participant registered successfully.' });
});

app.get('/api/getParticipants', (req, res) => {
    res.json(registeredParticipants);
});

function isEventClash(date, venue) {
    return registeredEvents.some(event => event.eventDate === date && event.venue === venue);
}

function isParticipantRegistered(participantName, eventDate, venue) {
    return registeredParticipants.some(participant => participant.participantName === participantName && participant.eventDate === eventDate && participant.venue === venue);
}

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
