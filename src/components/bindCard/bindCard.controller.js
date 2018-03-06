import md5 from 'md5'
export default class{
    constructor($scope, $stateParams, RS, Layer, Core, $state) {
        this.$scope = $scope
        this.$RS = RS
        this.Layer = Layer
        this.Core = Core
        this.$state = $state

        this.$scope.submit = this.submit.bind(this)
        this.$scope.showBankList = this.showBankList.bind(this)
        this.$scope.setBank = this.setBank.bind(this)
        this.$scope.uploadQRCode = this.uploadQRCode.bind(this)

        $scope.rules = {
            bank_name: {
                required: true,
                reg: /^[\u4E00-\u9FA5]{2,5}(?:·[\u4E00-\u9FA5]{2,5})*$/,
                message: '姓名格式不正确!'
            },
            bank_num: {
                required: true,
                reg: /^\d{16}|\d{19}$/,
                message: '卡号格式不正确!'
            },
            wx: {
                required: true,
                reg: /^[a-zA-Z\d_]{5,16}$/,
                message: '微信账号不正确!'
            },
            zfb: {
                required: true,
                reg: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+|1[3,5,6,7,8]\d{9}$/,
                message: '支付宝账号不正确!'
            },
            file: {
                required: true,
                reg: /\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/,
                message: '请上传您的支付二维码!'
            },
            bank_id: {
                required: true,
                reg: /^\d{1,6}$/,
                message: '请选择银行!'
            },
            address: {
                required: true,
                reg: /^([a-zA-Z\u4e00-\u9fa5]{1,50})$/,
                message: '银行开户地址不能为空!'
            },
            bank_pwd: {
                required: true,
                reg: /^\d{6}$/,
                message: '密码格式不正确!'
            },
            phone: {
                required: false,
                reg: /^1[3,5,7,8]\d{9}$/,
                message: '电话号码格式不正确!'
            }
        }

        $scope.form = {
            bank_name: '',
            phone: ''
        }
        $scope.isPhone = null
        $scope.bankList = null
        $scope.QR_code = null
        $scope.show_bankInfo = false
        $scope.type = $stateParams.type
        $scope.title = ''
        $scope.isPwd = true
        this.getBankUsername()
        this.getTitle()
    }

    setBank(id) {
        this.$scope.form.bank_id = id
    }

    getBankUsername() {
        this.$RS.getBankName().then((res) => {
            if(res.code == 200) {
                let info = res.data
                this.$scope.form.bank_name = info.name
                this.$scope.show_name = info.name? false: true
                this.$scope.form.phone = info.phone
                this.$scope.show_phone = info.phone? false: true
                this.$scope.isPwd = info.is_pwd
                this.$scope.isPhone = info.is_phone
                if (info.is_phone) {
                    this.$scope.rules.phone.required = true
                }
            }
        })
    }

    getTitle() {
        switch (this.$scope.type) {
            case '0':
                this.$scope.form.bank_id = 51
                this.$scope.form.zfb = ''
                this.$scope.form.file = ''
                this.$scope.title = '绑定支付宝'
                break
            case '1':
                this.$scope.form.bank_id = 52
                this.$scope.form.file = ''
                this.$scope.title = '绑定微信'
                break
            case '2':
                this.$scope.form.bank_num = ''
                this.$scope.form.bank_id = 0
                this.$scope.form.address = ''
                this.$scope.title = '绑定银行卡'
                break
            default:
                break
        }
        this.$scope.form.bank_pwd = ''
    }

    //选择银行弹出框
    showBankList() {
        const _this = this
        if(!_this.$scope.bankList) {
            _this.$RS.getBankList().then((res) => {
                if(res.code == 200) {
                    let list = res.data.rows
                    _this.$scope.bankList = _this.filterArr(list)
                   _this.show()
                }else{
                    _this.Layer.toast(res.msg)
                }
            })
        } else {
            _this.show()
        }
    }
    uploadQRCode(input) {//上传收款二维码
        const _this = this
        let file = input.target.files[0]
        if(!file) {
            return
        }

        if(typeof FileReader === 'undefined') {
            _this.Layer.toast('浏览器版本过低!')
            return
        } else if (!/image\/\w+/.test(file.type)) {
            _this.Layer.toast('必须上传图片')
            return
        } else if (file.size > 1024*1024) {
            _this.Layer.toast('图片大小不能超过1M')
            return
        }


        let data = new FormData()
        data.append('file', file)
        let l = _this.Layer.loading('图片上传中...')
        _this.$RS.upload(data).then((res) => {
            if(res.status == 200) {
                _this.$scope.QR_code = res.data.result
                _this.$scope.form.file = res.data.result
                l && l.close()
            } else {
                _this.Layer.toast(res.msg)
            }
        })
    }

    //显示模态框
    show() {
        const _this = this
        var $modal = this.Layer.popup({
            tpl: `<div class="show-banks"
                    ng-repeat="x in bankList track by $index"
                    ng-click="setBank(x.id)"
                    ng-if="x"
                    ng-class="{'current-bank': form.bank_id == x.id}">
                    <div class="row">
                        <img class="col-center" ng-src="{{x.img}}">
                        <span class="col-center" bank_id="{{x.id}}" is_qcode="{{x.is_qcode}}">{{x.name}}</span>
                    </div>
                </div>`,
            wrap: function(html) {
                return `<div class="popup-form">
                            <div class="popup-title fs14 main-bg white-text">选择银行</div>
                            <div class="popup-content clearfix">
                                ${html || ''}
                            </div>
                            <div class="popup-btns">
                                <button class="button button-primary cancel-btn">取消</button>
                                <button class="button button-primary button-fill">确定</button>
                            </div>
                        </div>`
            },
            scope: _this.$scope
        })
        $modal.find('.modal-content').css({
            borderRadius: '0.5rem'
        })
        $modal.find('.popup-content').css({
            maxHeight: '22rem',
            overflow: 'auto'
        })
        $modal.find('.popup-title').css({
            background: '#eee',
            borderTopLeftRadius: '10px',
            borderTopRightRadius: '10px'
        })
        $modal.find('.button-fill').on('click', function() {
            $modal.remove()
        })
        $modal.find('.cancel-btn').on('click', function() {
            _this.setBank(0)
            $modal.remove()
        })
    }

    filterArr(arr) {
        var list = []
        for(let v of arr) {
            if (v.id != 51 && v.id != 52) {
                list[v.id] = {id: v.id, name: v.bank_name, img: v.img}
            }
        }
        return list
    }
    submit() {
        const _this = this
        if (this.$scope.form.bank_id == 51 || this.$scope.form.bank_id == 52) {
             this.$scope.rules.bank_name.required = false
        }
        if(!_this.Core.valiForm(_this.$scope.form, _this.$scope.rules)) {
            return false
        }

        let data = {
            phone: _this.$scope.form.phone,
            bank_name: _this.$scope.form.bank_name,
            bank_pwd: _this.$scope.form.bank_pwd && md5(_this.$scope.form.bank_pwd),
            num: _this.$scope.form.bank_num || _this.$scope.form.wx || _this.$scope.form.zfb,
            bank_id: _this.$scope.form.bank_id,
            address: _this.$scope.form.address,
            file: _this.$scope.QR_code
        }
        console.log('data=>', data)
        this.bindingCard(data)
    }
    bindingCard(params) {
        this.$RS.bindingCard(params).then((res) => {
            this.$scope.form.bank_pwd = ''
            if(res.code == 200) {
                this.$scope.form = {}
                this.Layer.toast(res.data, 0.3, () => {
                    this.$state.go('tabs.my')
                })
            }else {
                this.Layer.toast(res.msg)
            }
        })
    }
}
