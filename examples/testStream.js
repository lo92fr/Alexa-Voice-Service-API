const fs = require("fs");
const http = require("http");

const multipart = require("parse-multipart");
const play = require("audio-play");
const decode = require("audio-decode");
const gstreamer = require("gstreamer-superficial");
const request = require("request");
require('mp3');
/*
var request = require('request');

const m3u8 = require('m3u8-stream-list');
const parseM3u8 = require('parse-m3u8');
const m3u = require('m3u8-reader')
//var StreamPlayer = require('stream-player');
//var player = new StreamPlayer();
const gstreamer = require('gstreamer-superficial');

var play = require('audio-play');
var load = require('audio-loader');
*/


async function playUri(uri) {

    async function loadUri() {
        return new Promise(resolve => {
            request.get(uri, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    uri = body;
                    console.log('body:' + body);
                    resolve();
                }
            });
        })
    }

    if (uri.indexOf(".ashx") >= 0)
        await loadUri();

    console.log('uri:' + uri);

    const pipeline = new gstreamer.Pipeline('playbin uri=' + uri);
    pipeline.play();
}

uri = "http://opml.radiotime.com/Tune.ashx?id=e91287850&sid=s6616&formats=aac,mp3&partnerId=4JqugguZ&serial=AGFFGGARISSU2GXFBGHBQZNV2HYQ";
//uri = "http://rfm-live.akamaized.net/rfm.isml/live-rfm.m3u8";
playUri(uri);



async function init() {
    console.log(1)
    await sleep(100000)
    console.log(2)
}
function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}
init();