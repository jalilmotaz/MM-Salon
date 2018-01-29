function getWindowScrollTop() {
    var windowScrollTop = $(window).scrollTop();
    return windowScrollTop;
}
function getWindowScrollBottom() {
    var windowScrollTop = getWindowScrollTop();
    var windowHeight = $(window).height();
    var windowScrollBottom = (windowScrollTop + windowHeight);
    return windowScrollBottom;
}
function getElementScrollTop(element) {
    var offset = $(element).offset().top;
    return offset;
}
function getElementScrollBottom(element) {
    var elementScrollTop = getElementScrollTop(element);
    var elementHeight = $(element).height();
    var elementScrollBottom = (elementScrollTop + elementHeight);
    return elementScrollBottom;
}
function procaccillaxEffect(element, windowScrollTop, windowScrollBottom, elementScrollTop, elementScrollBottom, rate) {
    var translate = -(windowScrollTop / (rate * 2)).toFixed(2);
    $(element).css({ 'transform': 'translate3d(0, ' + translate + '%, 0)' });
}
function procaccillax(containerID, bgImgUrl, rate) {
    var windowScrollTop;
    var windowScrollBottom;
    var elementScrollTop;
    var elementScrollBottom;
    $(document).ready(function () {
        var container = ('#' + containerID);
        windowScrollTop = getWindowScrollTop();
        windowScrollBottom = getWindowScrollBottom();
        elementScrollTop = getElementScrollTop(container);
        elementScrollBottom = getElementScrollBottom(container);
        $(container).css({ 'position': 'relative' });
        $(container).css({ 'overflow': 'hidden' });
        $(container).css({ 'max-wdith': '1500px' });
        $(container).append("<div id='" + containerID + "bg'></div>");
        var bg = ('#' + containerID + 'bg');
        $(bg).css({ 'background': "url('" + bgImgUrl + "') no-repeat bottom" });
        $(bg).css({ 'position': 'fixed' });
        $(bg).css({ 'max-wdith': '1500px' });
        $(bg).css({ 'z-index': '-1' });
        $(bg).css({ 'top': '0px' }); // 0px for now because we are only using headers
        $(bg).css({ 'left': '0px' }); // 0px for now because we are only using headers
        $(bg).css({ 'height': ($(container).height() * rate) + 'px' });
        $(bg).css({ 'width': '100%' });
        var constant = ($(bg).height()) / 100;
        rate = constant * rate;
        // initial parallax
        if ((windowScrollTop <= elementScrollBottom) && (windowScrollBottom >= elementScrollTop)) {
            procaccillaxEffect(bg, windowScrollTop, windowScrollBottom, elementScrollTop, elementScrollBottom, rate);
        }
        $(window).scroll(function () {
            // call requestanimationframe() for better performance (src: https://medium.com/@dhg/parallax-done-right-82ced812e61c#.uys7dhw3x)
            window.requestAnimationFrame(function () {
                windowScrollTop = getWindowScrollTop();
                windowScrollBottom = getWindowScrollBottom();
                elementScrollTop = getElementScrollTop(container);
                elementScrollBottom = getElementScrollBottom(container);
                if ((windowScrollTop <= elementScrollBottom) && (windowScrollBottom >= elementScrollTop)) {
                    procaccillaxEffect(bg, windowScrollTop, windowScrollBottom, elementScrollTop, elementScrollBottom, rate);
                }
            });
        });
    });
}