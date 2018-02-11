import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/app.less'
import {$} from './vendors'

import 'animate.css/animate.min.css'
import {WOW} from 'wowjs'


window.onload = function () {
    new WOW().init();
    $('#loading').fadeOut(200, function () {
        $(this).parent().removeClass('modal-open')
            .end().remove();
    });
}





