$(document).ready(function() {
    $("input[id=btnradio1]").prop("disabled", true);
    $('input[name=btnradio]').click(function() {
        var target = $(this).data('target');
        $('.collapse').collapse('hide');
        $(this).prop("disabled", true);
        $("input[type='radio']").not(this).prop("disabled", false);
        $(target).collapse('show');
    });
});
