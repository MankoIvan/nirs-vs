
const express = require('express');
const app = express();
const { PORT = 3000 } = process.env;
const server = require('http').Server(app);
const firebase = require('firebase');
const https = require("https");
const http = require("http");
const firebaseDB = require('firebase/database');
const { clear } = require('console');
const firebaseConfig = {
    apiKey: "AIzaSyDK9B9NCjSwJJL2ryiy7USK1XRIOzKoh5M",
    authDomain: "nirs-camera.firebaseapp.com",
    databaseURL: "https://nirs-camera.firebaseio.com",
    projectId: "nirs-camera",
    storageBucket: "nirs-camera.appspot.com",
    messagingSenderId: "382258061836",
    appId: "1:382258061836:web:bab2a86d0a88a57cc5c429",
    measurementId: "G-VNNLQ9Y1NN"
};
const firebaseApp = firebase.initializeApp(firebaseConfig);
const TelegramBot = require('node-telegram-bot-api');
const token = '1502722233:AAFoWVTUrhJEm9IjlQpblWNDQyVbUF0ygF8';
const bot = new TelegramBot(token, {polling: true});
const agent = new https.Agent({
	rejectUnauthorized: false
});
const agenthttp = new http.Agent({
	rejectUnauthorized: false
});
let posH = 0;
let posV = 0;
let currentImage = '';
function sendImageToTelegram() {
    const fileOpts = {
        filename: 'image',
        contentType: 'image/jpg',
    };
    bot.sendPhoto(391632784, Buffer.from(currentImage.substr(22), 'base64'), fileOpts);
}

function imageTransition() {
    setInterval(() => {
        http.get('http://172.20.10.6/cam-hi.jpg', {agenthttp}, (resp) => {
            resp.setEncoding('base64');
            body = "data:" + resp.headers["content-type"] + ";base64,";
            resp.on('data', (data) => { body += data});
            resp.on('end', () => {
                firebase.database().ref('image/ipcam-new').set({
                    data: body
                });
                currentImage = body;
            });
        }).on('error', (e) => {
            console.log(`Got error: ${e.message}`);
        });
    
    }, 700);
};
function getCoordinatesFromFirebase() {
    firebase.database().ref(`image/h-pos`).once('value')
    .then((data) => {
        posH = data.val().data;
    });
    firebase.database().ref(`image/v-pos`).once('value')
    .then((data) => {
        posV = data.val().data;
    });
}
function moveCamera() {
    http.get('http://172.20.10.6/cameraMove', (resp) => {
        console.log("camera is turning");
    }).on('error', (e) => {
        console.log("Error occured");
    });
}
getCoordinatesFromFirebase();
const avaliableCheck = setInterval(() => {
    http.get('http://172.20.10.6/cameraAvaliable', {agenthttp}, (resp) => {
        body = "";
        resp.on('data', (data) => { body += data});
        resp.on('end', () => {
            /*
            let coordinates = body.split(",")
            posH =  Number(coordinates[0]);
            posV =  Number(coordinates[1]);
            firebase.database().ref('image/h-pos').set({
                data: Number(posH)
            });
            firebase.database().ref('image/v-pos').set({
                data: Number(posV)
            });
            */
            if (resp.statusCode == 200) {
                imageTransition();
                clearInterval(avaliableCheck);
            }
        });
    }).on('error', (e) => {
        console.log(`Got error: ${e.message}`);
    });

}, 3000);
app.get('/coordinates', (req, res) => {
    console.log("coordinates request arrived");
    res.status(200).send(`${posH}, ${posV}`);
});
app.post('/movementdetected', (req, res) => {
    console.log("movement detection request arrived");
    sendImageToTelegram();
    res.status(200).send("detection confirmed");
});
/*
const coordCheck = setInterval(() => {
    http.get('http://172.20.10.6/cameraAvaliable', {agenthttp}, (resp) => {
        body = "";
        resp.on('data', (data) => { body += data});
        resp.on('end', () => {
            let coordinates = body.split(",")
            posH =  Number(coordinates[0]);
            posV =  Number(coordinates[1]);
            firebase.database().ref('image/h-pos').set({
                data: Number(posH)
            });
            firebase.database().ref('image/v-pos').set({
                data: Number(posV)
            });
        });
    }).on('error', (e) => {
        console.log(`Got error: ${e.message}`);
    });

}, 3000);
*/
firebase.database().ref('image/h-pos').on('value', function(data) {
    console.log("horizontal turn")
    posH = data.val().data;
    moveCamera();
});
firebase.database().ref('image/v-pos').on('value', function(data) {
    console.log("vertical turn")
    posV = data.val().data;
    moveCamera();
});
/*
firebase.database().ref('image/v-pos').on('value', function(data) {
    http.get('http://172.20.10.6/cam-hi.jpg', {agenthttp}, (resp) => {
        resp.setEncoding('base64');
        body = "data:" + resp.headers["content-type"] + ";base64,";
        resp.on('data', (data) => { body += data});
        resp.on('end', () => {
            firebase.database().ref('image/ipcam-new').set({
                data: body
            });
        });
    }).on('error', (e) => {
        console.log(`Got error: ${e.message}`);
    });
});
/* 
setInterval(() => {
    http.get('http://172.20.10.6/picture', {agenthttp}, (resp) => {
        resp.setEncoding('base64');
        body = "data:" + resp.headers["content-type"] + ";base64,";
        resp.on('data', (data) => { body += data});
        resp.on('end', () => {
            firebase.database().ref('image/ipcam').set({
                data: body
            });
        });
    })
    .then(res => res.json())
    .then(data => console.log(data));

}, 1000);



setTimeout(() => {
    setInterval(() => {
        https.get('https://root:ismart12@192.168.0.159/cgi-bin/currentpic.cgi', {agent}, (resp) => {
            resp.setEncoding('base64');
            body = "data:" + resp.headers["content-type"] + ";base64,";
            resp.on('data', (data) => { body += data});
            resp.on('end', () => {
                firebase.database().ref('image/ipcam1').set({
                    data: body
                });
            });
        }).on('error', (e) => {
            console.log(`Got error: ${e.message}`);
        });
    
    }, 1000);
}, 200)
setInterval(() => {
    https.get('https://root:ismart12@192.168.0.175/cgi-bin/currentpic.cgi', {agent}, (resp) => {
        resp.setEncoding('base64');
        body = "data:" + resp.headers["content-type"] + ";base64,";
        resp.on('data', (data) => { body += data});
        resp.on('end', () => {
            firebase.database().ref('image/ipcam2').set({
                data: body
            });
        });
    }).on('error', (e) => {
        console.log(`Got error: ${e.message}`);
    });

}, 1000); */
app.listen(PORT, () => {
    // Если всё работает, консоль покажет, какой порт приложение слушает
    console.log(`App listening on port ${PORT}`)
}) 
