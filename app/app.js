Date.prototype.yyyymmdd = function() {
    var mm = this.getMonth() + 1; // getMonth() is zero-based
    var dd = this.getDate();

    return [this.getFullYear(),
        (mm>9 ? '' : '0') + mm,
        (dd>9 ? '' : '0') + dd
    ].join('/');
};
Date.prototype.hhmm = function() {
    var hh = this.getHours(); // getMonth() is zero-based
    var mm = this.getMinutes();

    return [(hh>9 ? '' : '0') + hh,
        (mm>9 ? '' : '0') + mm
    ].join(':');
};
(function () {
    // create the module and name it app
    var app = angular.module('myApp', ['ngRoute',"firebase",'ui.bootstrap']);

    // configure our routes
    app.config(function($routeProvider) {
        $routeProvider

        // route for the home page
            .when('/', {
                templateUrl : 'tareas/home.html',
                controller  : 'mainController'
            })

            // route for the about page
            .when('/about', {
                templateUrl : 'tareas/about.html',
                controller  : 'aboutController'
            })

            // route for the contact page
            .when('/contact', {
                templateUrl : 'tareas/contact.html',
                controller  : 'contactController'
            })
            .otherwise({
                redirectTo: '/'
            });
    });
    app.service("servicioTareas",["firebase","$firebaseObject",
        function (firebase, $firebaseObject) {
            // Initialize Firebase
            var config = {
                apiKey: "AIzaSyBhYqfvmnNmWWlaIvrrAayZtm9Pxn0HIL0",
                authDomain: "calidad-c0a3f.firebaseapp.com",
                databaseURL: "https://calidad-c0a3f.firebaseio.com/",
                storageBucket: "calidad-c0a3f.appspot.com",
                messagingSenderId: "90338327004"
            };
            firebase.initializeApp(config);
            var database = firebase.database();
            return database;
        }]);
    app.service("tareas",["servicioTareas","$firebaseArray",
        function (servicioTareas,$firebaseArray) {
            var ref=servicioTareas.ref("tareas");
            return $firebaseArray(ref);
        }]);
    app.service("empleados",["servicioTareas","$firebaseObject",
        function (servicioTareas,$firebaseArray) {
            var ref=servicioTareas.ref("empleados");
            return $firebaseArray(ref);
        }]);
// create the controller and inject Angular's $scope
    app.controller('mainController',["$scope",
        "tareas",
        "empleados",
        function($scope,tareas, empleados) {

            $scope.tarea={
                name:"",
                employee:"",
                date:new Date(),
                init_date:new Date(),
                end_date:new Date(),
                quantity:1,
                status:0
            };
            $scope.tareas = tareas;
            $scope.empleados = empleados;
            //console.log(tareas.length);
            //console.log(empleados);
            $scope.submit=function(){
                //console.log($scope.tarea);
                //console.log($scope.tarea.init_date);
                $scope.tarea.init_date=$scope.tarea.init_date.hhmm();
                $scope.tarea.end_date=$scope.tarea.end_date.hhmm();
                $scope.tarea.date=(new Date).yyyymmdd();
                $scope.tareas.$add($scope.tarea)
                    .then(function(ref) {
                        var id = ref.key;
                        console.log("Añadida tarea con id: " + id);
                    });
                $scope.tarea={
                    name:"",
                    employee:"",
                    init_date:new Date(),
                    end_date:new Date(),
                    quantity:0
                };
            };
            $scope.borra=function (tarea) {
                console.log(tarea);
                $scope.tareas.$remove(tarea)
                    .then(function(ref) {
                        if(ref.key === tarea.$id){
                            console.log("Borrada tarea con id:"+ref.key);
                        }else{
                            console.log("No se ha podido borrar la tarea con id:"+ref.key);
                        }
                    }
                );
            }
        }]);

    app.controller('aboutController', function($scope) {

    });

    app.controller('contactController', function($scope) {

    });

}());