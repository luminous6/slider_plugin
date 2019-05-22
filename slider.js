/*
 * >>插件调用方法
 * 1.插件是基于jQuery写的，在调用之前先引入jQuery.js
 * 2.在HTML中插入带有swiper的ID，可以自己加个class设置宽高等样式
 * 3.在script中通过ID调用sliderImg方法用对象的方法进行传参
 *  参数 >>
 * 1-->.参数image用数组的形式往里加入图片的src
 *    
 * 2-->.参数interval用来设置轮播间隔时间
 * 
 * @by XiangMing
 */

(function($) {
    function Swiper(opt) {
        var opts = opt || {};
        this.wrap = opts.father;
        this.img = opts.image;
        this.interval = opts.interval,

            //入口函数
            this.init()

    }

    //入口函数
    Swiper.prototype.init = function() {
            console.log(this)
            this.nowIndex = 0;
            this.len = this.img.length - 1;
            this.itemWidth = parseInt(this.wrap.css('width'));
            this.itemHeight = parseInt(this.wrap.css('height'));
            this.timer = undefined;
            this.flag = true;

            this.creatDom();
            this.sliderAuto();
            this.bindEvent();
        }
        //根据传参  添加dom结构
    Swiper.prototype.creatDom = function() {
        var len = this.len;
        var str = '',
            listStr = '';
        var dot = $('<div class="dot"></div>');
        var imgBox = $('<ul class="img-box"></ul>');
        var list = $('<ul></ul>');
        var btnL = $('<div class="prevBtn btn">&lt;</div>');
        var btnR = $('<div class="nextBtn btn">&gt;</div>');

        for (i = 0; i < len; i++) {
            str += '<li><a href=""><img src="' + this.img[i] + '" alt=""></a></li>'
            listStr += '<li></li>'
        }
        str += '<li><a href=""><img src="' + this.img[0] + '" alt=""></a></li>';

        $(listStr).appendTo(list);
        $(dot).append(list)
        this.wrap.append(imgBox.html(str))
            .append(dot.append(list))
            .append(btnL)
            .append(btnR)

        $('.img-box').css({
            width: this.itemWidth * (len + 1) + 'px',
            height: this.itemHeight + 'px'
        })
        $('.img-box li').css({
            width: this.itemWidth + 'px'
        })
        $('.dot li').eq(0).addClass('active')
    }

    Swiper.prototype.sliderAuto = function() {
        var self = this;
        clearTimeout(self.timer)
        self.timer = setTimeout(function() {
            self.move('next')
        }, self.interval)
    }
    Swiper.prototype.bindEvent = function() {
        var self = this;
        $('.dot li').add('.prevBtn').add('.nextBtn').on('click', function() {

            if ($(this).hasClass('prevBtn')) {
                self.move('prev')
            } else if ($(this).hasClass('nextBtn')) {
                self.move('next')
            } else {
                var index = $(this).index();

                self.move(index)
            }
        })
        $('#swiper').hover(function() {

            $('#swiper .btn').show()
            clearTimeout(self.timer)
        }, function() {
            $('#swiper .btn').hide()
            self.sliderAuto();
        })


    }
    Swiper.prototype.move = function(dir) {
        var len = this.len;
        var self = this;

        var itemWidth = this.itemWidth
        if (this.flag) {
            this.flag = false;
            if (dir == 'prev' || dir == 'next') {
                if (dir == 'prev') {
                    if (this.nowIndex == 0) {
                        $('.img-box').css({
                            left: -(len * itemWidth)
                        })
                        this.nowIndex = len - 1;
                    } else {

                        this.nowIndex = this.nowIndex - 1;
                    }
                } else {
                    if (this.nowIndex == len - 1) {
                        $('.img-box').animate({
                            left: -(len * itemWidth)
                        }, function() {
                            $(this).css({
                                left: 0,
                            })
                            flag = true;

                            self.sliderAuto()
                        })
                        this.nowIndex = 0;
                    } else {

                        this.nowIndex = this.nowIndex + 1;
                    }
                }
            } else {
                this.nowIndex = dir;
            }
            this.slider()
            this.changeStyle();
        }
    }

    Swiper.prototype.slider = function() {
        var self = this;
        $('.img-box').animate({
            left: -(self.nowIndex * self.itemWidth)
        }, function() {
            self.sliderAuto();
            self.flag = true;
        })
    }
    Swiper.prototype.changeStyle = function() {
        $('.active').removeClass('active')
        $('.dot li').eq(this.nowIndex).addClass('active')
    }
    $.fn.extend({
        sliderImg: function(options) {
            options.father = this || $('body');
            new Swiper(options);
        
        }

    })

})(jQuery)