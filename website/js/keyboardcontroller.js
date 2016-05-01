/*! 
    quirli, replay with ease.
    Copyright (C) 2012 by marcel suter, marcel@codeministry.ch

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
 * Controller for the keyboard handling, using AngularJS.
 */

function keyboardController($scope) {
	   
        $scope.command = "";
     
        $scope.addCharacter = function(character) {
            $scope.command = $scope.command + character;
        };

        $scope.clearCommand = function() {
            $scope.command = "";
        };

    }
