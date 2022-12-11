//import * as Tone from 'tone'

//create a synth and connect it to the main output (your speakers)
//const synth = new Tone.Synth().toDestination();

//play a middle 'C' for the duration of an 8th note
//synth.triggerAttackRelease("C4", "8n");


//list of major chord progressions
//taken from wikipedia: https://en.wikipedia.org/wiki/List_of_chord_progressions
let melody_from_data = [];

if (!!window.EventSource) {
    var source = new EventSource('/events');
  
    source.addEventListener('open', function(e) {
      console.log("Events Connected");
    }, false);
  
    source.addEventListener('error', function(e) {
      if (e.target.readyState != EventSource.OPEN) {
        console.log("Events Disconnected");
      }
    }, false);
  
    source.addEventListener('message', function(e) {
      console.log("message", e.data);
    }, false);
  
    source.addEventListener('acc_data', function(e) {
      console.log("acc_data", e.data);
      melody_from_data.push(Number(e.data));

    }, false);
  }



let weights_1 = [
    [0.086, 0.072, 0.072, 0.177, 0.21, 0.11, 0.07],
    [0.17, 0.018, 0.11, 0.14, 0.29, 0.11, 0.007],
    [0.08, 0.15, 0.006, 0.286, 0.11, 0.21, 0.024],
    [0.286, 0.056, 0.084, 0.047, 0.259, 0.073, 0.003],
    [0.351, 0.041, 0.034, 0.167, 0.019, 0.16, 0.002],
    [0.114, 0.052, 0.062, 0.26, 0.265, 0.016, 0.032],
    [0.3, 0.05, 0.13, 0.07, 0.16, 0.29]
]

let major_progressions = [
    [1, 5, 6, 4],
    [1, 6, 4, 5],
    [2, 5, 1],
    [6, 2, 5, 1],
    [1, 5, 4, 4, 1, 5, 1, 5],
    [1, 4, 2, 5],
    [1, 5, 6, 3, 4, 1, 4, 5],
    [1, 4, 1, 5, 1, 4, 1, 5, 1],
    [1, 6, 2, 5],
    [5, 4, 1],
];

let major_circle_progressions = [
    [1, 3, 6, 2, 5, 1],
    [1, 3, 6, 2, 7, 1],
    [1, 3, 6, 4, 5, 1],
    [1, 3, 6, 4, 7, 1],
    [1, 6, 2, 5, 1],
    [1, 6, 2, 7, 1],
    [1, 6, 4, 5, 1],
    [1, 6, 4, 7, 1],
    [1, 2, 5, 1],
    [1, 2, 7, 1],
    [1, 4, 5, 1],
    [1, 4, 7, 1],
    [1, 5, 1],
    [1, 7, 1],
    [7, 3]
];

let major = [
    [1, 5, 6, 4],
    [1, 6, 4, 5],
    [2, 5, 1],
    [6, 2, 5, 1],
    [1, 5, 4, 4, 1, 5, 1, 5],
    [1, 4, 2, 5],
    [1, 5, 6, 3, 4, 1, 4, 5],
    [1, 4, 1, 5, 1, 4, 1, 5, 1],
    [1, 6, 2, 5],
    [5, 4, 1],
    [1, 3, 6, 2, 5, 1],
    [1, 3, 6, 2, 7, 1],
    [1, 3, 6, 4, 5, 1],
    [1, 3, 6, 4, 7, 1],
    [1, 6, 2, 5, 1],
    [1, 6, 2, 7, 1],
    [1, 6, 4, 5, 1],
    [1, 6, 4, 7, 1],
    [1, 2, 5, 1],
    [1, 2, 7, 1],
    [1, 4, 5, 1],
    [1, 4, 7, 1],
    [1, 5, 1],
    [1, 7, 1],
    [7, 3]
];

let minor_circle_progressions = [
    [1, 7, 3, 6, 2, 5, 1],
    [1, 7, 3, 6, 4, 5, 1],
    [1, 7, 3, 6, 2, 7, 1],
    [1, 7, 3, 6, 4, 7, 1],
    [1, 3, 6, 2, 5, 1],
    [1, 3, 6, 2, 7, 1],
    [1, 3, 6, 4, 5, 1],
    [1, 3, 6, 4, 7, 1],
    
]

let pop_progressions = [
    [1, 5, 6, 4, 1],
    [1, 6, 4, 5, 1],
    [6, 4, 1, 5, 6],
    [1, 4, 5, 1],
    [1, 5, 6, 1],
    [2, 5, 1, 2],
    [1, 4, 6, 5, 1],
]

let game_progressions = [
    [2, 5, 1, 2],
    [4, 3, 2, 1, 4],
    [1, 6, 7, 1],
    [1, 6, 2, 5, 1, 6, 2, 2, 1],
    [1, 5, 6, 5, 1],
    [1, 3, 6, 2, 5, 1],
    [1, 4, 6, 7, 1, 4, 1, 4, 1],
    [4, 5, 1, 6, 4],
    [1, 6, 7, 5],
    [1, 3, 1],
    
]

function generateFromData(){
    let prog = document.getElementById("progression").value;
    console.log(prog);
    let progression;

    if (prog=="classic") progression = major_circle_progressions;
    if (prog=="pop") progression = pop_progressions;
    if (prog=="game") progression = game_progressions;

    let newMelody = melody_from_data;
    document.getElementById("printmelody").innerHTML = newMelody;

    let harmony = "";
    
    let weights = calculate_weights(progression);
    // let weights = weights_1;
    for(let i = 0; i < 1; i++){
        harmony += suggest_harmony(newMelody, weights).toString() + "<BR/>";
    }


    document.getElementById("harmony").innerHTML = harmony;


}

function generateFromRandom(){
    let prog = document.getElementById("progression").value;
    console.log(prog);
    let progression;

    if (prog=="classic") progression = major_circle_progressions;
    if (prog=="pop") progression = pop_progressions;
    if (prog=="game") progression = game_progressions;

    
    var x = Number(document.getElementById("length").value);

    let newMelody = generate_melody(x);

    document.getElementById("printmelody").innerHTML = newMelody;

    let harmony = "";
    
    let weights = calculate_weights(progression);
    // let weights = weights_1;
    for(let i = 0; i < 1; i++){
        harmony += suggest_harmony(newMelody, weights).toString() + "<BR/>";
    }


    document.getElementById("harmony").innerHTML = harmony;

    
    // console.log(weights);
}


/**
 * On click of button, generates a new melody of a specified length (by text input) and several random harmonies.
 * Displays the melody and harmonies.
 */
function generateNew(){ //onclick of button, generates new melody and several random harmonies
    let prog = document.getElementById("progression").value;
    console.log(prog);
    let progression;

    if (prog=="classic") progression = major_circle_progressions;
    if (prog=="pop") progression = pop_progressions;
    if (prog=="game") progression = game_progressions;

    
    let user_melody = document.getElementById("melody").value;
    
    user_melody = user_melody.split(", ");
    for(let i = 0; i<user_melody.length; i++) user_melody[i] = Number(user_melody[i]);
    console.log(user_melody);

    document.getElementById("printmelody").innerHTML = user_melody;
    
    let harmony = "";
    
    let weights = calculate_weights(progression);
    // let weights = weights_1;
    for(let i = 0; i < 1; i++){
        harmony += suggest_harmony(user_melody, weights).toString() + "<BR/>";
    }

    document.getElementById("harmony").innerHTML = harmony;

    // console.log(weights);
}


/**
 * Generates a random melody of a specified length
 * @param {number} n Desired length of melody
 * @returns {Array} A random melody
 */
function generate_melody(n){ //create random melody line of length n
    let melody = [];
    for(let i = 0; i < n; i++){
        melody.push(Math.floor(Math.random() * 7)+1);
//        console.log(melody);
    }
    return melody;
}

/**
 * Given a melody, returns one possible random harmonic progression that would fit with that melody
 * 
 * @param {number} melody The given melody
 * @returns {number[]} An array of a possible harmonic progression
 */
function suggest_random_harmony(melody){ //suggest harmony given melody
    let harmonies = [[1, 4, 6], [2, 5, 7], [3, 6, 1], [4, 7, 2], [5, 1, 3], [6, 2, 4], [7, 3, 5]];
    let suggested = [];
    for(let note of melody){
        let idx = Math.floor(Math.random()*3);
        suggested.push(harmonies[note-1][idx]);
    }
    return suggested;
    
}

/**
 * Given a melody, suggest a harmony based on weighted probabilities
 * 
 * @param {number[]} melody Array of notes
 * @param {number[][]} weights Weighted probabilities
 * @returns {number[]} harmonic progression
 */
function suggest_harmony(melody, weights){
    let suggested = [melody[0]]; //start on same harmony as starting note ***CHANGE LATER****
    let sIdx = 0;
    console.log(weights);
    for(let i = 1; i < melody.length; i++){
        let note = melody[i]-1;
        // suggested.push(weights[note-1].indexOf(Math.max.apply(Math, weights[note-1]))+1);

        let prev = suggested[sIdx]-1; // previous harmony
        
        //get max probability of the three possible harmonies the next note belongs to
        //console.log("weights: " + weights[prev][(note) - 1], weights[prev][(note + 3) % 7 - 1], weights[prev][(note + 5) % 7 - 1]);
        let max = Math.max(weights[prev][note], weights[prev][(note + 3) % 7], weights[prev][(note + 5) % 7]);
        
        let next = weights[prev].indexOf(max)+1
        console.log("prev: " + prev + "   next: " + next + "   max: " + max);
        
        suggested.push(next);
        console.log("suggested: " + suggested);
        sIdx++;

    }
    return suggested;
    
}


/*
Given a melody and corresponding harmony (how to deal with rhythm?? how to reduce
    a piece to just basic melody andh harmony??), produce weighted probabilities
    for each corresponding harmony and note of melody.

    SEE AI NOTES

    **see score-transformer**
*/


/**
 * Updates a matrix of weighted probabilities for harmonic transitions given a new harmonic progression
 * 
 * @param {number[][]} weights A 2d array of numbers representing the current weight
 * @param {number[]} harmony A harmonic progression
 * @returns {number[][]} The 2d array of weights that have been updated
 */
function update_weights(weights, harmony){ 
    for(let i = 0; i < harmony.length-1; i++){
        weights[harmony[i]-1][harmony[i+1]-1] += (1 / harmony.length);
    }
}

/**
 * Calculates weighted probability for each harmonic transition where weights[i][j] is the probability of 
 * going TO harmony j FROM harmony i.
 * 
 * @returns {number[][]} 2d array of weights for harmonic transitions
 */
function calculate_weights(progression) {
    let weights = [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0]
    ];
    for(let prog of progression) {
        update_weights(weights, prog);        
    }

//normalize weights
    for(let i = 0; i < weights.length; i++){
        let sum = weights[i].reduce(add, 0);
        for(let j = 0; j < weights.length; j++){
            weights[i][j] /= sum;
        }
    }

    return weights;
}


function add(accumulator, current){
    return accumulator + current;
}




