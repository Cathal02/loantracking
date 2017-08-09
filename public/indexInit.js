$(document).ready(function(){
// the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
$('.modal').modal();

$("#searchLoan").on('keyup', function(){
  console.log("search");
  var searchTerm = $(this).val().toLowerCase();
  $("#loanTable tbody tr").each(function(){
    var lineStr = $(this).text().toLowerCase();
    if(lineStr.indexOf(searchTerm) == -1){
      $(this).hide();
    } else{
      $(this).show();
    }
  });
});

$("#searchClient").on("keyup", function(){
  var clientName = $(this).val().toLowerCase();
  $(".clientHeader").each(function(){
    var lineStr = $(this).text().toLowerCase();
    if(lineStr.indexOf(clientName) === -1){
      $(this).parent().parent().hide();
    } else{
      $(this).parent().parent().show();
    }
  })
});


});
