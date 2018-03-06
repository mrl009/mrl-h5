export const fileUpLoad = function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var onChangeHandler = scope.$eval(attrs.fileUpLoad)
            element.bind('change', onChangeHandler)
        }
    }
}
