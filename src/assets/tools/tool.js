export function posterTvGrid(o, options, data) {
    this.parent = $("#" + o);
    this.body = $("body");
    if (this.parent.length <= 0) {
        return false;
    }
    
    this.options = $.extend({}, posterTvGrid.options, options);
    if (typeof(data) !== 'object') return false;
    
    this.data = data || {};
    this.reset();
    //处理页面resize
    var _this = this;
    $(window).resize(function () {
        _this.reset();
    });
};
posterTvGrid.prototype = {
    reset: function (options) {
        if (typeof(options) == 'object') {
            $.extend(this.options, options);
        }
        if (parseInt(this.body.outerWidth()) > 1255 || navigator.userAgent.indexOf('iPad') !== -1) {
            this.options.width = 1190;
        } else {
            this.options.width = 970;
        }
        this.total = this.data.length;
        this.pageNow = this.options.initPage;
        this.preLeft = 0;
        this.nextLeft = this.options.width - 530;
        this.preNLeft = -530;
        this.nextNLeft = this.options.width;
        this.pageNowLeft = (this.options.width - 640) / 2
        this.drawContent();
    },
    drawContent: function () {
        this.parent.empty();
        this.parent.css({
            width: this.options.width + "px",
            height: this.options.height + "px",
            position: "relative",
            margin: '20px auto 0'
        });
        this.content = document.createElement("DIV");
        this.content.className = this.options.className;
        this.content.cssText = "width:" + this.options.width + "px;height:" + this.options.height + "px;cursor:move;position:absolute;";
        this.bottomNav = document.createElement("DIV");
        this.bottomNav.className = "bottomNav";
        for (var i = 1; i <= this.total; i++) {
            var bottomItem = document.createElement("DIV");
            bottomItem.className = "bottomNavButtonOFF";
            if (i == this.pageNow) {
                bottomItem.className = "bottomNavButtonOFF bottomNavButtonON";
            }
            bottomItem.setAttribute("ref", i);
            this.bottomNav.appendChild(bottomItem);
        }
        // this.content.appendChild(this.bottomNav);
        this.bannerControls = '<div class="bannerControls"> <div class="leftNav"><i class="glyphicon glyphicon-menu-left"></i></div> <div class="rightNav"><i class="glyphicon glyphicon-menu-right"></i></div> </div>';
        this.content.innerHTML += this.bannerControls;
        
        this.contentHolder = document.createElement("DIV");
        this.contentHolder.style.width = this.options.width + 'px';
        this.contentHolder.style.height = this.options.height + 'px';
        
        for (var item = 0, i = 1, l = this.data.length; item < l; ++item, ++i) {
            var contentHolderUnit = document.createElement("DIV");
            contentHolderUnit.className = "contentHolderUnit";
            contentHolderUnit.setAttribute("ref", i);
            contentHolderUnit.setAttribute("id", 'contentHolderUnit' + (i));
            var unitItem = '<img src="' + this.data[item].img + '" alt="' + this.data[item].title + '"/>';
            unitItem += '<span class="leftShadow"></span>';
            unitItem += '<span class="rightShadow"></span>';
            contentHolderUnit.innerHTML = unitItem;
            this.contentHolder.appendChild(contentHolderUnit);
        }
        this.content.appendChild(this.contentHolder);
        this.parent.append(this.content);
        this.parent.css({overflow: 'hidden'});
        this.initContent();
        this.bind();
        // this.start();
    },
    initContent: function () {
        var contentHolderUnit = this.parent.find(".contentHolderUnit");
        contentHolderUnit.css({
            width: '0px',
            height: '0px',
            opacity: 0,
            left: '435px',
            zIndex: 0,
            marginTop: '135px'
        });
        this.parent.find(".contentHolderUnit:nth-child(" + this.pageNow + ")").css({
            width: '320px',
            height: '662px',
            opacity: 1,
            left: '435px',
            zIndex: 3,
            marginTop: 0
        });
        this.parent.find(".contentHolderUnit:nth-child(" + this.pageNow + ") .leftShadow").css({opacity: 1});
        this.parent.find(".contentHolderUnit:nth-child(" + this.pageNow + ") .rightShadow").css({opacity: 1});
        
        var pre = this.pageNow > 1 ? this.pageNow - 1 : this.total;
        var next = this.pageNow == this.total ? 1 : this.pageNow + 1;
        this.parent.find(".contentHolderUnit:nth-child(" + pre + ")").css({
            opacity: 1,
            left: '85px',
            height: '580px',
            width: '280px',
            zIndex: 0,
            marginTop: '41px'
        });
        this.parent.find(".contentHolderUnit:nth-child(" + pre + ") .leftShadow").css({opacity: 0});
        this.parent.find(".contentHolderUnit:nth-child(" + pre + ") .rightShadow").css({opacity: 0});
        
        this.parent.find(".contentHolderUnit:nth-child(" + next + ")").css({
            opacity: 1,
            left: '825px',
            height: '580px',
            width: '280px',
            zIndex: 0,
            marginTop: '41px'
        });
        this.parent.find(".contentHolderUnit:nth-child(" + next + ") .leftShadow").css({opacity: 0});
        this.parent.find(".contentHolderUnit:nth-child(" + next + ") .rightShadow").css({opacity: 0});
    },
    bind: function () {
        this.leftNav = this.parent.find(".leftNav");
        this.rightNav = this.parent.find(".rightNav");
        this.bottonNav = this.parent.find(".bottomNavButtonOFF");
        this.lists = this.parent.find(".contentHolderUnit");
        var _this = this, dir;
        _this.leftNav.click(function () {
            _this.turn("right");
        });
        _this.rightNav.click(function () {
            _this.turn("left");
        });
        _this.bottonNav.click(function () {
            var ref = parseInt(this.getAttribute("ref"));
            if (_this.pageNow == ref) return false;
            
            if (_this.pageNow < ref) {
                var rightAbs = ref - _this.pageNow;
                var leftAbs = _this.pageNow + _this.total - ref;
            } else {
                var rightAbs = _this.total - _this.pageNow + ref;
                var leftAbs = _this.pageNow - ref;
            }
            if (leftAbs < rightAbs) {
                dir = "right";
            } else {
                dir = "left";
            }
            
            _this.turnpage(ref, dir);
            return false;
        });
        
        _this.lists.click(function (e) {
            var ref = parseInt(this.getAttribute("ref"));
            if (_this.pageNow == ref) {
                return true;
            } else {
                e.preventDefault();
            }
            if (_this.pageNow < ref) {
                var rightAbs = ref - _this.pageNow;
                var leftAbs = _this.pageNow + _this.total - ref;
            } else {
                var rightAbs = _this.total - _this.pageNow + ref;
                var leftAbs = _this.pageNow - ref;
            }
            if (leftAbs < rightAbs) {
                dir = "right";
            } else {
                dir = "left";
            }
            _this.turnpage(ref, dir);
            
        });
    },
    initBottomNav: function () {
        this.parent.find(".bottomNavButtonOFF").removeClass("bottomNavButtonON");
        this.parent.find(".bottomNavButtonOFF:nth-child(" + this.pageNow + ")").addClass("bottomNavButtonON");
    },
    stop: function () {
        clearInterval(this.timerId);
    },
    turn: function (dir) {
        var _this = this;
        
        if (dir == "right") {
            var page = _this.pageNow - 1;
            if (page <= 0) page = _this.total;
        } else {
            var page = _this.pageNow + 1;
            if (page > _this.total) page = 1;
        }
        _this.turnpage(page, dir);
    },
    turnpage: function (page, dir) {
        var _this = this;
        if (_this.locked) return false;
        _this.locked = true;
        if (_this.pageNow == page) return false;
        var run = function (page, dir, t) {
            var pre = page > 1 ? page - 1 : _this.total;
            var next = page == _this.total ? 1 : page + 1;
            var preP = pre - 1 >= 1 ? pre - 1 : _this.total;
            var nextN = next + 1 > _this.total ? 1 : next + 1;
            if (pre != _this.pageNow && next != _this.pageNow) {
                var nowpre = _this.pageNow > 1 ? _this.pageNow - 1 : _this.total;
                var nownext = _this.pageNow == _this.total ? 1 : _this.pageNow + 1;
                _this.parent.find(".contentHolderUnit:nth-child(" + nowpre + ")").animate({
                    width: '0px',
                    height: '0px',
                    opacity: 1,
                    left: '85px',
                    zIndex: 0,
                    marginTop: '135px'
                }, t);
                _this.parent.find(".contentHolderUnit:nth-child(" + _this.pageNow + ")").animate({
                    width: '0px',
                    height: '0px',
                    opacity: 1,
                    left: '435px',
                    zIndex: 0,
                    marginTop: '135px'
                }, t);
                _this.parent.find(".contentHolderUnit:nth-child(" + nownext + ")").animate({
                    width: '0px',
                    height: '0px',
                    opacity: 1,
                    left: '825px',
                    zIndex: 0,
                    marginTop: '135px'
                }, t);
            }
            if (dir == 'left') {
                _this.parent.find(".contentHolderUnit:nth-child(" + _this.pageNow + ")").css({zIndex: 0});
                _this.parent.find(".contentHolderUnit:nth-child(" + pre + ")").animate({
                    opacity: 1,
                    left: '85px',
                    height: '580px',
                    width: '280px',
                    zIndex: 2,
                    marginTop: '41px'
                }, t);
                _this.parent.find(".contentHolderUnit:nth-child(" + page + ")").css({zIndex: 3});
                _this.parent.find(".contentHolderUnit:nth-child(" + page + ")").animate({
                    opacity: 1,
                    left: '435px',
                    height: '662px',
                    width: '320px',
                    zIndex: 3,
                    marginTop: '0'
                }, t);
                _this.parent.find(".contentHolderUnit:nth-child(" + next + ")").css({
                    opacity: 1,
                    left: '1175px',
                    height: '580px',
                    width: '280px',
                    zIndex: 0,
                    marginTop: '41px'
                });
                _this.parent.find(".contentHolderUnit:nth-child(" + next + ")").animate({
                    opacity: 1,
                    left: '825px',
                    height: '580px',
                    width: "280px",
                    zIndex: 0,
                    marginTop: '41px'
                }, t);
                _this.parent.find(".contentHolderUnit:nth-child(" + preP + ")").css({zIndex: 0});
                _this.parent.find(".contentHolderUnit:nth-child(" + preP + ")").animate({
                    width: '280px',
                    height: '580px',
                    opacity: 1,
                    left: '-315px',
                    zIndex: 0,
                    marginTop: '41px'
                }, t, "", function () {
                    _this.locked = false;
                });
            } else {
                _this.parent.find(".contentHolderUnit:nth-child(" + _this.pageNow + ")").css({zIndex: 0});
                _this.parent.find(".contentHolderUnit:nth-child(" + next + ")").css({zIndex: 2});
                _this.parent.find(".contentHolderUnit:nth-child(" + next + ")").animate({
                    opacity: 1,
                    left: '825px',
                    height: '580px',
                    width: '280px',
                    zIndex: 2,
                    marginTop: '41px'
                }, t);
                _this.parent.find(".contentHolderUnit:nth-child(" + page + ")").css({zIndex: 3}, t);
                _this.parent.find(".contentHolderUnit:nth-child(" + page + ")").animate({
                    opacity: 1,
                    left: '435px',
                    height: '662px',
                    width: '320px',
                    zIndex: 3,
                    marginTop: '0px'
                }, t);
                _this.parent.find(".contentHolderUnit:nth-child(" + pre + ")").css({
                    opacity: 1,
                    left: '-265px',
                    height: '580px',
                    width: '280px',
                    zIndex: 2,
                    marginTop: '41px'
                });
                _this.parent.find(".contentHolderUnit:nth-child(" + pre + ")").animate({
                    opacity: 1,
                    left: '85px',
                    height: '580px',
                    width: '280px',
                    zIndex: 2,
                    marginTop: '41px'
                }, t);
                _this.parent.find(".contentHolderUnit:nth-child(" + nextN + ")").css({zIndex: 0});
                _this.parent.find(".contentHolderUnit:nth-child(" + nextN + ")").animate({
                    width: '280px',
                    height: '580px',
                    opacity: 1,
                    left: '1225px',
                    zIndex: 0,
                    marginTop: '41px'
                }, t, "", function () {
                    _this.locked = false;
                });
            }
            _this.pageNow = page;
            _this.initBottomNav();
        };
        run(page, dir, _this.options.speed);
    }
};
posterTvGrid.options = {
    offsetPages: 3,//默认可视最大条数
    direct: "left",//滚动的方向
    initPage: 1,//默认当前显示第几条
    className: "posterTvGrid",//最外层样式
    autoWidth: true,//默认不用设置宽
    //width: 970,//最外层宽，需要使用的时候在传,默认由程序自动判断
    //height: 310,//最外层高
    delay: 3000,//滚动间隔（毫秒）
    speed: 500 //滚动速度毫秒
};

export function loadingHandler(o) {
    this.totalImages = o.srcList.length;
    this.srcList = o.srcList;
    this.callback = o.callback || null;
};
loadingHandler.prototype = {
    loadIMG: function () {
        let _this = this;
        for (let i = 0; i < _this.totalImages; i++) {
            (function (index) {
                var Img = new Image();
                Img.src = _this.srcList[index].img;
                if (Img.complete) {
                    _this.callback();
                } else {
                    Img.onload = _this.callback;
                }
            })(i);
        }
    }
};