import './userInfo.less'
import 'animate.css'
export default class {
    constructor($scope, Layer, $state, RS, Util, Core, DT) {
        this.S = $scope
        this.L = Layer
        this.$S = $state
        this.DT = DT
        this.RS = RS
        this.Util = Util
        this.Core = Core

        $scope.toggleTitle = this.toggleTitle.bind(this)

        $scope.replacePicture = this.replacePicture.bind(this)
        $scope.selectPicture = this.selectPicture.bind(this)
        $scope.uploadAvatar = this.uploadAvatar.bind(this)
        $scope.showNickname = this.showNickname.bind(this)
        $scope.showUsername = this.showUsername.bind(this)
        // $scope.setUsername = this.setUsername.bind(this)
        $scope.showPhone = this.showPhone.bind(this)
        $scope.showEmail = this.showEmail.bind(this)
        $scope.showSex = this.showSex.bind(this)
        $scope.setSex = this.setSex.bind(this)
        $scope.setBirthday = this.setBirthday.bind(this)
        $scope.setInfo = this.setInfo.bind(this)
        $scope.title = 'left'
        $scope.checkImgIndex = 0
        $scope.rankInfo = null
        $scope.show_photos = false
        $scope.show_nickname = false
        $scope.show_name = false
        $scope.show_phone = false
        $scope.show_email = false
        $scope.show_sex = false
        $scope.show_brithday = false

        this.init()
    }

    init() {
        this.RS.getUserInfo().then((res) => {
            if(res.code == 200) {
                this.S.userInfo = res.data
                this.S.userInfo.birthday = this.S.userInfo.birthday == 0?
                    '1971/01/01': this.DT.dtToString(parseInt(this.S.userInfo.birthday), '/')
            } else {
                this.L.toast(res.msg)
            }
        })
    }

    replacePicture() {
        const _this = this
        _this.RS.getTouXiang().then((res) => {
            if(res.code == 200) {
                _this.S.imgs = res.data

                _this.S.modal = _this.L.confirmForm({
                    title: '请选择头像',
                    url: 'change-photos.html',
                    scope: _this.S,
                    confirm: () => {
                        let url = _this.S.imgs[_this.S.checkImgIndex]
                        _this.S.userInfo.img = url
                        _this.RS.setDefaultPortrait(url).then((res) => {
                            console.log(res)
                        })
                        // _this.S.$apply(_this.S.data.img)
                    }
                })
            }
        })
    }
    //图片上传
    uploadAvatar(input) {
        let file = input.target.files[0]
        if(!file) {
            return
        }
        if(typeof FileReader === 'undefined') {
            this.L.toast('浏览器版本过低!')
            return
        } else if (!/image\/\w+/.test(file.type)) {
            this.L.toast('必须上传图片')
            return
        } else if (file.size > 1024*1024) {
            this.L.toast('图片大小不能超过1M')
            return
        }
        let data = new FormData()
        data.append('file', file)
        this.S.modal.hide()
        let l = this.L.loading()
        this.RS.upDataAvatar(data).then((res) => {
            if(res.status == 200 && res.data.code == 200) {
                this.S.modal.remove()
                l && l.close()
                this.L.toast('头像更新成功!')
                this.init()
            }
        })
    }

    selectPicture(index) {
        if(index == this.S.checkImgIndex) {
            return
        }
        this.S.checkImgIndex = index
    }
    //昵称
    showNickname() {
        if(this.S.userInfo.nickname != 0) {
            return
        }
        this.S.show_nickname = true
    }

    //用户名
    showUsername() {
        if(this.S.userInfo.username) {
            return
        }
        this.S.show_name = true
    }

    //手机
    showPhone() {
        if(this.S.userInfo.phone != 0) {
            return
        }
        this.S.show_phone = true
    }

    //邮箱
    showEmail() {
        if(this.S.userInfo.email != 0) {
            return
        }
        this.S.show_email = true
    }
    setInfo(e, type, text) {
        const _this = this
        let val = e.target.value
        if(type == 'nickname') {
            _this.S.show_nickname = false
            let reg = /^[\u4E00-\u9FA5]{2,5}$/
            if(!reg.test(val)) {
                _this.L.toast('昵称必须为2~5中文字符!')
                return
            }
        } else if(type == 'phone') {
            _this.S.show_phone = false
            let reg = /^1[3,5,6,7,8]\d{9}$/
            if(!reg.test(val)) {
                _this.L.toast('手机号码必须为11位数字')
                return
            }
        } else if(type == 'email') {
            _this.S.show_email = false
            let reg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+\.){1,63}[a-z0-9]+$/
            if(!reg.test(val)) {
                _this.L.toast('邮箱格式不正确')
                return
            }
        }
        _this.L.confirm({
            title: '修改资料',
            msg: '一经修改无法再次修改,确定修改'+text+'吗?',
            yesFn: function () {
                let params = {}
                params[type] = val
                params.modify = _this.S.userInfo.modify
                _this.RS.updateUserInfo(params).then((res) => {
                    if(res.code == 200) {
                        _this.L.toast('修改成功!')
                        _this.S.userInfo[type] = val
                        _this.S.userInfo.modify = res.data
                    }else {
                        _this.L.toast(res.msg)
                    }
                })
            }
        })
    }

    //性别
    showSex() {
        if(this.S.userInfo.modify[3] == 1) {
            return
        }
        this.S.show_sex = true
    }
    setSex(type) {
        this.S.show_sex = false
        if(type == this.S.userInfo.sex) {
            return false
        }
        this.S.userInfo.sex = type
        this.RS.updateUserInfo({
            sex: type,
            modify: this.S.userInfo.modify
        }).then((res) => {
            if(res.code == 200) {
                this.L.toast('修改成功!')
                this.S.userInfo.sex = type
                this.S.userInfo.modify = res.data
            }else {
                this.L.toast(res.msg)
            }
        })
    }

    //设置生日
    setBirthday(e) {
        const _this = this
        if(this.S.userInfo.birthday != '1971/01/01') {
            return
        }
        this.Util.picker(e.target, (v) => {
            if(v) {
                this.L.confirm({
                    title: '修改资料',
                    msg: '一经修改无法再次修改,确定修改生日吗?',
                    yesFn: function () {
                        _this.RS.updateUserInfo({
                            birthday: v,
                            modify: _this.S.userInfo.modify
                        }).then((res) => {
                            if(res.code == 200) {
                                _this.L.toast('修改成功!')
                                _this.S.userInfo.birthday = v
                            }else {
                                _this.L.toast(res.msg)
                            }
                        })
                    }
                })
            }
        }, '/')
    }

    // updateModify(str, n) {
    //     let arr = str.split(',')
    //     arr[n] = 1
    //     return arr.join(',')
    // }

    toggleTitle(type) {
        if(type == this.S.title) {
            return
        }
        this.S.title = type
        if(this.S.title == 'right' && !this.S.rankList) {
            this.RS.getUserRank().then((res) => {
                if(res.code == 200) {
                    this.S.rankInfo = res.data
                    this.S.balance = (this.S.rankInfo.NextVipIntegral-this.S.rankInfo.integral) < 0? 0: (this.S.rankInfo.NextVipIntegral-this.S.rankInfo.integral)
                    this.S.w = Math.floor(this.S.rankInfo.integral*100/this.S.rankInfo.NextVipIntegral) >100? '100%':
                        Math.floor(this.S.rankInfo.integral*100/this.S.rankInfo.NextVipIntegral)+'%'
                } else {
                    this.L.toast(res.msg)
                }
            })
            this.RS.getRankList().then((res) => {
                if(res.code == 200) {
                    this.S.rankList = res.data.rows
                } else {
                    this.L.toast(res.msg)
                }
            })
        }
    }
}
