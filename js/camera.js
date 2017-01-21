(function() {
  var width = 320;    // Scale width to this
  var height = 0;     // Compute based on input stream

  var streaming = false;

  var video = null;
  var canvas = null;
  var photo = null;
  var startbutton = null;

  function startup() {
    video = document.getElementById('video');
    canvas = document.getElementById('canvas');
    photo = document.getElementById('photo');
    startbutton = document.getElementById('startbutton');

    navigator.getMedia = ( navigator.getUserMedia ||
                           navigator.webkitGetUserMedia ||
                           navigator.mozGetUserMedia ||
                           navigator.msGetUserMedia);

    navigator.getMedia(
      {
        video: true,
        audio: false
      },
      function(stream) {
        if (navigator.mozGetUserMedia) {
          video.mozSrcObject = stream;
        } else {
          var vendorURL = window.URL || window.webkitURL;
          video.src = vendorURL.createObjectURL(stream);
        }

        video.play();
      },
      function(err) {
        console.log("An error occured! " + err);
      }
    );

    video.addEventListener('canplay', function(ev){
      if (!streaming) {
        height = video.videoHeight / (video.videoWidth/width);

        video.setAttribute('width', width);
        video.setAttribute('height', height);
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
        streaming = true;
      }
    }, false);

    startbutton.addEventListener('click', function(ev){
      takepicture();
      ev.preventDefault();
    }, false);

    clearphoto();
  }

  function clearphoto() {
    var context = canvas.getContext('2d');
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

    var data = canvas.toDataURL('application/octet-stream');
    photo.setAttribute('src', data);
  }

  function takepicture() {
    var context = canvas.getContext('2d');
    if (width && height) {
      canvas.width = width;
      canvas.height = height;
      context.drawImage(video, 0, 0, width, height);

      var data = canvas.toDataURL('image/jpeg');
      var dataToSend = makeblob(data);
      var apiKey;
      var mood;
      $.getJSON( "config.json", function( data ) {
        apiKey = data.apiKey;
        $.ajax({
        beforeSend: function(request) {
          request.setRequestHeader("Ocp-Apim-Subscription-Key", apiKey);
        },
        url: 'https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognize',
        type: 'POST',
        processData: false,
        contentType: 'application/octet-stream',
        data: dataToSend,
        success: function(data) {
          var scores = data[0].scores;
          for (var key in scores) {
            if (!scores.hasOwnProperty(key)) continue;
              var obj = scores[key];
              //needs to be tweeked for different moods
              if(obj > 0.75){
                mood = key;
              }              
          }
          $.get( "https://api.spotify.com/v1/search?q="+ mood +"&type=playlist&limit=1", function( data ) {
            playlist = data.playlists.items[0].external_urls.spotify;
            window.open(playlist,'_blank');
          })

          console.log(scores);
          console.log("mood: " + mood);

        }
     });
      });
      
      photo.setAttribute('src', data);
    } else {
      clearphoto();
    }
  }

  window.addEventListener('load', startup, false);
})();

makeblob = function (dataURL) {
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
