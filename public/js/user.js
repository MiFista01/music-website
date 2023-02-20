$(document).ready(function () {
    if(location.pathname.split('/')[1] != "" && location.pathname.split('/')[1] != "genre"){
        $(".search").remove();
    }
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
    $("#change_profile").submit(function (e) { 
        e.preventDefault();
        let form = this
        let data = {}
        if(form.nick == null){
            if (form.password.value >= 5){
                data.password = form.password.value
            }else{
                $(".error_text").text("Password shorter than 5 characters");
            }
        }else{
            if (form.password.value.length >= 5 && form.nick.value.length >= 5){
                data.password = form.password.value
                data.nick = form.nick.value
            }
        }
        if(Object.keys(data).length){
            $.ajax({
                type: "post",
                url: "/change_profile",
                data: data,
                dataType: "json",
                success: function (response) {
                    if(response.status == 1){
                        $(".error_text").text("Profile changed");
                    }else{
                        $(".error_text").text("Profile not changed");
                    }
                }
            });
        }
    });
});