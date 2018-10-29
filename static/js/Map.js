var Map = {
    tileSize: 32,
    level: 1,
    startLevel: 1,
    lastLevel: 61,

    LoadImages: function() {
        Map["background"] = new Image;
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
        Map.block.src = "images/Sprites/block.png";
        Map.target.src = "images/Sprites/target.png";
        Map.boulder.src = "images/Sprites/boulder.png";
        Map.cdiamond.src = "images/Sprites/CDiamond.png";
        Map.odiamond.src = "images/Sprites/ODiamond.png";
        Map.circle.src = "images/Sprites/Circle.png";
        Map.spiral.src = "images/Sprites/Spiral.png";
        Map.plus.src = "images/Sprites/Plus.png";
        Map.square.src = "images/Sprites/Square.png";
    },

    GetPassLevel: function() {
        var password = document.getElementById("password-box").value;
        var level = Map.level;
        if (password.toUpperCase() == "BONK") {
            level = 4;
        }
        else if (password.toUpperCase() == "NERD") {
            level = 8;
        }
        else if (password.toUpperCase() == "BURP") {
            level = 12;
        }
        else if (password.toUpperCase() == "SPUD") {
            level = 16;
        }
        else if (password.toUpperCase() == "GROK") {
            level = 20;
        }
        else if (password.toUpperCase() == "SPOT") {
            level = 24;
        }
        else if (password.toUpperCase() == "KALE") {
            level = 28;
        }
        else if (password.toUpperCase() == "PODS") {
            level = 32;
        }
        else if (password.toUpperCase() == "TAPS") {
            level = 36;
        }
        else if (password.toUpperCase() == "KRIL") {
            level = 40;
        }
        else if (password.toUpperCase() == "GNIP") {
            level = 44;
        }
        else if (password.toUpperCase() == "GORN") {
            level = 48;
        }
        else if (password.toUpperCase() == "LOUT") {
            level = 52;
        }
        else if (password.toUpperCase() == "") {
            level = 56;
        }
        else if (password.toUpperCase() == "FLU") {
            level = 15;
        }
        else if (password.toUpperCase() == "ME") {
            level = 43;
        }
        else if (password.toUpperCase() == "DANG") {
            level = 10;
        }
        else if (password.indexOf("f") == 0 && password.indexOf("u") == 3) {
            level = parseInt(password.substring(1, 3));
        }
        Map.level = level;
    },

    LoadLevel: function(level) {
        var results = GetLevel(level);
        /*assigns the level data to each array*/
        /*creates rectangles*/

        /*posx=results[0]+tileSize/2;
        posy=results[1]+tileSize/2;*/


        var tempboulder_posx = results[2];
        var tempboulder_posy = results[3];

        Map.boulder_rect_list = [];

        for (i = 0; i < tempboulder_posy.length; i++) {
            Map.boulder_rect_list[i] = new Rectangle(tempboulder_posx[i] + shiX, tempboulder_posy[i] + shiY, Map.tileSize, Map.tileSize);
        }


        Map.bricks_rect_list = RFP(results[4], shiX, shiY);
        Map.block_rect_list = RFP(results[5], shiX, shiY);
        Map.target_rect_list = RFP(results[6], shiX, shiY);
        Map.cdiamond_rect_list = RFP(results[7], shiX, shiY);
        Map.odiamond_rect_list = RFP(results[8], shiX, shiY);
        Map.circle_rect_list = RFP(results[9], shiX, shiY);
        Map.spiral_rect_list = RFP(results[10], shiX, shiY);
        Map.plus_rect_list = RFP(results[11], shiX, shiY);
        Map.square_rect_list = RFP(results[12], shiX, shiY);

        /* IN THEORY THIS ARRAY COULD BE SMALLER IF WE CHECKED ONLY FOR BLOCKS THAT ARE NEXT TO BLANK SPACE.
          JUST A THOUGHT FOR THE FUTURE IF NECESSARY*/

        Map.collision_rect_list = Map.bricks_rect_list.concat(Map.block_rect_list, Map.cdiamond_rect_list,
            Map.odiamond_rect_list, Map.circle_rect_list, Map.spiral_rect_list, Map.square_rect_list, Map.plus_rect_list);
    },

    Draw: function(context) {
        context.drawImage(Map.background, 0, 0);
        DrawRectArray(context, Map.bricks, Map.bricks_rect_list);
        DrawRectArray(context, Map.block, Map.block_rect_list);
        DrawRectArray(context, Map.target, Map.target_rect_list);
        DrawRectArray(context, Map.cdiamond, Map.cdiamond_rect_list);
        DrawRectArray(context, Map.odiamond, Map.odiamond_rect_list);
        DrawRectArray(context, Map.circle, Map.circle_rect_list);
        DrawRectArray(context, Map.spiral, Map.spiral_rect_list);
        DrawRectArray(context, Map.plus, Map.plus_rect_list);
        DrawRectArray(context, Map.square, Map.square_rect_list);
        DrawRectArray(context, Map.boulder, Map.boulder_rect_list);
    },
    MoveBoulder: function(index, direction) {
        var tempList = Map.boulder_rect_list.slice(0);
        tempList.splice(index, 1);
        var canMoveBoulder = true;
        var futureRect = new Rectangle();


        shiftX = 0;
        shiftY = 0;
        if (direction == "UP") {
            shiftY = -Map.tileSize;
        }
        else if (direction == "DOWN") {
            shiftY = Map.tileSize;
        }
        else if (direction == "LEFT") {
            shiftX = -Map.tileSize;
        }
        else if (direction == "RIGHT") {
            shiftX = Map.tileSize;
        }

        var futureRect = new Rectangle(Map.boulder_rect_list[index].positionX + shiftX, Map.boulder_rect_list[index].positionY + shiftY, Map.tileSize, Map.tileSize);

        //Check for other boulders
        for (i = 0; i < tempList.length; i++) {
            if (Intersect(futureRect, tempList[i])) {
                canMoveBoulder = false;
            }
        }

        //Check for walls
        for (i = 0; i < Map.collision_rect_list.length; i++) {
            if (Intersect(futureRect, Map.collision_rect_list[i])) {
                canMoveBoulder = false;
            }
        }


        if (canMoveBoulder) {
            Map.boulder_rect_list[index] = new Rectangle(Map.boulder_rect_list[index].positionX + shiftX, Map.boulder_rect_list[index].positionY + shiftY, Map.tileSize, Map.tileSize);
            Game.bulldozer.boulderMoves += 1;
        }
        else {
            if (direction == "UP") {
                Game.bulldozer.canMoveUp = false;
            }
            else if (direction == "DOWN") {
                Game.bulldozer.canMoveDown = false;
            }
            else if (direction == "LEFT") {
                Game.bulldozer.canMoveLeft = false;
            }
            else if (direction == "RIGHT") {
                Game.bulldozer.canMoveRight = false;
            }
        }
    }






}