$(document).ready(function () {
    $("#search_albums").submit(function (e) { 
        e.preventDefault();
        let form = this
        $.ajax({
            type: "post",
            url: "/search_albums",
            data: {album:form.obj.value},
            dataType: "html",
            success: function (response) {
                $("main").empty();
                $("main").html(response);
            }
        });
    });
    $("#search_playlist").submit(function (e) { 
        e.preventDefault();
        let form = this
        $.ajax({
            type: "post",
            url: "/search_playlists",
            data: {playlist:form.obj.value},
            dataType: "html",
            success: function (response) {
                $("main").empty();
                $("main").html(response);
            }
        });
    });
});