/*!
 *
 *  Inspired and adapted from David Bushell's Responsive-Off-Canvas-Menu | https://github.com/dbushell/Responsive-Off-Canvas-Menu/blob/master/js/main.js
 *
 */
(function(window, document, undefined)
{

    // helper functions

    var trim = function(str)
    {
        return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g,'');
    };

    var hasClass = function(el, cn)
    {
        return (' ' + el.className + ' ').indexOf(' ' + cn + ' ') !== -1;
    };

    var addClass = function(el, cn)
    {
        if (!hasClass(el, cn)) {
            el.className = (el.className === '') ? cn : el.className + ' ' + cn;
        }
    };

    var removeClass = function(el, cn)
    {
        el.className = trim((' ' + el.className + ' ').replace(' ' + cn + ' ', ' '));
    };

    var hasParent = function(el, id)
    {
        if (el) {
            do {
                if (el.id === id) {
                    return true;
                }
                if (el.nodeType === 9) {
                    break;
                }
            }
            while((el = el.parentNode));
        }
        return false;
    };

    // normalize vendor prefixes

    var doc = document.documentElement;

    var transform_prop = window.Modernizr.prefixed('transform'),
        transition_prop = window.Modernizr.prefixed('transition'),
        transition_end = (function() {
            var props = {
                'WebkitTransition' : 'webkitTransitionEnd',
                'MozTransition'    : 'transitionend',
                'OTransition'      : 'oTransitionEnd otransitionend',
                'msTransition'     : 'MSTransitionEnd',
                'transition'       : 'transitionend'
            };
            return props.hasOwnProperty(transition_prop) ? props[transition_prop] : false;
        })();

    window.App = (function()
    {

        var _init = false, app = { };

        var options = {
            navID: 'menu',
            nav_class_open: 'js-menu-open',
            nav_class_closed: 'js-menu-closed',
            allowAutoOpen: true,
            openByDefault: false 
        };
        
        app.init = function()
        {
            if (_init) {
                return;
            }
            _init = true;

            var inner = document.getElementById(options.navID);
            app.nav_open = options.openByDefault;


            var closeNavEnd = function(e)
            {
                if (e && e.target === inner) {
                    document.removeEventListener(transition_end, closeNavEnd, false);
                }
                app.nav_open  = false;
            };

            app.closeNav =function()
            {
               
                if (app.nav_open ) {
                    // close navigation after transition or immediately
                    var duration = (transition_end && transition_prop) ? parseFloat(window.getComputedStyle(inner, '')[transition_prop + 'Duration']) : 0;
                    if (duration > 0) {
                        document.addEventListener(transition_end, closeNavEnd, false);
                    } else {
                        closeNavEnd(null);
                    }
                 
                    removeClass(doc, options.nav_class_open );
                    addClass(doc, options.nav_class_closed);
                }
               

            };

            app.openNav = function()
            {
                if (app.nav_open) {
                    return;
                }
                addClass(doc, options.nav_class_open);
                removeClass(doc, options.nav_class_closed);
                app.nav_open  = true;
            };

            app.toggleNav = function(e)
            {
               
                if (app.nav_open ) {
                    app.closeNav();
                   
                } else {
                    app.openNav();
                   
                }
                if (e) {
                    e.preventDefault();
                }
            };

            app.autoOpenClose = function() {
                
                // media query event handler
                if (options.allowAutoOpen && matchMedia) {
                    var mq = window.matchMedia("(min-width: 500px)");
                    if(mq.matches) {
                         app.openNav();
                    }                    
                    
                    mq.addListener(WidthChange);
                    WidthChange(mq);
                }
                // media query change
                function WidthChange(mq) {

                    if (mq.matches) {
                        app.openNav();
                        // window width is at least 500px
                    }
                    else {
                        app.closeNav();
                        // window width is less than 500px
                    }

                }    
            }

            // open nav with main "nav" button
            document.getElementById('nav-open-btn').addEventListener('click', app.toggleNav, false);
           
            addClass(doc, (app.nav_open == true) ?  options.nav_class_open : options.nav_class_closed);
            app.autoOpenClose();
        };

        return app;

    })();

    if (window.addEventListener) {
        window.addEventListener('DOMContentLoaded', window.App.init, false);
    }

})(window, window.document);