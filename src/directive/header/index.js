export const iheader = function() {
    return {
        restrict: 'E',
        template: `
			<header class="bar bar-nav main-w" ng-transclude></header>
        `,
        controller: function() {},
        transclude: true,
        replace: true
    }
}

export const back = function() {
    return {
        require: '^iheader',
        restrict: 'E',
        template: `
            <a class="icon iconfont icon-arrow-left pull-left fs24"></a>
        `,
        replace: true,
        link: function($scope, $elem, $attr) {
            if($attr.url) {
                $elem.attr('href', $attr.url)
            }

            if(!$attr.url && !$attr.ngClick) {
                $elem.bind('click', function() {
                    history.go(-1)
                })
            }
        }
    }
}

export const content = function() {
    return {
        restrict: 'E',
        template: `
            <div class="content" ng-transclude></div>
        `,
        transclude: true,
        replace: true,
        link: function($scope, $elem, $attr) {
            if($attr.hastabs !== undefined) {
                $elem.addClass('with-tab')
            }
        }
    }
}

export const ifooter = function() {
    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        template: '<div class="bar bar-footer" ng-transclude></div>'
    }
}
