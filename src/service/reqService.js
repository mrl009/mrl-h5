import angular from 'angular'
import { UPLOAD_API, API } from '../config'

export const reqService = function(Core, $http, $location, $state, $rootScope) {
	return {
		get: function(url, params, cache) {
			return Core.get(url, params || {}, (json) => {
			    if(json.code == 403) {
                     $state.go('maintenance')
                    $rootScope.maintenance_msg = json.data.close_info
                    return
                }
				return angular.fromJson(json)
			}, cache)
		},
		post: function(url, params) {
			return Core.post(url, params || {}, (json) => {
                if(json.code == 403) {
                    $state.go('maintenance')
                    return
                }
                return angular.fromJson(json)
            })
		},
		getBalance: function(cache = true, params) {
   			return this.get('user/user/user_balance', params || {}, cache)
		},
		getOutShow: function(params, cache) {
			return this.get('pay/out_mamage/out_show', params, cache)
		},
		getActivityList: function(cache) {
			return this.get('activity/promotion/get_activity_list', {}, cache)
		},
        getActivityView: function(id) {
            return this.get('activity/promotion/h5_show', {id: id}, true)
        },
		getGameList: function(params, cache) {
			return this.get('Open_time/get_games_list', params || {}, cache)
		},
		getAG: function() {
			return this.getGameList({}, true)
		},
		//获取类型列表
		getTypeList: function(params, cache) {
			return this.get('Open_time/get_type_list', params || {}, cache)
		},
		setFavorite: function(params) {
			return this.post('user/Favorite/set_favorite', params)
		},
		getToken: function(cache) {
			return this.get('login/get_token_private_key', {}, cache)
		},
		//为get封装过的使用
		getOpen: function(gid, needLoading) {
			return this.get('Open_result', {gid, needLoading}, true)
		},
		initPage: function (gid, flag) {
            return this.get(`games/play/${gid}`, flag ? {needLoading: false} : {}, flag)
        },
        getProduct: function (gid, flag) {
			return this.get(`games/products/${gid}`, flag !== undefined ? {needLoading: false} : {}, flag)
        },
		//获取验证码
		getCode: function() {
			return this.get('login/get_token_private_key', {}, true)
		},
        //获取系统设置
        getSystem: function() {
            return this.get('system/index', {app_type: 'wap'}, true)
        },
		//注册提交
		register(data = {}) {
            return this.post('login/user_add', data)
        },
		//需要字符串，必须不能格式化
        getRule: function(type) {
        	return Core.get('rules/game_rules/h5_games_rules_content', {type}, (json) => {
        		return json
        	})
        },
		getGameOpt: function() {
			return this.get('home/get_game_opt', {})
		},
		needCode: function() {
			return this.get('system/index', {app_type: 'wap'})
		},
		login: function(params) {
			return this.post('login/token', params)
		},
        rLogin: function(params) {
            return this.post('user/user/refresh', params)
        },
        changeLoginPwd: function(params) {
            return this.post('user/user/chang_login_pwd', params, true)
        },
        changeBankPwd(params) {
		    return this.post('user/user/bank_pwd_chang', params, true)
        },
		//获取期数
		getKithe: function(gid, needLoading) {
			return this.get('open_time/get_games_list', {gid, needLoading}, false)
		},
		getLottery: function(data) {
			return this.get('open_time/get_games_list', data)
		},
        //getHomeData
        getHD: function(params) {
		    params.needLoading = false
            return this.get('home/getHomeData', params)
        },
		getHomeData: function() {
			return this.getHD({show_location: 3})
		},
        getInitHD: function() {
            return this.getHD({show_location: 4})
        },
        //获取 中奖榜
		getPrize: function() {
			return this.get('home/today_win', {}, true)
		},
		payDo: function(params) {
			return this.post('pay/pay/pay_do', params)
		},
		payMethod: function() {
			return this.get('pay/pay/pay_method', {}, false)
		},

        //获取用户代理人信息
        getAgentData() {
		    return this.get('user/user/agent_show', {}, false)
        },

        //代理人提交审核
        submitAudit(params) {
            return this.post('/agent/create_agent_account', params)
        },

        //提现记录列表
        getWithdrawRecord(params) {
            return this.get('user/payout_record/get_payout_list', params, true)
        },

        //提现记录详情
        payoutDetail(id) {
            return this.get('user/Payout_record/get_payout_detail', {id})
        },

        //获取会员提示
        getNotice() {
            return this.get('notice/isNewNotice', {}, false)
        },

        //获取关于我们
        getAboutUs() {
            return this.get('home/aboutUs', {}, false)
        },

        //获取会员提示详情
        getNoticeDetail(params) {
            return this.get('home/getNotice', params, false)
        },

        //读消息
        setReadNotice(type) {
		    return this.post('notice/setReadTime', {type}, false)
        },

        //获取我的收藏
        getFavorite() {
            return this.get('user/Favorite/get_favorite', {}, false)
        },
        //设置我的收藏
        postFavoriteSet(params) {
            return this.post('user/Favorite/set_favorite', params)
        },
        //获取开奖结果
        getOpenTime(params, cache) {
            return this.get('Open_time/get_games_list', params, cache)
        },
        //获取审核状态
        getAuditStatus() {
            return this.get('agent/check_agent_register', {}, false)
        },
        //获取代理人报表信息
        getSheet(params) {
            return this.get('agent/get_agent_report', params, false)
        },
        //获取代理分成
        getAgentSet() {
          return this.get('agent/get_agent_set', {}, false)
        },

        //获取下级用户
        getSubUsers(params = {}) {
          return this.get('agent/get_agent_user', params, false)
        },

        // 账户明细
        getAccountList(params = {}) {
            return this.get('user/cash_list/get_agent_list', params, false)
        },

        // 账户明细
        getUserCard() {
            return this.get('user/user_card/new_user_card', {}, true)
        },

        //投注记录列表
        getBettingList(params) {
          return this.get('user/bet_record/get_agent_list', params, false)
        },

        //获取代理佣金信息
        getCommissionData(params) {
            return this.get('agent/get_agent_count', params, false)
        },

		//下单
		orderBet(gid, params) {
			return this.post(`orders/bet/${gid}/`, params)
		},
        //六合彩生肖
		getLhcsx() {
			return this.get('games/lhc_sx', {}, false)
		},
        /******提现*******/
        //设置提款密码
        setDrawing(params) {
            return this.post('user/user/bank_pwd_add', params)
        },

        // 获取银行卡姓名
        getBankName(params = {}) {
            return this.get('user/user/bank_name', params, false)
        },

        // 获取银行列表
        getBankList(params = {}) {
            return this.get('user/user/bank_list', params, false)
        },

        //绑定银行卡
        bindingCard(params) {
            return this.post('user/user_card/card_add', params)
        },

        //图片上传
        upload(fd) {
            return $http({
                method: 'POST',
                url: UPLOAD_API,
                data: fd,
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity
            })
        },

        //提现数据
        getWithdrawData(params = {}) {
            return this.get('pay/out_mamage/out_show', params, false)
        },

        //追号
        getZhop(gid) {
        	return this.get('Open_time/get_zhkithe_list', {gid}, false)
        },

        //追号提交
        zhBet(gid, toggleID, data) {
        	return this.post(`orders/bets2/${gid}/${toggleID}`, data)
        },
        //提现
        withdraw(params) {
            return this.post('pay/out_mamage/member_out', params)
        },
        //代理说明
        getExplain() {
            return this.get('rules/game_rules/get_game_article_content', {id: 8})
        },
        //充值记录列表
        getIncomeList(data = {}) {
            return this.get('user/income_record/get_list', data, false)
        },

        //充值记录筛选
        getIncomeType(data = {}) {
            return this.get('user/income_record/get_type', data, false)
        },

        //获取账户明细
        getCashList(data = {}) {
            return this.get('user/cash_list/get_list', data, false)
        },

        //获取账户明细 类型
        getCashType(data = {}) {
            return this.get('user/cash_list/get_type', data, false)
        },

        //趋势图
        getTrend(gid) {
            return Core.get('activity/game_trend/get_game_trend_list', {gid}, (json) => {
                return json
            }, false)
        },

        //取消订单
        cancelOrder(order_num) {
            return this.post('orders/cancel/', {order_num})
        },

        //玩法提示
        getTip(gid) {
            return this.get('rules/game_rules/get_game_tips_content', {id: gid})
        },

        //今日盈亏
        userProfit() {
            return this.get('user/User_info/profit', {}, true)
        },

        //获取昨日的奖金榜
        getTopList() {
            return this.get('home/yesterday_win', {}, true)
        },

        //用户等级头衔
        getUserRank() {
            return this.get('user/user_info/nobility', {}, true)
        },

        //vip列表
        getRankList() {
            return this.get('user/user_info/nobility')
        },

        //获取个人信息
        getUserInfo() {
            return this.get('user/user_info/info', {}, true)
        },

        //获取玩家信息
        getPlayerInfo(data) {
            return this.get('home/win_info', data, true)
        },
        //获取红包次数及昨日充值金额
        getRedNum(id) {
            return this.get('red_bag/user_detail', {red_id: id}, true)
        },
        //获取红包中奖榜
        getRedPacketList() {
            return this.get('red_bag/bag_list', {}, true)
        },
        //检查是否显示红包
        checkRedPacket() {
            return this.get('red_bag/index', {needLoading: false}, true)
        },
        //拆红包
        chaiRedPacket(id) {
            return this.post('red_bag/grab_red_bag', {id}, true)
        },
        //个人资料更新
        updateUserInfo(data) {
            return this.post('user/user_info/update_info', data, true)
        },

        //安全保障,如何领奖,如何提款
        getDescription(id) {
            return this.get('index.php/rules/game_rules/get_game_article_content', {id}, true)
        },

        //更换头像
        upDataAvatar(fd) {
            return $http({
                method: 'POST',
                url: API+'user/user/user_head',
                data: fd,
                headers: {
                    'Content-Type': undefined,
                    'AuthGC': $location.host() + ';' + Core.getToken()
                },
                transformRequest: angular.identity
            })
        },

        //分享
        fenXiang() {
            return this.get('home/get_fenxiang', {}, false)
        },

        //VIP等级机制
        getVipClass() {
            return this.get('index.php/activity/Promotion/getGradeList', {}, false)
        },

        //是否有未领取晋级奖励
        checkReward() {
            return this.get('user/grade_mechanism/getUserGrade', {}, true)
        },

        //领晋级奖励
        getAward() {
            return this.get('user/grade_mechanism/rewardDo', {}, true)
        },

        //wx转账 步骤
        wxStep(id) {
            // return this.get('rules/game_rules/get_game_article_content', {id}, true)
            return this.get('rules/game_rules/get_game_article_content', {id}, true)
        },

        //微信提交
        wxSubmit(data) {
            return this.post('pay/pay/pay_do', data, false)
        },

        //获取默认头像列表
        getTouXiang() {
            return this.get('user/user/get_touxiang', {}, false)
        },

        //设置默认头像
        setDefaultPortrait(url) {
            return this.post('user/user/user_head', {url}, false)
        }
	}
}
