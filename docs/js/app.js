$(function(){
    var msg = $('.message').val();
    $('#notification').html('');
    var dialog = $('#dialog-1');
    var alertDialog =  $('#alert-1');
    var fullScreenDialog =  $('#full-screen-1');

    dialog.on('ca.dialog.dismissive.action', function(){
        $('#notification').html('Your response was dismissive');
    });

    dialog.on('ca.dialog.affirmative.action', function(){
        $('#notification').html('Your response was affirmative');
    });

    dialog.on('ca.dialog.click.dismiss.', function(e){
        $('#notification').html('You dismiss the dialog.');
        console.log(e);
    });

    dialog.on('ca.dialog.keydown.dismiss', function(){
        $('#notification').html('You dismiss the dialog by pressing esc key.');
    });
    alertDialog.on('ca.dialog.dismissive.action', function(){
        $('#notification').html('Your response was dismissive');
    });

    alertDialog.on('ca.dialog.affirmative.action', function(){
        $('#notification').html('Your response was affirmative');
    });

    alertDialog.on('ca.dialog.click.dismiss.', function(e){
        $('#notification').html('You dismiss the dialog.');
        console.log(e);
    });

    alertDialog.on('ca.dialog.keydown.dismiss', function(){
        $('#notification').html('You dismiss the dialog by pressing esc key.');
    });
    fullScreenDialog.on('ca.dialog.dismissive.action', function(){
        $('#notification').html('Your response was dismissive');
    });

    fullScreenDialog.on('ca.dialog.affirmative.action', function(){
        $('#notification').html('Your response was affirmative');
    });

    fullScreenDialog.on('ca.dialog.click.dismiss.', function(e){
        $('#notification').html('You dismiss the dialog.');
        console.log(e);
    });

    fullScreenDialog.on('ca.dialog.keydown.dismiss', function(){
        $('#notification').html('You dismiss the dialog by pressing esc key.');
    });
    hljs.initHighlightingOnLoad();
});