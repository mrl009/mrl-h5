// import $ from 'zepto'
// import './trend.less'

export default class {
	constructor(
		$scope,
        $stateParams,
        RS
    ) {
		$scope.tmpurl = 'src/components/' //模板前缀
        $scope.gid = $stateParams.gid
        $scope.tmp = $stateParams.tmp

        this.S = $scope
        this.rs = RS
        this.init($scope)
	}

	init(S) {
		const _this = this
		this.rs.getTrend(S.gid)
			.then((json) => {
                console.log('json===>', json)
				if (json.code == 200 && json.data != null) {
	                var resultData = json.data.rows
	                var ballsNum = 0
	                var bitNum = json.data.rows[0].number_arr.length
	                var isPlusFlag = 0


	                if (S.tmp == 'lhc') {
	                    S.tmp = S.tmpurl + 'trend/lhc.tple.html'
	                    for(var i=0; i < resultData.length; i++) {
	                        for(var k=0; k<resultData[i].number_arr.length; k++) {
	                            if(parseInt(resultData[i].number_arr[k].num)/10 < 1) {
	                                resultData[i].number_arr[k].num = '0' + resultData[i].number_arr[k].num
	                            }
	                        }
	                    }
	                    S.number = resultData
	                    S.sum = _this.sumTable(resultData)
	                    S.speical = _this.specialTable(resultData)
	                } else {
	                    switch (S.tmp) {
	                        case 'pcdd':
	                            ballsNum = 10
	                            S.tmp = S.tmpurl + 'trend/pcdd.tple.html'
	                            break
	                        case 'k3':
	                            ballsNum = 6
	                            S.tmp = S.tmpurl + 'trend/k3.tple.html'
	                            isPlusFlag = 1
	                            break
                            case 's_k3':
                                ballsNum = 6
                                S.tmp = S.tmpurl + 'trend/k3.tple.html'
                                isPlusFlag = 1
                                break
	                        case 'ssc':
	                            ballsNum = 10
	                            S.tmp = S.tmpurl + 'trend/ssc.tple.html'
	                            break
                            case 's_ssc':
                                ballsNum = 10
                                S.tmp = S.tmpurl + 'trend/ssc.tple.html'
                                break
	                        case '11x5':
	                            ballsNum = 11
	                            S.tmp = S.tmpurl + 'trend/11x5.tple.html'
	                            isPlusFlag = 1
	                            break
                            case 's_11x5':
                                ballsNum = 11
                                S.tmp = S.tmpurl + 'trend/11x5.tple.html'
                                isPlusFlag = 1
                                break
	                        case 'pk10':
	                            ballsNum = 10
	                            S.tmp = S.tmpurl + 'trend/pk10.tple.html'
	                            isPlusFlag = 1
	                            break
                            case 's_pk10':
                                ballsNum = 10
                                S.tmp = S.tmpurl + 'trend/pk10.tple.html'
                                isPlusFlag = 1
                                break
                            case 's_kl10':
                                ballsNum = 20
                                S.tmp = S.tmpurl + 'trend/kl10.tple.html'
                                isPlusFlag = 1
                                break
                            case 'yb':
                                ballsNum = 10
                                S.tmp = S.tmpurl + 'trend/yb.tple.html'
                                isPlusFlag = 0
                                break
                            case 's_yb':
                                ballsNum = 10
                                S.tmp = S.tmpurl + 'trend/yb.tple.html'
                                isPlusFlag = 0
                                break
	                        default:
	                            break
	                    }
	                    S.numData = _this.initTdData(resultData, bitNum, ballsNum, isPlusFlag)

	                    var countTime = []
	                    var maxContinueTime = []
	                    var maxUnselectTime = []
	                    var avgUnselectTime = []
	                    for (var j = 0; j < bitNum; j++) {
	                        countTime.push(_this.countTimes(j, resultData, ballsNum, isPlusFlag))
	                        maxContinueTime.push(_this.maxContinueTimes(j, resultData, ballsNum, isPlusFlag))
	                        maxUnselectTime.push(_this.maxUnselectTimes(j, resultData, ballsNum, isPlusFlag))
	                        avgUnselectTime.push(_this.avgUnselectTimes(j, resultData, ballsNum, isPlusFlag))
	                    }
	                    S.countTime = countTime
	                    S.maxContinueTime = maxContinueTime
	                    S.maxUnselectTime = maxUnselectTime
	                    S.avgUnselectTime = avgUnselectTime
	                }
	            }
			})
	}

	specialTable(objectRows) {
	    var oddflag = null
	    var bigflag = null
	    var sumOddFlag = null
	    var sumBigFlag = null
	    var bigRearFlag = null
	    var specialNum = null
	    var kithe = null
	    var arrayObj = []

	    for (var i = 0; i < objectRows.length; i++) {
	        kithe = objectRows[i].kithe
	        specialNum = objectRows[i].number_arr[6].num

	        oddflag = specialNum % 2
	        oddflag = oddflag == 0 ? '双' : '单'

	        bigflag = specialNum > 24 ? '大' : '小'

	        var tensDigit = specialNum / 10
	        var unitsDigit = specialNum % 10

	        var sum = parseInt(tensDigit + unitsDigit)
	        sumOddFlag = sum % 2 == 0 ? '和双' : '和单'
	        sumBigFlag = sum > 6 ? '和大' : '和小'
	        bigRearFlag = specialNum % 10 > 4 ? '尾大' : '尾小'

	        var resultobj = {
	            'kithe': kithe,
	            'bigflag': bigflag,
	            'sumOddFlag': sumOddFlag,
	            'sumBigFlag': sumBigFlag,
	            'bigRearFlag': bigRearFlag,
	            'oddflag': oddflag
	        }

	        arrayObj.push(resultobj)
	        sum = 0
	    }
	    return arrayObj
	}


	sumTable(objectRows) {
	    var sum = null
	    var oddflag = null
	    var bigflag = null
	    var colorflag = null

	    var color = [0, 0, 0]
	    var maxColorValue = 0
	    var maxColorIndex = -1
	    var kithe = null

	    var arrayObj = []

	    for (var i = 0; i < objectRows.length; i++) {
	        color = [0, 0, 0]
	        kithe = objectRows[i].kithe
	        for (var j = 0; j < objectRows[i].number_arr.length; j++) {
	            sum += parseInt(objectRows[i].number_arr[j].num)

	            if (objectRows[i].number_arr[j].sb == 'red') {
	                color[0]++
	            } else if (objectRows[i].number_arr[j].sb == 'green') {
	                color[1]++
	            } else if (objectRows[i].number_arr[j].sb == 'blue') {
	                color[2]++
	            }
	        }

	        oddflag = sum % 2
	        oddflag = oddflag == 0 ? '双' : '单'
	        bigflag = sum > 174 ? '大' : '小'

	        maxColorValue = Math.max(...color)
	        for (var k = 0, len = color.length; k < len; k++) {
	            if (color[k] == maxColorValue) {
	                maxColorIndex = k
	                break
	            }
	        }

	        if (maxColorIndex == 0) {
	            colorflag = '红波'
	        } else if (maxColorIndex == 1) {
	            colorflag = '绿波'
	        } else if (maxColorIndex == 2) {
	            colorflag = '蓝波'
	        }

	        var resultobj = {
	            'kithe': kithe,
	            'sum': sum,
	            'oddflag': oddflag,
	            'bigflag': bigflag,
	            'colorflag': colorflag
	        }

	        arrayObj.push(resultobj)
	        sum = 0
	    }
	    return arrayObj
	}

	//初始化球的每一位
	initBaseBallsArray(ballsNumber) {
	    var baseBallsArray = new Array(ballsNumber)
	    for (var y = 0; y < baseBallsArray.length; y++) {
	        baseBallsArray[y] = 0
	    }
	    return baseBallsArray
	}

	initTdData(objectRows, bitNum, ballsNum, plusNum) {
	    var tdDataArrayRecord = this.initBaseBallsArray(ballsNum)
	    var nunberObj = null

	    var resultObj = []
	    for (var j = 0; j < bitNum; j++) {
	        var bitArray = []
	        for (var i = 0; i < objectRows.length; i++) {
	            var arrayObj = []
	            for (var k = 0; k < ballsNum; k++) {
	                if (objectRows[i].number_arr[j] == k + plusNum) {
	                    nunberObj = {
	                        num: k + plusNum,
	                        flag: 1
	                    }
	                    tdDataArrayRecord[k] = 0
	                } else {
	                    tdDataArrayRecord[k]++
	                    nunberObj = {
	                        num: tdDataArrayRecord[k],
	                        flag: 0
	                    }
	                }
	                arrayObj.push(nunberObj)
	            }
	            if (objectRows.length <= 20) {
	                var temp = {
	                    kithe: objectRows[i].kithe,
	                    arrayObj: arrayObj
	                }

	                bitArray.push(temp)
	            } else if (objectRows.length > 20 && i >= objectRows.length - 20) {
	                var temp = {
	                    kithe: objectRows[i].kithe,
	                    arrayObj: arrayObj
	                }
	                bitArray.push(temp)
	            }
	        }
	        tdDataArrayRecord = this.initBaseBallsArray(ballsNum)
	        resultObj.push(bitArray)
	    }
	    return resultObj
	}

	//出现次数
	countTimes(e, objectRows, ballsNumber, number) {
	    var dataArray = this.initBaseBallsArray(ballsNumber)
	    for (var i = 0; i < objectRows.length; i++) {
	        dataArray[objectRows[i].number_arr[e] - number]++
	    }
	    return dataArray
	}


	maxContinueTimes(e, objectRows, ballsNumber, number) {
	    var dataArray = this.initBaseBallsArray(ballsNumber)
	    var temp
	    var count = 1

	    temp = objectRows[0].number_arr[e]
	    for (var i = 1; i < objectRows.length; i++) {
	        if (temp == objectRows[i].number_arr[e]) {
	            count++
	            if (count > dataArray[objectRows[i].number_arr[e] - number]) {
	                dataArray[objectRows[i].number_arr[e] - number] = count
	            }
	        } else {
	            count = 1
	            temp = objectRows[i].number_arr[e]
	        }
	    }

	    for (var k = 0; k < objectRows.length; k++) {
	        if (dataArray[objectRows[k].number_arr[e] - number] == 0) {
	            dataArray[objectRows[k].number_arr[e] - number] = 1
	        }
	    }

	    return dataArray
	}

	//根据选择table计算最大遗漏
	maxUnselectTimes(e, objectRows, ballsNumber, number) {
	    // var title = '<tr><th class="chinese">最大遗漏</th>'
	    var dataArray = this.initBaseBallsArray(ballsNumber)
	    var dataArrayTemp = this.initBaseBallsArray(ballsNumber)

	    for (var i = 0; i < objectRows.length; i++) {
	        for (var k = 0; k < dataArray.length; k++) {
	            if (objectRows[i].number_arr[e] - number == k) {
	                if (dataArray[k] < dataArrayTemp[k]) {
	                    dataArray[k] = dataArrayTemp[k]
	                    dataArrayTemp[k] = 0
	                } else {
	                    dataArrayTemp[k] = 0
	                }
	            } else {
	                dataArrayTemp[k]++
	            }
	        }
	    }

	    for (var y = 0; y < dataArray.length; y++) {
	        if (dataArray[y] < dataArrayTemp[y]) {
	            dataArray[y] = dataArrayTemp[y]
	        }
	    }

	    return dataArray
	}

	//根据选择table计算平均遗漏
	avgUnselectTimes(e, objectRows, ballsNumber, number) {
	    // var title = '<tr><th class="chinese">平均遗漏</th>'
	    var dataArray = this.initBaseBallsArray(ballsNumber)
	    var dataArrayTemp = this.initBaseBallsArray(ballsNumber)

	    var temp = []
	    for (var j = 0; j < dataArray.length; j++) {
	        temp[j] = []
	    }

	    for (var i = 0; i < objectRows.length; i++) {
	        for (var k = 0; k < dataArray.length; k++) {
	            if (objectRows[i].number_arr[e] - number == k) {
	                if (dataArrayTemp[k] != 0) {
	                    temp[k].push(dataArrayTemp[k])
	                    dataArrayTemp[k] = 0
	                }
	            } else {
	                dataArrayTemp[k]++
	            }
	        }
	    }

	    for (var p = 0; p < dataArray.length; p++) {
	        if (dataArrayTemp[p] != 0) {
	            temp[p].push(dataArrayTemp[p])
	        }
	    }

	    for (var m = 0; m < dataArray.length; m++) {
	        var value = 0
	        for (var y = 0; y < temp[m].length; y++) {
	            value += temp[m][y]
	        }
	        if (dataArray[m] == 0 && temp[m].length == 0) {
	        	console.log('ddd')
	        } else {
	            dataArray[m] = Math.round(value / temp[m].length)
	        }
	    }

	    return dataArray
	}
}
