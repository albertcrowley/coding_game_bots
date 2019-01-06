/**
 * Survive the wrath of Kutulu
 * Coded fearlessly by JohnnyYuge & nmahoude (ok we might have been a bit scared by the old god...but don't say anything)
 **/

const width = parseInt(readline());
const height = parseInt(readline());
var walls = []
for (let i = 0; i < height; i++) {
    const line = readline();
    walls.push(line);
}
var inputs = readline().split(' ');
const sanityLossLonely = parseInt(inputs[0]); // how much sanity you lose every turn when alone, always 3 until wood 1
const sanityLossGroup = parseInt(inputs[1]); // how much sanity you lose every turn when near another player, always 1 until wood 1
const wandererSpawnTime = parseInt(inputs[2]); // how many turns the wanderer take to spawn, always 3 until wood 1
const wandererLifeTime = parseInt(inputs[3]); // how many turns the wanderer is on map after spawning, always 40 until wood 1
var light = 3;
var lightCooldown = 0;
var planCount = 2;
var planCooldown = 5;

function wallAt(x, y) {
 var line = walls[y];
 var cell = line.substr(x,1); 
 return (cell == "#");   
}

function monsterClose(x,y, d) {
    
    for (var i=0; i < wanderers.length; i++) {
        if ((Math.abs(wanderers[i].x - x) < d)  && (Math.abs(wanderers[i].y - y) < d)) {
            return true;   
        }
    }
    
    return false;
    
}

function explorerClose(x,y, d) {
    
    for (var i=1; i < explorers.length; i++) {
        if ((Math.abs(explorers[i].x - x) < d)  && (Math.abs(explorers[i].y - y) < d)) {
            return true;   
        }
    }
    return false;    
}

function runFrom (x,y) {
    
    var dx = x - myX;
    var dy = y - myY;
    
    var newX = (myX -dx);
    var newY = (myY - dy);

    if (wallAt(newX,newY)) {
        if (dx ==0) {
         dy = 0;
         dx = 1;
         newX = (myX -dx);
         newY = (myY - dy);
         if (wallAt(newX,newY)) {
           dy = 0;
           dx = -1;
           newX = (myX -dx);
           newY = (myY - dy);
         }             
        } else {
        if (dy ==0) {
         dy = 1;
         dx = 0;
         newX = (myX -dx);
         newY = (myY - dy);
         if (wallAt(newX,newY)) {
           dy = -1;
           dx = 0;
           newX = (myX -dx);
           newY = (myY - dy);
         }             
        }  
        }
    }
    return {x: dx, y:dy};
}


function runAway() {
    var move = "";
    // anyone near us?
    printErr ("checking wanderers. There are " + wanderers.length + " of them");
    for (var i = 0; i < wanderers.length; i++) {
        if ((Math.abs(wanderers[i].x - myX) < 2)  && (Math.abs(wanderers[i].y - myY) < 2)) {
            
            var delta = runFrom(wanderers[i].x, wanderers[i].y);
            var newX = (myX -delta.x);
            var newY = (myY - delta.y);
        

              move = "MOVE "  + newX + " " + newY; 
              printErr ("wanderer close by at " + wanderers[i].x + " " + wanderers[i].y);
              printErr ("I am at " + myX + " " + myY);
        }
        printErr("wanderer " + i + " is no threat");
    }
    return move;
    
}

function tryLight() {
    var move = "";
    printErr (lightCooldown);
    if (monsterClose(myX, myY, 4) && light>0 && lightCooldown <=0) {
        move = "LIGHT";   
        light--;
        lightCooldown = 4;
    }
    return move;
}

function tryPlan() {
    if (explorerClose(myX,myY,2) && planCount > 0 && planCooldown <= 0) {
        planCount --;
        planCooldown == 4;
        return "PLAN";
    } 
    return "";
}


// game loop
while (true) {
    lightCooldown--;
    planCooldown--;
    var explorers = [];
    var wanderers = [];
    const entityCount = parseInt(readline()); // the first given entity corresponds to your explorer
    for (let i = 0; i < entityCount; i++) {
        var inputs = readline().split(' ');
        const entityType = inputs[0];
        const id = parseInt(inputs[1]);
        const x = parseInt(inputs[2]);
        const y = parseInt(inputs[3]);
        const param0 = parseInt(inputs[4]);
        const param1 = parseInt(inputs[5]);
        const param2 = parseInt(inputs[6]);
        
        if (entityType == "EXPLORER") {
            explorers.push( {x: x, y:y, id: id, sanity: param0} );
        }
        
        if (entityType == "WANDERER") {
            wanderers.push( {x: x, y:y, id: id} );     
        }
        
        
    }

    // Write an action using print()
    // To debug: printErr('Debug messages...');

    var target = 0;
    var myX = explorers[0].x;
    var myY = explorers[0].y;
    var move = "";
    
    
    var bestSanity = 0;
    for (var i=1; i < explorers.length; i++) {
        if (explorers[i].sanity > bestSanity) {
            target = i;
            bestSanity = explorers[i].sanity;
        }
    }
 
 
    if (move =="") {
        move = tryLight();
    }
    if (move == "") {
      move = runAway();
    }
    if (move =="") {
        move = tryPlan();
    }
    
    if (move == "" && (explorers[target].x != myX || explorers[target].y != myY)) {    
        move = ("MOVE " +explorers[target].x + " " + explorers[target].y);
        printErr("moving to explorer " + target);
    }
    
    if (move =="") {
        move = "WAIT";
        printErr("waiting");
    }
    
    print (move);

//    // print('WAIT'); // MOVE <x> <y> | WAIT
}
