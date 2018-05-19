/**
 * Created by lcw on 2018/5/19.
 */
window.onload = function () {
    //顶部搜索
    search();
    //轮播图
    banner();
    //倒计时
    downTime();
};
function search() {
    var searchBox = document.querySelector('.jd_search_box');
    var bannerHeight = document.querySelector('.jd_banner').offsetHeight;
    window.onscroll = function () {
        var top = document.body.scrollTop;
        var opacity = 0;
        if (top < bannerHeight) {
            opacity = top / bannerHeight * 0.85;
        } else {
            opacity = 0.85;
        }
        searchBox.style.background = 'rgba(201,21,35,' + opacity + ')';
    }
}

function banner() {
    /*
     * 1.自动轮播且无缝   利用定时器加过渡
     * 2.点要随着图片的轮播改变  根据索引去切换
     * 3.滑动效果   利用touch事件完成
     * 4.滑动结束的时候   如果滑动的距离不超过屏幕的1/3 会吸附回去  利用过渡
     * 5.滑动结束的时候  如果滑动的距离超过屏幕的1/3切换（上一张，下一张）根据滑动的方向 过渡
     * */
    var banner = document.querySelector('.jd_banner');
    var width = banner.offsetWidth;
    var imageBox = banner.querySelector('ul:first-child');
    var pointBox = banner.querySelector('ul:last-child');
    var points = pointBox.querySelectorAll('li');
    var index = 1;

    function addTransition() {
        imageBox.style.transition = 'all 0.2s';
        imageBox.style.webkitTransition = 'all 0.2s';
    }

    function removeTransition() {
        imageBox.style.transition = 'none';
        imageBox.style.webkitTransition = 'none';
    }

    function setTranslate(step) {
        imageBox.style.transform = 'translateX(' + (step) + 'px)';
        imageBox.style.webkitTransform = 'translateX(' + (step) + 'px)';
    }

    var timer = null;

    function selfMotion() {
        timer = setInterval(function () {
            index++;
            addTransition();
            setTranslate(-index * width);
        }, 3000);
    }

    selfMotion();
    imageBox.addEventListener('transitionend', function () {
        if (index > 8) {
            index = 1;
            removeTransition();
            setTranslate(-index * width);
        } else if (index < 1) {
            index = 8;
            removeTransition();
            setTranslate(-index * width);
        }
        setPoints();
    });
    function setPoints() {
        pointBox.querySelector('.now').classList.remove('now');
        points[index - 1].classList.add('now');
    }

    var starX = 0;
    var distance = 0;
    var isMove = false;
    imageBox.addEventListener('touchstart', function (e) {
        clearInterval(timer);
        starX = e.touches[0].clientX;
    });
    imageBox.addEventListener('touchmove', function (e) {
        var moveX = e.touches[0].clientX;
        distance = moveX - starX;
        var translateX = -index * width + distance;
        removeTransition();
        setTranslate(translateX);
        isMove = true;
    });
    imageBox.addEventListener('touchend', function (e) {
        if (!isMove) return false;
        if (Math.abs(distance) < width / 3) {
            addTransition();
            setTranslate(-index * width);
        } else if (distance > width / 3) {
            index--;
            addTransition();
            setTranslate(-index * width);
        } else if (distance < -width / 3) {
            index++;
            addTransition();
            setTranslate(-index * width);
        }
        starX = 0;
        distance = 0;
        clearInterval(timer);
        selfMotion();

    })
}
function downTime() {
    var time = 4 * 60 * 60;
    var spans = document.querySelectorAll('.time span');
    var timer = setInterval(function () {
        time--;
        var h = Math.floor(time / 3600);
        var m = Math.floor(time % 3600 / 60);
        var s = Math.floor(time % 60);

        spans[0].innerHTML = Math.floor(h / 10);
        spans[1].innerHTML = h % 10;
        spans[3].innerHTML = Math.floor(m / 10);
        spans[4].innerHTML = m % 10;
        spans[6].innerHTML = Math.floor(s / 10);
        spans[7].innerHTML = s % 10;

        if (time <= 0) {
            clearInterval(timer);
        }
    }, 1000)
}