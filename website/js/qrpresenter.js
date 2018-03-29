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
 * qr presenter layer
 * This presentes data on the tightly coupled view (the qr.html file)
 * It uses known identifiers from the view to access and present various data.
 */

//visually initialize the page, including tooltips
$(document).ready(function () {
    $("#loadingdisplay").hide(); //to signal working javascript to the user
    $("[rel=tooltip]").tooltip();

    //Specially handle the enter key on the url entry field, to actually change the model on enter key
    $("#sourceurl").keyup(function (event) {
        if (event.keyCode == 13) {
            $("#sourceurl").blur();
        }
    });

    setupqr();
    //loads the eventual existing text into a new qr code
    doqr();
});
