/*
CLONE FROM https://gist.github.com/scoffey/1617014

Credits to:
__version__ = '0.1.1'
__author__ = 'Santiago Coffey'
__email__ = 'scoffey@itba.edu.ar'
*/

var offset = 0;
var polling = null;

var param = function (key, fallback) {
    var query = window.location.search.substring(1);
    var parameters = query.split('&');
    for (var i = 0; i < parameters.length; i++) {
        var pair = parameters[i].split('=');
        if (pair[0] == key) {
            return unescape(pair[1]);
        }
    }
    return fallback;
}

var append = function (text) {
    if (text) {
        var element = document.getElementById('tail');
        var lines = element.textContent.split('\\n');
        lines.splice(0,text.split('\\n').length-1);
        element.textContent = lines.join('\\n');
        element.textContent += text;
        window.scrollTo(0, document.body.scrollHeight);
    }
}

var request = function (uri, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', uri, true);
    xhr.onreadystatechange = function () {
        var done = 4, ok = 200;
        if (xhr.readyState == done && xhr.status == ok) {
            var newOffset = xhr.getResponseHeader('X-Seek-Offset');
            if (newOffset) offset = parseInt(newOffset);
            callback(xhr.responseText);
        }
    };
    xhr.send(null);
}

var tail = function () {
    var uri = '/tail?offset=' + offset;
    if (!offset) {
        var limit = parseInt(param('limit', 1000));
        uri += '&limit=' + limit;
    }
    request(uri, append);
}

var refresh = function () {
    tail();
    if (polling == null) {
        var interval = parseInt(param('interval', 3000));
        polling = window.setInterval(tail, interval);
    }
}

var sleep = function () {
    if (polling != null) {
        window.clearInterval(polling);
        polling = null;
    }
}

window.onload = refresh;
window.onfocus = refresh;
window.onblur = sleep;
