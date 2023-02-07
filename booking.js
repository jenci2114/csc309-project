$(document).ready(function() {
    $('input[name=btnradio]').click(function() {
        var target = $(this).data('target');
        $('.collapse').collapse('hide');
        $(target).collapse('show');
    });
});
