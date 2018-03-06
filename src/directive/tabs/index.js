import angular from 'angular'
const j = angular.element

export const tabs = function($rootScope) {
    return {
        restrict: 'E',
        scope: true,
        template: '<nav class="bar bar-tab" ng-transclude></nav>',
        replace: true,
        transclude: true,
        controller: function() {},
        link: function($scope, $elem) {
            $rootScope.$on('$locationChangeSuccess', function(obj, curr) {
                angular.forEach($elem.children(), function(e) {
                    j(e).removeClass('active').find('span').removeClass('active')
                    const attr = j(e).attr('href')
                    if(curr.indexOf(attr) >= 0) {
                        j(e).addClass('active').find('span').addClass('active')
                    }
                })
            })
        }
    }
}

export const tab = function($location) {
    return {
        restrict: 'E',
        require: '^tabs',
        template: `
            <a class="tab-item">
                <span class="icon iconfont"></span>
                <span class="tab-label"></span>
            </a>`,
        replace: true,
        link: function($scope, $elem, $attr) {
            const $child = $elem.children()
            const icon = $child[0]
            const label = $child[1]
            j(label).text($attr.title)
            j(icon).addClass($attr.icon)
            const { $$path } = $location
            if( $$path.indexOf($attr.href) >= 0 ) {
                $elem.addClass('active').find('span').addClass('active')
            }
        }
    }
}
