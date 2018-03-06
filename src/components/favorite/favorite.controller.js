// import './favorite.less'
// import angular from 'angular'
import $ from 'zepto'
// import md5 from 'md5'
export default class {
    constructor($scope, Layer, Core, $state, RS) {
        this.S = $scope
        this.L = Layer
        this.C = Core
        this.$S = $state
        this.RS = RS
        this.init()
        this.S.text = '删除'
        this.S.items = []
        this.S.data = {isDelete: false, favoriteIds: [], allSelected: false}
        $scope.jumpToGame = this.jumpToGame.bind(this)
        $scope.prepareDelete = this.prepareDelete.bind(this)
        $scope.prepareSelected = this.prepareSelected.bind(this)
        $scope.favoriteDelete = this.favoriteDelete.bind(this)
    }

    init() {
        this.RS
            .getFavorite()
            .then((json) => {
                if (json.code == 200) {
                    this.S.items = json.data
                }
            })
    }

    jumpToGame(index) {
        let itemData = this.S.items[index]
        this.$S.go(itemData.type, {type: itemData.type, gid: itemData.id})
    }

    prepareDelete() {
        this.clearAll()
        this.S.data.allSelected = false
        this.S.data.isDelete = !this.S.data.isDelete
        this.S.text = this.S.data.isDelete ? '取消' : '删除'
    }

    prepareSelected(k, id, type) {
        // console.log(this.S.data.favoriteIds)
        if (type == 'add') {
            this.S.data.favoriteIds.push(id)
            $('.list-cell').eq(k).children('div').eq(1).children('.button').eq(0).addClass('hidden')
            $('.list-cell').eq(k).children('div').eq(1).children('.button').eq(1).removeClass('hidden')
        } else if (type == 'delete') {
            for (var i = 0; i < this.S.data.favoriteIds.length; i++) {
                if (this.S.data.favoriteIds[i] == id) {
                    this.S.data.favoriteIds.splice(i, 1)
                    break
                }
            }
            $('.list-cell').eq(k).children('div').eq(1).children('.button').eq(0).removeClass('hidden')
            $('.list-cell').eq(k).children('div').eq(1).children('.button').eq(1).addClass('hidden')
        } else if (type == 'all') {
            this.S.data.allSelected = !this.S.data.allSelected
            if (this.S.data.allSelected) {
                for(let k in this.S.items) {
                    this.S.data.favoriteIds.push(this.S.items[k].id)
                    $('.list-cell').eq(k).children('div').eq(1).children('.button').eq(0).addClass('hidden')
                    $('.list-cell').eq(k).children('div').eq(1).children('.button').eq(1).removeClass('hidden')
                }
            } else {
                for(let k in this.S.items) {
                    $('.list-cell').eq(k).children('div').eq(1).children('.button').eq(0).removeClass('hidden')
                    $('.list-cell').eq(k).children('div').eq(1).children('.button').eq(1).addClass('hidden')
                }
                this.S.data.favoriteIds = []
            }
        }
    }

    favoriteDelete() {
        let gid = this.S.data.favoriteIds.join()
        let params = {
            'gid': gid,
            'status': 1
        }
        this.RS
            .postFavoriteSet(params)
            .then((json) => {
                if (json.code == 200) {
                    this.L.toast('删除成功')
                    this.init()
                    this.clearAll()
                } else{
                    this.L.toast(json.msg)
                }
            })
    }

    clearAll() {
        if (this.S.items) {
            for(let k in this.S.items) {
                $('.list-cell').eq(k).children('div').eq(1).children('.button').eq(0).removeClass('hidden')
                $('.list-cell').eq(k).children('div').eq(1).children('.button').eq(1).addClass('hidden')
            }
        }
    }
}

