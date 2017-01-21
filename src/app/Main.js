/**
 * In this file, we create a React component
 * which incorporates components provided by Material-UI.
 */
import React, {Component} from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import {deepOrange500} from 'material-ui/styles/colors';
import FlatButton from 'material-ui/FlatButton';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Title from './Title';

import Cam from './Camera';

const muiTheme = getMuiTheme({
  palette: {
    accent1Color: deepOrange500,
  },
});

class Main extends Component {
  constructor(props, context) {
    super(props, context);

    this.getEmotion = this.getEmotion.bind(this);

    this.state = {
        emotionImg: null
    };
  }

  //converts an base64 image/* to a format for Emotion API
  makeblob(dataURL) {
    var BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) == -1) {
      var parts = dataURL.split(',');
      var contentType = parts[0].split(':')[1];
      var raw = decodeURIComponent(parts[1]);
      return new Blob([raw], { type: contentType });
    }
    var parts = dataURL.split(BASE64_MARKER);
    var contentType = parts[0].split(':')[1];
    var raw = window.atob(parts[1]);
    var rawLength = raw.length;

    var uInt8Array = new Uint8Array(rawLength);

    for (var i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
  }

  getEmotion(img) {
    var dataS = makeblob(img);
    var apiKey = "f2e5006779884f8c8109ef675baf60ef";
    var URL = "https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognize";
    var reqHeaders = new Headers({
      "Content-Type": "application/octet-stream",
      "Ocp-Apim-Subscription-Key": "f2e5006779884f8c8109ef675baf60ef",
    });
    var mood;
      fetch(URL, {
        method: "POST", 
        header: reqHeaders,
        body: dataS
      }).then(function(res) {
        if(res.ok) {
          res.json().then(function(data) {
            var scores = data[0].scores;
            for (var key in scores) {
              if (!scores.hasOwnProperty(key)) continue;
              var obj = scores[key];
              //needs to be tweeked for different moods
              if(obj > 0.75) {
                mood = key;
              }
            }
          }.bind(this))
        } else {
          console.log("error");
        }
      })
  }

  render() {
    return (
      <div>
        <Title name="Moodify" />
        <Cam img={this.state.emotionImg} func={this.getEmotion.bind(this)}/>
      </div>
    );
  }
}

export default Main;
