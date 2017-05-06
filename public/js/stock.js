 var socket = io();
 $(function() {
 });
 socket.on('chat message', function(msg) {
     console.log("go to chat message");
     var tempsym = $.url().param('symbol') || msg;
     var tempdur = $.url().param('duration') || 3650;
    
     new Markit.InteractiveChartApi(tempsym, tempdur);
     $('#stockButtons').append('&nbsp;<div class="btn btn-info" role="button">' + msg + ' <a class="stock" id="' + msg + '">X</a></div>');
     $('#symbolsearch').val('');
 });
 socket.on('remove message', function(msg) {
  console.log("go to remove message");
     var chart = $('#chartDemoContainer').highcharts();
     for (var i = 0; i < chart.series.length; i++) {
         if (chart.series[i].name === msg) {
             chart.series[i].remove();
             break;
         }
     }
     for (var j = 0; j < seriesOptions.length; j++) {
         if (seriesOptions[j].name === msg) {
             seriesOptions.splice(j, 1);
             break;
         }
     }
      $('#' + msg).parent().remove();
 });
 socket.on('message', function(message) {
  console.log("go to message "+message);
     var tempStocks = JSON.parse(message);
     for (var i = 0; i < tempStocks.data.length; i++) {
         var tempsym = $.url().param('symbol') || tempStocks.data[i];
         var tempdur = $.url().param('duration') || 3650;
         new Markit.InteractiveChartApi(tempsym, tempdur);
         $('#stockButtons').append('&nbsp;<div class="btn btn-info" role="button">' + tempStocks.data[i] + ' <a class="stock" id="' + tempStocks.data[i] + '">X</a></div>');
         $('#symbolsearch').val('');
     }
 });

 $('body').on('click', '.stock', function() {
     var stockValue = $(this).attr("id");
     socket.emit('remove message', stockValue);
 });