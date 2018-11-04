(function ($, win) {
    var songData = null,
        oAudio = new Audio(),
        len ,
        index = 0,
        duration = 0,
        timer,
        oImg = $('.song_img'),
        oSongName = $('.song_name'),
        oAuthor = $('.author'),
        oAlbum = $('.album'),
        oCurTime = $('.cur_time'),
        oProcTop = $('.proc_top'),
        oDura = $('.dura'),
        oFaverite = $('.faverite'),
        oPreviouce = $('.previouce'),
        oPlay = $('.play'),
        oNext = $('.next'),
        oList = $('.list'),
        oPoint = $('.point');
    $.ajax({
        url: '../mock/data.json',
        type: 'GET',
        success: function (data) {
            songData = data;
            len = data.length;
            init();
            console.log(data);
        },
        error: function (err) {
            console.log(err);
        }
    })
    function init() {
        showSong(index);
        document.body.appendChild(oAudio);
        bindEvent();
        createList();
    }
    function createList() {
        var str = '';
        songData.forEach(function (ele, ind) {
            str += `<li class="song"> ${ele.song} </li>`
        })
        $('.list_box').html(str);
        $('.song').on('click', function (e) {
    
            index = $(this).index();
            showSong(index);
            oAudio.play();
        })
    }
    function showSong(ind) {
        // clearInterval(timer);
        var newImg = new Image();
        var flag = oAudio.paused;
        newImg.onload = function () {
            win.blurImg(newImg, $(document.body));
        }
        newImg.src = songData[ind].image;
        oAudio.src = songData[ind].audio;
        oImg[0].src = songData[ind].image;
        oSongName.text(songData[ind].song);
        oAuthor.text(songData[ind].singer);
        oAlbum.text(songData[ind].album);
        if(!flag){
            oAudio.play();
        }
        if(songData[ind].isLike){
            oFaverite.css('backgroundImage', 'url(../images/icon-like-solid.png)');
        }else{
            oFaverite.css('backgroundImage', 'url(../images/icon-like.png)');
        }
    }
    function bindEvent() {
        $(oAudio).on('loadedmetadata', function (e) {
            var dura = Math.floor(oAudio.duration);
            var m = '0' + Math.floor(dura / 60);
            var s = '0' + dura % 60;
            var str = `${m.slice(-2)}:${s.slice(-2)}`;
            oDura.text(str);
            duration = Math.floor(oAudio.duration);
        })
        $(oAudio).on('ended', function (e) {
            clearInterval(timer);
            next();
            oAudio.play();
        })
        $(oAudio).on('play', function (e) {
            oPlay.css('backgroundImage', 'url(../images/icon-pause.png)');
            showCurrent();
        })
        $(oAudio).on('pause', function (e) {
            oPlay.css('backgroundImage', 'url(../images/icon-play.png)');
            clearInterval(timer);           
        })
        oPlay.on('click', function (e) {
            if(oAudio.paused) {
                oAudio.play();
            }else{
                oAudio.pause();
            }
        })
        oPreviouce.on('click', function (e) {
            prev();
        })
        oNext.on('click', function (e) {
            next();
        })
        oFaverite.on('click', function (e) {
            if(songData[index].isLike) {
                songData[index].isLike = false;
                oFaverite.css('backgroundImage', 'url(../images/icon-like.png)');
            }else{
                songData[index].isLike = true;
                oFaverite.css('backgroundImage', 'url(../images/icon-like-solid.png)');
            }
        })
        oPoint.on('touchstart', function (e) {
            var left = $('.proc_bottom').offset().left;
            var width = oProcTop.offset().width;
            var per;
            clearInterval(timer);
            oPoint.on('touchmove', (function () {
                var lastTime = 0;
                return function (e) {
                    var newTime = Date.now();
                    if(newTime - lastTime > 300){
                        var clientX = e.changedTouches[0].clientX;
                        per = (clientX - left) *100 / width - 100;
                        if(per <= 0 && per >= -100){
                            oProcTop.css('transform', `translateY(-50%) translateX(${per}%)`)
                        }else if(per < -100){
                            oProcTop.css('transform', `translateY(-50%) translateX(-100%)`)
                        }else{
                            oProcTop.css('transform', `translateY(-50%) translateX(0%)`)
                        }
                        lastTime = newTime;
                    }
                }
            })())
            oPoint.on('touchend', function (e) {
                var current = duration * ((100 + per) /100);
                showCurrent();
                oAudio.currentTime = current;
                oPoint.off('touchmove');
                oPoint.off('touchend');
            })
        })
        oList.on('click', function (e) {
            if($('.list_wrap').css('display') == 'none'){
                $('.list_wrap').show();
            }
        })
        $('.close_img').on('click', function (e) {
            $('.list_wrap').css('display', 'none')
        })
    }
    function prev() {
        if(index === 0){
            index = len -1;
        }else{
            index -= 1;
        }
        showSong(index);
    }
    function next() {
        if(index === (len -1)){
            index = 0;
        }else{
            index += 1;
        }
        showSong(index);
    }
    function showCurrent() {
        var current;
        clearInterval(timer);
        timer = setInterval(function () {
            current = Math.floor(oAudio.currentTime);
            var m = '0' + Math.floor(current / 60);
            var s = '0' + current % 60;
            var str = `${m.slice(-2)}:${s.slice(-2)}`;
            var per = (current/duration - 1)*100 + '%';
            if(!current){
                oCurTime.text('00:00');
            }else{
                oCurTime.text(str);
                oProcTop.css({
                    'transform': `translateY(-50%) translateX(${per})`
                })
            }
            console.log(current);
        }, 100)
    }
})(window.Zepto, window)