/*!
 * apply-full-height.js, set some container (eg for MapBox) to the full height of the viewport, excluding the height of headers and maybe footers.
 * Copyright 2020, utilmind, https://github.com/utilmind
 *
 * USAGE example:
 *
 *   <script>
 *   // <![CDATA[
 *   document.addEventListener("DOMContentLoaded", function() {
 *       applyMaxHeight("div.search-map", ["#wpadminbar", "header.header-1", ".special-nav"]);
 *
 *       // alternative....
 *
 *       applyMaxHeight("div.search-map", {
 *          0: ["#wpadminbar", "header.header-1", ".special-nav"], // mobile
 *          414: ["#wpadminbar", "header.header-1"], // desktop, 414px and wider
 *       });
 *
 *   });
 *   // ]]>
 *   </script>
 *
 */

var applyMaxHeight = function(el, excludeHeightArr, triggerResizeOnInit) {

        var lastW, lastH, lastExcludeHeight,
            updateContainerSize = function() {
                var excludeHeight = 0;

                if (excludeHeightArr) {
                    if ("function" === typeof excludeHeightArr) {
                        excludeHeight = excludeHeightArr();

                    }else {
                        var arr, i;
                        // responsive and variable?
                        if ("undefined" !== typeof excludeHeightArr["0"]) {
                          if (!lastW) lastW = window.innerWidth;

                          var maxW = 0;
                          for (i in excludeHeightArr)
                            if ((i <= lastW) && (i > maxW))
                              maxW = i;

                          arr = excludeHeightArr[maxW];
                        }else
                          arr = excludeHeightArr;

                        var subEl,
                            arrLen = arr.length;

                        for (i = 0; i < arrLen; ++i) {
                            // console.log(excludeHeightArr[i]+ ': ' + subEl.offsetHeight);
                            if ((subEl = document.querySelector(arr[i])) &&
                                (0 < subEl.offsetHeight)) // .is(":visible")
                                excludeHeight+= parseFloat(subEl.offsetHeight);
                        }
                    }
                }

                if (lastExcludeHeight !== excludeHeight) {
                  // console.log('excludeHeight: ' + excludeHeight);
                  el.style.height = "calc(100vh - "+ excludeHeight +"px)";
                }
            },

            triggerResize = function() {
                // trigger "window.resize"
                var event, eventName = "resize";
                if ("function" === typeof(Event)) { // modern browsers
                    event = new Event(eventName);
                }else { // IE compatibility
                    event = document.createEvent("CustomEvent");
                    event.initEvent(eventName, true, true, window);
                }
                window.dispatchEvent(event);
            };

        if (el = ("object" === typeof el) ? el : document.querySelector(el)) {
            updateContainerSize(); // initial
            if (triggerResizeOnInit)
                triggerResize();

            window.addEventListener("resize", function() {
                var cW = window.innerWidth,
                    cH = window.innerHeight;

                if (cW !== lastW || cH !== lastH) {
                    lastW = cW;
                    lastH = cH;
                    setTimeout(function() { // after DOM rendered
                        updateContainerSize();
                    }, 0);
                }
            }, true);
        }
    };