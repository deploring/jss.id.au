"use strict";

let friendsData;
let selectedFriend;
let friendAudios = [];
let imagesToLoad;
let loaded = false;

function initialise() {
    $.ajax({
        url: "assets/friends.json",
        dataType: 'json',
        success: function (json) {
            friendsData = json["friends"];
            loadFriendData();
            waitToShowPage();
        }
    });
}

function random(max) {
    return Math.round(Math.random() * (max));
}

function loadFriendData() {
    selectedFriend = friendsData[random(friendsData.length - 1)];

    let audioUrl;
    for (audioUrl of selectedFriend["audios"]) {
        friendAudios.push(new Audio(audioUrl));
    }

    imagesToLoad = selectedFriend["images"].length;
    console.assert(imagesToLoad >= 2);
    let imageUrl;
    for (imageUrl of selectedFriend["images"]) {
        // Preload all friend images so that it updates immediately upon refresh.
        $.ajax({
            type: "GET",
            url: imageUrl,
            complete: function () {
                imagesToLoad--;
            }
        });
    }
}

function waitToShowPage() {
    let loaded = true;

    if (imagesToLoad > 0) {
        loaded = false;
    } else {
        let friendAudio;
        for (friendAudio of friendAudios) {
            if (friendAudio.readyState !== 4) {
                loaded = false;
                break;
            }
        }
    }

    if (!loaded) setTimeout(waitToShowPage, 100);
    else showPage();
}

function showPage() {
    refreshAvatar();

    $('#loading').fadeOut(500, function () {
        $('body').css('background-color', 'rgb(15,15,15)');
        $('#friend').animate({top: '50%'}, 1250, 'swing', function () {
            setTimeout(function () {
            }, 500);
        });
    });
}

function refreshAvatar() {
    let avatarElement = $('#friend > img');
    let currentMascotImage = avatarElement.attr('src');

    let newMascotImage;
    do {
        newMascotImage = selectedFriend["images"][random(selectedFriend["images"].length - 1)];
    } while (newMascotImage === currentMascotImage);

    if (loaded) {
        avatarElement.fadeOut(500, function () {
            avatarElement.attr('src', newMascotImage);
            avatarElement.fadeIn(250);
        });
    } else {
        avatarElement.attr('src', newMascotImage);
        loaded = true;
    }
}

function growl() {
    let growlAudio = friendAudios[random(friendAudios.length - 1)];
    if (growlAudio.paused) {
        growlAudio.load();
        growlAudio.play();
    }
}

$(function () {
    initialise();
});
