'use strict';

onmessage = function (message) {

  function applyTransform(result) {
    var data = new Uint8Array(result);
    return data;
  }

  function http(str) {
    var url = str;

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';

    xhr.onload = function () {
      console.log('db loaded from file');
      postMessage(applyTransform(this.response));
      close();
    };

    xhr.send();
  }

  http(message.data.url);

};