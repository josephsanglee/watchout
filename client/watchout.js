// start slingin' some d3 here.
var gameOptions = {
  height: 450,
  width: 700,
  nEnemies: 30,
  padding: 15
};

gameStats = {
  score: 0,
  bestScore: 0
};


var gameBoard = d3.select('.board').append('svg:svg')
                  .style('width', gameOptions.width + 'px')
                  .style('height', gameOptions.height + 'px')
                  .style('background-color', 'grey');

//creates all enemies initially

var enemiesData = new Array(gameOptions.nEnemies);
var randomizeEnemies = function () {
  for (var i = 0; i < enemiesData.length; i++) {
    enemiesData[i] = {id: i,
                    x: Math.random() * gameOptions.width,
                    y: Math.random() * gameOptions.height};
  }
};



//defines dragging behavior of player circle
var drag = d3.behavior.drag()
             .on('dragstart', function() { player.style('fill', 'green'); })
             .on('drag', function() {
               player.attr('cx', d3.event.x)
                     .attr('cy', d3.event.y); })
             .on('dragend', function() { player.style('fill', 'red'); });


//creates player initially
var playerData = [{id: 'player', x: gameOptions.width / 2, y: gameOptions.height / 2}];



var render = function() {
  randomizeEnemies();

  //defines dragging behavior of player circle
  var drag = d3.behavior.drag()
               .on('dragstart', function() { player.style('fill', 'green'); })
               .on('drag', function() {
                 player.attr('cx', d3.event.x)
                       .attr('cy', d3.event.y);
                 playerData[0].x = d3.event.x;
                 playerData[0].y = d3.event.y;
               })
             .on('dragend', function() { player.style('fill', 'red'); });



  var enemies = gameBoard.selectAll('circle.enemy')
                         .data(enemiesData, function(d) { return d.id; });
  var player = gameBoard.selectAll('circle.player')
                        .data(playerData, function(d) { return d.id; });

  enemies.enter()
         .append('svg:circle')
         .attr('class', 'enemy')
         .attr('cx', function(d) { return d.x; })
         .attr('cy', function(d) { return d.y; })
         .attr('r', gameOptions.padding);

  enemies.exit()
         .remove();

  enemies.transition()
         .duration(3000)
         .attr('cx', function(d) { return d.x; })
         .attr('cy', function(d) { return d.y; });
  

  player.enter()
        .append('svg:circle')
        .attr('class', 'player')
        .attr('cx', function(d) { return d.x; })
        .attr('cy', function(d) { return d.y; })
        .attr('r', gameOptions.padding)
        .call(drag)
        .style('fill', 'red');

};

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
  console.log(0);
};

//render the enemies right away, then set an interval for them afterwards
render();
setInterval(render, 3000);
setInterval(checkCollision, 15);


