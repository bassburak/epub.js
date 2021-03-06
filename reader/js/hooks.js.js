EPUBJS.Hooks.register("beforeChapterDisplay").endnotes = function(a, b) {
    var c = b.contents.querySelectorAll("a[href]"),
        d = Array.prototype.slice.call(c),
        e = "epub:type",
        f = "noteref",
        g = EPUBJS.core.folder(location.pathname),
        h = g + EPUBJS.cssPath || g,
        i = {};
    EPUBJS.core.addCss(h + "popup.css", !1, b.render.document.head), d.forEach(function(a) {
        function c() {
            var c, e, f = b.height,
                j = b.width,
                p = 225;
            o || (c = l.cloneNode(!0), o = c.querySelector("p")), i[k] || (i[k] = document.createElement("div"), i[k].setAttribute("class", "popup"), pop_content = document.createElement("div"), i[k].appendChild(pop_content), pop_content.appendChild(o), pop_content.setAttribute("class", "pop_content"), b.render.document.body.appendChild(i[k]), i[k].addEventListener("mouseover", d, !1), i[k].addEventListener("mouseout", g, !1), b.on("renderer:pageChanged", h, this), b.on("renderer:pageChanged", g, this)), c = i[k], e = a.getBoundingClientRect(), m = e.left, n = e.top, c.classList.add("show"), popRect = c.getBoundingClientRect(), c.style.left = m - popRect.width / 2 + "px", c.style.top = n + "px", p > f / 2.5 && (p = f / 2.5, pop_content.style.maxHeight = p + "px"), popRect.height + n >= f - 25 ? (c.style.top = n - popRect.height + "px", c.classList.add("above")) : c.classList.remove("above"), m - popRect.width <= 0 ? (c.style.left = m + "px", c.classList.add("left")) : c.classList.remove("left"), m + popRect.width / 2 >= j ? (c.style.left = m - 300 + "px", popRect = c.getBoundingClientRect(), c.style.left = m - popRect.width + "px", popRect.height + n >= f - 25 ? (c.style.top = n - popRect.height + "px", c.classList.add("above")) : c.classList.remove("above"), c.classList.add("right")) : c.classList.remove("right")
        }

        function d() {
            i[k].classList.add("on")
        }

        function g() {
            i[k].classList.remove("on")
        }

        function h() {
            setTimeout(function() {
                i[k].classList.remove("show")
            }, 100)
        }
        var j, k, l, m, n, o, p = a.getAttribute(e);
        p == f && (j = a.getAttribute("href"), k = j.replace("#", ""), l = b.render.document.getElementById(k), a.addEventListener("mouseover", c, !1), a.addEventListener("mouseout", h, !1))
    }), a && a()
}, EPUBJS.Hooks.register("beforeChapterDisplay").mathml = function(a, b) {
    if (-1 !== b.currentChapter.manifestProperties.indexOf("mathml")) {
        b.iframe.contentWindow.mathmlCallback = a;
        var c = document.createElement("script");
        c.type = "text/x-mathjax-config", c.innerHTML = '        MathJax.Hub.Register.StartupHook("End",function () {           window.mathmlCallback();         });        MathJax.Hub.Config({jax: ["input/TeX","input/MathML","output/SVG"],extensions: ["tex2jax.js","mml2jax.js","MathEvents.js"],TeX: {extensions: ["noErrors.js","noUndefined.js","autoload-all.js"]},MathMenu: {showRenderer: false},menuSettings: {zoom: "Click"},messageStyle: "none"});                 ', b.doc.body.appendChild(c), EPUBJS.core.addScript("http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML", null, b.doc.head)
    } else a && a()
}, EPUBJS.Hooks.register("beforeChapterDisplay").smartimages = function(a, b) {
    var c = b.contents.querySelectorAll("img"),
        d = Array.prototype.slice.call(c),
        e = b.height;
    return "reflowable" != b.layoutSettings.layout ? void a() : (d.forEach(function(a) {
        function c() {
            var c, d = a.getBoundingClientRect(),
                f = d.height,
                g = d.top,
                h = a.getAttribute("data-height"),
                i = h || f,
                j = Number(getComputedStyle(a, "").fontSize.match(/(\d*(\.\d*)?)px/)[1]),
                k = j ? j / 2 : 0;
            e = b.contents.clientHeight, 0 > g && (g = 0), i + g >= e ? (e / 2 > g ? (c = e - g - k, a.style.maxHeight = c + "px", a.style.width = "auto") : (i > e && (a.style.maxHeight = e + "px", a.style.width = "auto", d = a.getBoundingClientRect(), i = d.height), a.style.display = "block", a.style.WebkitColumnBreakBefore = "always", a.style.breakBefore = "column"), a.setAttribute("data-height", c)) : (a.style.removeProperty("max-height"), a.style.removeProperty("margin-top"))
        }
        a.addEventListener("load", c, !1), b.on("renderer:resized", c), b.on("renderer:chapterUnloaded", function() {
            a.removeEventListener("load", c), b.off("renderer:resized", c)
        }), c()
    }), void(a && a()))
}, EPUBJS.Hooks.register("beforeChapterDisplay").transculsions = function(a, b) {
    var c = b.contents.querySelectorAll("[transclusion]"),
        d = Array.prototype.slice.call(c);
    d.forEach(function(a) {
        function c() {
            j = g, k = h, j > chapter.colWidth && (d = chapter.colWidth / j, j = chapter.colWidth, k *= d), f.width = j, f.height = k
        }
        var d, e = a.getAttribute("ref"),
            f = document.createElement("iframe"),
            g = a.getAttribute("width"),
            h = a.getAttribute("height"),
            i = a.parentNode,
            j = g,
            k = h;
        c(), b.listenUntil("renderer:resized", "renderer:chapterUnloaded", c), f.src = e, i.replaceChild(f, a)
    }), a && a()
};
