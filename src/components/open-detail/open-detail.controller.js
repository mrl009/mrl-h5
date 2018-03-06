// import './open-detail.less'
// import $ from 'zepto'
export default class {
    constructor($scope, $state, $stateParams, RS) {
        this.S = $scope
        this.$S = $state
        this.$ST = $stateParams
        this.RS = RS
        this.S.data = {
            tmp: $stateParams.tmp
        }
        console.log(this.S.data)
        this.init()
    }

    init() {
        const _this = this
        this.S.data.name = this.$ST.name
        this.S.data.img = this.$ST.img.replace(/_(png|jpe?g)/, '.$1')
        const {gid} = this.$ST
        this.S.gid = gid
        this.RS.getOpen(gid)
            .then((json) => {
                if (json.code == 200) {
                    this.S.items = json.data
                    // $.each(json.data.rows, function (i, d) {
                    //     json.data.rows[i].number = d.number.split(',')
                    //     if (this.S.data.tmp == 'lhc') {
                    //         json.data.rows[i].shengxiao = d.shengxiao.split(',')
                    //     }
                    // })
                    let list = json.data.rows
                    list.map((item) => {
                        item.number = item.number.split(',')
                        if(_this.S.data.tmp == 'lhc') {
                            item.shengxiao = item.shengxiao.split(',')
                        } else if(_this.S.data.tmp == 'pcdd') {
                            let arr = item.number.slice()
                            item.number.push(arr.reduce((num, v) => {return parseInt(v) + parseInt(num)}))
                        }
                        return item
                    })
                    this.S.items.rows = list
                }
            })
    }
}

