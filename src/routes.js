import stateHandler from './stateHandler'

const onEnter = function(Core, Layer, $state, $location) {
    const isLogin = Core.isLogin()
    if(!isLogin) {
        Layer.toast('请先登录', 1, function() {
            const { $$path } = $location
            if($$path !== '/tabs/my') {
                $state.go('tabs.my')
            }
        })
        return false
    }
}

const filterLogined = function(Core, $state, $timeout) {
    const isLogin = Core.isLogin()
    if(isLogin) {
        $timeout(function() {
            $state.go('tabs.home')
        })
    }
}
/*
 * stateHandler 接收3个参数
 *  url, 字符串，对应的路由，必传
 *	key, 字符串，这里的key对应在stateHandler中 数据对象的key，必传
 *  params, 对象，可以传cache, abstract等属性，非必传
 */
export default function($stateProvider) {
    $stateProvider
        .state('tabs', stateHandler('/tabs', 'tabs', {
            cache: false,
            abstract: true
        }))
        .state('tabs.home', stateHandler('/home', 'home', {
            cache: true
        }))
        .state('tabs.my', stateHandler('/my', 'my', {
            cache: true
        }))
        .state('tabs.discover', stateHandler('/discover', 'discover', {
            cache: true
        }))
        .state('tabs.buy', stateHandler('/buy/:type', 'buy', {
            cache: false
        }))
        .state('tabs.order', stateHandler('/order', 'order', {
            cache: false
        }))
        .state('tabs.open', stateHandler('/open', 'open', {
            cache: true
        }))
        .state('allLottery', stateHandler('/allLottery/:type', 'allLottery', {
        	cache: true
        }))
        .state('login', stateHandler('/login/:ret', 'login', {
        	cache: false,
            onEnter: filterLogined
        }))
        .state('register', stateHandler('/register', 'register', {
            cache: false,
            onEnter: filterLogined
        }))
        .state('set', stateHandler('/set', 'set', {
            cache: false,
            onEnter
        }))
        .state('rule', stateHandler('/rule/:type', 'rule', {
            cache: false
        }))
        .state('income', stateHandler('/income', 'income', {
            cache: false,
            onEnter
        }))
        .state('activity', stateHandler('/activity', 'activity', {
            cache: true
        }))
        .state('activityview', stateHandler('/activity/view/:id', 'activityview', {
            cache: true
        }))
        .state('detailSet', stateHandler('/detailSet', 'detailSet', {
            cache: true,
            onEnter
        }))
        .state('bonus', stateHandler('/bonus', 'bonus', {
            cache: true,
            onEnter
        }))
        .state('topup', stateHandler('/topup', 'topup', {
            cache: false,
            onEnter
        }))
        .state('topupTwo', stateHandler('/topupTwo', 'topupTwo', {
            cache: false,
            onEnter
        }))
        .state('topUpFinish', stateHandler('/topUpFinish', 'topUpFinish', {
            cache: false,
            onEnter
        }))
        .state('pk10', stateHandler('/pk10/:type/:gid', 'pk10', {
            cache: false
        }))
        .state('s_pk10', stateHandler('/s_pk10/:type/:gid', 's_pk10', {
            cache: false
        }))
        .state('ssc', stateHandler('/ssc/:type/:gid', 'ssc', {
            cache: false
        }))
        .state('s_ssc', stateHandler('/s_ssc/:type/:gid', 's_ssc', {
            cache: false
        }))
        .state('pcdd', stateHandler('/pcdd/:type/:gid', 'pcdd', {
            cache: false
        }))
        .state('11x5', stateHandler('/11x5/:type/:gid', '11x5', {
            cache: false
        }))
        .state('s_11x5', stateHandler('/s_11x5/:type/:gid', 's_11x5', {
            cache: false
        }))
        .state('k3', stateHandler('/k3/:type/:gid', 'k3', {
            cache: false
        }))
        .state('s_k3', stateHandler('/s_k3/:type/:gid', 's_k3', {
            cache: false
        }))
        .state('s_kl10', stateHandler('/s_kl10/:type/:gid', 's_kl10', {
            cache: false
        }))
        .state('yb', stateHandler('/yb/:type/:gid', 'yb', {
            cache: false
        }))
        .state('s_yb', stateHandler('/s_yb/:type/:gid', 's_yb', {
            cache: false
        }))
        .state('lhc', stateHandler('/lhc/:type/:gid', 'lhc', {
            cache: false
        }))
        .state('cart', stateHandler('/cart/:gid/:type', 'cart', {
            cache: false
        }))
        .state('proxy', stateHandler('/proxy', 'proxy', {
            cache: false,
            onEnter
        }))
        .state('sheet', stateHandler('/sheet', 'sheet', {
            cache: false,
            onEnter
        }))
        .state('submasses', stateHandler('/submasses', 'submasses', {
            cache: false,
            onEnter
        }))
        .state('account', stateHandler('/account', 'account', {
            cache: false,
            onEnter
        }))
        .state('betting', stateHandler('/betting', 'betting', {
            cache: false,
            onEnter
        }))
        .state('commission', stateHandler('/commission', 'commission', {
            cache: false,
            onEnter
        }))
        .state('apply', stateHandler('/apply', 'apply', {
            cache: false,
            onEnter
        }))
        .state('withdraw', stateHandler('/withdraw', 'withdraw', {
            cache: false,
            onEnter
        }))
        .state('notice', stateHandler('/notice', 'notice', {
            cache: false,
            onEnter
        }))
        .state('noticeDetail', stateHandler('/noticeDetail/:type', 'noticeDetail', {
            cache: false,
            onEnter
        }))
        .state('aboutUs', stateHandler('/aboutUs', 'aboutUs', {
            cache: false
        }))
        .state('favorite', stateHandler('/favorite', 'favorite', {
            cache: false,
            onEnter
        }))
        .state('open', stateHandler('/open', 'open', {
            cache: false
        }))
        .state('openDetail', stateHandler('/openDetail/:gid/:img/:name/:tmp', 'openDetail', {
            cache: false
        }))
        .state('modifyMoneyPwd', stateHandler('/modifyMoneyPwd/:type', 'modifyMoneyPwd', {
            cache: false,
            onEnter
        }))
        .state('modifyLoginPwd', stateHandler('/modifyLoginPwd', 'modifyLoginPwd', {
            cache: false,
            onEnter
        }))
        .state('bindCard', stateHandler('/bindCard/:type', 'bindCard', {
            cache: false,
            onEnter
        }))
        .state('userCard', stateHandler('/userCard', 'userCard', {
            cache: false,
            onEnter
        }))
        .state('smartTrack', stateHandler('/smartTrack/:gid/:total', 'smartTrack', {
            cache: false,
            onEnter
        }))
        .state('payoutRecord', stateHandler('/payoutRecord', 'payoutRecord', {
            cache: false,
            onEnter
        }))
        .state('payoutDetail', stateHandler('/payoutDetail/:id', 'payoutDetail', {
            cache: false,
            onEnter
        }))
        .state('incomeDetail', stateHandler('/incomeDetail', 'incomeDetail', {
            cache: false,
            onEnter
        }))
        .state('cashRecord', stateHandler('/cashRecord', 'cashRecord', {
            cache: false,
            onEnter
        }))
        .state('trend', stateHandler('/trend/:gid/:tmp', 'trend', {
            cache: false
        }))
        .state('lhccart', stateHandler('/lhccart/:gid/:type', 'lhccart', {
            cache: false
        }))
        .state('userInfo', stateHandler('/userInfo', 'userInfo', {
            cache: true,
            onEnter
        }))
        .state('profit', stateHandler('/profit', 'profit', {
            cache: true,
            onEnter
        }))
        .state('playerDetail', stateHandler('/discover/:type/:id', 'playerDetail', {
            cache: true
        }))
        .state('share', stateHandler('/share', 'share', {
            cache: false
        }))
        .state('question', stateHandler('/question/:id', 'question', {
            cache: false
        }))
        //微信好友转账
        .state('wxAccount', stateHandler('/wxAccount', 'wxAccount', {
            cache: false
        }))
        .state('topUpConfirm', stateHandler('/topUpConfirm', 'topUpConfirm', {
            cache: false
        }))
        //系统维护提示
        .state('maintenance', stateHandler('/maintenance', 'maintenance', {
            cache: false
        }))
        //app下载
        .state('loadApp', stateHandler('/loadApp', 'loadApp', {
            cache: true
        }))
        .state('qqService', stateHandler('/qqService', 'qqService', {
            cache: true
        }))
}
