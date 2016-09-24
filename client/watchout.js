// start slingin' some d3 here.
var gameOptions = {
  height: 450,
  width: 700,
  nEnemies: 30,
  padding: 15
};

gameStats = {
  score: 0,
  bestScore: 0,
  collisions: 0
};


var gameBoard = d3.select('.board').append('svg:svg')
                  .style('width', gameOptions.width + 'px')
                  .style('height', gameOptions.height + 'px')
                  .style('background-color', 'grey');

//creates all enemies initially
var enemiesData = new Array(gameOptions.nEnemies);

var randomizeEnemies = function () {
  for (var i = 0; i < enemiesData.length; i++) {
    var x = gameOptions.padding + Math.random() * (gameOptions.width - 2 * gameOptions.padding);
    var y = gameOptions.padding + Math.random() * (gameOptions.height - 2 * gameOptions.padding);
    enemiesData[i] = {
      id: i,
      x: x,
      y: y
    };
  }
};

var enemyRender = function() {
  var enemies = gameBoard.selectAll('circle.enemy')
                         .data(enemiesData, function(d) { return d.id; });

  enemies.enter()
         .append('svg:circle')
         .attr('class', 'enemy')
         .attr('cx', function(d) { return d.x; })
         .attr('cy', function(d) { return d.y; })
         .attr('r', gameOptions.padding);

  enemies.exit()
         .remove();

  enemies.transition()
         .duration(2000)
         .attr('cx', function(d) { return d.x; })
         .attr('cy', function(d) { return d.y; });
};

//creates player initially
var playerData = [{id: 'player', x: gameOptions.width / 2, y: gameOptions.height / 2}];

var limitPlayer = function(position, max) {
  if (position < gameOptions.padding) {
    return gameOptions.padding;
  } else if (position > max - gameOptions.padding) {
    return max - gameOptions.padding;
  }
  return position;
};

playerRender = function() {
  var drag = d3.behavior.drag()
               .on('dragstart', function() { player.style('fill', 'green'); })
               .on('drag', function() {
                 playerData[0].x = limitPlayer(d3.event.x, gameOptions.width);
                 playerData[0].y = limitPlayer(d3.event.y, gameOptions.height);
                 player.attr('cx', playerData[0].x)
                       .attr('cy', playerData[0].y);
               })
             .on('dragend', function() { player.style('fill', 'red'); });

  var player = gameBoard.selectAll('circle.player')
                        .data(playerData, function(d) { return d.id; });

  player.enter()
      .append('svg:circle')
      .attr('class', 'player')
      .attr('cx', function(d) { return d.x; })
      .attr('cy', function(d) { return d.y; })
      .attr('r', gameOptions.padding)
      .call(drag)
      .style('fill', 'red');
};

var hasCollided = false;

var checkCollision = function() {
  gameStats.score += 15;
  var minDistance = gameOptions.padding * 2;
  for (var i = 0; i < enemiesData.length; i++) {
    var dx = enemiesData[i].x - playerData[0].x;
    var dy = enemiesData[i].y - playerData[0].y;
    var distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    if (distance <= minDistance) {
      collision();
    }
  }
};

var collision = function() {
  gameStats.bestScore = Math.max(gameStats.score, gameStats.bestScore);
  gameStats.score = 0;
  hasCollided = true;
};

var updateScore = function() {
  d3.select('.current').select('span')
    .text('' + Math.floor(gameStats.score / 250));
  d3.select('.highscore').select('span')
    .text('' + Math.floor(gameStats.bestScore / 250));
  if (hasCollided) {
    gameStats.collisions++;
    d3.select('.collisions').select('span')
      .text('' + gameStats.collisions);
    hasCollided = false;
  }
};

var gameRender = function() {
  randomizeEnemies();
  enemyRender();
  playerRender();

};
//render the enemies right away, then set an interval for them afterwards
gameRender();
setInterval(updateScore, 250);
setInterval(checkCollision, 15);
setInterval(gameRender, 2000);



