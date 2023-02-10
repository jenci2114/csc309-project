function apply_filter() {
    reset_filter()
    $("#guests").val('2')
    $("#order").val('rating_desc')
    $(".filter-hide").hide()
}

function reset_filter() {
    $(".filter-hide").show()
    $(".filter-hide-2").show()
    $("#startDate").val('')
    $("#endDate").val('')
    $("#guests").val('')
}

function apply_filter_two() {
    reset_filter()
    $("#guests").val('3')
    $("#order").val('name_asc')
    $("#startDate").val('2023-02-06')
    $("#endDate").val('2023-02-07')
    $(".filter-hide-2").hide()
}
