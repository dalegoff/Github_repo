window.onload = function()
{
    
    var canvas;
    var canvasWidth = 900;
    var canvasHeight=600;
    
    var ctx;
    var delay = 100;
    var xCoord =0;
    var yCoord =0;
    //var snakee; 
    var blockSize = 30;
    var widthInBlocks = canvasWidth/blockSize;
    var heightInBlocks = canvasHeight/blockSize; 
    var score;
    var timeout;
    
    init();
 function init ()
    {
        canvas=document.createElement("canvas");
        canvas.width=canvasWidth;
        canvas.height=canvasHeight;
        canvas.style.border= "30px solid grey"
        canvas.style.margin = "50px auto";
        canvas.style.display = "block";
        canvas.style.backgroundColor="#ddd";
        document.body.appendChild(canvas);
        ctx = canvas.getContext("2d");
        snakee = new Snake([[6,4],[5,4],[4,4]],"right");
        applee = new Apple([10,10]);
        score = 0;
        refreshCanvas();
    }
    
    function drawScore()
    {
        ctx.save();
        ctx.font = "bold 200px sans-serif";
        ctx.fillStyle = "gray";
        ctx.textAlign = "center"; 
        ctx.textBaseline = "middle";
        var centrex = canvasWidth/2;
        var centreY = canvasHeight/2;
        ctx.fillText(score.toString(),centrex , centreY);
        ctx.restore();
    }
    
    function refreshCanvas()
    {
        
         snakee.advance();
        if(snakee.checkCollision())
            {
                //gameover
                gameOver();
            }
        else
            {
            if(snakee.isEatingApple(applee))
                {
                    //manger la pomme
                    snakee.ateApple=true;
                    score ++;
                    do
                    {
                        applee.setNewPosition();
                    }
                    while(applee.isOnSnake(snakee))
                    
                }
            ctx.clearRect(0,0,canvasWidth,canvasHeight); //clear le canvas
            
            drawScore();
            snakee.draw();
            applee.draw();
            timeout = setTimeout(refreshCanvas,delay);
            //setTimeout(refreshCanvas,delay);
            }
    }
    
    
    function drawBlock (ctx,position)
    {
        var x = position[0] * blockSize;
        var y = position[1] * blockSize;
        ctx.fillRect(x,y,blockSize,blockSize);
        
    }
    
   function gameOver()
        {
            ctx.save();
            ctx.font = "bold 100px sans-serif";
            ctx.fillStyle = "black";
            ctx.textAlign = "center"; 
            ctx.textBaseline = "middle";
            ctx.strokeStyle="white";
            ctx.lineWidth = 5;
            var centrex = canvasWidth/2;
            var centreY = canvasHeight/2;
            ctx.strokeText("Game Over",centrex , centreY-180);
            ctx.fillText("Game Over",centrex , centreY-180);
            
            ctx.font = "bold 30px sans-serif";
            ctx.strokeText("Appuyer sur la touche espace pour rejouer",centrex,centreY-120);
            ctx.fillText("Appuyer sur la touche espace pour rejouer",centrex,centreY-120);
            ctx.restore;
        }
        
    function restart()
        {
        snakee = new Snake([[6,4],[5,4],[4,4]],"right");
        applee = new Apple([10,10]);
        score = 0;
        clearTimeout(timeout);
        refreshCanvas();
        }
        
    function Snake(body,direction)
    {
        this.body = body;
       this.direction = direction;
        this.ateApple = false;
       this.draw = function ()
        {
            ctx.save();
            ctx.fillStyle = "red";
            
            for (var i = 0; i<this.body.length;i++)
                {
                    drawBlock(ctx,this.body[i]);
                }
                
            ctx.restore; //remettre comme il etait
        };
        
        this.advance = function ()
        {
            var nextPosition = this.body[0].slice();
            switch(this.direction)
                {
                    case "left":
                    nextPosition[0] --;
                    break;
                
                    case "right":
                    nextPosition[0] ++;
                    break;
                
                    case "down":
                    nextPosition[1] ++;
                    break;
                
                    case "up":
                    nextPosition[1] --;
                    break;
                        
                    default:
                        throw("invalid direction");
                }
            
            this.body.unshift(nextPosition); //ajoute l'element au array en premiere position
            if(!this.ateApple)
                this.body.pop(); // supprime le dernier element d'un array
            else
                this.ateApple=false;
            
        };
        
         this.setDirection = function(newDirection)
        {
            var allowedDirection;
                   
        
           switch(this.direction)
            {
                case "left":
                case "right":
                        allowedDirection = ["up","down"];
                        break;
                case "up":
                case "down":
                        allowedDirection = ["right","left"];
                        break;
                default:
                    throw("invalid direction");
                    
            }
             
            if (allowedDirection.indexOf(newDirection)>-1)
            {
                this.direction = newDirection;   
                console.log(this.direction);
                
            }
            
        };
        
        this.checkCollision = function()
        {
            var wallCollision = false;
            var snakeCollision = false;
            var head = this.body[0]; // la tête du serpent
            var rest = this.body.slice(1);  //recupere le reste du corps
            var snakeX = head[0];
            var snakeY = head[1];
            var minX = 0;
            var minY = 0;
            var maxX = widthInBlocks-1;
            var maxY = heightInBlocks-1;
            var isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
            var isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;
            if (isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls)
            {
                wallCollision = true;
            }
            
            for(var i =0; i< rest.length ;i++)
                {
                    if(snakeX === rest[i][0] && snakeY === rest[i][1])
                    {
                        snakeCollision=true;                                           
                    }
                }
            return wallCollision || snakeCollision ;
                                                               
        };
        
        this.isEatingApple = function(appleToEat)
        {
            var head = this.body[0];
            if(head[0]=== appleToEat.position[0] && head[1] === appleToEat.position[1])
                    return true;
                else
                    return false;
        };
    
    }
    
    function Apple (position)
    {
        this.position = position;
        this.draw = function ()
        {
        
        
        ctx.save();  //sauvegarde les valeurs du contexte (garde la couleur rouge) 
        ctx.fillStyle="green";
        ctx.beginPath();
        var radius = blockSize/2;
        var x = this.position[0]*blockSize + radius;
        var y = this.position[1]*blockSize + radius;       
        ctx.arc(x,y,radius,0,Math.PI*2,true);  // le rond    
        ctx.fill(); //dessine
        ctx.restore(); //restaure la couleur de dessin rouge
            
        };
        
        this.setNewPosition = function ()
        {
            var newX = Math.round(Math.random() * (widthInBlocks - 1));
            var newY = Math.round(Math.random() * (heightInBlocks - 1));
            this.position =[newX,newY];
            console.log(this.position);
        };
        
        this.isOnSnake = function(snakeToCheck)
        {
            var isOnSnake = false;
            for (var i =0;i< snakeToCheck.body.length;i++)
                {
                    if (this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1])
                        {
                            isOnSnake = true;
                        }
                }
            return isOnSnake;
        };
    }
    
     document.onkeydown = function handleKeyDown(e) 
                {
                var key = e.keyCode;
                var newDirection;
                switch(key)
                        {
                            case 37:
                            newDirection = "left";
                            break;
                        
                            case 38:
                            newDirection = "up";
                            break;
                        
                            case 39:
                            newDirection = "right";
                            break;
                        
                            case 40:
                            newDirection = "down";
                            break;
                                
                            case 32:
                                restart();
                                return;
                                
                            default:
                                return;
                        }
                snakee.setDirection(newDirection);
                }
}