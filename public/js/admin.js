$(document).ready(function () {
    $("#add").click(function (e) { 
        e.preventDefault();
        let btn = this
        $(".create_form").empty();
        $.ajax({
            type: "post",
            url: "/get_form_"+$(btn).attr("form")+"",
            data: {form:"add", type:$(btn).attr("form")},
            dataType: "html",
            success: function (response) {
                $(".create_form").html(response);
                $("#add_row").submit(function (e) { 
                    e.preventDefault();
                    let form = new FormData(this)
                    let data = {}
                    for (const [key, value] of form) {
                        if (key != "img"){
                            data[key] = value
                        }
                    }
                    $.ajax({
                        url: "/"+$(btn).attr("form")+"_add",
                        method: 'post',
                        processData: false,
                        contentType: false,
                        cache: false,
                        data: form,
                        enctype: 'multipart/form-data',
                        dataType: "json",
                        success: function (response) {
                            if(response.status == 1){
                                $(".error_text").text("Created");
                                for (const [key, value] of form) {
                                    form[key] = ""
                                }
                            }else{
                                $(".error_text").text("Error");
                            }
                        }
                    });
                });
            }
        });
    });
    $(".update").click(function (e) { 
        e.preventDefault();
        $(".create_form").empty();
        let btn = this
        $.ajax({
            type: "post",
            url: "/get_form_"+$(btn).attr("form")+"",
            data: {form:"update", id:$(btn).attr("id")},
            dataType: "html",
            success: function (response) {
                $(".create_form").html(response);
                $(".delete").click(function (e) { 
                    e.preventDefault();
                    let delete_btn = this
                    $.ajax({
                        type: "post",
                        url: "/"+$(btn).attr("form")+"_remove",
                        data: {id:$(delete_btn).attr("id")},
                        dataType: "json",
                        success: function (response) {
                            $($(".list").find("[id='"+$(delete_btn).attr("id")+"']")).remove();
                            $(".create_form").empty();
                        }
                    });
                });
                $(".update_row").submit(function (e) { 
                    e.preventDefault();
                    let form = new FormData(this)
                    let data = {}
                    for (const [key, value] of form) {
                        data[key] = value
                    }
                    data["id"] = $(btn).attr("id")
                    $.ajax({
                        type: "post",
                        url: "/"+$(btn).attr("form")+"_update",
                        data: data,
                        dataType: "json",
                        processData: false,
                        contentType: false,
                        success: function (response) {
                            if(response.status == 1){
                                $(".error_text").text("Updated");
                            }else{
                                $(".error_text").text("Error");
                            }
                        }
                    });
                });
            }
        });
    });
});