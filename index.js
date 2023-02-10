function apply_filter() {
    reset_filter()
    $("#guests").val('2')
    $("#order").val('rating_desc')
    $(".filter-hide").hide()
}

function reset_filter() {
    $(".filter-hide").show()
    $(".filter-hide-2").show()
}

function apply_filter_two() {
    reset_filter()
    $("#guests").val('3')
    $("#order").val('name_asc')
    $(".filter-hide-2").hide()
}
