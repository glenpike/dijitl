(function($) {

    $.fn.innerfade = function(options) {
        return this.each(function() {
            $.innerfade(this, options);
        });
    };

    $.innerfade = function(container, options) {
        var settings = {
            'animationtype': 'fade',
            'speed': 'normal',
            'type': 'sequence',
            'timeout': 2000,
            'containerwidth': 'auto',
            'runningclass': 'innerfade',
            'children': null
        };
        if (options)
            $.extend(settings, options);
        if (settings.children === null)
            var elements = $(container).children();
        else
            var elements = $(container).children(settings.children);
        if (elements.length > 1) {
            $(container).css('position', 'relative').css('width', settings.containerwidth).addClass(settings.runningclass);
            for (var i = 0; i < elements.length; i++) {
                $(elements[i]).css('z-index', String(elements.length - i)).css('position', 'absolute').hide();
            };
            if (settings.type == "sequence") {
                setTimeout(function() {
                    $.innerfade.next(elements, settings, 1, 0);
                }, settings.timeout);
                $(elements[0]).show();
            } else if (settings.type == "random") {
                var last = Math.floor(Math.random() * (elements.length));
                setTimeout(function() {
                    do {
                        current = Math.floor(Math.random() * (elements.length));
                    } while (last == current);
                    $.innerfade.next(elements, settings, current, last);
                }, settings.timeout);
                $(elements[last]).show();
            } else if (settings.type == 'random_start') {
                settings.type = 'sequence';
                var current = Math.floor(Math.random() * (elements.length));
                setTimeout(function() {
                    $.innerfade.next(elements, settings, (current + 1) % elements.length, current);
                }, settings.timeout);
                $(elements[current]).show();
            } else {
                alert('Innerfade-Type must either be \'sequence\', \'random\' or \'random_start\'');
            }
        }
    };

    $.innerfade.next = function(elements, settings, current, last) {
        if (settings.animationtype == 'slide') {
            $(elements[last]).slideUp(settings.speed);
            $(elements[current]).slideDown(settings.speed);
        } else if (settings.animationtype == 'fade') {
            $(elements[last]).fadeOut(settings.speed);
            $(elements[current]).fadeIn(settings.speed, function() {
                removeFilter($(this)[0]);
            });
        } else
            alert('Innerfade-animationtype must either be \'slide\' or \'fade\'');
        if (settings.type == "sequence") {
            if ((current + 1) < elements.length) {
                current = current + 1;
                last = current - 1;
            } else {
                current = 0;
                last = elements.length - 1;
            }
        } else if (settings.type == "random") {
            last = current;
            while (current == last)
                current = Math.floor(Math.random() * elements.length);
        } else
            alert('Innerfade-Type must either be \'sequence\', \'random\' or \'random_start\'');
        setTimeout((function() {
            $.innerfade.next(elements, settings, current, last);
        }), settings.timeout);
    };

})(jQuery);

// **** remove Opacity-Filter in ie ****
function removeFilter(element) {
    if (element.style.removeAttribute) {
        element.style.removeAttribute('filter');
    }
}

$.fn.switchstylesheet = function(options) {

    //default vals
    defaults = {
        seperator: 'alt'
    };

    var options = $.extend(defaults, options);

    //read the style
    var c = cookie.readCookie(options.seperator);
    //alert("read cookie? " + c);
    if (c) switchss(c);

    //goes thru the links to find out the ones having the selector
    $(this).click(function() {
        var title = $(this).attr('title'); //gets the title=?
        switchss(title);
    });

    function switchss(title) {
        //goes thru all the styles having seperator - alt
        $('link[rel*=style][title*=' + options.seperator + ']').each(function(i) {
            //alert("switchcss " + title + " this " + $(this).attr('title') + " disabled ? " + this.disabled);
            this.disabled = true;
            if ($(this).attr('title') == title) {
                this.disabled = false;
            }
        });
        //create a cookie to store the style
        cookie.createCookie(options.seperator, title, 365);
    }
};

//cookie functions
var cookie;
(function($) {
    cookie = {
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
})(jQuery);

//Preload images...
(function($) {
    var cache = [];
    // Arguments are image paths relative to the current page.
    $.preLoadImages = function() {
        var args_len = arguments.length;
        for (var i = args_len; i--;) {
            var cacheImage = document.createElement('img');
            cacheImage.src = arguments[i];
            cache.push(cacheImage);
        }
    }
})(jQuery)
