import $ from 'zepto'
import angular from 'angular'
import service from './src/service'
import uirouter from 'uirouter'
// import uirouter from '@uirouter/angularjs'
import ngCookies from 'angular-cookies'
import fastclick from 'fastclick'
import { setColors } from './src/config'
// polyfill fastclick
// 解决手机端点击延迟问题
if ( 'addEventListener' in document ) {
  document.addEventListener('DOMContentLoaded', function() {
    fastclick.attach(document.body)
  }, false)
}

import ep from 'promise'
ep.polyfill()

import { Indexeddb } from './src/service/indexeddb'

Indexeddb().openDB()
import './src/assets/css/index.less'
import './node_modules/swiper/dist/css/swiper.min.css'
import routes from './src/routes'
import directives from './src/directive'

// $.fn.longPress = function(fn) {
//
//     var timeout = undefined
//     var $this = this
//     for(var i = 0;i<$this.length;i++){
//         $this[i].addEventListener('touchstart', function(event) {
//             timeout = setTimeout(fn, 800);  //长按时间超过800ms，则执行传入的方法
//         }, false)
//         $this[i].addEventListener('touchend', function(event) {
//             clearTimeout(timeout);  //长按时间少于800ms，不会执行传入的方法
//         }, false)
//     }
// }
// $(document).longPress(function(){
//     console.log(11111111111111111)
// })
const app = angular.module('myApp', [
    ngCookies,
    uirouter,
    service
]).directive('tabs', directives.tabs)
  .directive('tab', directives.tab)
  .directive('imarquee', directives.imarquee)
  .directive('iheader', directives.iheader)
  .directive('back', directives.back)
  .directive('content', directives.content)
  .directive('carousel', directives.carousel)
  .directive('carouselItem', directives.carouselItem)
  .directive('tabItems', directives.tabItems)
  .directive('tabItem', directives.tabItem)
  .directive('pullRefresh', directives.pullRefresh)
  .directive('slideTabs', directives.slideTabs)
  .directive('slideTab', directives.slideTab)
  .directive('lazyImg', directives.lazyImg)
  .directive('ifooter', directives.ifooter)
  .directive('number', directives.number)
  .directive('ionTabs', directives.ionTabs)
  .directive('ionTab', directives.ionTab)
  .directive('ionView', directives.ionView)
  .directive('drawLine', directives.drawLine)
  .directive('fileUpLoad', directives.fileUpLoad)

app.config((
    $stateProvider,
    $urlRouterProvider,
    $locationProvider,
    $httpProvider
) => {
    $locationProvider.html5Mode(true)
    $httpProvider.defaults.headers.common = {}
    $httpProvider.defaults.headers.post = {}
    $httpProvider.defaults.headers.put = {}
    $httpProvider.defaults.headers.patch = {}

    $urlRouterProvider.otherwise('/tabs/home')

    routes($stateProvider)
})

app.config([
    '$compileProvider',
    function( $compileProvider ) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|file|sms|weixin|alipayqr):/)
        // Angular v1.2 之前使用 $compileProvider.urlSanitizationWhitelist(...)
    }
])

app.run(function ($rootScope, RS, $cookieStore, Layer, Core, $timeout, $location) {
    const { $$search } = $location
    if(!$cookieStore.get('s')) {
        $cookieStore.put('s', $$search.s)
    }

    if(/Android|webOS|iPhone|Windows Phone|iPod|BlackBerry|SymbianOS/i.test(navigator.userAgent) || window.innerWidth <= 800) {
        $('ui-view').show()
    } else {
        const search = $$search.intr ? '?intr=' + $$search.intr : ''
        Core.get('welcome/index', {type: 'pc'}, function(json) {
            const c = angular.fromJson(json)
            if(c.code == 200) {
                c.data && (location.href = c.data[0] + search)
            }
        })
    }
    $rootScope.$on('$locationChangeSuccess', function() {
        Layer.clearModals()
        Layer.clearCD()
    })
    $$search.intr && $cookieStore.put('intr', Number($$search.intr), {expires: 1000})
    $$search.s && $cookieStore.put('s', Number($$search.s), {expires: 1000})
    $rootScope.LTY_ROOT = 'src/lottery/'
    $rootScope.PAGE_SIZE = 15
    $rootScope.DEFAULT_IMG = require('./src/assets/img/bgImages/default.jpg')

    let HomeData = sessionStorage.getItem('HomeData')? JSON.parse(sessionStorage.getItem('HomeData')) : ''

    $rootScope.BY = '博友彩票'
    $rootScope.GF = '官方彩票'
    const setHomeData = function (HomeData) {
        $rootScope.BY = HomeData.sys_games || '博友彩票'
        $rootScope.WEBNAME = HomeData.web_name || ''
        $rootScope.WAP_DOMAIN = HomeData.wap_domain || ''
        $rootScope.IOS_QRCODE = HomeData.ios_qrcode || ''
        $rootScope.ANDROID_QRCODE = HomeData.android_qrcode || ''
        $rootScope.H5_QRCODE = HomeData.h5_qrcode || ''
        $rootScope.LOGO = HomeData.logo || ''
        $rootScope.logo_wap = HomeData.logo_wap || ''
        $rootScope.show_logo_wap = false
        $rootScope.quick_recharge_url = HomeData.quick_recharge_url
        let notice = ''
        if (HomeData.new_notice && HomeData.new_notice.length > 0) {
            angular.forEach(HomeData.new_notice, function (d) {
                notice += d.content
            })
        } else {
            notice = '没有公告通知'
        }
        $rootScope.NOTICEMSG = notice
        $rootScope.COURSEDATA = HomeData.wap_banner_img || []
        $rootScope.ONLINE_SERVICE = HomeData.online_service || ''
        $rootScope.SLIDESIMG = HomeData.wap_slides_img || []
        $rootScope.ROVCODE = HomeData.register_open_verificationcode //是否显示验证码
        $rootScope.IS_BANK_NAME = HomeData.register_open_username //是否显示真实姓名
        $rootScope.IS_AGENT = HomeData.is_agent //是否代理
        $rootScope.SPWD = HomeData.strength_pwd //是否密码强度
        $rootScope.cp_default = HomeData.cp_default
        document.title = $rootScope.WEBNAME
        $rootScope.APPCOLOR = HomeData.app_color || []
        setColors(HomeData.app_color)
        $rootScope.lottery_auth = HomeData.lottery_auth
        //是否显示下载
        $rootScope.IS_NAV = HomeData.IS_NAV
        // 显示条件
        //$rootScope.IS_IOS = HomeData.IS_IOS
        $rootScope.IOS_URL = HomeData.ios_url
        $rootScope.ANDROID_URL = HomeData.android_url
        if(/Android/i.test(navigator.userAgent)) {
            $rootScope.APP_URL = $rootScope.ANDROID_URL || ''
            sessionStorage.setItem('QRCODE', HomeData.android_qrcode)
        } else {
            $rootScope.APP_URL = $rootScope.IOS_URL || ''
            sessionStorage.setItem('QRCODE', HomeData.ios_qrcode)
        }
        $('#ico').attr('href', HomeData.logo_wap)
        $('#appleico').attr('href', HomeData.logo_wap)
        $('#apple_t').attr('href', HomeData.logo_wap)
        /*if ($rootScope.IS_NAV) {
            $cookieStore.put('IS_NAV', $rootScope.IS_NAV)
        }
        if ($rootScope.IS_NAV >= 100) {
            $cookieStore.remove('IS_NAV')
        }
        $rootScope.close = function () {
            $rootScope.IS_NAV = 1
            $cookieStore.put('IS_NAV', $rootScope.IS_NAV)
        }*/
    }
    //定时登陆
    $rootScope.doLogin = function () {
        const now = new Date().getTime()
        let loginData = Core.getCookie('loginData')
        if (now >= loginData.expires_time) {
            RS.getToken()
                .then((c) => {
                    if (c.code == 200) {
                        loginData.token_private_key = c.data.token_private_key
                        RS.login(loginData)
                            .then((c) => {
                                if (c && c.code == 200) {
                                    Core.setToken(c.data.token)
                                    loginData.expires_time = now + parseInt(loginData.refresh_time*1000)
                                    Core.setCookie('loginData', loginData)
                                    $rootScope.loginLoop(loginData.refresh_time*1000)
                                }
                            })
                    }
                })
        } else {
            $rootScope.loginLoop(60*1000)
        }
    }
    $rootScope.loginLoop = function (time) {
        $rootScope.loginTimer = $timeout(function () {
            $rootScope.doLogin()
        }, time)
    }
    const loginData = Core.getCookie('loginData')
    if (Core.getToken() && loginData) {
        const time = loginData.expires_time > new Date().getTime() ? loginData.expires_time - new Date().getTime() : loginData.refresh_time*1000
        $rootScope.loginLoop(time)
    }

    const getSiteInfo = function(fun) {
        RS.getHomeData()
            .then((c) => {
                if (c.code == 200) {
                    const HomeData = {
                        web_name: c.data.web_name,
                        wap_domain: c.data.wap_domain,
                        ios_qrcode: c.data.ios_qrcode,
                        android_qrcode: c.data.android_qrcode,
                        h5_qrcode: c.data.h5_qrcode,
                        logo: c.data.logo,
                        new_notice: c.data.new_notice,
                        wap_banner_img: c.data.pc_banner_img,
                        online_service: c.data.online_service,
                        wap_slides_img: c.data.wap_slides_img,
                        app_color: c.data.app_color,
                        register_open_verificationcode: c.data.register_open_verificationcode,
                        register_open_username: c.data.register_open_username,
                        is_agent: c.data.is_agent,
                        strength_pwd: c.strength_pwd,
                        logo_wap: c.data.logo_wap,
                        cp_default: c.data.cp_default,
                        quick_recharge_url: c.data.quick_recharge_url,
                        android_url: c.data.android_url,
                        ios_url: c.data.ios_url,
                        IS_NAV: $cookieStore.get('IS_NAV') == undefined ? 0 : parseInt($cookieStore.get('IS_NAV')) + 1,
                        //IS_IOS: $cookieStore.get('s') == 1 ? true : false,
                        lottery_auth: c.data.lottery_auth, //彩票权限
                        piwik: c.data.piwik,
                        sys_games: c.data.sys_games

                    }
                    if(fun) {
                        fun(c.data.piwik)
                    }
                    sessionStorage.setItem('HomeData', JSON.stringify(HomeData))
                    setHomeData(HomeData)
                    setColors(c.data.app_color)
                }
            })
    }
    if (HomeData) {
        $('<img src="https://www.boyou.biz/piwik.php?idsite='+HomeData.piwik+'&rec=1" style="border:0">').appendTo('body')
        setHomeData(HomeData)
        setTimeout(function() {getSiteInfo()}, 1000)
    } else {
        getSiteInfo(function(c) {
            $('<img src="https://www.boyou.biz/piwik.php?idsite='+c+'&rec=1" style="border:0">').appendTo('body')
        })
    }
})
