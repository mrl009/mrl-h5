import $ from 'zepto'

export const Layer = function(
    $timeout,
    $compile,
    $http,
    Util
) {
    return {
        load: function(url) {
            return $http
                .get(url)
                .then(function(response) {
                    return response.data && response.data.trim()
                })
                .catch(function(response) {
                    return response
                })
        },
        timerCache: [],
        //toast 应为单例
        toast: function(msg, delay, fn) {
            const _this = this
            const $t = $('.toast-wrap')
            const d = typeof delay !== 'function' && delay!= undefined ? delay : 2
            let cbfn

            if($t.length) {
                return
            }

            if(typeof delay === 'function' ) {
                cbfn = delay
            } else if(fn != undefined) {
                cbfn = fn
            }

            const autoClose = function(target) {
                const _t = $timeout(function() {
                    $timeout.cancel(_t)
                    target.remove()
                    cbfn && cbfn()
                    _this.timerCache.push(_t)
                }, d * 1000)
            }

            $(document.body).append(`<div class="toast-wrap"><div class="modal toast modal-in" style="display: block;">${msg}</div></div>`)
            const $t1 = $('.toast')
            const $tw = $('.toast-wrap')
            // const _tw = $t1.get(0).offsetWidth
            // const _th = $t1.get(0).offsetHeight
            $t1.css({
                maxWidth: '60%',
                left: 0,
                right: 0,
                margin: 'auto',
                whiteSpace: 'normal',
                padding: '0.5rem 0.3rem',
                height: 'auto',
                lineHeight: 'normal',
                transform: 'translateY(-50%)'
            })

            autoClose($tw)
        },
        modalCache: [],
        /*
         * single: boolean 是否单例, 默认为true
         * content: html, string 内容
         * maskClose: boolean 默认 true
         * style: {}
         * cb: function 回调
         */
        modal: function(opts) {
            const _this = this
            opts.single = opts.single || true
            opts.maskClose = opts.maskClose != undefined ? opts.maskClose : true
            if(opts.single) {
                if($('.modal-overlay').length) {
                    return
                }
            }
            const modalId = `modal_${new Date().getTime()}`
            $(document.body).append(
                `<div id="${modalId}" class="modal-overlay modal-overlay-visible">
                     <div class="modal-content ${opts.clazz||''}"></div>
                 </div>`)
            const $modal = $(`#${modalId}`)
            $modal.find('.modal-content').css(opts.style || {}).html(opts.content || '')

            if(opts.maskClose) {
                $modal.click(function(e) {
                    if(e.target.id === modalId) {
                        _this.mclose($(e.target))
                    }
                })
            }

            opts.cb && opts.cb()
            this.modalCache.push($modal)

            $modal.getId = function() {
                return modalId
            }

            $modal.close = function() {
                $modal.remove()
            }
            return $modal
        },
        //popup， 参考ionic版去实现
        popupFromUrl: function(url, opts, fn) {
            let tpl = `<div ng-include="'${url}'" ></div>`
            let _in
            if(opts.wrap) {
                tpl = opts.wrap(tpl)
            }
            _in = $compile(tpl)(opts.scope)
            const $modal = this.modal({
                content: _in[0],
                cb: fn,
                maskClose: opts.maskClose || true,
                style: opts.style || {}
            })

            return $modal
        },
        //popup
        popup: function(opts) {
            let tpl = opts.tpl
            if(opts.wrap) {
                tpl = opts.wrap(tpl)
            }

            if(opts.scope) {
                tpl = $compile(tpl)(opts.scope)[0]
            }

            return this.modal({
                content: tpl,
                cb: opts.cb,
                style: opts.style || {},
                clazz: opts.clazz
            })
        },
        mclose: function(target) {
            target.remove()
        },
        /*
         * title
         * msg
         * yesFn
         * noFn
         * yesCd
         * noCd
         */
        confirm: function(opts) {
            const tpl =
                `<div class="modal modal-in">
                    <div class="modal-inner">
                        <div class="modal-title">
                            ${opts.title || '提示'}
                        </div>
                        <div class="modal-text">
                            ${opts.msg || ''}
                        </div>
                    </div>
                    <div class="modal-buttons ">
                        <span class="modal-button confirm-no">${opts.cancelText || '取消'}</span>
                        <span class="modal-button modal-button-bold confirm-yes main-color">${opts.yesText || '确定'}</span>
                    </div>
                </div>`
            const $modal = this.modal({
                content: tpl,
                maskClose: false
            })

            let _loop = 0

            $.each(['yes', 'no'], function(i, e) {
                $(`.confirm-${e}`).bind('click', function(el) {
                    opts[`${e}Fn`] && opts[`${e}Fn`](el)
                    _loop && Util.stopLoop(_loop)
                    $modal.close()
                })
            })

            if(opts.yesCd && !isNaN(opts.yesCd)) {
                let cd = Number(opts.yesCd)
                _loop = Util.loop(function() {
                    if(cd > 0) {
                        $('.confirm-yes').text(`(${cd--}s) 确定`)
                    } else {
                        Util.stopLoop(_loop)
                        $('.confirm-yes').text('(0s) 确定').trigger('click')
                    }
                }, 1000)
            }
            return $modal
        },
        //查询部分 弹窗
        confirmForm: function(opts) {
            const now = new Date().getTime()
            const cancelId = `cancel${now}`
            const okId = `confirm${now}`

            const $modal = this.popupFromUrl(opts.url, {
                scope: opts.scope,
                wrap: function(html) {
                    return `<div class="popup-form">
                                <div class="popup-title fs14">${opts.title || '标题'}</div>
                                <div class="popup-content clearfix">
                                    ${html || opts.content || ''}
                                </div>
                                <div class="popup-btns">
                                    <button id="${cancelId}" class="button button-primary cancel-btn">${opts.cancelText || '取消'}</button>
                                    <button id="${okId}" class="button button-primary button-fill main-w">${opts.yesText || '确定'}</button>
                                </div>
                            </div>`
                },
                style: {borderRadius: '0.5rem', maxWidth: '18rem'}
            })
            $(`#${cancelId}`).bind('click', function(e) {
                opts.cancelFn && opts.cancelFn(e)
                $modal.close()
            })

            $(`#${okId}`).bind('click', function(e) {
                const ret = opts.confirm && opts.confirm(e)
                ret !== false && $modal.close()
            })
            return $modal
        },
        popupForm: function(opts) {
            const now = new Date().getTime()
            const cancelId = `cancel${now}`
            const okId = `confirm${now}`

            const $modal = this.popup({
                scope: opts.scope,
                wrap: function(html) {
                    return `<div class="popup-form">
                                <div class="popup-title fs14">${opts.title || '标题'}</div>
                                <div class="popup-content clearfix">
                                    ${html || opts.content || ''}
                                </div>
                                <div class="popup-btns">
                                    <button id="${cancelId}" class="button button-primary cancel-btn">${opts.cancelText || '取消'}</button>
                                    <button id="${okId}" class="button button-primary button-fill main-w">${opts.yesText || '确定'}</button>
                                </div>
                            </div>`
                },
                style: {borderRadius: '0.5rem', maxWidth: '15.8rem'},
                tpl: opts.tpl
            })
            $(`#${cancelId}`).bind('click', function(e) {
                opts.cancelFn && opts.cancelFn(e)
                $modal.close()
            })

            $(`#${okId}`).bind('click', function(e) {
                const ret = opts.confirm && opts.confirm(e)
                ret !== false && $modal.close()
            })
            return $modal
        },
        loading: function(msg = '') {
            let tpl = ''
            if(msg) {
               tpl = `<div class="preloader-indicator-modal">
                              <div class="preloader"></div>
                              <p class="white-text text-center fs12">${msg}</p>
                          </div>`
            }else{
               tpl = `<div class="preloader-indicator-modal">
                        <div class="preloader"></div>
                      </div>`
            }
            const $load = this.modal({
                content: tpl
            })
            $load && $load.addClass('preloader-indicator-overlay')
            return $load
        },
        //closeLoading
        CL: function() {
            $('.preloader-indicator-overlay').remove()
        },
        clearCD: function() {
            Util.clearCd(this.timerCache)
            this.timerCache = []
        },
        clearModals: function() {
            if(this.modalCache.length) {
                this.modalCache.forEach(function(e) {
                    e.close()
                })
                this.modalCache = []
            }
        }
    }
}
