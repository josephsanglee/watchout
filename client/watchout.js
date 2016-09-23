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

var enemiesData = new Array(gameOptions.nEnemies);
//creates all enemies initially
for (var i = 0; i < enemiesData.length; i++) {
  enemiesData[i] = {id: i,
                    x: Math.random() * gameOptions.width,
                    y: Math.random() * gameOptions.height};
}

var enemies = gameBoard.selectAll('circle.enemy')
  .data(enemiesData, function(d) { return d.id; })
  .enter()
  .append('svg:circle')
  .attr('class', 'enemy')
  .attr('cx', function(d) { return d.x; })
  .attr('cy', function(d) { return d.y; })
  .attr('r', gameOptions.padding);
