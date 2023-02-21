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
                                if(response.text != undefined){
                                    $(".error_text").text(response.text);
                                }
                                else{
                                    $(".error_text").text("Error");
                                }
                            }
                        }
                    });
                });
            }
        });
    });
    update(".update")
    $("#search_track").submit(function (e) { 
        e.preventDefault();
        let form = this
        $.ajax({
            type: "post",
            url: "/search_tracks",
            data: {name:form.name.value},
            dataType: "html",
            success: function (response) {
                $(".list .result").empty();
                $(".list .result").html(response)
                update(".update")
            }
        });
    });
    $("#search_tracks").submit(function (e) { 
        e.preventDefault();
        let form = this
        $.ajax({
            type: "post",
            url: "/search_tracks",
            data: {name:form.name.value},
            dataType: "html",
            success: function (response) {
                $(".list .result").empty();
                $(".list .result").html(response)
                add(".update")
            }
        });
    });
});
function update(obj) {
    $(obj).click(function (e) { 
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
                    console.log(data)
                    data["id"] = $(btn).attr("id")
                    $.ajax({
                        url: "/"+$(btn).attr("form")+"_update",
                        method: 'post',
                        processData: false,
                        contentType: false,
                        cache: false,
                        data: form,
                        enctype: 'multipart/form-data',
                        dataType: "json",
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
    $("#update_playlist").submit(function (e) { 
        e.preventDefault();
        let data = []
        $("input:checkbox[name=track]:checked").each(function() {
            data.push($(this).val());
        });
        $.ajax({
            type: "post",
            url: "/update_playlist",
            data: {data},
            dataType: "dataType",
            success: function (response) {
                
            }
        });
    });
}
function add(obj){
    $(obj).click(function (e) { 
        e.preventDefault();
        let btn = this
        let div = document.createElement("div")
        remove(div)
        let input = document.createElement("input")
        input.type = "checkbox"
        input.checked = true
        input.name = "track"
        input.value = $(btn).find(".text").text()
        input.style.display = "none"
        let lable = document.createElement("label")
        lable.textContent = $(btn).find(".text").text()
        lable.className = "middle_ft"
        div.appendChild(input)
        div.appendChild(lable)
        $(".tracks").append(div);
    });
}
function remove(obj){
    $(obj).click(function (e) { 
        e.preventDefault();
        $(this).remove();
    });

}