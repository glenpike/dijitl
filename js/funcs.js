// $.ready
function ready(fn) {
    if (document.readyState != 'loading'){
      fn();
    } else if (document.addEventListener) {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      document.attachEvent('onreadystatechange', function() {
        if (document.readyState != 'loading')
          fn();
      });
    }
}

//$.on(...)
function addEventListener(el, eventName, handler) {
    if (el.addEventListener) {
      el.addEventListener(eventName, handler);
    } else {
      el.attachEvent('on' + eventName, function(ev){
        handler.call(el, ev);
      });
    }
}

//cookie functions
var cookie = {
    createCookie: function(name, value, days) {
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            var expires = "; expires=" + date.toGMTString();
        } else var expires = "";
        document.cookie = name + "=" + value + expires + "; path=/";
    },

    readCookie: function(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
};


function initSwitchStyleSheet() {
    var savedColour = cookie.readCookie('colour');
    if (savedColour) switchss(savedColour);

    // When a new colour is chosen, go through all the stylesheets, disabling them and enabling the
    // one that matches the chosen colour
    function switchss(newColour) {
        var styleSheets = document.querySelectorAll('link[rel*=style][title*=colour]')

        Array.prototype.forEach.call(styleSheets, function(stylesheet) {
            var colour = stylesheet.getAttribute('title')
            // console.log("switchcss " + newColour + " this " + colour + " disabled ? " + stylesheet.disabled);
            stylesheet.disabled = true;
            if (newColour === colour) {
                stylesheet.disabled = false;
            }
        });
        cookie.createCookie('colour', newColour, 365);
    }

    var switchers = document.querySelectorAll('.js_colour_switch')

    Array.prototype.forEach.call(switchers, function(s) {
        addEventListener(s, 'click', function clicked(ev) {
            switchss(ev.target.getAttribute('title'))
        })
    })

};

ready(function(){
    var colourBlocks = document.querySelectorAll('.colours')
    Array.prototype.forEach.call(colourBlocks, function(block) {
        block.className = block.className.replace('colours--hidden', '');
    })
    initSwitchStyleSheet();
});