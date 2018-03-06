// import angular from 'angular'
import $ from 'zepto'

export default class {
    constructor(
        $scope,
        Core,
        Layer,
        $state,
        RS,
        $timeout,
        $rootScope,
        Lottery,
        Util
    ) {
        Object.assign(this, {
            C: Core,
            s: $scope,
            L: Layer,
            $state:
            $state,
            RS: RS,
            $r: $rootScope,
            ly: Lottery,
            $tm: $timeout,
            u: Util
        })

        this.s.favorObj = {}

        $scope.syTimeCc = {}
        this.s.playName =$rootScope.GF
        this.s.playSn ='gc'
        this.s.allauth = false
        let cp = $rootScope.lottery_auth ? $rootScope.lottery_auth : '1,2'
        cp = cp.split(',')
        if($.inArray('1', cp)>-1 && $.inArray('2', cp)>-1) {
            this.s.allauth = true
        }else if($.inArray('1', cp)>-1) {
            this.s.playSn = 'gc'
        }else if($.inArray('2', cp) >-1) {
            this.s.playSn = 'sc'
        }
        this.showType(this.s.playSn)

        this.destroyCds()

        $scope.showType = this.showType.bind(this)

        this.s.favorite = this.favorite.bind(this)
        this.s.goUrl = this.goUrl.bind(this)
        this.s.hdDate = this.hdDate.bind(this)
    }

    initData() {
        return this.RS
                .getTypeList()
                .then((json) => {
                   return this.initLottery(json)
                })
    }

    showType(t) {
        this.s.playSn = t=='gc' ? 'sc' : 'gc'
        this.s.playName = t=='gc' ? this.$r.GF : this.$r.BY
        return this.RS
            .getTypeList({ctg: t})
            .then((json) => {
                return this.initLottery(json, {ctg: t})
            })
    }

    initLottery(c, p) {
        const _this = this
        const setD = function(temp, dd) {
            temp.push({
                cptype: dd.cptype,
                gid: dd.gid,
                img: dd.img,
                name: dd.name,
                number: dd.number,
                kithe: dd.kithe,
                kithe_time_second: dd.kithe_time_second,
                up_close_time: dd.up_close_time,
                kithe_time_stamp: dd.kithe_time_stamp,
                favorite: dd.favorite,
                tmp: dd.tmp
            })
        }
        return this.RS
                .getGameList(p)
                //.getAG()
                .then((cc) => {
                    if (c.code == 200) {
                        let newData = []
                        let a = -1
                        $.each(c.data, function (i, d) {
                            if(d !== null) {
                                var temp = []
                                $.each(cc.data, function (ii, dd) {
                                    _this.s.favorObj[dd.gid] = dd.favorite
                                    if (d.type =='hot' && dd.hot == 1) {
                                        setD(temp, dd)
                                    } else if(d.type == dd.cptype) {
                                        setD(temp, dd)
                                    }
                                })
                                if(temp.length > 0) {
                                    a = a+1
                                    newData[a]=c.data[i]
                                    newData[a].items = temp
                                }
                            }
                        })
                        _this.s.lotterys = newData
                    }
                })
                .then(() => {
                    this.initCds()
                })
    }

    favorite(gid) {
        const _favoriate = this.s.favorObj[gid]
        const token = this.C.getToken()
        if(!token) {
            this.L.toast('请先登录')
            return false
        }
        const param = {
            token,
            gid,
            status: _favoriate
        }
        this.RS
            .setFavorite(param, 'buhuancun')
            .then((json) => {
                if(json.code == 200) {
                    this.L.toast(_favoriate == 1 ? '取消成功' : '收藏成功', 1)
                    this.s.favorObj[gid] = _favoriate == 1 ? 0 : 1
                } else {
                    this.L.toast(json.msg)
                }
            })
    }

    goUrl(url, type) {
        this.$state.go(url, {type})
    }

    initCds() {
        const self = this
        this.s.$watch('slideTabsId', (val) => {
            console.log(val)
            if(val !== undefined) {
                let data = []
                data = self.s.lotterys[val].items
                data.forEach((e) => {
                    self.ly.getKithe(e.gid, self.s, false)
                })
                console.log(data)
            }
        })
    }

    destroyCds() {
        this.s.$on('$destroy', () => {
            this.ly.clearCds()
        })
    }

    hdDate(val, key) {
        return this.u.hdDate(val, key)
    }
}
