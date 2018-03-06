import './topUpConfirm.less'
export default class {
    constructor($scope, Layer, Core, $state, RS, DB, $sce) {
        this.$scope = $scope
        this.Layer = Layer
        this.Core = Core
        this.A = $sce
        this.$state = $state
        this.RS = RS
        this.DB = DB
        $scope.info = {}

        this.init()
    }

    init() {
        this.$scope.payData = this.DB.getData('payData', (data) => {
            let info = JSON.parse(data)
            this.$scope.info = info
            let id = this.getType(info.jump_mode, info.type)
            this.RS.wxStep(id).then((res) => {
                if(res.code == 200) {
                    if (res.data[0].content) {
                        this.$scope.content = this.A.trustAsHtml(res.data[0].content)
                    }
                }
            })
        })
    }
    getType(c, type) {
        if (c == 4) {
            switch (type) {
                case 'zfb':
                    return 19
                case 'wx':
                    return 21
                case 'qq':
                    return 22
                case 'jd':
                    return 23
                case 'bd':
                    return 24
                case 'xm':
                    return 25
                case 'hw':
                    return 26
                case 'sx':
                    return 27
                default:
                    return ''
            }
        } else {
            switch (type) {
                case 'qq':
                    return 28
                case 'jd':
                    return 29
                case 'bd':
                    return 30
                case 'xm':
                    return 31
                case 'hw':
                    return 32
                case 'sx':
                    return 33
                case 'zfb':
                    return 34
                case 'wx':
                    return 35
                default:
                    return ''
            }
        }
    }
}
