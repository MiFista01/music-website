$(document).ready(function () {
    $(".user ul").hide(0);
    $(".icon img").click(function (e) { 
        e.preventDefault();
        $(".user ul").toggle(200);
    });
    $("#logout").click(function (e) { 
        e.preventDefault();
        $.ajax({
            type: "post",
            url: "/logout",
            data: "",
            dataType: "json",
            success: function (response) {
                if(response.status == 1){
                    location.reload()
                }
            }
        });
    });
    
});