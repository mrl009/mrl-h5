// import './open.less'

export default class {
    constructor($scope, $state, RS) {
        this.S = $scope
        this.$S = $state
        this.RS = RS
        this.init()
        $scope.goOpenDetail = this.goOpenDetail.bind(this)
    }

    init() {
        this.RS
            .getOpenTime({use: 'kj'})
            .then((json) => {
                if (json.code == 200) {
                    var openLottoryArray = json.data
                    for (var i = 0; i < openLottoryArray.length; i++) {
                        openLottoryArray[i].number = openLottoryArray[i].number.split(',')
                        if (openLottoryArray[i].shengxiao) {
                            openLottoryArray[i].shengxiao = openLottoryArray[i].shengxiao.split(',')
                        }else if(openLottoryArray[i].cptype == 'pcdd') {
                            console.log('asd===>', openLottoryArray[i].number)
                            let arr = openLottoryArray[i].number.slice()
                            openLottoryArray[i].number.push(arr.reduce((num, v) => {return parseInt(v) + parseInt(num)}))
                        }
                    }
                    this.S.openLottoryArray = openLottoryArray
                }
            })
    }

    goOpenDetail(gid, img, name, tmp) {
        console.log(tmp)
        this.$S.go('openDetail', {gid, img: img.replace(/\.(png|jpe?g)/, '_$1'), name, tmp})
    }
}
