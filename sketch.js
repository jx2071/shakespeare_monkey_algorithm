let target;
let popmax;
let mutationRate;
let population;

let targetPhrase;
let bestPhrase;
let allPhrases;
let stats;

let framerate = 5;
let accbutton;
let speedbutton;
let stopbutton;
let resumebutton;
let resetbutton;
let buttons = [accbutton,speedbutton,stopbutton,resumebutton,resetbutton];

function setup() {
  frameRate(framerate);
  let urlParams = new URLSearchParams(window.location.search);
  target = urlParams.has('target')? urlParams.get('target') : "To be or not to be that is a question?";
  popmax = 1000;
  mutationRate = 0.01;
  start(target,popmax,mutationRate);

  accbutton = createButton("Accelerate");
  accbutton.position(20,20);
  accbutton.mousePressed(()=>{
    frameRate(60);
  });

  accbutton.mouseReleased(()=>{
    frameRate(framerate);
  })
  accbutton.attribute('title',"Press and hold to accelerate")
  accbutton.class('button');

  speedbutton = createButton("Speed Up");
  speedbutton.position(145,20);
  speedbutton.mousePressed(()=>{
    frameRate(60);
  })
  speedbutton.attribute('title',"Click to accelerate")
  speedbutton.class('button');

  stopbutton = createButton("Stop");
  stopbutton.position(20,60);
  stopbutton.mousePressed(()=>{
    noLoop();
  })
  stopbutton.class('button');

  resumebutton = createButton("Resume");
  resumebutton.position(90,60);
  resumebutton.mousePressed(()=>{
    loop();
  })
  resumebutton.class('button');


  resetbutton = createButton("Reset");
  resetbutton.position(20,100);
  resetbutton.mousePressed(()=>{
    population = new Population(target, mutationRate, popmax);
    frameRate();
    loop();
  })
  resetbutton.class('button');
}

function start(target,popmax,mutationRate){
    //frameRate(framerate);
    
    targetPhrase = createP("Target phrase:<br>"+target);
    targetPhrase.class("best");

    bestPhrase = createP("Best phrase:");
    //bestPhrase.position(10,10);
    bestPhrase.class("best");
  
    allPhrases = createP("All phrases:");
    let pos = target.length*30 > 600 ? target.length*30 : 600;
    allPhrases.position(pos, 10);
    allPhrases.class("all");
  
    stats = createP("Stats");
    //stats.position(10,200);
    stats.class("stats");
  
    //createCanvas(640, 360);
  
    // Create a population with a target phrase, mutation rate, and population max
    population = new Population(target, mutationRate, popmax);

}

function draw() {
  // Generate mating pool
  population.naturalSelection();
  //Create next generation
  population.generate();
  // Calculate fitness
  population.calcFitness();

  population.evaluate();

  // If we found the target phrase, stop
  if (population.isFinished()) {
    //println(millis()/1000.0);
    noLoop();
  }

  displayInfo();
}

function displayInfo() {
  // Display current status of population
  let answer = population.getBest();

  bestPhrase.html("Best phrase:<br>" + answer);

  let statstext =
    "Total Generations:     " + population.getGenerations() + "<br>";
  statstext +=
    "Average Fitness:       " + nf(population.getAverageFitness()) + "%<br>";
  statstext += "Total Population:      " + popmax + "<br>";
  statstext += "Mutation Rate:         " + floor(mutationRate * 100) + "%<br>";
  statstext += "Generations Per Second:      " + floor(frameRate());

  stats.html(statstext);

  allPhrases.html("All phrases:<br>" + population.allPhrases());
}
