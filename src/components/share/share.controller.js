import './share.less'
// import { nativeShare } from '../../../../ceshi/js/nativeShare'
import Clipboard from 'clipboard'
import 'animate.css'
export default class {
    constructor($scope, RS, Layer) {
        this.S = $scope
        this.RS = RS
        this.L = Layer

        $scope.show_modal = false
        $scope.load_href = window.location.host
        $scope.qqZone = this.qqZone.bind(this)
        $scope.shareFriend = this.shareFriend.bind(this)
        $scope.hideModal = this.hideModal.bind(this)

        this.init()
    }
    init() {
        this.RS.fenXiang().then((res) => {
            if(res.code == 200) {
                this.S.qrcode = sessionStorage.getItem('QRCODE')
                this.S.message = res.data.fenxiang_string
            }
        })
    }
    shareFriend() {
        this.S.show_modal = true
    }
    hideModal(e) {
        e.preventDefault()
        const _this = this
        let className = e.target.className.split(' ')
        if(className.indexOf('app-share-link') > -1) {
            let clipboard = new Clipboard('.app-share-link', {
                text: function() {
                    let share = location.host +' '+_this.S.message
                    return share
                }
            })

            clipboard.on('success', () => {
                _this.L.toast('复制成功!!')
            })
        }else if(className.indexOf('app-modal') > -1 || className.indexOf('app-cancel-share') > -1) {
            _this.S.show_modal = false
        }
    }

    qqZone() {
        let _url = document.location
        let _showcount = 0
        let _desc = ''
        //let _summary = ''
        let _title = this.$rootScope.WEBNAME
        //let _site = ''
        let _width = '600px'
        let _height = '800px'
        //let _summary = ''
        let _pic = 'http://www.junlenet.com/uploads/allimg/150510/1-150510104044.jpg'
        let _shareUrl = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?'
        _shareUrl += 'url=' + encodeURIComponent(_url||document.location)
        _shareUrl += '&showcount=' + _showcount || 0
        _shareUrl += '&desc=' + encodeURIComponent(_desc||'分享的描述')
        //_shareUrl += '&summary=' + encodeURIComponent(_summary||'分享摘要')
        _shareUrl += '&title=' + encodeURIComponent(_title||document.title)
        //_shareUrl += '&site=' + encodeURIComponent(_site||'')
        _shareUrl += '&pics=' + encodeURIComponent(_pic||'')
        window.open(_shareUrl, 'width='+_width+', height='+_height+',top='+(screen.height-_height)/2+',left='+(screen.width-_width)/2+', toolbar=no,menubar=no,scrollbars=no,resizable=1,location=no,status=0')
    }
}
// (function() {
//     window._bd_share_config={
//         'common': {
//             'bdSnsKey': {},
//             'bdText': '',
//             'bdMini': '2',
//             'bdMiniList': false,
//             'bdPic': '',
//             'bdStyle': '1',
//             'bdSize': '24'
//         },
//         'share': {},
//         'image': {
//             'viewList': ['fbook', 'twi', 'linkedin', 'qzone', 'tsina', 'douban', 'weixin', 'evernotecn'],
//             'viewText': '分享到：',
//             'viewSize': '16'
//         }
//     }
//
//     // let src =  require('../../assets/static/api/js/share.js')+'?v=89860593.js?cdnversion='+~(-new Date()/36e5)
//     // let share = `<script id='share' type='text/javascript' src=${src}></script>`
//     // $(window.document.body).append(share)
// })($)

