let view_mode = 1;

$(document).ready(async function() {
    $("#past_button").hide()
    $("#past_commented").hide()
    $("#pending_button").hide()
    $("#current_view").text("Current view: Present Booking")
})

async function switch_view() {
    if (view_mode === 1) {
        view_mode = 2;
        $("#present_button").hide()
        $("#past_button").show()
        $("#current_view").text("Current view: Past Booking")
    } else if (view_mode === 2) {
        view_mode = 3;
        $("#past_button").hide()
        $("#past_commented").show()
        $("#current_view").text("Current view: Past Commented Booking")
    } else if (view_mode === 3) {
        view_mode = 4;
        $("#past_commented").hide()
        $("#pending_button").show()
        $("#current_view").text("Current view: Pending Booking")
    } else if (view_mode === 4) {
        view_mode = 1;
        $("#pending_button").hide()
        $("#present_button").show()
        $("#current_view").text("Current view: Present Booking")
    }
}
