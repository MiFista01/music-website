$(document).ready(function () {
    let form_on = false
    $(".modal_window").animate({opacity:0}, 0, function () { $(".modal_window").css("display", "none");});
    $(".modal_window").click(function (e) { 
       if($(e.target).hasClass("modal_window")){
            $(e.target).animate({opacity:0}, 200, function () { $(e.target).css("display", "none");});
            form_on = false
            $("body").removeClass("scroll_off");
       }
    });
    $("#log").click(function (e) { 
        e.preventDefault();
        if(!form_on){
            $(".log").css("display", "flex");
            $(".log").animate({opacity:1}, 200, function () { });
            form_on = true
            $("body").addClass("scroll_off");
        }
    });
    $("#reg").click(function (e) { 
        e.preventDefault();
        if(!form_on){
            $(".reg").css("display", "flex");
            $(".reg").animate({opacity:1}, 200, function () { });
            form_on = true
            $("body").addClass("scroll_off");
        }
    });
    $(".log").submit(function (e) { 
        e.preventDefault();
        let form = this
        $.ajax({
            type: "post",
            url: "/login",
            data: {nick:form.nick.value, password:form.password.value},
            dataType: "json",
            success: function (response) {
                if(response.status == 1){
                    location.reload()
                }else{
                    $($(form).find(".error_text")).text("Wrong password or nickname");
                }
            }
        });
    });
    $(".reg").submit(function (e) { 
        e.preventDefault();
        let form = this
        $.ajax({
            type: "post",
            url: "/reg",
            data: {nick:form.nick.value, password:form.password.value},
            dataType: "json",
            success: function (response) {
                if(response.status == 1){
                    location.reload()
                }else{
                    $($(form).find(".error_text")).text(response.cause);
                }
            }
        });
    });
});