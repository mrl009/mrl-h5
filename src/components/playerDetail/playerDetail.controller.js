import './playerDetail.less'
export default class {
    constructor($scope, Layer, RS, $stateParams) {
        this.S = $scope
        this.L = Layer
        this.RS = RS
        this.$stateParams = $stateParams
        $scope.default_games =
           [{
                game_img: require('../../assets/img/defaultGames/aj3fc.png'),
                name: '三分时时彩'
            },
            {
                game_img: require('../../assets/img/defaultGames/bjpk10.png'),
                name: '北京Pk10'
            },
            {
                game_img: require('../../assets/img/defaultGames/cqssc.png'),
                name: '重庆时时彩'
            },
            {
                game_img: require('../../assets/img/defaultGames/jsk3.png'),
                name: '江苏快3'
            },
            {
                game_img: require('../../assets/img/defaultGames/lhc.png'),
                name: '香港六合彩'
            },
            {
                game_img: require('../../assets/img/defaultGames/sd11x5.png'),
                name: '山东11选5'
            },
            {
                game_img: require('../../assets/img/defaultGames/sfpk10.png'),
                name: '三分PK10'
            },
            {
                game_img: require('../../assets/img/defaultGames/xy28.png'),
                name: '幸运28'
            }]
        this.init()
    }

    init() {
        let params = {
            uid: this.$stateParams.id,
            type: this.$stateParams.type
        }
        this.RS.getPlayerInfo(params).then((res) => {
            if(res.code == 200) {
                this.S.playerInfo = res.data
                if(this.S.playerInfo.game_list.length == 0) {
                    this.S.playerInfo.game_list = this.S.default_games
                }
            }else {
                this.L.toast(res.msg)
            }
        })
    }
}
