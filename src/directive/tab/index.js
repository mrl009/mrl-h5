import angular from 'angular'
const j = angular.element

export const tabItems = function($timeout) {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        template: '<div class="buttons-tab" ng-transclude></div>',
        controller: function($scope) {
            $scope.items = []
        	this.addItem = function(item) {
                $scope.items.push(item)
            }
        },
        link: function($scope, $elem) {
            console.log('$elem->', $elem)
        	$timeout(function() {
        		if($scope.items.length) {
        			angular.forEach($scope.items, function(e) {
        				$elem.append(e)
        			})

                    $scope.handleActive()
                    $scope.bindActive()
        		}
        	})

            $scope.tabId = 0
            $scope.handleActive = function() {
                const $c = $elem.children()
                angular.forEach($c, function(e, idx) {
                    if($scope.tabId == idx) {
                        j(e).addClass('active border-color')
                    }
                })
            }

            $scope.bindActive = function() {
                const $child = $elem.children()
                $child.on('click', function() {
                    $child.removeClass('active border-color')
                    j(this).addClass('active border-color')
                })
            }
        }
    }
}

export const tabItem = function() {
	return {
		require: '^tabItems',
        restrict: 'E',
		template: '<a class="tab-link button fs14"></a>',
		replace: true,
		link: function($scope, $elem, $attr, $parent) {
			$parent.addItem($elem)
			$elem.text($attr.title)
		}
	}
}
