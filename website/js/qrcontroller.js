/*! 
    quirli, replay with ease.
    Copyright (C) 2012-2018 by marcel suter, marcel@codeministry.ch

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/*!
 * Controller for the qr generator, using AngularJS.
 */

var qrApp = angular.module('qr', []);

function qrController($scope, $location) {
    
    globalScope = $scope; //TODO to give easy access, but later rework to fit the angular style
    
    $scope.QrText = "";
    $scope.QrTextReadonly = false;
    $scope.EccLevel = 1;
    $scope.QrSizeDivider = 1; //1 is 100%

    //preload this scope from the url query when available
    //$scope.location = $location;
    parseQueryParameter($scope);
    
    //If available, readily generate the QR code 
    //doqr();
}

//parses the query parameter and preloads the model with it's data
function parseQueryParameter($scope) {
    //TODO later use the $location from the scope to get the url, to comply with angular style
    var url = window.location.href;

    //Load text from parameters		
    var qrText = decodeURIComponent(gup(url, 'text'));
    if (qrText) { //there is any?
        $scope.QrText = qrText;
    }
    
    //Load readonly state from parameters
    var qrTextReadonly = (gup(url, 'readonly') === "true");
    $scope.QrTextReadonly = qrTextReadonly;
}

//---Helpers

//Parses the current URL and returns the value for the specified parameter specified.
//It does this using javascript's built in regular expressions.
//Taken from http://www.netlobo.com/url_query_string_javascript.html 
function gup(url, name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(url);
    if (results == null)
        return "";
    else
        return results[1];
}