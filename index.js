
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

setInterval(() => {
    https.get('https://root:ismart12@192.168.0.159/cgi-bin/currentpic.cgi', {agent}, (resp) => {
        resp.setEncoding('base64');
        body = "data:" + resp.headers["content-type"] + ";base64,";
        resp.on('data', (data) => { body += data});
        resp.on('end', () => {
            firebase.database().ref('image/currentImage').set({
                data: body
            });
        });
    }).on('error', (e) => {
        console.log(`Got error: ${e.message}`);
    });

}, 500);

/*
const Recorder = require('node-rtsp-recorder').Recorder
 
var rec = new Recorder({
    url: 'rtsp://192.168.0.159:8554/unicast',
    folder: './',
    name: 'cam1',
    type: 'image',
    fileNameFormat: 'k-m-s',
    directoryPathFormat: 'D-M-YYYY',
});
setInterval(() => {
    rec.captureImage(() => {
        console.log('Image Captured')
    })

}, 1000);
function base64Encode(file) {
	const bitmap = fs.readFileSync(file);
	return new Buffer(bitmap).toString('base64');
}

setTimeout(() => {
	setInterval(() => {
		let date = new Date()
		date.setSeconds(date.getSeconds() - 5);
		let path = `./cam1/${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}/image/${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}.jpg`;
		let image = base64Encode(path);
		firebase.database().ref('image/currentImage').set({
			data: `data:image/jpeg;base64,${image}`
		});

	}, 1000);
}, 10000);
*/
/*
async function removeOldImagesFolder(days) {
	let date = new Date();
	date.setDate(date.getDate() - days);
	let folder = `./cam1/${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;

	try {
		await fsExtra.remove(folder)
	} catch (err) {
		console.log(folder + " folder doesnt exist already")
	}
}
removeOldImagesFolder(2);

const imageToBase64 = require('image-to-base64');
imageToBase64("https://root:ismart12@192.168.0.159/cgi-bin/currentpic.cgi") // you can also to use url
    .then(
        (response) => {
            console.log(response); //cGF0aC90by9maWxlLmpwZw==
        }
    )
    .catch(
        (error) => {
            console.log(error); //Exepection error....
        }
    )

*/
