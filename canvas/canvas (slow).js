/* The following code keeps the scope clean and maps 'jQuery' to '$' */
//(function($){

  /* Here are some 'global' variables */
  var canvas;
  var context;
  // painting
  var clickX = new Array();
  var clickY = new Array();
  var clickDrag = new Array();
  var clickSpeed = new Array();
  var paint;
  // mouse speed
  var speedMouseX = -1;
  var speedMouseY = -1;
  var speedTime = -1;
  
  
  /* This is the 'onload' code */
  $(function(){
    
    /* Now we initialize the app */
    canvas = document.getElementById('main_canvas');
    context = canvas.getContext("2d");
    
    $('#main_canvas').mousedown(function(e){
      var mouseX = e.pageX - this.offsetLeft;
      var mouseY = e.pageY - this.offsetTop;
		
      paint = true;
      addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
      redraw();
    });
    $('#main_canvas').mousemove(function(e){
      if(paint){
        addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
        redraw();
      }
    });
    $('#main_canvas').mouseup(function(e){
      paint = false;
    });
    $('#main_canvas').mouseleave(function(e){
      paint = false;
    });
    
  });

  function addClick(x, y, dragging)
  {
    clickX.push(x);
    clickY.push(y);
    clickDrag.push(dragging);
    
    // add speed recording
    var speedRel = 0;
    var i = clickX.length;
    
    if (i > 1) {
      var distanceSquared = Math.sqrt(
      Math.pow(clickX[i-1]-clickX[i-2],2)
                          + Math.pow(clickY[i-1]-clickY[i-2],2));
      speedRel = distanceSquared/50;
    }
    
    clickSpeed.push(speedRel);
  }
  
  function redraw(){
    canvas.width = window.innerWidth; // Clears the canvas
    canvas.height = window.innerHeight
    
    context.strokeStyle = "#df4b26";
    context.lineJoin = "round";
    context.lineWidth = 5;
    var lineWidth = 5;
    
    for(var i=0; i < clickX.length; i++)
    {
      if(clickDrag[i] && i){
        stroke(clickX[i-1], clickY[i-1], clickX[i], clickY[i], 5-10*clickSpeed[i-1], 5-10*clickSpeed[i]);
      }else{
        context.beginPath();
        context.moveTo(clickX[i]-1, clickY[i]);
        context.lineTo(clickX[i], clickY[i]);
        context.closePath();
      }
    }
  }
  
  function stroke(x,y,x2,y2,r1,r2){
    
    if (r1<1) r1 = 1;
    if (r2<1) r2 = 1;
    
    console.log()
    
    var l = Math.sqrt(Math.pow(x2-x,2)+Math.pow(y2-y,2));
    var r1x = -(y2-y)*r1/l/2;
    var r1y = (x2-x)*r1/l/2;
    var r2x = -(y2-y)*r2/l/2;
    var r2y = (x2-x)*r2/l/2;
    
    var oldFill = context.fillStyle;
    context.fillStyle   = context.strokeStyle;
    
    // start dot done elsewhere
    // stroke
    context.beginPath();
    context.moveTo(x+r1x, y+r1y);
    context.lineTo(x-r1x, y-r1y);
    context.lineTo(x2-r2x, y2-r2y);
    context.lineTo(x2+r2x, y2+r2y);
    context.fill();
    context.closePath();
    // end dot
    context.beginPath();
    context.arc(x2,y2,r2/2,0,Math.PI*2,true);
    context.closePath();
    context.fill();
    
    context.fillStyle = oldFill;
    
    //var rr = Math.sqrt(Math.pow(2*r1x,2)+Math.pow(2*r1y,2));
    //console.log([rr,r1])
  }
//})(jQuery);
