angular.module('weatherstationApp', ['chart.js'])
    .controller('dataController', function ($http, $scope) {
        $scope.stationData = this;
        $scope.stationData.selectedStation = "None";
        $scope.activeStation = "None";
        //gets stations
        $http.get('http://localhost:3000/api/getStations').then(function (response) {
            $scope.stationData.stations = response.data;
        });

        $scope.refreshPage = function() {
            $http.get('http://localhost:3000/api/getStations').then(function (response) {
                $scope.stationData.stations = response.data;
                if(response) {
                    event.target.id = $scope.stationData.selectedStation;
                    $scope.setSelectedStation(event);
                }
            });
        };
        //Gets measured data from server
        $scope.setSelectedStation = function (event) {
            $scope.stationData.selectedStation = event.target.id;
            $scope.activeStation = event.target.id;
            $http.get('http://localhost:3000/api/getStationData/' + event.target.id).then(function (response) {
                $scope.stationData.data = response.data;
                //dit volgende blokje is om de datum voor ons leesbaar te maken.
                //deze loopt over het response.data heen en vervangt de date met een nieuwe format data
                response.data.forEach(function (v, i) {
                    var parts = v.Time.slice(0, -1).split('T');
                    var ptrn = /(\d{4})-(\d{2})-(\d{2})/;
                    parts[0] = parts[0].replace(ptrn, '$3-$2-$1');
                    $scope.stationData.data[i].Time = parts[0] + ' ' + parts[1];
                    //vult het array voor de graph
                    if (i < 11) {
                        $scope.tempData[i] = $scope.stationData.data[i].Temperature_celsius;
                        $scope.lightData[i] = $scope.stationData.data[i].Illuminate;
                        $scope.labels[i] = $scope.stationData.data[i].Time.slice(0,-4);
                    }
                    //flipt het array voor de juiste volgorde in de graph (anders komen de meest recente temperatuurmetingen links in de graph
                    if (i === 11) {
                        $scope.tempData.reverse();
                        $scope.labels.reverse();
                        $scope.lightData.reverse();
                        $scope.maxTemp = Math.round(Math.max.apply(Math, $scope.tempData.map(function(o) { return (o +10);}))/5)*5;
                        $scope.maxLight = Math.round(Math.max.apply(Math, $scope.lightData.map(function(o) { return o +100;}))/100)*100;
                    }
                });

            })
        };
        //menu item config
        $scope.menuItems = ['Table', 'Temp Graph', 'Light Graph'];
        $scope.activeMenu = $scope.menuItems[0];
        $scope.setActive = function (menuItem) {
            $scope.activeMenu = menuItem;
            if (menuItem === 'Temp Graph') {
                $scope.options.scales.yAxes[0].ticks.max = $scope.maxTemp;
            }
            if (menuItem === 'Light Graph') {
                $scope.options.scales.yAxes[0].ticks.max = $scope.maxLight;
            }

        };

        //chart config
        $scope.lightData = [];
        $scope.tempData = [];
        $scope.labels = [];

        $scope.onClick = function (points, evt) {
            console.log(points, evt);
        };

        $scope.options = {
            scales: {
                yAxes: [
                    {
                        id: 'y-axis-1',
                        type: 'linear',
                        display: true,
                        position: 'left',
                        ticks: { min: 0, max: 100 }
                    }
                ]
            },
            elements: {
                line: {
                    tension: 0
                }
            }
        };
    });
