$(document).ready(function () {
    $(".play_pause").click(function (e) { 
        e.preventDefault();
        let btn = this
        if($(btn).attr("status") == "pause"){
            $(".play_pause").attr("src", "../../../imgs/design/play.png");
            $(".play_pause").attr("status", "pause")
            for(let i of $(".album_track")){
                i.currentTime = 0
                i.pause()
            }
            $(btn).attr("src", "../../../imgs/design/pause.png");
            $(btn).attr("status", "play")
            $($(btn).next()).find(".album_track")[0].play()
            
        }else{
            $(btn).attr("src", "../../../imgs/design/play.png");
            $(btn).attr("status", "pause")
        }
    });
});