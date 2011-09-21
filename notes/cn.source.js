/**
  Canvas Notes
 **/

var CanvasNotes = {

  viewMode: 'document',
  
  // Canvas contexts
  ctxBg:  null,
  ctxHl:  null,
  ctxSk:  null,
  ctxSt:  null,
  // painting
  lastClick: {x:-1,y:-1,v:0,nl:false},
  painting:   false,
  // options
  lineColour:   0,
  lineWidth:    5,
  speedEffect:  4,
  lineColours: [
    "#000",
    "#c00",
    "#0c0",
    "#00c",
    "#900", //#df4b26
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
  ],
  lineErase:  false,
  lineEraseColour:  "#ffe",
  lineHi: false,
  backgroundMode: 0,
  backgroundProperties: {lineHeight: 30, margin: 120, doubleLine: 10},
  
  sourceView: function(){
  },
  
  keyPress: function(e){
    console.log([e.keyCode, CanvasNotes.viewMode]);
    if (e.ctrlKey && CanvasNotes.viewMode=='document') {
      switch(e.keyCode){
        case 76: // L
        case 39: // Right
          console.log('Display Source');
          CanvasNotes.setView('source');
          break;
        case 75: // K
        case 40: // Down
          console.log('Split View');
          CanvasNotes.setView('split');
          break;
        case 74: // J
        case 37: // Left
          console.log('Preview');
          CanvasNotes.setView('preview');
          break;
        case 82: // R
          console.log('Reload Preview');
          CanvasNotes.updatePreview();
          break;
        case 83: // S
          console.log('Save Document');
          break;
        case 83: // O
          console.log('Open Document');
          break;
        // Dot-Markup Features
        case 73: // I
          console.log('Insert Image');
          CanvasNotes.insertImage();
          break;
        //case B: <strong>
        //case I: <em>
        //case H: hyperlink
        //case ?: Image
        //case ?: Sketch
        //case ?: ...
      }
      // default to disable all Ctrl+<key>, except A,C,V,X,Z
      if(e.keyCode==65 || e.keyCode==67 || e.keyCode==86 || e.keyCode==88 || e.keyCode==90){
        return false;
      }
      return true;
    }else if(CanvasNotes.viewMode=='canvas'){
      switch(e.keyCode){
        case 87: // W
          CanvasNotes.lineWidth++;
          console.log("Width: "+CanvasNotes.lineWidth);
          CanvasNotes.canvasDrawStatus();
          break;
        case 83: // S
          CanvasNotes.lineWidth--;
          if(CanvasNotes.lineWidth<1) CanvasNotes.lineWidth=1;
          console.log("Width: "+CanvasNotes.lineWidth);
          CanvasNotes.canvasDrawStatus();
          break;
        case 65: // A
          CanvasNotes.speedEffect--;
          if(CanvasNotes.speedEffect<1) CanvasNotes.speedEffect=1;
          console.log("Effect: "+CanvasNotes.speedEffect);
          CanvasNotes.canvasDrawStatus();
          break;
        case 68: // D
          CanvasNotes.speedEffect++;
          console.log("Effect: "+CanvasNotes.speedEffect);
          CanvasNotes.canvasDrawStatus();
          break;
        case 67: // C
          CanvasNotes.lineColour  = (CanvasNotes.lineColour + 1)
                                    % CanvasNotes.lineColours.length;
          console.log("Colour "+CanvasNotes.lineColour+": "
                      +CanvasNotes.lineColours[CanvasNotes.lineColour]);
          CanvasNotes.canvasDrawStatus();
          break;
        case 88: // X
          CanvasNotes.lineColour--;
          if(CanvasNotes.lineColour<0)
            CanvasNotes.lineColour+=CanvasNotes.lineColours.length;
          console.log("Colour "+CanvasNotes.lineColour+": "
                      +CanvasNotes.lineColours[CanvasNotes.lineColour]);
          CanvasNotes.canvasDrawStatus();
          break;
        case 66: // B
          CanvasNotes.backgroundMode  = (CanvasNotes.backgroundMode + 1)
                                      % CanvasNotes.backgrounds.length;
          console.log("Background: "+CanvasNotes.backgroundMode);
          CanvasNotes.canvasDrawBackground();
          break;
        case 90: // Z
          if(CanvasNotes.lineErase)
            CanvasNotes.lineErase = false;
          else
            CanvasNotes.lineErase = true;
          console.log("Erase: "+CanvasNotes.lineErase);
          CanvasNotes.canvasDrawStatus();
          break;
        case 86: // V
          if(CanvasNotes.lineHi)
            CanvasNotes.lineHi = false;
          else
            CanvasNotes.lineHi = true;
          console.log("Highlight: "+CanvasNotes.lineHi);
          CanvasNotes.canvasDrawStatus();
          break;
        case 81: // Q
          CanvasNotes.canvasClear();
          console.log("Clear Drawing");
          //drawStatusLayer();
          break;
        case 13: // <RETURN>
          //CanvasNotes.canvasClear();
          console.log("Save Drawing");
          CanvasNotes.canvasDone();
          return true;
          break;
        case 75: // K
          console.log("Auto-crop");
          CanvasNotes.canvasAutoCrop();
          CanvasNotes.canvasDone();
          return true;
          break;
      }
    }
    return false;
  },
  
  setView: function(mode){
    
    switch(mode){
      case 'source':
        $('#cn_source').animate({width: '100%'});
        $('#cn_preview').animate({width: '0%'});
        break;
      case 'split':
        $('#cn_source').animate({width: '50%'});
        $('#cn_preview').animate({width: '50%'});
        break;
      case 'preview':
        $('#cn_source').animate({width: '0%'});
        $('#cn_preview').animate({width: '100%'});
        break;
    }
    CanvasNotes.editor.refresh();
  },
  
  updatePreview: function(){
  
    var $preview = $('#cn_preview');
    // check visible, start timeout
    if($preview.width() > 10){
      //CanvasNotes.editor.replaceSelection("<span>findme</span>");
      $preview.html(CanvasNotes.editor.getValue());
    }
  },
  
  setCanvas: function(visible){
  
    if(visible){
      $('#cn_source').hide();
      $('#cn_preview').hide();
      $('#cn_canvas').show();
      CanvasNotes.viewMode = 'canvas';
      //load background
      //prepare canvas
      CanvasNotes.canvasClear();
      
    }else{
      $('#cn_source').show();
      $('#cn_preview').show();
      $('#cn_canvas').hide();
      CanvasNotes.viewMode = 'document';
      //clear canvas + events
    }
  },
  
  canvasMouse: function(e){
    
    //console.log(e);
    if(CanvasNotes.viewMode=='canvas'){
      e.preventDefault(); // stops glitchy selecting of text on page
      if(e.type=='mouseup' || e.type=='mouseleave' || e.type=='mouseout'){
        CanvasNotes.painting = false;
        if(CanvasNotes.lastClick.nl){
          CanvasNotes.canvasSketchBlob();
        }
      }else if(e.type=='mousedown'){
      
        CanvasNotes.painting = true;
        var elC = document.getElementById("cn_canvas");
        var x = e.pageX - elC.offsetLeft;
        var y = e.pageY - elC.offsetTop;
        CanvasNotes.lastClick = {x:x,y:y,v:100,nl:true};
      }else if(e.type=='mousemove' && CanvasNotes.painting){
        
        var elC = document.getElementById("cn_canvas");
        var x = e.pageX - elC.offsetLeft;
        var y = e.pageY - elC.offsetTop;
        var v = Math.sqrt(Math.pow(x-CanvasNotes.lastClick.x,2)
                          + Math.pow(y-CanvasNotes.lastClick.y,2));
        if(v>100) v=100;
        CanvasNotes.canvasSketchLine(x,y,v);
        CanvasNotes.lastClick = {x:x,y:y,v:v,nl:false};
      }
    }
  },
  
  canvasSketchLine: function(x2,y2,v2){
    
    var l = v2;
    var x1  = CanvasNotes.lastClick.x;
    var y1  = CanvasNotes.lastClick.y;
    var v1  = CanvasNotes.lastClick.v;
    var rdx = -(y2-y1)/l;
    var rdy =  (x2-x1)/l;
    var ctx = null;
    var r1  = CanvasNotes.lineWidth;
    var r2  = CanvasNotes.lineWidth;
    
    if(CanvasNotes.lineHi){
      // do highlighting
      ctx = CanvasNotes.ctxHl;
      r1  = r1+10;
      r2  = r2+10;
    }else{
      // do normal
      ctx = CanvasNotes.ctxSk;
      if(!CanvasNotes.lineErase){
        r1  = Math.max(r1 - r1 * v1/100 * CanvasNotes.speedEffect, 0.5);
        r2  = Math.max(r2 - r2 * v2/100 * CanvasNotes.speedEffect, 0.5);
      }
    }
    
    var cop = ctx.globalCompositeOperation;
    
    if(CanvasNotes.lineErase){
      ctx.globalCompositeOperation = "copy";
      ctx.fillStyle = "rgba(0,0,0,0)";
    }else{
      ctx.fillStyle   = CanvasNotes.lineColours[CanvasNotes.lineColour];
    }
    
    if(CanvasNotes.lastClick.nl) CanvasNotes.canvasSketchBlob();
    
    ctx.beginPath();
    ctx.moveTo(x1+r1*rdx, y1+r1*rdy);
    ctx.lineTo(x1-r1*rdx, y1-r1*rdy);
    ctx.lineTo(x2-r2*rdx, y2-r2*rdy);
    ctx.lineTo(x2+r2*rdx, y2+r2*rdy);
    ctx.closePath();
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(x2,y2,r2,0,Math.PI*2,true);
    ctx.closePath();
    ctx.fill();
    
    ctx.globalCompositeOperation = cop;
  },
  
  canvasSketchBlob: function(){
    
    var x = CanvasNotes.lastClick.x;
    var y = CanvasNotes.lastClick.y;
    var v = CanvasNotes.lastClick.v;
    var ctx = null;
    var r = CanvasNotes.lineWidth;
    
    if(CanvasNotes.lineHi){
      // do highlighting
      ctx = CanvasNotes.ctxHl;
      r   = r+10;
    }else{
      // do normal
      ctx = CanvasNotes.ctxSk;
    }
    
    var cop = ctx.globalCompositeOperation;
    
    if(CanvasNotes.lineErase){
      ctx.globalCompositeOperation = "copy";
      ctx.fillStyle = "rgba(0,0,0,0)";
    }else{
      ctx.fillStyle   = CanvasNotes.lineColours[CanvasNotes.lineColour];
    }
      
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2,true);
    ctx.closePath();
    ctx.fill();
    
    ctx.globalCompositeOperation = cop;
  },
  
  canvasDrawStatus: function(){
  
    var context = CanvasNotes.ctxSt;
    context.canvas.width = window.innerWidth;
    context.canvas.height = window.innerHeight;
    
    var w = CanvasNotes.lineWidth;
    
    // basic circle
    if(CanvasNotes.lineErase){
      context.fillStyle   = "#ffe";
    }else{
      context.fillStyle   = CanvasNotes.lineColours[CanvasNotes.lineColour];
    }
    context.beginPath();
    context.arc(30,context.canvas.height-30,w+10,0,Math.PI*2,true);
    context.closePath();
    context.fill();
    
    // hollow centre for non-highlight
    if(!CanvasNotes.lineHi){
      context.beginPath();
      context.arc(30,context.canvas.height-30,w,0,Math.PI*2,true);
      context.closePath();
      
      var cop = context.globalCompositeOperation;
      context.globalCompositeOperation = "copy";
      context.fillStyle = "rgba(0,0,0,0)";
      context.fill();
      context.globalCompositeOperation = cop;
      
      // inner outline for eraser
      if(CanvasNotes.lineErase){
        context.beginPath();
        context.strokeStyle = "#333";
        context.lineWidth   = 1;
        context.arc(30,context.canvas.height-30,w,0,Math.PI*2,true);
        context.closePath();
        context.stroke();
        context.fillStyle   = "#ffe";
      }
    }
    // outline eraser
    if(CanvasNotes.lineErase){
      context.beginPath();
      context.strokeStyle = "#333";
      context.lineWidth   = 1;
      context.arc(30,context.canvas.height-30,w+10,0,Math.PI*2,true);
      context.closePath();
      context.stroke();
    }
    
  },
  
  canvasDrawBackground: function(){
  
    CanvasNotes.backgrounds[CanvasNotes.backgroundMode]();
  },
  
  backgrounds: [
    function(){
    
      var context = CanvasNotes.ctxBg;
      context.canvas.width = window.innerWidth;
      context.canvas.height = window.innerHeight;
    },
    function(){
    
      var context = CanvasNotes.ctxBg;
      context.canvas.width = window.innerWidth;
      context.canvas.height = window.innerHeight;
      
      var props = CanvasNotes.backgroundProperties;
      
      context.beginPath();
      context.moveTo(props.margin, 0);
      context.lineTo(props.margin, context.canvas.height);
      context.closePath();
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
      for (var y = 0.5; y < context.canvas.height; y += props.lineHeight+props.doubleLine) {
        context.moveTo(0, y);
        context.lineTo(context.canvas.width, y);
      }
      for (var y = 0.5+props.doubleLine; y < context.canvas.height; y += props.lineHeight+props.doubleLine) {
        context.moveTo(0, y);
        context.lineTo(context.canvas.width, y);
      }
      context.closePath();
      context.width = 1;
      context.strokeStyle = "#ccf";
      context.stroke();
    },
    function(){
    
      var context = CanvasNotes.ctxBg;
      context.canvas.width = window.innerWidth;
      context.canvas.height = window.innerHeight;
      
      context.beginPath();
      for (var x = 0.5; x < context.canvas.width; x += 10) {
        context.moveTo(x, 0);
        context.lineTo(x, context.canvas.height);
      }
      for (var y = 0.5; y < context.canvas.height; y += 10) {
        context.moveTo(0, y);
        context.lineTo(context.canvas.width, y);
      }
      context.closePath();
      context.strokeStyle = "#eee";
      context.stroke();
      
      context.beginPath();
      for (var x = 0.5; x < context.canvas.width; x += 100) {
        context.moveTo(x, 0);
        context.lineTo(x, context.canvas.height);
      }
      for (var y = 0.5; y < context.canvas.height; y += 100) {
        context.moveTo(0, y);
        context.lineTo(context.canvas.width, y);
      }
      context.closePath();
      context.strokeStyle = "#ccc";
      context.stroke();
    }
  ],
  
  canvasClear: function(){
  
    CanvasNotes.ctxHl.canvas.width  = window.innerWidth;
    CanvasNotes.ctxHl.canvas.height = window.innerHeight;
    CanvasNotes.ctxSk.canvas.width  = window.innerWidth;
    CanvasNotes.ctxSk.canvas.height = window.innerHeight;
    
    CanvasNotes.canvasDrawStatus();
    CanvasNotes.canvasDrawBackground();
    
    $('.cn_autocrop').remove();
  },
  
  canvasAutoCrop: function(){
    
    function isEmpty(context, x, y, w, h) { /* from yendis.org */
        //console.log([context, x, y, w, h]);
        var imgd = context.getImageData(x, y, w, h);
        var pix = imgd.data;
        // Loop through every pixel
        for (var i = 0, n = pix.length; i < n; i += 4) {
            // pix[i+3] contains the alpha
            if (pix[i+3] != 0)
            {
                // Pixel isn't transparent
                return false;
            }
        }
        return true;
    }
    
    function getBoundary(context){
    
      // Set initial values
      var trim_left = -1;
      var trim_right = -1;
      var trim_top = -1;
      var trim_bottom = -1;
      
      // Check top
      for (var row = 0; row < height && trim_top == -1; row++)
      {
        if (!isEmpty(context, 0, row, width, 1))
        {
          trim_top = row;
          break;
        }
      }
      
      // empty image
      if (trim_top==-1)
        return null;

      // Check bottom
      for (var row = height - 1; row > 0 && trim_bottom == -1; row--)
      {
        if (!isEmpty(context, 0, row, width, 1))
        {
          trim_bottom = row;
          break;
        }
      }
      
      // Check left
      for (var column = 0; column < width && trim_left == -1; column++)
      {
        if (!isEmpty(context, column, trim_top, 1, trim_bottom-trim_top))
        {
          trim_left = column;
          break;
        }
      }
      
      // Check right
      for (var column = width - 1; column > 0 && trim_right == -1; column--)
      {
        if (!isEmpty(context, column, trim_top, 1, trim_bottom-trim_top))
        {
          trim_right = column;
          break;
        }
      }
      
      return [trim_left,trim_top,trim_right,trim_bottom];
    }
    
    var width   = CanvasNotes.ctxHl.canvas.width;
    var height  = CanvasNotes.ctxHl.canvas.height;
    
    var trim_sk = getBoundary(CanvasNotes.ctxSk);
    var trim_hl = getBoundary(CanvasNotes.ctxHl);
    var trim    = [];
    
    if (trim_sk==null && trim_hl==null){
      console.log("Empty Image");
    }else if (trim_sk==null){
      trim = trim_hl
    }else if (trim_hl==null){
      trim = trim_sk
    }else{
      trim[0] = Math.min(trim_sk[0],trim_hl[0]);
      trim[1] = Math.min(trim_sk[1],trim_hl[1]);
      trim[2] = Math.max(trim_sk[2],trim_hl[2]);
      trim[3] = Math.max(trim_sk[3],trim_hl[3]);
    }
    // add some padding
    trim[0] = Math.max(trim[0]-10,0);
    trim[1] = Math.max(trim[1]-10,0);
    trim[2] = Math.min(trim[2]+10,width);
    trim[3] = Math.min(trim[3]+10,height);
    console.log(trim);
    var w = trim[2]-trim[0]+1;
    var h = trim[3]-trim[1]+1;
    
    $('.cn_autocrop').remove();
    $auto = $("<canvas width='" + w + "' height='" + h + "' class='cn_autocrop' />");
    $('#cn_canvas').append($auto);
    var ctx = $auto.width(w).height(h)[0].getContext('2d');
    
    ctx.canvas.width  = w;
    ctx.canvas.height = h;
    
    ctx.drawImage(CanvasNotes.ctxBg.canvas, trim[0], trim[1], w, h, 0, 0, w, h);
    ctx.globalAlpha = 0.5;
    ctx.drawImage(CanvasNotes.ctxHl.canvas, trim[0], trim[1], w, h, 0, 0, w, h);
    ctx.globalAlpha = 1;
    ctx.drawImage(CanvasNotes.ctxSk.canvas, trim[0], trim[1], w, h, 0, 0, w, h);
    
    return $auto;
  },
  
  insertImage: function(){
  
    CanvasNotes.CodeMirrorCursor = CanvasNotes.editor.getCursor();
    CanvasNotes.setCanvas(true);
    
  },
  
  canvasDone: function(){

    var canvas  = CanvasNotes.canvasAutoCrop();
    var img     = canvas[0].toDataURL();
    
    //console.log("<img src='"+img+"' alt='sketch' />");
    
    CanvasNotes.setCanvas(false);
    
    CanvasNotes.editor.setCursor(CanvasNotes.CodeMirrorCursor);
    console.log(CanvasNotes.editor.getCursor());
    CanvasNotes.editor.focus();
    CanvasNotes.editor.replaceSelection("<img src='"+img+"' alt='sketch' class='cn_sketch' />");
    //CanvasNotes.editor.replaceSelection("Hello");
  },
  
  editImage: function(){
  
    CanvasNotes.setCanvas(true);
    // more stuff to load last image into foreground
  }
};

// onload
$(function(){
  // hook events
  $(document).keydown(function(e){
    if(CanvasNotes.keyPress(e)) e.preventDefault();
  });
  $(document).mousedown(function(e){
    if(CanvasNotes.viewMode=='canvas'){
      CanvasNotes.canvasMouse(e);
    }
  });
  $(document).mousemove(function(e){
    if(CanvasNotes.viewMode=='canvas'){
      CanvasNotes.canvasMouse(e);
    }
  });
  $(document).mouseup(function(e){
    if(CanvasNotes.viewMode=='canvas'){
      CanvasNotes.canvasMouse(e);
    }
  });
  $(document).mouseleave(function(e){
    if(CanvasNotes.viewMode=='canvas'){
      CanvasNotes.canvasMouse(e);
    }
  });
  $(document).mouseout(function(e){
    if(CanvasNotes.viewMode=='canvas'){
      CanvasNotes.canvasMouse(e);
    }
  });
  
  // prepare source view
  var CodeMirrorProperties = {
    enterMode: 'keep',
    electricChars: false,
    lineNumbers: true,
    fixedGutter: true,
    onChange: function(i){
      CanvasNotes.updatePreview();
    },
    onKeyEvent: function(i, e) {
      if (e.type == 'keydown') {
        if(CanvasNotes.keyPress(e, 'source')) e.stop();
      }
    }
  }
  CanvasNotes.editor = CodeMirror.fromTextArea(document.getElementById("cn_source_ta"), CodeMirrorProperties);
  $('.CodeMirror-scroll').width('100%').height('100%');
  CanvasNotes.editor.refresh();
  
  // prepare canvas
  CanvasNotes.ctxBg = document.getElementById('cn_bgCanvas').getContext("2d");
  CanvasNotes.ctxHl = document.getElementById('cn_hlCanvas').getContext("2d");
  CanvasNotes.ctxSk = document.getElementById('cn_skCanvas').getContext("2d");
  CanvasNotes.ctxSt = document.getElementById('cn_stCanvas').getContext("2d");
});
