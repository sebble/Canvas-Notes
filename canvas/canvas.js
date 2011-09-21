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
  // options
  //var lineColour = '#df4b26';
  var lineColour = 0;
  var lineWidth = 5;
  var speedEffect = 4;
  var lineColours = [
    "#000",
    "#c00",
    "#0c0",
    "#00c",
    "#900",
    "#090",
    "#009",
    "#9c0",
    "#c90",
    "#90c",
    "#c09",
    "#0c9",
    "#09c",
    "#ccc",
    "#999"
  ];
  var lineErase = false;
  var lineEraseColour = "#ffe";
  var lineHi = false;
  var background = 0;
  var backgrounds = [
    "drawLines",
    "drawGrid"
  ];
  
  
  /* This is the 'onload' code */
  $(function(){
    
    /* Now we initialize the app */
    canvas = document.getElementById('cn_mainCanvas');
    context = canvas.getContext("2d");
    context.strokeStyle = lineColours[lineColour];
    context.lineJoin = "round";
    context.lineWidth = lineWidth;
    canvas.width = window.innerWidth; // Clears the canvas
    canvas.height = window.innerHeight;
    
    $('#cn_statusCanvas').mousedown(function(e){
      e.preventDefault();// stops glitchy selecting of text on page
      
      var mouseX = e.pageX - this.offsetLeft;
      var mouseY = e.pageY - this.offsetTop;
		
      paint = true;
      addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
      //redraw();
      //var i = clickX.length-1;
      //stroke(clickX[i-1], clickY[i-1], clickX[i], clickY[i], 5-10*clickSpeed[i-1], 5-10*clickSpeed[i]);
      newline(clickX[clickX.length-1], clickY[clickX.length-1], lineWidth-lineWidth*2*clickSpeed[clickX.length]);
    });
    $('#cn_statusCanvas').mousemove(function(e){
      if(paint){
        addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
        //redraw();
        var i = clickX.length-1;
        stroke(clickX[i-1], clickY[i-1], clickX[i], clickY[i], lineWidth-lineWidth*2*clickSpeed[i-1], lineWidth-lineWidth*2*clickSpeed[i]);
      }
      //drawStatusLayer(e);
    });
    $('#cn_statusCanvas').mouseup(function(e){
      paint = false;
    });
    $('#cn_statusCanvas').mouseleave(function(e){
      paint = false;
    });
    $('#cn_statusCanvas').mouseout(function(e){
      paint = false;
    });
    
    $(window).keypress(function(e){
          console.log(e.keyCode);
      switch (e.keyCode) {
        case 119: // W
          lineWidth++;
          console.log("Width: "+lineWidth);
          drawStatusLayer();
          break;
        case 115: // S
          lineWidth--;
          if(lineWidth<1) lineWidth=1;
          console.log("Width: "+lineWidth);
          drawStatusLayer();
          break;
        case 97: // A
          speedEffect--;
          if(speedEffect<1) speedEffect=1;
          console.log("Effect: "+speedEffect);
          drawStatusLayer();
          break;
        case 100: // D
          speedEffect++;
          console.log("Effect: "+speedEffect);
          drawStatusLayer();
          break;
        case 120: // X
          lineColour          = (lineColour + 1) % lineColours.length;
          context.fillStyle   = lineColours[lineColour];
          context.strokeStyle = lineColours[lineColour];
          
          console.log("Colour "+lineColour+": "+lineColours[lineColour]);
          drawStatusLayer();
          break;
        case 98: // B
          background          = (background + 1) % backgrounds.length;
          console.log("Background "+lineColour+": "+backgrounds[background]);
          drawBackgroundLayer();
          break;
        case 122: // Z
          if(lineErase){
            lineErase = false;
            clearErased();
          }else lineErase = true;
          console.log("Erase: "+lineErase);
          drawStatusLayer();
          break;
        case 118: // V
          if(lineHi){
            lineHi = false;
          }else lineHi = true;
          console.log("Highlight: "+lineHi);
          drawStatusLayer();
          break;
        default:
      }
    });
    
    drawLayers();
    $(window).resize(function(){
      drawLayers();
    })
    
  });

  function addClick(x, y, dragging)
  {
    clickX.push(x);
    clickY.push(y);
    clickDrag.push(dragging);
    
    // add speed recording
    var speedRel = 2;
    var i = clickX.length;
    
    if (dragging && i) {
      var distanceSquared = Math.sqrt(
      Math.pow(clickX[i-1]-clickX[i-2],2)
                          + Math.pow(clickY[i-1]-clickY[i-2],2));
      speedRel = distanceSquared*speedEffect/100;
      //speedRel = ;
    } else {
      speedRel = 1;
    }
    //console.log(speedRel);
    clickSpeed.push(speedRel);
  }
  
  function clearErased(){
    
    return;
    
    var imgWidth  = canvas.width;
    var imgHeight = canvas.height;
    var imageData = context.getImageData(0,0, canvas.width, canvas.height);
    
    console.log();
    for (j=0; j<imageData.height; i++) {
      for (i=0; i<imageData.width; j++) {
        var index=(i*4)*imageData.width+(j*4);
        var red=imageData.data[index];
        var green=imageData.data[index+1];
        var blue=imageData.data[index+2];
        var alpha=imageData.data[index+3];
        var average=(red+green+blue)/3;
        if (index > 1 && index < 10)
          console.log([red,green,blue]);
   	    imageData.data[index]=average;
        imageData.data[index+1]=average;
        imageData.data[index+2]=average;
        imageData.data[index+3]=alpha;
      }
    }
  }
  
  function redraw(){
    canvas.width = window.innerWidth; // Clears the canvas
    canvas.height = window.innerHeight
    
    //context.strokeStyle = lineColours[lineColour];
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
  
  function newline(x,y,r){
    
    //context.fillStyle   = lineColours[lineColour];
    // eraser?
    var colour = context.fillStyle;
    if(lineErase){
      context.fillStyle = lineEraseColour
    }
    
    context.beginPath();
    context.arc(x,y,r/2,0,Math.PI*2,true);
    context.closePath();
    context.fill();
    // restore
    context.fillStyle = colour;
  }
  
  function stroke(x,y,x2,y2,r1,r2){
    
    if (r1<1) r1 = 1;
    if (r2<1) r2 = 1;
    if(lineErase){
      r1 = lineWidth;
      r2 = lineWidth;
    }
    
    if(lineHi){
    
      r1 = lineWidth+10;
      r2 = lineWidth+10;
      
    var status_canvas = document.getElementById('cn_highlightCanvas');
    var status_context = status_canvas.getContext("2d");
    
    var context = status_context;
    
      context.fillStyle   = lineColours[lineColour];
      context.strokeStyle = lineColours[lineColour];
    }else{
      var context = window['context'];
    }
    
    //console.log()
    
    var l = Math.sqrt(Math.pow(x2-x,2)+Math.pow(y2-y,2));
    var r1x = -(y2-y)*r1/l/2;
    var r1y = (x2-x)*r1/l/2;
    var r2x = -(y2-y)*r2/l/2;
    var r2y = (x2-x)*r2/l/2;
    
    
    //var oldFill = context.fillStyle;
    //context.fillStyle   = context.strokeStyle;
    //context.fillStyle   = lineColours[lineColour];
    
    
    // eraser?
    var colour = context.fillStyle;
    if(lineErase){
      context.fillStyle = lineEraseColour
    }
    
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
    
    
    context.fillStyle = colour;
    
    //context.fillStyle = oldFill;
    
    //var rr = Math.sqrt(Math.pow(2*r1x,2)+Math.pow(2*r1y,2));
    //console.log([rr,r1])
  }
  
  function drawLayers(){
  
    drawBackgroundLayer();
    drawStatusLayer();
    drawHi();
    //drawMainLayer();
  }
  
  function drawHi(){
    
    var status_canvas = document.getElementById('cn_highlightCanvas');
    var status_context = status_canvas.getContext("2d");
    
    status_canvas.width = window.innerWidth;
    status_canvas.height = window.innerHeight;
  }
  
  function drawStatusLayer(e){
    
    var status_canvas = document.getElementById('cn_statusCanvas');
    var status_context = status_canvas.getContext("2d");
    
    status_canvas.width = window.innerWidth;
    status_canvas.height = window.innerHeight;
    
    var context = status_context;
    var w = lineWidth-lineWidth*2*0.04;
    if(paint) w = lineWidth-lineWidth*2*clickSpeed[clickX.length-1];
    if (w<0) w=1;
    //console.log([lineWidth,clickX.length,clickSpeed[clickX.length-1],w]);
    
    if(lineErase){
      context.fillStyle   = lineEraseColour;
      context.strokeStyle = "#333";
      context.lineWidth   = 1;
    }else{
      context.fillStyle   = lineColours[lineColour];
      context.strokeStyle = "#ffe";
      context.lineWidth   = 0;
    }
    context.beginPath();
    context.arc(30,status_canvas.height-30,(w/2)+5,0,Math.PI*2,true);
    context.closePath();
    context.fill();
    context.stroke();
    if(!lineHi){
      context.beginPath();
      context.arc(30,status_canvas.height-30,w/2,0,Math.PI*2,true);
      context.closePath();
      context.fillStyle   = lineEraseColour;
      context.fill();
    }else if(lineErase){
      context.beginPath();
      context.arc(30,status_canvas.height-30,w/2,0,Math.PI*2,true);
      context.closePath();
      context.fillStyle   = "#333";
      context.fill();
    }
    
    if(e!==undefined){
      var mouseX = e.pageX - canvas.offsetLeft;
      var mouseY = e.pageY - canvas.offsetTop;
      context.beginPath();
      context.arc(mouseX,mouseY,w/2,0,Math.PI*2,true);
      context.closePath();
      context.fill();
      context.stroke();
    }
  }
  
  function drawBackgroundLayer(){
    
    var bg_canvas = document.getElementById('cn_bgCanvas');
    var bg_context = bg_canvas.getContext("2d");
    
    bg_canvas.width = window.innerWidth;
    bg_canvas.height = window.innerHeight;
    
    window[backgrounds[background]](bg_canvas, bg_context, {lineHeight: 30, margin: 120, doubleLine: 10});
    //drawLines(bg_canvas, bg_context, {lineHeight: 30, margin: 120, doubleLine: 10});
  }
  
  function drawGrid(canvas, context) {
  
    context.beginPath();
    for (var x = 0.5; x < canvas.width; x += 10) {
      context.moveTo(x, 0);
      context.lineTo(x, canvas.height);
    }
    for (var y = 0.5; y < canvas.height; y += 10) {
      context.moveTo(0, y);
      context.lineTo(canvas.width, y);
    }
    context.strokeStyle = "#eee";
    context.stroke();
    
    context.beginPath();
    for (var x = 0.5; x < canvas.width; x += 100) {
      context.moveTo(x, 0);
      context.lineTo(x, canvas.height);
    }
    for (var y = 0.5; y < canvas.height; y += 100) {
      context.moveTo(0, y);
      context.lineTo(canvas.width, y);
    }
    context.strokeStyle = "#ccc";
    context.stroke();
  }
  
  function drawLines(canvas, context, props) {
  
    context.beginPath();
    context.moveTo(props.margin, 0);
    context.lineTo(props.margin, canvas.height);
    //context.moveTo(props.margin+(canvas.width/2), 0);
    //context.lineTo(props.margin+(canvas.width/2), canvas.height);
    context.width = 2;
    context.strokeStyle = "#fcc";
    context.stroke();
    
    //context.beginPath();
    //context.moveTo(canvas.width/2, 0);
    //context.lineTo(canvas.width/2, canvas.height);
    //context.width = 4;
    //context.strokeStyle = "#ccc";
    //context.stroke();
    
    context.beginPath();
    for (var y = 0.5; y < canvas.height; y += props.lineHeight+props.doubleLine) {
      context.moveTo(0, y);
      context.lineTo(canvas.width, y);
    }
    for (var y = 0.5+props.doubleLine; y < canvas.height; y += props.lineHeight+props.doubleLine) {
      context.moveTo(0, y);
      context.lineTo(canvas.width, y);
    }
    context.width = 1;
    context.strokeStyle = "#ccf";
    context.stroke();
  }
//})(jQuery);
