import angular from 'angular'

import { Indexeddb } from './indexeddb'

import { Lottery } from './lottery'
import { S_lottery } from './s_lottery'
import { Ssc } from './ssc'
import { S_normal } from './s_normal'
import { Pk10 } from './pk10'
import { Pcdd } from './pcdd'
import { $11x5 } from './$11x5'
import { Yb } from './yb'
import { K3 } from './k3'
import { Lhc } from './lhc'
import { Core } from './core'
import { Layer } from './layer'
import { Util } from './util'
import { DateTool } from './date-tool'
import { reqService } from './reqService'
import { CtrlService } from './ctrlService'

export default angular.module('main.service', [])
	.factory('S_lottery', S_lottery)
    .factory('Lottery', Lottery)
	.factory('$11x5', $11x5)
	.factory('Yb', Yb)
	.factory('K3', K3)
	.factory('Pk10', Pk10)
	.factory('Pcdd', Pcdd)
	.factory('Lhc', Lhc)
	.factory('Core', Core)
	.factory('Layer', Layer)
	.factory('Util', Util)
	.factory('DT', DateTool)
	.factory('RS', reqService)
    .factory('DB', Indexeddb)
    .factory('Ssc', Ssc)
    .factory('S_normal', S_normal)
    .factory('CS', CtrlService)
	.name
