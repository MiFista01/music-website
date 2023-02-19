$(document).ready(function () {
    $($(".list").next()).hide(0);
    $(".list").click(function () {
        $($(this).next()).toggle(200);
    });
});