const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');
const moment = require('moment');

//Thought Service
class IdeaService {
    constructor() {
        this.ideas = [];
    }

    async find() {
        return this.ideas;
    }

    async create(data) {
        const idea = {
            id: this.ideas.length,
            text: data.text,
            tech: data.tech,
            viewer: data.viewer
        };

        idea.time = moment().format('h:mm:ss a');

        this.ideas.push(idea);

        return idea;
    }
}

const app = express(feathers());

// parse JSON
app.use(express.json());
//Config Socket.io
app.configure(socketio());
//REST services
app.configure(express.rest());
//Reg Services
app.use('/ideas', new IdeaService()); 

app.on('connection', conn => app.channel('stream').join(conn));

const PORT = process.env.PORT || 3030;

app
    .listen(PORT)
    .on('listening', () => 
    console.log(`Realtime service running on port ${PORT}`)
    );

    app.service('ideas').create({
        text: 'Build an app',
        tech: 'Node.js',
        viewer: 'John Doe',
        time: moment().format('h:mm:ss a')
    });