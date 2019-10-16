/*!
    quirli, replay with ease.
    Copyright (C) 2012-2018 by marcel suter, marcel@marcelsuter.ch

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
 * player presenter layer
 * This presentes data on the tightly coupled view (the player.html file)
 * It uses known identifiers from the view to access and present various data.
 */

//visually initialize the page, including tooltips
$(document).ready(function() {
    $("#loadingdisplay").hide(); //to signal working javascript to the user
    $("#coreui").show(); //to signal working javascript to the user		
    $("[rel=tooltip]").tooltip();
    $("#playercontrols").hide(); //initially, there is no media to control for playing
    $("#progressdisplay").hide(); //document is ready now
    $("#errordisplay").hide(); //document is ready now

    //Specially handle the enter key on the url entry field, to actually change the model on enter key
    $("#sourceurl").keyup(function(event) {
        if (event.keyCode == 13) {
            $("#sourceurl").blur();
        }
    });
});

//this method is called after sucessfully loading the media from a mediaelement player
//and defines the actions for a media element media
function onMediaelementPlayerReady(mediaelementplayer) {
    mediaelementplayer.load();
    defineMediaPlayerHandling(mediaelementplayer, globalScope);
    globalScope.PlaybackType = mediaelementplayer.rendererName;
    globalScope.$apply();
}




//removes all exising player controls, which stops them playing and unloads the media content
function removeAllPlayers() {
    try {
        doPause(); //to silence eventual media playing
        doStop(); //to somewhat unload media (helps for flash playing in FF at least)
    } catch (e) {
        //just catch em all
    }

    globalScope.PlaybackType = "";
    $("#quirliplayer").empty();
}

//Displays an error text in the error area
function displayError(errortext) {
    $("#errortext").text(errortext);
    $("#errordisplay").show();
}

//Removes any previously displayed error
function removeErrors(errortext) {
    $("#errortext").text("");
    $("#errordisplay").hide();
}



//loads the content of the specified url into a new, matching media player
//later, instead of interpreting the url, actually request the file
function loadMediaUrl(objectURL) {
    if ((objectURL === null) || (objectURL === '')) {
        return false; //nothing to load at all
    }
    //TODO later check the existence of the referenced file first, to create a better user experience
    removeErrors();

    //determine media type and handle accordingly
    if (objectURL.substr(objectURL.length - 4) === ".wav") {
        createPlayerAndLoadSource(objectURL, "audio");
    } else if (objectURL.substr(objectURL.length - 4) === ".mp3") {
        createPlayerAndLoadSource(objectURL, "audio");
    } else if (objectURL.substr(objectURL.length - 4) === ".ogv") {
        createPlayerAndLoadSource(objectURL, "video");
    } else if (objectURL.substr(objectURL.length - 4) === ".wmv") {
        createPlayerAndLoadSource(objectURL, "video");
    } else if (objectURL.substr(objectURL.length - 5) === ".webm") {
        createPlayerAndLoadSource(objectURL, "video");
    } else if (objectURL.substr(objectURL.length - 4) === ".mp4") {
        createPlayerAndLoadSource(objectURL, "video");
    } else { //we dont know or it is from a content provider like youtube or vimeo: Just assume video, because video generally also can play audio
        createPlayerAndLoadSource(objectURL, "video");
    }
}

//creates a suitable player, sets the source of the matching media player control, and defines the action handlers.
//this works for real url's only, not for url object of local files (unfortunately these object urls seem to become invalid at the call to this method)
function createPlayerAndLoadSource(objectURL, sourceType) {
    removeAllPlayers(); //to get rid of unused ones
    quirliControlType = sourceType;

    //TODO probably we can simplyfiy this if case
    if (quirliControlType === "audio") {
        //The way to handle the video element is taken from the mediaelement.js demo and docs
        var audio = document.createElement('audio');
        audio.controls = true;
        audio.src = objectURL;
        audio.preload = true;
       $("#quirliplayer").append(audio);
        var mediaelementplayer = new MediaElementPlayer(audio, {
            alwaysShowControls: true,
            enableAutosize: true,
            // width of audio player
            audioWidth: '100%',
            // the order of controls you want on the control bar (and other plugins below)
            features: ['playpause', 'progress', 'current', 'duration', 'tracks', 'volume', 'fullscreen'],
            // when this player starts, it will pause other players
            pauseOtherPlayers: true,
            success: function(mediaelementplayer) {
                onMediaelementPlayerReady.apply(this, arguments)
            },
            error: function(mediaElement) {
                console.log('medialement problem is detected: %o', mediaElement);
            }
        });

    }
    if (quirliControlType === "video") {
        //The way to handle the video element is taken from the mediaelement.js demo and docs
        var video = document.createElement('video');
        video.width = "640";
        video.height = "360";
        video.controls = true;
        video.src = objectURL;
        //video.preload = true;
        $("#quirliplayer").append(video);
        var mediaelementplayer = new MediaElementPlayer(video, {
            defaultVideoWidth: 640,
            defaultVideoHeight: 360,
            videoWidth: 640,
            videoHeight: 360,
            alwaysShowControls: true,
            // enables Flash and Silverlight to resize to content size
            enableAutosize: true,
            // the order of controls you want on the control bar (and other plugins below)
            features: ['playpause', 'progress', 'current', 'duration', 'tracks', 'volume', 'fullscreen'],
            // when this player starts, it will pause other players
            pauseOtherPlayers: true,
            success: function(mediaelementplayer) {
                onMediaelementPlayerReady.apply(this, arguments)
            },
            error: function(mediaElement) {
                console.log('medialement problem is detected: %o', mediaElement);
            }
        });
    }
}

///Adds a visual representation of a cue
function presentCue(caption, position) {
    //thru the globally availabe scope of the cues, add the new one. This is kind of a hack, but i dont know how to access the cues otherwise
    globalScope.text = caption;
    globalScope.position = position;
    globalScope.addCueAsNewest();
}



//defines the concrete MediaelementJs player actions for the standardized do...Actions
function defineMediaPlayerHandling(mediaPlayer, globalscope) {
    globalscope.doPlay = function() {
        //The audio flash requires this check below, otherwise it plays more than once when clicked the play button repeatedly
        if (mediaPlayer.paused || mediaPlayer.ended) {
            mediaPlayer.play();
        }
    } //make sure we do not "play twice"
    globalscope.doPause = function() {
        mediaPlayer.pause();
    }
    globalscope.doStop = function() {
        mediaPlayer.pause();
        mediaPlayer.stop();
    } //To really stop any ongoing flash stuff
    globalscope.doIncreaseVolume = function() {
        mediaPlayer.setVolume(mediaPlayer.volume + 0.1);
    }
    globalscope.doDecreaseVolume = function() {
        mediaPlayer.setVolume(mediaPlayer.volume - 0.1);
    }
    //Seeks to the point in time, but does not autoplay
    globalscope.doSeekTo = function(position) {
        mediaPlayer.setCurrentTime(position);
    }
    globalscope.doGetPosition = function() {
        return mediaPlayer.currentTime;
    }
    globalscope.doAddCueHere = function() {
        presentCue('', globalscope.doGetPosition().toFixed(2));
    } //round to two decimal places only, more is not audible anyway
}
