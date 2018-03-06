// import './topUpFinish.less'
export default class {
    constructor($scope, DB) {
        this.$scope = $scope
        this.DB = DB
        this.getData()
    }
    getData() {
       const _this = this
       _this.DB.getItem('bankData').then((data) => {
           if(data) {
              _this.$scope.money = data.money
           }
       })
    }
}
