import Ep from 'promise'

const components = {
	tabs: (resolve) => {
		require.ensure([], (require) => {
            var controller = require('./components/tabs/tabs.controller.js').default
            var template = require('./components/tabs/tabs.tpl.html')
            resolve({
                controller,
                template
            })
        })
	},
	home: (resolve) => {
		require.ensure([], (require) => {
            var controller = require('./components/home/home.controller.js').default
            var template = require('./components/home/home.tpl.html')
            resolve({
                controller,
                template
            })
        })
	},
    my: (resolve) => {
        require.ensure([], (require) => {
            var controller = require('./components/member/member.controller.js').default
            var template = require('./components/member/member.tpl.html')
            resolve({
                controller,
                template
            })
        })
    },
    //发现
    discover: (resolve) => {
        require.ensure([], (require) => {
            var controller = require('./components/discover/discover.controller.js').default
            var template = require('./components/discover/discover.tpl.html')
            resolve({
                controller,
                template
            })
        })
    },

    buy: (resolve) => {
        require.ensure([], (require) => {
            var controller = require('./lottery/buy/buy.controller.js').default
            var template = require('./lottery/buy/buy.tpl.html')
            resolve({
                controller,
                template
            })
        })
    },
    order: (resolve) => {
        require.ensure([], (require) => {
            var controller = require('./components/order/order.controller.js').default
            var template = require('./components/order/order.tpl.html')
            resolve({
                controller,
                template
            })
        })
    },
	allLottery: (resolve) => {
		require.ensure([], (require) => {
            var controller = require('./components/all-lottery/all-lottery.controller.js').default
            var template = require('./components/all-lottery/all-lottery.tpl.html')
            resolve({
                controller,
                template
            })
        })
	},
	login: (resolve) => {
		require.ensure([], (require) => {
            var controller = require('./components/login/login.controller.js').default
            var template = require('./components/login/login.tpl.html')
            resolve({
                controller,
                template
            })
        })
	},
    register: (resolve) => {
        require.ensure([], (require) => {
            var controller = require('./components/register/register.controller.js').default
            var template = require('./components/register/register.tpl.html')
            resolve({
                controller,
                template
            })
        })
    },
    set: (resolve) => {
        require.ensure([], (require) => {
            var controller = require('./components/set/set.controller.js').default
            var template = require('./components/set/set.tpl.html')
            resolve({
                controller,
                template
            })
        })
    },
    rule: (resolve) => {
        require.ensure([], (require) => {
            var controller = require('./components/rule/rule.controller.js').default
            var template = require('./components/rule/rule.tpl.html')
            resolve({
                controller,
                template
            })
        })
    },
    income: (resolve) => {
        require.ensure([], (require) => {
            var controller = require('./components/income/income.controller.js').default
            var template = require('./components/income/income.tpl.html')
            resolve({
                controller,
                template
            })
        })
    },
    activity: (resolve) => {
        require.ensure([], (require) => {
            var controller = require('./components/activity/activity.controller.js').default
            var template = require('./components/activity/activity.tpl.html')
            resolve({
                controller,
                template
            })
        })
    },
    activityview: (resolve) => {
        require.ensure([], (require) => {
            var controller = require('./components/activity/view.controller.js').default
            var template = require('./components/activity/view.tpl.html')
            resolve({
                        controller,
                        template
                    })
        })
    },
    detailSet: (resolve) => {
        require.ensure([], (require) => {
            var controller = require('./components/detail-set/detail-set.controller.js').default
            var template = require('./components/detail-set/detail-set.tpl.html')
            resolve({
                controller,
                template
            })
        })
    },
    bonus: (resolve) => {
        require.ensure([], (require) => {
            var controller = require('./components/bonus/bonus.controller.js').default
            var template = require('./components/bonus/bonus.tpl.html')
            resolve({
                controller,
                template
            })
        })
    },
    topup: (resolve) => {
        require.ensure([], (require) => {
            var controller = require('./components/top-up/top-up.controller.js').default
            var template = require('./components/top-up/top-up.tpl.html')
            resolve({
                controller,
                template
            })
        })
    },
    topupTwo: (resolve) => {
        require.ensure([], (require) => {
            var controller = require('./components/topup-two/topup-two.controller.js').default
            var template = require('./components/topup-two/topup-two.tpl.html')
            resolve({
                controller,
                template
            })
        })
    },
    topUpFinish: (resolve) => {
        require.ensure([], (require) => {
            var controller = require('./components/topUpFinish/topUpFinish.controller.js').default
            var template = require('./components/topUpFinish/topUpFinish.tpl.html')
            resolve({
                controller,
                template
            })
        })
    },
    pk10: (resolve) => {
        require.ensure([], (require) => {
            var controller = require('./lottery/pk10/pk10.controller.js').default
            var template = require('./lottery/detail/detail.tpl.html')
            resolve({
                controller,
                template
            })
        })
    },
    s_pk10: (resolve) => {
        require.ensure([], (require) => {
            var controller = require('./lottery/s_pk10/s_pk10.controller.js').default
            var template = require('./lottery/detail/detail.tpl.html')
            resolve({
                controller,
                template
            })
        })
    },
    ssc: (resolve) => {
        require.ensure([], (require) => {
            var controller = require('./lottery/ssc/ssc.controller.js').default
            var template = require('./lottery/detail/detail.tpl.html')
            resolve({
                controller,
                template
            })
        })
    },
    s_ssc: (resolve) => {
        require.ensure([], (require) => {
            var controller = require('./lottery/s_ssc/s_ssc.controller.js').default
            var template = require('./lottery/detail/detail.tpl.html')
            resolve({
                controller,
                template
            })
        })
    },
    pcdd: (resolve) => {
        require.ensure([], (require) => {
            var controller = require('./lottery/pcdd/pcdd.controller.js').default
            var template = require('./lottery/detail/detail.tpl.html')
            resolve({
                controller,
                template
            })
        })
    },
    '11x5': (resolve) => {
        require.ensure([], (require) => {
            var controller = require('./lottery/11x5/11x5.controller.js').default
            var template = require('./lottery/detail/detail.tpl.html')
            resolve({
                controller,
                template
            })
        })
    },
    s_11x5: (resolve) => {
        require.ensure([], (require) => {
            var controller = require('./lottery/s_11x5/s_11x5.controller.js').default
            var template = require('./lottery/detail/detail.tpl.html')
            resolve({
                controller,
                template
            })
        })
    },
    k3: (resolve) => {
        require.ensure([], (require) => {
            var controller = require('./lottery/k3/k3.controller.js').default
            var template = require('./lottery/detail/detail.tpl.html')
            resolve({
                controller,
                template
            })
        })
    },
    s_k3: (resolve) => {
        require.ensure([], (require) => {
            var controller = require('./lottery/s_k3/s_k3.controller.js').default
            var template = require('./lottery/detail/detail.tpl.html')
            resolve({
                controller,
                template
            })
        })
    },
    s_kl10: (resolve) => {
        require.ensure([], (require) => {
            var controller = require('./lottery/s_kl10/s_kl10.controller.js').default
            var template = require('./lottery/detail/detail.tpl.html')
            resolve({
                controller,
                template
            })
        })
    },
    yb: (resolve) => {
        require.ensure([], (require) => {
            var controller = require('./lottery/yb/yb.controller.js').default
            var template = require('./lottery/detail/detail.tpl.html')
            resolve({
                controller,
                template
            })
        })
    },
    s_yb: (resolve) => {
        require.ensure([], (require) => {
            var controller = require('./lottery/s_yb/s_yb.controller.js').default
            var template = require('./lottery/detail/detail.tpl.html')
            resolve({
                controller,
                template
            })
        })
    },
    lhc: (resolve) => {
        require.ensure([], (require) => {
            var controller = require('./lottery/lhc/lhc.controller.js').default
            var template = require('./lottery/lhc/lhc.tpl.html')
            resolve({
                controller,
                template
            })
        })
    },
	cart: (resolve) => {
		require.ensure([], (require) => {
			var controller = require('./lottery/cart/cart.controller.js').default
			var template = require('./lottery/cart/cart.tpl.html')
			resolve({
				controller,
				template
			})
		})
	},
    proxy: (resolve) => {
	    require.ensure([], (require) => {
	        var controller = require('./components/proxy/proxy.controller.js').default
            var template = require('./components/proxy/proxy.tpl.html')
            resolve({
                controller,
                template
            })
        })
    },
    sheet: (resolve) => {
	    require.ensure([], (require) => {
	        var controller = require('./components/sheet/sheet.controller.js').default
            var template = require('./components/sheet/sheet.tpl.html')
            resolve({
                controller,
                template
            })
        })
    },
    submasses: (resolve) => {
	    require.ensure([], (require) => {
	        var controller = require('./components/submasses/submasses.controller.js').default
            var template = require('./components/submasses/submasses.tpl.html')
            resolve({
                controller,
                template
            })
        })
    },
    account: (resolve) => {
        require.ensure([], (require) => {
            var controller = require('./components/account/account.controller.js').default
            var template = require('./components/account/account.tpl.html')
            resolve({
                controller,
                template
            })
        })
    },
    withdraw: (resolve) => {
        require.ensure([], (require) => {
            var controller = require('./components/withdraw/withdraw.controller.js').default
            var template = require('./components/withdraw/withdraw.tpl.html')
            resolve({
                controller,
                template
            })
        })
    },
    notice: (resolve) => {
        require.ensure([], (require) => {
            var controller = require('./components/notice/notice.controller.js').default
            var template = require('./components/notice/notice.tpl.html')
            resolve({
                controller,
                template
            })
        })
    },
    noticeDetail: (resolve) => {
        require.ensure([], (require) => {
            var controller = require('./components/notice-detail/notice-detail.controller.js').default
            var template = require('./components/notice-detail/notice-detail.tpl.html')
            resolve({
                controller,
                template
            })
        })
    },
    favorite: (resolve) => {
        require.ensure([], (require) => {
            var controller = require('./components/favorite/favorite.controller.js').default
            var template = require('./components/favorite/favorite.tpl.html')
            resolve({
                controller,
                template
            })
        })
    },
    open: (resolve) => {
        require.ensure([], (require) => {
            var controller = require('./components/open/open.controller.js').default
            var template = require('./components/open/open.tpl.html')
            resolve({
                controller,
                template
            })
        })
    },
    openDetail: (resolve) => {
        require.ensure([], (require) => {
            var controller = require('./components/open-detail/open-detail.controller.js').default
            var template = require('./components/open-detail/open-detail.tpl.html')
            resolve({
                controller,
                template
            })
        })
    },
    betting: (resolve) => {
        require.ensure([], (require) => {
            var controller = require('./components/betting/betting.controller.js').default
            var template = require('./components/betting/betting.tpl.html')
            resolve({
                controller,
                template
            })
        })
    },
    commission: (resolve) => {
        require.ensure([], (require) => {
            var controller = require('./components/commission/commission.controller').default
            var template = require('./components/commission/commission.tpl.html')
            resolve({
                controller,
                template
            })
        })
    },
    apply: (resolve) => {
        require.ensure([], (require) => {
            var controller = require('./components/apply/apply.controller').default
            var template = require('./components/apply/apply.tpl.html')
            resolve({
                controller,
                template
            })
        })
    },
    modifyMoneyPwd: (resolve) => {
        require.ensure([], (require) => {
            var controller = require('./components/modifyMoneyPwd/modifyMoneyPwd.controller').default
            var template = require('./components/modifyMoneyPwd/modifyMoneyPwd.tpl.html')
            resolve({
                controller,
                template
            })
        })
    },
    modifyLoginPwd: (resolve) => {
        require.ensure([], (require) => {
            var controller = require('./components/modifyLoginPwd/modifyLoginPwd.controller').default
            var template = require('./components/modifyLoginPwd/modifyLoginPwd.tpl.html')
            resolve({
                controller,
                template
            })
        })
    },
    bindCard: (resolve) => {
        require.ensure([], (require) => {
            var controller = require('./components/bindCard/bindCard.controller').default
            var template = require('./components/bindCard/bindCard.tpl.html')
            resolve({
                controller,
                template
            })
        })
    },
    userCard: (resolve) => {
        require.ensure([], (require) => {
            var controller = require('./components/userCard/userCard.controller').default
            var template = require('./components/userCard/userCard.tpl.html')
            resolve({
                controller,
                template
            })
        })
    },
    smartTrack: (resolve) => {
        require.ensure([], (require) => {
            var controller = require('./components/smart-track/smart-track.controller').default
            var template = require('./components/smart-track/smart-track.tpl.html')
            resolve({
                controller,
                template
            })
        })
    },
    payoutRecord: (resolve) => {
        require.ensure([], (require) => {
            var controller = require('./components/payoutRecord/payoutRecord.controller').default
            var template = require('./components/payoutRecord/payoutRecord.tpl.html')
            resolve({
                controller,
                template
            })
        })
    },
    payoutDetail: (resolve) => {
        require.ensure([], (require) => {
            var controller = require('./components/payoutDetail/payoutDetail.controller').default
            var template = require('./components/payoutDetail/payoutDetail.tpl.html')
            resolve({
                controller,
                template
            })
        })
    },
    incomeDetail: (resolve) => {
        require.ensure([], (require) => {
            var controller = require('./components/incomeDetail/incomeDetail.controller').default
            var template = require('./components/incomeDetail/incomeDetail.tpl.html')
            resolve({
                controller,
                template
            })
        })
    },
    trend: (resolve) => {
        require.ensure([], (require) => {
            var controller = require('./components/trend/trend.controller').default
            var template = require('./components/trend/trend.tpl.html')
            resolve({
                controller,
                template
            })
        })
    },
    cashRecord: (resolve) => {
        require.ensure([], (require) => {
            var controller = require('./components/cashRecord/cashRecord.controller').default
            var template = require('./components/cashRecord/cashRecord.tpl.html')
            resolve({
                controller,
                template
            })
        })
    },
    lhccart: (resolve) => {
        require.ensure([], (require) => {
            var controller = require('./lottery/lhc-cart/lhc-cart.controller').default
            var template = require('./lottery/lhc-cart/lhc-cart.tpl.html')
            resolve({
                controller,
                template
            })
        })
    },
    userInfo: (resolve) => {
        require.ensure([], (require) => {
            var controller = require('./components/userInfo/userInfo.controller').default
            var template = require('./components/userInfo/userInfo.tpl.html')
            resolve({
                controller,
                template
            })
        })
    },
    profit: (resolve) => {
        require.ensure([], (require) => {
            var controller = require('./components/profit/profit.controller').default
            var template = require('./components/profit/profit.tpl.html')
            resolve({
                controller,
                template
            })
        })
    },
    playerDetail: (resolve) => {
        require.ensure([], (require) => {
            var controller = require('./components/playerDetail/playerDetail.controller').default
            var template = require('./components/playerDetail/playerDetail.tpl.html')
            resolve({
                controller,
                template
            })
        })
    },
    share: (resolve) => {
        require.ensure([], (require) => {
            var controller = require('./components/share/share.controller').default
            var template = require('./components/share/share.tpl.html')
            resolve({
                controller,
                template
            })
        })
    },
    question: (resolve) => {
        require.ensure([], (require) => {
            var controller = require('./components/question/question.controller').default
            var template = require('./components/question/question.tpl.html')
            resolve({
                controller,
                template
            })
        })
    },
    wxAccount: (resolve) => {
        require.ensure([], (require) => {
            var controller = require('./components/wx-accounts/wx-accounts.controller').default
            var template = require('./components/wx-accounts/wx-accounts.tpl.html')
            resolve({
                controller,
                template
            })
        })
    },
    topUpConfirm: (resolve) => {
        require.ensure([], (require) => {
            var controller = require('./components/topUpConfirm/topUpConfirm.controller').default
            var template = require('./components/topUpConfirm/topUpConfirm.tpl.html')
            resolve({
                controller,
                template
            })
        })
    },
    maintenance: (resolve) => {
        require.ensure([], (require) => {
            var controller = require('./components/maintenance/maintenance.controller').default
            var template = require('./components/maintenance/maintenance.tpl.html')
            resolve({
                controller,
                template
            })
        })
    },
    loadApp: (resolve) => {
        require.ensure([], (require) => {
            var controller = require('./components/loadApp/loadApp.controller').default
            var template = require('./components/loadApp/loadApp.tpl.html')
            resolve({
                controller,
                template
            })
        })
    },
    qqService: (resolve) => {
        require.ensure([], (require) => {
            var controller = require('./components/qqService/qqService.controller').default
            var template = require('./components/qqService/qqService.tpl.html')
            resolve({
                controller,
                template
            })
        })
    }
    // iosjc: (resolve) => {
    //     require.ensure([], (require) => {
    //         var controller = require('./components/loadApp/iosjc.controller').default
    //         var template = require('./components/loadApp/iosjc.tpl.html')
    //         resolve({
    //             controller,
    //             template
    //         })
    //     })
    // }
}

const stateHandler = function(componentName) {
	return {
		resources: () => {
	        return new Ep(
	        	(resolve) => {
	        		components[componentName] && components[componentName](resolve)
	        		!components[componentName] && components.home(resolve)
	        	}
	        )
	    }
	}
}

export default function(url, moduleName, opts) {
	let ret = {
		url,
		templateProvider: function(resources) {
			return resources.template
		},
		controllerProvider: (resources) => {
			return resources.controller
		},
		resolve: stateHandler(moduleName)
	}
	return Object.assign(ret, opts || {})
}
