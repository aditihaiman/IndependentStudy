//import * as Tone from 'tone'

console.log("Test");

//create a synth and connect it to the main output (your speakers)
//const synth = new Tone.Synth().toDestination();

//play a middle 'C' for the duration of an 8th note
//synth.triggerAttackRelease("C4", "8n");


//list of major chord progressions
//taken from wikipedia: https://en.wikipedia.org/wiki/List_of_chord_progressions
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
    [1, 7, 1]
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
    [1, 7, 1]
];

function generateFromRandom(){
    var x = Number(document.getElementById("length").value);

    let newMelody = generate_melody(x);

    document.getElementById("printmelody").innerHTML = newMelody;

    let harmony = "";
    
    let weights = calculate_weights();
    for(let i = 0; i < 1; i++){
        harmony += suggest_harmony(newMelody, weights).toString() + "<BR/>";
    }


    document.getElementById("harmony").innerHTML = harmony;

    
    console.log(weights);
}


/**
 * On click of button, generates a new melody of a specified length (by text input) and several random harmonies.
 * Displays the melody and harmonies.
 */
function generateNew(){ //onclick of button, generates new melody and several random harmonies
    let user_melody = document.getElementById("melody").value;
    
    user_melody = user_melody.split(", ");
    for(let i = 0; i<user_melody.length; i++) user_melody[i] = Number(user_melody[i]);
    console.log(user_melody);

    document.getElementById("printmelody").innerHTML = user_melody;
    
    let harmony = "";
    
    let weights = calculate_weights();
    for(let i = 0; i < 1; i++){
        harmony += suggest_harmony(user_melody, weights).toString() + "<BR/>";
    }


    document.getElementById("harmony").innerHTML = harmony;

    
    console.log(weights);
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
function calculate_weights() {
    let weights = [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0]
    ];
    for(let progression of major_circle_progressions) {
        update_weights(weights, progression);        
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


