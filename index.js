
const express = require('express');
const app = express();
const server = require('http').Server(app);
const firebase = require('firebase');
const https = require("https");
const firebaseDB = require('firebase/database');
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

const agent = new https.Agent({
	rejectUnauthorized: false
});
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

}, 1000);


