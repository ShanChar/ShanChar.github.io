//Music for the game
const bgm = new Audio('./assests/bgm.mp3');
const game_over_sound = new Audio('./assests/game_over.mp3');
const orb_collect_sound = new Audio('./assests/orb_collect.mp3');
const moving_sound = new Audio('./assests/moving.mp3');

// constant declaration for html stuff
const game_board = document.querySelector('.play-board');
const menuBox = document.querySelector('.menu');
const score = document.querySelector('.score');
const highScoreElement = document.querySelector('.high-score');
const restHighScore = document.querySelector('.reset');
const replay = document.querySelector('.replay');
const snakeColorElement = document.querySelector('.snake_color');
const foodColorElement = document.querySelector('.food_color');
const buttons = document.querySelectorAll('.btn');
//this checks if snakeColor is available in localstorage, if it is not then provides a default color
let snakeColor = localStorage.getItem("snakeColor") || '#fff';
let foodColor = localStorage.getItem("foodColor") || '#ff0202'; 


// this iterates through the buttons 
buttons.forEach((button) =>
{
    // for each button this adds a click event listener
    button.addEventListener("click", () =>
    {
        // takes attribute from data-key and stores it in direction 
        const direction = button.getAttribute('data-key');
        // passes the direction to changeDirection function
        changeDirection(direction);
    })
});

//adds a input event listener to the color input
snakeColorElement.addEventListener('input', (e) =>
{
    snakeColor = snakeColorElement.value;
    // stores the color values input by user in localstorage
    localStorage.setItem("snakeColor", snakeColor);

});


// same as above but for food
foodColorElement.addEventListener('input', (e) =>
{
    foodColor = foodColorElement.value;
    localStorage.setItem("foodColor", foodColor);
   
});



let speedElement = document.querySelector('.speed');
// this tries to retreive value of speed if it exists in local storage and if not, assings it to 10
let speed = localStorage.getItem("speed") || 10;

// this checks for the user input for speed
speedElement.addEventListener("keydown", (e) => 
{
    // a event listener that checks for key enter
    if(e.key ==="Enter")
    {

        // assings the speed input by user in speed variable
        speed = speedElement.value;    
        // this stores the value in localstorage
        localStorage.setItem("speed", speed);
        // this focuses out from the input field
        speedElement.blur();
    }
});
// some variables we need in the game
let game_score =0;
let previousTime = 0;
let game_over = false;




//Overwriting the value of highscore if the game was already played
let high_score = localStorage.getItem("highScore") || 0;
highScoreElement.textContent = 'High Score: ' + high_score;


//velocity which actually helps move the snake
let velocity = {
    x: 0,
    y: 0
}
//the last velocity, will be useful when we wanna know what the last direction was
let last_input_velocity = {
    x:0,
    y:0
}

// snake block will be an array of different block, each individual block, which is an object, will combine to form a snake, 
let snake_block = [
     {
        // declaration of two variables which are responsible for the placement of the initial block of snake
        x: 15,
        y: 15,
     }
 ];


 let food_block = {
    // position of food
    x: 10,
    y: 20,
 };

 // Function called when the user dies 
 function endOfGame() {
    game_over_sound.play(); // this plays the game over sound
    bgm.pause(); //this pauses the bgm
    // this makes the hidden menu box visible
    menuBox.style.display = 'flex';



    // this will put delay so that the menuBox wouldn't suddenly appear
    setTimeout(function() {
        menuBox.style.opacity = '1';
        menuBox.style.display = 'flex';
        // this is the delay in milisecond
    }, 150);


    //event listener for the reset button
    restHighScore.addEventListener("click", function(){

        // removes the value of highscore stored in localstorage
        localStorage.removeItem("highScore", high_score);
        // displays 0 instead of whatever value there was
        highScoreElement.textContent = 'High Score: ' + 0;
    
     });

 
     //event listener that checks for spacebar keypress
     window.addEventListener("keypress", (e) =>{

        if(e.key === " ")
        {
            // if player hits space when the game is paused, then the game is reloaded, essentially a shortcut to what is used below
            location.reload();
        }
    });

    // this adds an event listener 'click' to the replay button
    replay.addEventListener("click", function() {
        // if player clicks the button then the game is reloaded
    location.reload(); // this reloads the page so that the player can play the game after clicking on OK of alert or hitting enter key
    });

 }

 // Function that changes the position of food randomly
 function changePosition() {

    // Grid area is 30 * 30, but i use 28 there so that the food will not appear towards the edges, which makes the game little easier
    food_block.x = Math.floor(Math.random() * 28) + 1;
    food_block.y = Math.floor(Math.random() * 28) + 1;
 }


 // Function to change the direction of snake when the buttons are clicked
 function changeDirection(direction) {
    
    // we check if game is over because we don't want the snake to move upon key press after the game is over
    if(game_over)
    {
        return;
    }
    // directon here is passed from two sources, one from keys, another through the buttons
    switch(direction)
               {
                case "ArrowUp":
                    {
                        if(last_input_velocity.y !=0)
                        {
                            // this checks if the snake is moving downward or upward, in both cases we don't want the snake to change direction so we break out of it
                           
                            break;
                        }
                        velocity.x = 0; // Since our goal is to move up when pressed ArrowUp
                        velocity.y = -1; // This moves it up, it's counterintuitive because in math it'll be the opposite, so had to be careful
                        moving_sound.play(); // plays the moving sound, which is the sound when the snake changes direction
                        bgm.play(); // To start the bgm
                    }
                break;
    
                case "ArrowDown":
                    {
                        // same logic as mentioned above
                        if(last_input_velocity.y !=0)
                        {
                            
                            break;
                        }
                        velocity.x = 0;
                        velocity.y = 1;
                        moving_sound.play();
                        bgm.play();
                    }
                break;
                
                case "ArrowLeft":
                    {
                        if(last_input_velocity.x !=0)
                        {
                           
                            break;
                        }
                        velocity.x = -1;
                        velocity.y = 0;
                        moving_sound.play();
                        bgm.play();
                    }
                break;
                
                case "ArrowRight":
                    {
                        if(last_input_velocity.x !=0)
                        {
                            
                            break;
                        }
                        velocity.x = 1;
                        velocity.y = 0;
                        moving_sound.play();
                        bgm.play();
                        
                    }
                    break;
    
            }

            renderGame(); // after updaing the values of velocity object now we go to renderGame() function where we can use updated value of velocity object to move our snake
 }


//Update the snake as it eats

function Update() {
     // as the snake eats, we want all our blocks to move a step back, and in the place of first first block, a new block will be added
    for (let index = snake_block.length -2; index >= 0; index--) {
        // This is last block       // a new object because it's a different block
        snake_block[index+1] = {...snake_block[index] };    
    }

}




// Gameloop that will run actually run the game
function main(currentTime) {
    // here we check if the value of game_over is true, we set it to false , so, unless this is changed, this step will be skipped 
    if(game_over){
        // If it set to true then we return to the endOfGame() function which was at the top
        return endOfGame();
        
    }

else {
    window.requestAnimationFrame(main); // This is to loop again and again
        
    // This is to know the difference in time between last and current iteration, a vairbale named previousTime will store the time of last iteration, by defualt it is zero, but will be upgraded
    const deltaTime = (currentTime - previousTime)/1000; // To convert into second from milisecond

    // this checks if the difference in time between two iteration is less than a certain speed
    // we do 1/speed because we want to exit the function when a certain difference in time between two iteration is met,  
    if(deltaTime < 1/ speed) //This is to control the fps, unless the difference is met, the function would not execute
    {
        return; //We skip a step
    }
   
    // previousTime is now current time and current time will get updated in next iteration
    previousTime = currentTime;
  
    // this function will be responsible for rendering stuff
    renderGame();
}
    
   
}

// here we have the actual function
function renderGame(){

   
    // clearing the gameboard if something exists
    game_board.innerHTML ='';
  
  

    // Snake creation, for this we loop throught the array
    snake_block.forEach((block, index) => {

        // we create a div
        let snake = document.createElement('div');
        // put some style,  we get the snakeColor from player input or the defualt values is used
        snake.style.background = `radial-gradient(circle, ${snakeColor}, transparent)`
        snake.style.boxShadow =  `0 0 5px 2px ${snakeColor}`;
        // this places the snake block in a area that is fixed above, around the center i.e
        snake.style.gridArea = `${block.y} / ${block.x} /  ${block.y+1} /  ${block.x+1}`;

        // this chekcs if we are currently in element 1 of array, essentially the first object inside the array which is also out snakeHead
        if(index === 0)
        {
         // adding a class to snake div, this is snake_head because the first object or element is our head
        snake.classList.add('snake_head');
        }

        else {
            // the remaining objects or elements of our array is the body of snake
            snake.classList.add('snake_body');
        }
        // we appendChild snake to game_board 
        game_board.appendChild(snake);

        
    });
   

    // this stores the value of last direction
    last_input_velocity = velocity;
  
    // this checks if both the snake and food are in same position, remember that the y actually row, while x is column
    if(snake_block[0].y === food_block.y && snake_block[0].x=== food_block.x)
    {
        // this adds a new block in the front, we use velocity.x,y to determine in which direction to put, where the snake moves that is the direction of front block
        snake_block.unshift({x: snake_block[0].x + velocity.x, y: snake_block[0].y + velocity.y})
        // plays this sound when the snake eats food
        orb_collect_sound.play();
        // increment the score
        game_score++;
        //display the score
        score.textContent = 'Score: ' + game_score; 
        // set value for highscore
        high_score = game_score> high_score ? game_score : high_score;
        // display highscore
        highScoreElement.textContent = 'High Score: ' + high_score;
        // use localstorage to store highscore
        localStorage.setItem("highScore", high_score);

        // change the position of food after it is eaten
        changePosition();
    }
    // this calls the update function that updates the snake blocks or objects
    Update();
       // This changes the value of snake block using velocity object, the value of velocity will be changed upon keypress, so here we are always changing the value of at lest one axis
       snake_block[0].x += velocity.x;
       snake_block[0].y += velocity.y;

 

    //This uses variable food to create a div
    let food = document.createElement('div');
    // class .food is addes to the div
    food.classList.add('food');
    // the food div is appended to the parent game_board
    game_board.appendChild(food);
    // here we display the food block by adding some styles we get from user or by default
    food.style.background = `radial-gradient(circle, ${foodColor}, transparent)`;
    food.style.boxShadow =  `0 0 5px 2px ${foodColor}`;
    food.style.gridArea = `${food_block.y} / ${food_block.x}/ ${food_block.y+1} /${food_block.x+1}`;

    
    // this checks if the snake block is out of the screen or grid area
    if(snake_block[0].x <=0 || snake_block[0].x >= 31 || snake_block[0].y <=0 || snake_block[0].y >= 31)
    {
        // we change the state of game_over if the snake is out of the box, after that it is returned back
        return game_over = true;
    }    

    // a loop that iterates from index 2 till the end of array
    for(let i =1; i<snake_block.length; i++)
    {
        // here it checks if the second, third,etc  block's position is same as the position of head, if it is then the game is over
        if(snake_block[0].x == snake_block[i].x && snake_block[0].y == snake_block[i].y)
        {
            // we make game_over true so that the endOfGame function will be activated
            return game_over = true;

        }
    }
   


}

// this is function call of the function that randomizes the position of food
changePosition();

// setInterval(renderGame, 200); // setInterval is just a backup option if gameloop doesn't work
// addded an event listener that listens to keydown, and if true calls a function changeDirection
// this adds evetlistener that passes the key that is pressed to the changeDirection function
window.addEventListener("keydown", (e) => {


    changeDirection(e.key);
});


// calls the main function using requestAnimationFrame
window.requestAnimationFrame(main);





