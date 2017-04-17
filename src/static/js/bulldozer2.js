//Global Constants
var TO_RADIANS = Math.PI / 180;
var shiX=32/2;
var shiY=32/2;
var initialDelay=250;
var holdDelay = 70;
var levelPassword = {4:"BONK", 8:"NERD", 12:"BURP", 16:"SPUD", 20:"GROK", 24:"SPOT", 28:"KALE", 32:"PODS", 36:"TAPS", 40:"KRIL", 44:"GNIP", 48:"GORN", 52:"LOUT", 56:""};

var Key = {
      _pressed: {},

      LEFT: 37,
      UP: 38,
      RIGHT: 39,
      DOWN: 40,

      isDown: function(keyCode) {
        return this._pressed[keyCode];
      },

      onKeydown: function(event) {
        this._pressed[event.keyCode] = true;
        if(event.keyCode==37 || event.keyCode==38 || event.keyCode==39 || event.keyCode==40){
          event.preventDefault();
        }
      },

      onKeyup: function(event) {
        delete this._pressed[event.keyCode];
      }
    };
        
    window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
    window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);









//-------------------------------------------------------------------------------------------------
//==========================================Game Class=============================================
    
var Game = {
      fps: 60,
      width: 640,
      height: 384
    };


    Game._onEachFrame = (function() {
      var requestAnimationFrame = window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;

      if (requestAnimationFrame) {
       return function(cb) {
          var _cb = function() { cb(); requestAnimationFrame(_cb); }
          _cb();
        };
      } else {
        return function(cb) {
          setInterval(cb, 1000 / Game.fps);
        }
      }
    })();

    Game.init = function(){
      Map.LoadImages();
      Game.start();
    }
    
    Game.start = function() {
      Game.canvas = document.getElementById("game-canvas");
      Game.canvas.width = Game.width;
      Game.canvas.height = Game.height;
      Game.startTime= new Date();

      Game.context = Game.canvas.getContext("2d");
      Game.isRunning=true;
           
      Map.GetPassLevel();
      Map.LoadLevel(Map.level);
      postStart('Level '+Map.level.toString());
      Game.bulldozer = new Bulldozer();
      $("p#curr-level").text("Level " + Map.level.toString());
      $("textarea#password-box").val("password");

      Game._onEachFrame(Game.run);
    };

    Game.pause = function(){

    };
    
    Game.run = (function() {
      var loops = 0, skipTicks = 1000 / Game.fps,
          maxFrameSkip = 10,
          nextGameTick = (new Date).getTime(),
          lastGameTick;

      return function() {
        loops = 0;

        while ((new Date).getTime() > nextGameTick) {
          if (Game.isRunning){
          Game.update();
          }
          nextGameTick += skipTicks;
          loops++;
        }

        if (loops) Game.draw();
      }
    })();
    
    Game.draw = function() {
      Map.Draw(Game.context);
      Game.bulldozer.draw(Game.context);

    };
    
    Game.update = function() {
        Game.bulldozer.Update();
        Game.CheckLevelComplete();
    };

    Game.CheckLevelComplete = function(){
      //If all boulders are intersecting with the targets then call bring up win box and change level
      var levelComplete=false;
      levelComplete=IntersectAll(Map.boulder_rect_list,Map.target_rect_list);
      if(levelComplete){
        Game.NewLevel();
      }
      if(Map.level>Map.lastLevel){
        Game.Win();
      }
    };

    Game.NewLevel=function(){
      NotificationAppear();
      Game.isRunning=false;
      Game.endTime=new Date();
      time=FormatTimer(Game.startTime,Game.endTime);
      postScore("Level " + Map.level.toString(), Game.bulldozer.boulderMoves.toString(), time);
      //postScore("Level 1", "16","1000s");
      //Update scores for this level
    };

    Game.Continue=function(){
      NotificationDisappear();
      Game.isRunning=true;
      Map.level+=1;
      Game.Reset();
    };

    Game.Win = function(){

    };

    Game.Reset = function(){
      Game.start();
    };

//========================================End Game Class=============================================
    








    //-------------------------------------------------------------------------------------------------
    //==========================================Map Class=============================================
    var Map = {
        tileSize: 32,
        level: 1,
        startLevel: 1,
        lastLevel: 61,

        LoadImages: function(){
          Map["background"]= new Image;
          Map.bricks = new Image();
          Map.block = new Image();
          Map.target = new Image();
          Map.boulder = new Image();
          Map.cdiamond = new Image();
          Map.odiamond = new Image();
          Map.circle = new Image();
          Map.spiral = new Image();
          Map.plus = new Image();
          Map.square = new Image();

          Map.background.src = "images/Sprites/Background.png";
          Map.bricks.src = "images/Sprites/Bricks.png";
          Map.block.src = "images/Sprites/Block.png";
          Map.target.src = "images/Sprites/2Target.png";
          Map.boulder.src = "images/Sprites/Boulder.png";
          Map.cdiamond.src = "images/Sprites/CDiamond.png";
          Map.odiamond.src = "images/Sprites/ODiamond.png";
          Map.circle.src = "images/Sprites/Circle.png";
          Map.spiral.src = "images/Sprites/Spiral.png";
          Map.plus.src = "images/Sprites/Plus.png";
          Map.square.src = "images/Sprites/Square.png";
        },

        GetPassLevel: function(){
          var password = document.getElementById("password-box").value;
          var level=Map.level;
          if(password.toUpperCase() == "BONK"){
            level=4;
          }
          else if(password.toUpperCase() == "NERD"){
            level=8;
          }
          else if(password.toUpperCase() == "BURP"){
            level=12;
          }
          else if(password.toUpperCase() == "SPUD"){
            level=16;
          }
          else if(password.toUpperCase() == "GROK"){
            level=20;
          }
          else if(password.toUpperCase() == "SPOT"){
            level=24;
          }
          else if(password.toUpperCase() == "KALE"){
            level=28;
          }
          else if(password.toUpperCase() == "PODS"){
            level=32;
          }
          else if(password.toUpperCase() == "TAPS"){
            level=36;
          }
          else if(password.toUpperCase() == "KRIL"){
            level=40;
          }
          else if(password.toUpperCase() == "GNIP"){
            level=44;
          }
          else if(password.toUpperCase() == "GORN"){
            level=48;
          }
          else if(password.toUpperCase() == "LOUT"){
            level=52;
          }
          else if(password.toUpperCase() == ""){
            level=56;
          }
          else if(password.toUpperCase() == "FLU"){
            level=15;
          }
          else if(password.toUpperCase() == "ME"){
            level=43;
          }
          else if(password.toUpperCase() == "DANG"){
            level=10;
          }
          else if(password.indexOf("f")==0 && password.indexOf("u")==3){
            level=parseInt(password.substring(1,3));
          }
          Map.level=level;
          },

        LoadLevel: function(level){
          var results=GetLevel(level);
          /*assigns the level data to each array*/
          /*creates rectangles*/

          /*posx=results[0]+tileSize/2;
          posy=results[1]+tileSize/2;*/
          

          var tempboulder_posx=results[2];
          var tempboulder_posy=results[3];

          Map.boulder_rect_list=[];

          for (i = 0; i < tempboulder_posy.length; i++) { 
              Map.boulder_rect_list[i]=new Rectangle(tempboulder_posx[i]+shiX,tempboulder_posy[i]+shiY,Map.tileSize,Map.tileSize);
          }
          

          Map.bricks_rect_list=RFP(results[4],shiX,shiY);
          Map.block_rect_list=RFP(results[5],shiX,shiY);
          Map.target_rect_list=RFP(results[6],shiX,shiY);
          Map.cdiamond_rect_list=RFP(results[7],shiX,shiY);
          Map.odiamond_rect_list=RFP(results[8],shiX,shiY);
          Map.circle_rect_list=RFP(results[9],shiX,shiY);
          Map.spiral_rect_list=RFP(results[10],shiX,shiY);
          Map.plus_rect_list=RFP(results[11],shiX,shiY);
          Map.square_rect_list=RFP(results[12],shiX,shiY);
          
          /* IN THEORY THIS ARRAY COULD BE SMALLER IF WE CHECKED ONLY FOR BLOCKS THAT ARE NEXT TO BLANK SPACE.
            JUST A THOUGHT FOR THE FUTURE IF NECESSARY*/

          Map.collision_rect_list=Map.bricks_rect_list.concat(Map.block_rect_list,Map.cdiamond_rect_list,
            Map.odiamond_rect_list,Map.circle_rect_list,Map.spiral_rect_list,Map.square_rect_list,Map.plus_rect_list);
        },

        Draw: function(context){
          context.drawImage(Map.background,0,0);
          DrawRectArray(context,Map.bricks,Map.bricks_rect_list);
          DrawRectArray(context,Map.block,Map.block_rect_list);
          DrawRectArray(context,Map.target,Map.target_rect_list);
          DrawRectArray(context,Map.cdiamond,Map.cdiamond_rect_list);
          DrawRectArray(context,Map.odiamond,Map.odiamond_rect_list);
          DrawRectArray(context,Map.circle,Map.circle_rect_list);
          DrawRectArray(context,Map.spiral,Map.spiral_rect_list);
          DrawRectArray(context,Map.plus,Map.plus_rect_list);
          DrawRectArray(context,Map.square,Map.square_rect_list);
          DrawRectArray(context,Map.boulder,Map.boulder_rect_list);
        },
        MoveBoulder: function(index,direction){
          var tempList=Map.boulder_rect_list.slice(0);
          tempList.splice(index,1);
          var canMoveBoulder=true;
          var futureRect = new Rectangle();
                   
          
          shiftX=0;
          shiftY=0;
          if(direction=="UP"){
            shiftY=-Map.tileSize;
          }
          else if(direction=="DOWN"){
            shiftY=Map.tileSize;
          }
          else if(direction=="LEFT"){
            shiftX=-Map.tileSize;
          }
          else if(direction=="RIGHT"){
            shiftX=Map.tileSize;
          } 

          var futureRect= new Rectangle(Map.boulder_rect_list[index].positionX+shiftX,Map.boulder_rect_list[index].positionY+shiftY,Map.tileSize,Map.tileSize);

          //Check for other boulders
          for(i=0;i<tempList.length;i++){
            if(Intersect(futureRect,tempList[i])){
              canMoveBoulder=false;
            }
          }

          //Check for walls
          for(i=0;i<Map.collision_rect_list.length;i++){
            if(Intersect(futureRect,Map.collision_rect_list[i])){
              canMoveBoulder=false;
            }
          }


          if(canMoveBoulder){
            Map.boulder_rect_list[index]=new Rectangle(Map.boulder_rect_list[index].positionX+shiftX,Map.boulder_rect_list[index].positionY+shiftY,Map.tileSize,Map.tileSize);
            Game.bulldozer.boulderMoves+=1;
          }
          else{
            if(direction=="UP"){
              Game.bulldozer.canMoveUp=false;
            }
            else if(direction=="DOWN"){
              Game.bulldozer.canMoveDown=false;
            }
            else if(direction=="LEFT"){
              Game.bulldozer.canMoveLeft=false;
            }
            else if(direction=="RIGHT"){
              Game.bulldozer.canMoveRight=false;
            } 
          }
        }
          





    }
    
    //==========================================End Map Class=========================================








    //-------------------------------------------------------------------------------------------------
    //==========================================Bulldozer class========================================
    function Bulldozer() {
      //[Up, Left, Down, Right]
      this.KeepTrackOfButtonsTime=[0,0,0,0];
      this.ButtonPressed=[false,false,false,false];
      this.ButtonHold=[false,false,false,false];

      this.boulderMoves=0;

      var results=GetLevel(Map.level);
      this.x = results[0] +shiX;
      this.y = results[1] +shiY;
      this.width=Map.tileSize;
      this.height=Map.tileSize;
      this.rotation=0;

      this.canMoveLeft=true;
      this.canMoveRight=true;
      this.canMoveUp=true;
      this.canMoveDown=true;
      
      this.boulderLeft=-1;
      this.boulderRight=-1;
      this.boulderDown=-1;
      this.boulderUp=-1;

      this.dozer = new Image();
      this.dozer.src = "images/Sprites/Bulldozer.png";
    }

    Bulldozer.prototype.draw = function(context) {
      DrawRotatedImage(context,this.dozer, this.x, this.y, this.width, this.height, this.rotation);
    };

    Bulldozer.prototype.moveLeft = function() {
      this.x -= Map.tileSize;
    };

    Bulldozer.prototype.moveRight = function() {
      this.x += Map.tileSize;
    };

    Bulldozer.prototype.moveUp = function() {
      this.y -= Map.tileSize;
    };

    Bulldozer.prototype.moveDown = function() {
      this.y += Map.tileSize;
    };

    Bulldozer.prototype.CheckFutureWalls = function(){
      //Check all sides of dozer
      this.canMoveRight=true;
      this.canMoveLeft=true;
      this.canMoveDown=true;
      this.canMoveUp=true;


      rightRect=new Rectangle(this.x+Map.tileSize,this.y,Map.tileSize,Map.tileSize);
      leftRect=new Rectangle(this.x-Map.tileSize,this.y,Map.tileSize,Map.tileSize);
      upRect=new Rectangle(this.x,this.y - Map.tileSize,Map.tileSize,Map.tileSize);
      downRect=new Rectangle(this.x,this.y + Map.tileSize,Map.tileSize,Map.tileSize);
      for(i=0;i<Map.collision_rect_list.length;i++){
        if(Intersect(rightRect,Map.collision_rect_list[i])){
          this.canMoveRight=false;
        }
        if(Intersect(leftRect,Map.collision_rect_list[i])){
          this.canMoveLeft=false;
        }
        if(Intersect(upRect,Map.collision_rect_list[i])){
          this.canMoveUp=false;
        }
        if(Intersect(downRect,Map.collision_rect_list[i])){
          this.canMoveDown=false;
        }
      }

    };

    Bulldozer.prototype.FindBoulders = function(){
      this.boulderLeft=-1;
      this.boulderRight=-1;
      this.boulderDown=-1;
      this.boulderUp=-1;

      rightRect=new Rectangle(this.x+Map.tileSize,this.y,Map.tileSize,Map.tileSize);
      leftRect=new Rectangle(this.x-Map.tileSize,this.y,Map.tileSize,Map.tileSize);
      upRect=new Rectangle(this.x,this.y - Map.tileSize,Map.tileSize,Map.tileSize);
      downRect=new Rectangle(this.x,this.y + Map.tileSize,Map.tileSize,Map.tileSize);
      for(i=0;i<Map.boulder_rect_list.length;i++){
        if(Intersect(rightRect,Map.boulder_rect_list[i])){
          this.boulderRight=i;
        }
        if(Intersect(leftRect,Map.boulder_rect_list[i])){
          this.boulderLeft=i;
        }
        if(Intersect(upRect,Map.boulder_rect_list[i])){
          this.boulderUp=i;
        }
        if(Intersect(downRect,Map.boulder_rect_list[i])){
          this.boulderDown=i;
        }
      }
      //console.log("BoulderRight: "+ this.boulderRight.toString() +", BoulderLeft: " + this.boulderLeft.toString())


    }
    Bulldozer.prototype.Update = function() {
      this.now=(new Date).getTime()

      this.CheckFutureWalls();
      this.FindBoulders();

      //Button down
      if ((Key.isDown(Key.UP) && !this.ButtonPressed[0])  ) {
        if(this.boulderUp>-1){
          Map.MoveBoulder(this.boulderUp,"UP");
        }
        if(this.canMoveUp){
          //One key press movement
          //console.log(this.now.toString());
          //console.log(this.KeepTrackOfButtonsTime[0].toString());
          this.moveUp();
          this.KeepTrackOfButtonsTime[0]=this.now;
          this.ButtonPressed[0]=true;
        }
        

        
        this.rotation=180;
      }
      else if ((Key.isDown(Key.LEFT) && !this.ButtonPressed[1] ) ){
        if(this.boulderLeft>-1){
          Map.MoveBoulder(this.boulderLeft,"LEFT");

        }
        if(this.canMoveLeft){
          this.moveLeft();
          this.KeepTrackOfButtonsTime[1]=this.now;
          this.ButtonPressed[1]=true;
        }
        
        this.rotation=90;
      }
      else if ((Key.isDown(Key.DOWN)  && !this.ButtonPressed[2])  ) {
        if(this.boulderDown>-1){
          Map.MoveBoulder(this.boulderDown,"DOWN");

        }
        if(this.canMoveDown){
          this.moveDown();
          this.KeepTrackOfButtonsTime[2]=this.now;
          this.ButtonPressed[2]=true;
        }
        
        this.rotation=0;
      }
      else if ((Key.isDown(Key.RIGHT)   && !this.ButtonPressed[3]) ) {
        if(this.boulderRight>-1){
          Map.MoveBoulder(this.boulderRight,"RIGHT");

        }
        if(this.canMoveRight){
          this.moveRight();
          this.KeepTrackOfButtonsTime[3]=this.now;
          this.ButtonPressed[3]=true;
        }
        
        this.rotation=270;
      }

      //Button up
      if (!Key.isDown(Key.UP) && this.ButtonPressed[0]) {
        this.ButtonPressed[0]=false;
        this.ButtonHold[0]=false;
      }
      else if (!Key.isDown(Key.LEFT) && this.ButtonPressed[1]) {
        this.ButtonPressed[1]=false;
        this.ButtonHold[1]=false;
      }
      else if (!Key.isDown(Key.DOWN) && this.ButtonPressed[2]) {
        this.ButtonPressed[2]=false;
        this.ButtonHold[2]=false;
      }
      else if (!Key.isDown(Key.RIGHT) && this.ButtonPressed[3]) {
        this.ButtonPressed[3]=false;
        this.ButtonHold[3]=false; 
      }
        
      

      //Button hold
      if(this.now-this.KeepTrackOfButtonsTime[0]>initialDelay && this.ButtonPressed[0]){
        this.ButtonHold[0]=true;
      }
      else if(this.now-this.KeepTrackOfButtonsTime[1]>initialDelay && this.ButtonPressed[1]){
        this.ButtonHold[1]=true;
      }
      else if(this.now-this.KeepTrackOfButtonsTime[2]>initialDelay && this.ButtonPressed[2]){
        this.ButtonHold[2]=true;
      }
      else if(this.now-this.KeepTrackOfButtonsTime[3]>initialDelay && this.ButtonPressed[3]){
        this.ButtonHold[3]=true;
      }

      //Button hold movement
      if(this.ButtonHold[0] && ((this.now - this.KeepTrackOfButtonsTime[0])>holdDelay) && this.canMoveUp){
          //Button hold movement
          if(this.boulderUp>-1){
          Map.MoveBoulder(this.boulderUp,"UP");

        }
        if(this.canMoveUp){
         // console.log(this.now.toString());
         // console.log(this.KeepTrackOfButtonsTime[0].toString());
          this.moveUp();
          this.KeepTrackOfButtonsTime[0]=this.now;
          this.ButtonPressed[0]=true;
        }
        this.rotation=180;
      }
      else if(this.ButtonHold[1] && ((this.now - this.KeepTrackOfButtonsTime[1])>holdDelay) && this.canMoveLeft){
        if(this.boulderLeft>-1){
          Map.MoveBoulder(this.boulderLeft,"LEFT");

        }
        if(this.canMoveLeft){
          this.moveLeft();
          this.KeepTrackOfButtonsTime[1]=this.now;
          this.ButtonPressed[1]=true;
        }
        
        this.rotation=90;
      }
      else if(this.ButtonHold[2] && ((this.now - this.KeepTrackOfButtonsTime[2])>holdDelay) && this.canMoveDown){
        if(this.boulderDown>-1){
            Map.MoveBoulder(this.boulderDown,"DOWN");

          }
          if(this.canMoveDown){
            this.moveDown();
            this.KeepTrackOfButtonsTime[2]=this.now;
            this.ButtonPressed[2]=true;
          }
          
          this.rotation=0;
        }

      else if(this.ButtonHold[3] && ((this.now - this.KeepTrackOfButtonsTime[3])>holdDelay) && this.canMoveRight){
        if(this.boulderRight>-1){
            Map.MoveBoulder(this.boulderRight,"RIGHT");

          }
          if(this.canMoveRight){
            this.moveRight();
            this.KeepTrackOfButtonsTime[3]=this.now;
            this.ButtonPressed[3]=true;
          }
          
          this.rotation=270;
        }

      };

    //===========================================End Bulldozer Class==================================








//----------------------------------------------------------------------------------------------------
//===========================================Rectangle Class==========================================
function Rectangle(){}

function Rectangle(posiX,posiY,w,h){
  this.positionX=posiX;
  this.positionY=posiY;
  this.width=w;
  this.height=h;
  this.left=posiX;
  this.top=posiY;
  this.right=posiX+w-1;
  this.bottom=posiY+h-1;
}


/*Methods*/
Rectangle.prototype.Update = function(positionX,positionY,width,height){
  this.positionX=positionX;
  this.positionY=positionY;
  this.width=width;
  this.height=height;
  this.left=positionX;
  this.top=positionY;
  this.right=positionX+width-1;
  this.bottom=positionY+height-1;
}

//=========================================End Rectangle Class========================================








    //=========================================Global Functions=======================================
function Intersect(A,B){
  //Check intersection of two rectangles
  return !(B.left > A.right || 
          B.right < A.left || 
          B.top > A.bottom ||
          B.bottom < A.top);
}

function IntersectAll(A, B){
  //Check intersection of all rectangles in two lists
  if(A.length!=B.length){
    //console.log("Function IntersectAll: The arrays used were not the same length.");
    return false;
  }
  var inter=fillArray(false,A.length);
  for(i=0;i<A.length;i++){
    for(j=0;j<B.length;j++){
      if(Intersect(A[i],B[j])){
        inter[i]=true;
      }
    }
  }
  return AllValuesTrue(inter);
}

function AllValuesTrue(a){

    if(a.length>0){
      for(i=0;i<a.length;i++){
        if(a[i]!=true){
          //console.log("Boulders on targets: " + a.reduce(function(n, val) {
                //return n + (val === true);}));
          return false;
        }
      }

      //console.log("Boulders on targets: " + a.reduce(function(n, val) {
      //return n + (val === true);}));

      return true;
    }
    else{
      //console.log("Function AllValuesTrue: The array was empty.")
    }
}

function fillArray(value, len) {
  var arr = [];
  for (var i = 0; i < len; i++) {
    arr.push(value);
  };
  return arr;
}

function RFP(posArray, shiftX, shiftY){
  //Recangles from position arrays
  var temp=[];
  for (i = 0; i < [posArray.length]; i++) { 
      temp.push(new Rectangle(posArray[i][0]+shiftX,posArray[i][1]+shiftY,Map.tileSize,Map.tileSize));
  }
  return temp;
}

function DrawRectArray(context,image,rects){
  for (i = 0; i < rects.length; i++) { 
      context.drawImage(image,rects[i].positionX-rects[i].width/2,rects[i].positionY-rects[i].height/2);
  }
}

function DrawRotatedImage(context,image, x, y, width, height, angle) {
    // save the current co-ordinate system 
    // before we screw with it
    context.save();

    // move to the middle of where we want to draw our image
    context.translate(x, y);

    // rotate around that point, converting our 
    // angle from degrees to radians 
    context.rotate(angle * TO_RADIANS);

    // draw it up and to the left by half the width
    // and height of the image 
    context.drawImage(image, -(width/2), -(height/2));

    // and restore the co-ords to how they were when we began
    context.restore();
}

function FormatTimer(start,end){
  diffmilli=end-start;
  millis=diffmilli %1000;
  x = diffmilli / 1000;
  secs = Math.floor(x % 60);
  x /= 60;
  mins = Math.floor(x % 60);
  x /= 60;
  hours = Math.floor(x % 24);
  x /= 24;
  days = Math.floor(x);
  //console.log(diffmilli);
  //console.log(millis);
  //console.log(mins);
  //console.log(secs);

  return hours +":"+ mins +":" + secs +":" + millis ;

}

    //========================================End Global Functions====================================




//=============================================Jquery and HTML functions============================

//remove and replace the default value when the user clicks the text box
$("#password-box")
  .focus(function() {
        if (this.value === this.defaultValue) {
            this.value = '';
        }
  })
  .blur(function() {
        if (this.value === '') {
            this.value = this.defaultValue;
        }
});


//Don't allow returns in the textarea
$('textarea').keyup(function(){
$(this).val($(this).val().replace(/\v+/g, ''));
});



//Get the button elemnts on the screen
var startButton=document.getElementById("start-button");
var resetButton = document.getElementById("reset-button");
//var passwordModal = document.getElementById("password-modal")
var notificationModal = document.getElementById("notification-modal");

startButton.onclick=Game.init;
resetButton.onclick=Game.start;


function NotificationAppear(text){
  //Center the box in the canvas
  notificationModal.style.display='block';

  var canRect = Game.canvas.getBoundingClientRect();
  var notRect = notificationModal.getBoundingClientRect();

  var newLeft = (canRect.left+(canRect.width-notRect.width)/2);
  var newTop = (canRect.top+(canRect.height-notRect.height));


  if(Map.level+1 in levelPassword){
    notificationModal.innerHTML="<div id='notif-head'><p id='tittle'> <b> Level  " + Map.level + "</b></p></div><p> Success! <br> Password: "+levelPassword[Map.level+1] + " </p><button class='btn btn-lg btn-primary' id='notif-close-button'>Continue</button>";
  }
  else{
    notificationModal.innerHTML="<div id='notif-head'><p id='tittle'> <b> Level  " + Map.level + "</b></p></div><p> Success! </p><button class='btn btn-lg btn-primary' id='notif-close-button'>Continue</button>";
  }
  

  notificationModal.style.left=newLeft.toString() +"px";
  notificationModal.style.top=newTop.toString() +"px";
  

  notRect = notificationModal.getBoundingClientRect();
  var notifButton = document.getElementById("notif-close-button");
  var buttonRect = notifButton.getBoundingClientRect();
  var newButtonLeft=(notRect.width-buttonRect.width)/2;
  notifButton.style.left=(newButtonLeft).toString() + "px";

  
  notifButton.onclick=Game.Continue;
  //notificationModal.style.left="100px";
}


function NotificationDisappear(){
  notificationModal.style.display="none";
}


function postScore(level,moves,time) {
  AssignUserName();
  username=document.getElementById("username-box").value;
  //console.log(username);
  strt=('username=' + username + '&level=' + level + '&moves=' + moves +'&time=' +time) ;
  $('#scores-table').hide();
  if (strt=="") {
  //document.getElementById("scores-table").innerHTML="";
  return;
  } 
  if (window.XMLHttpRequest) {
  // code for IE7+, Firefox, Chrome, Opera, Safari
  xmlhttp=new XMLHttpRequest();
  } else { // code for IE6, IE5
  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
  xmlhttp.onreadystatechange=function() {
  if (xmlhttp.readyState==4 && xmlhttp.status==200) {
    console.log("Successful score posting: " + xmlhttp.responseText);

  }
  else{
    console.log("no response");
  }
  }
  xmlhttp.open("GET","postScore.php?"+strt,true);
  xmlhttp.send();

}

function postStart(level){
  AssignUserName();
  username=document.getElementById("username-box").value;
  //console.log(username);
  strt=('username=' + username + '&level=' + level);
  $('#scores-table').hide();
  if (strt=="") {
  //document.getElementById("scores-table").innerHTML="";
  return;
  } 
  if (window.XMLHttpRequest) {
  // code for IE7+, Firefox, Chrome, Opera, Safari
  xmlhttp=new XMLHttpRequest();
  } else { // code for IE6, IE5
  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
  xmlhttp.onreadystatechange=function() {
  if (xmlhttp.readyState==4 && xmlhttp.status==200) {
    //document.getElementById("scores-table").innerHTML=xmlhttp.responseText;
    console.log("Successful start posting: " + xmlhttp.responseText);
    //$('#scores-table').slideDown('slow');
    //$('html, body').scrollTop( $(document).height() );

  }
  else{
    console.log("no response");
  }
  }
  xmlhttp.open("GET","postStart.php?"+strt,true);
  xmlhttp.send();
}

var randUsers=["ron","veronica","gordo","whynousername?","cantbebothered","johnnyboi","doozy","balogna"];

function AssignUserName(){
  us=document.getElementById("username-box").value;
  if(us.trim().toUpperCase()=="USERNAME"){
    us = randUsers[Math.floor(Math.random() * randUsers.length)] + Math.floor(Math.random() * 1000);
  }
  document.getElementById("username-box").value=us;
}