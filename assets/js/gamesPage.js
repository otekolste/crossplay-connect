let ytKey = 'AIzaSyDqk5LsbYpP5Z463Q5A4mXxZdPIlhytH-8';

let rawgKey = 'b618359b01914cd7acce5ef9812e9759';

let player = $('#player');

let info = [];

let wishlist = [];

let videoId = '';



function renderGameDetails(){
    if(info == null) {
        $('#gameTitle').innerHTML = "Whoops...there was an issue loading the info!"
    }
    else{
      console.log(info);
        $('#gameTitle').text(info.name);

        let genString = info.genres.map((gen) => `${gen.name}`).join(", ");

        $('#infoContainer').append(`
          <h1 class="text-xl my-2">Rating: ${info.rating}</h1>
          <h1 class="text-xl my-2">Genres: ${genString}</h1>

        `);

        fetchYoutubeData();


    }
}


function fetchYoutubeData(){
    let searchString = (info.name.replaceAll(' ','+')).concat('+trailer');
    const ytURL = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchString}&maxResults=1&type=video&videoEmbeddable=true&key=${ytKey}`
    fetch(ytURL)
    .then((response) => {
        return response.json();

    })
    .then((response) => {
        console.log(response);

        var tag = document.createElement('script');

        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        videoId = response["items"][0]["id"].videoId;

    })
    
    .catch((error) => {
        console.log("Error fetching YT data: " + error)
        $("#errorMessage").innerHTML('There was an error embedding the YouTube video player.');
    })
}

function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '390',
    width: '640',
    videoId: videoId,
    playerVars: {
      'playsinline': 1
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

      // 4. The API will call this function when the video player is ready.
      function onPlayerReady(event) {
        event.target.playVideo();
      }

      // 5. The API calls this function when the player's state changes.
      //    The function indicates that when playing a video (state=1),
      //    the player should play for six seconds and then stop.
      var done = false;
      function onPlayerStateChange(event) {
        if (event.data == YT.PlayerState.PLAYING && !done) {
          setTimeout(stopVideo, 6000);
          done = true;
        }
      }
      function stopVideo() {
        player.stopVideo();
      }

      function handleAddWishlist(event) {
        event.preventDefault();
        console.log(wishlist);
        const game = wishlist.find(function(element) {
          return element.id == info.id;
        });
        if(!game) {
          wishlist.push(info);
          localStorage.setItem('wishlist', JSON.stringify(wishlist));
        }

        window.location.href = 'wishlist.html';


      }

$(document).ready(function(){

    info = JSON.parse(localStorage.getItem('gameInfo'));


    let storedList = JSON.parse(localStorage.getItem('wishlist'));

    if(storedList!=null) {
      wishlist = storedList;
    }

    renderGameDetails();

    $('#wishlistButton').on('click', handleAddWishlist);
 //   fetchYoutubeData();
})