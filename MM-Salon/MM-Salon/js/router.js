(function () {
    'use strict';

    angular
        .module('app')
        .controller('router', router);

    router.$inject = ['$location']; 

    function router($location) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = 'router';

        activate();

        function activate() { }
    }
})();
