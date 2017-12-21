import './index.less'
import {$} from "@/vendors"
import 'jquery.localscroll'
import 'jquery.scrollto'
import 'bootstrap/dist/js/bootstrap.min'
import {posterTvGrid, loadingHandler} from '@/assets/tools/tool'
$(function () {
    $.localScroll({filter: '.smoothScroll'});
    let doneImages = 0,
        loadingPercent = 0,
        dom = {
            modal: $('#webApp'),
            service: $('#service'),
            posterTvGrid: $('#posterTvGrid')
        },
        demoImg = {
            clothes: [
                {img: require('@/assets/img/clothes/clothes_1.png')},
                {img: require('@/assets/img/clothes/clothes_2.png')},
                {img: require('@/assets/img/clothes/clothes_3.png')},
                {img: require('@/assets/img/clothes/clothes_4.png')},
                {img: require('@/assets/img/clothes/clothes_5.png')}
            ],
            education: [
                {img: require('@/assets/img/education/education_1.png')},
                {img: require('@/assets/img/education/education_2.png')},
                {img: require('@/assets/img/education/education_3.png')},
                {img: require('@/assets/img/education/education_3.png')}
            ],
            health: [
                {img: require('@/assets/img/health/health_1.png')},
                {img: require('@/assets/img/health/health_2.png')},
                {img: require('@/assets/img/health/health_3.png')},
                {img: require('@/assets/img/health/health_4.png')}
            ]
        },
        _posterTvGrid = new posterTvGrid('posterTvGrid', {
            height: 600
        });
    dom.service.on('click', '.case-wrap', function () {
        let _this = $(this);
        dom.modal.one('shown.bs.modal', function () {
            let self = $(this);
            self.find('#webAppLabel').html(_this.data('title'));
            let imgList = demoImg[_this.data('demo')];
            new loadingHandler({
                srcList: imgList,
                callback: function () {
                    doneImages++;
                    loadingPercent = parseInt((doneImages / imgList.length) * 100);
                    if (loadingPercent === 100) {
                        self.find('.cssload-box-loading').fadeOut(600, function () {
                            _posterTvGrid.data = imgList;
                            _posterTvGrid.reset();
                            dom.posterTvGrid.fadeIn();
                        });
                    }
                }
            }).loadIMG();
        }).one('hidden.bs.modal', function () {
            var self = $(this);
            doneImages = 0;
            loadingPercent = 0;
            self.find('.cssload-box-loading').show();
            dom.posterTvGrid.hide();
        }).modal('show')
    })
});



