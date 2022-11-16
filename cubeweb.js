//import * as Tone from 'tone'

console.log("Test");

//create a synth and connect it to the main output (your speakers)
//const synth = new Tone.Synth().toDestination();

//play a middle 'C' for the duration of an 8th note
//synth.triggerAttackRelease("C4", "8n");


function generateNew(){ //onclick of button, generates new melody and several random harmonies
    var x = Number(document.getElementById("length").value);
    let newMelody = generate_melody(x);
    console.log(newMelody);
    
    document.getElementById("melody").innerHTML = newMelody;
    
    let harmony = "";
    
    for(let i = 0; i < 5; i++){
        harmony += suggest_harmony(newMelody).toString() + "<BR/>";
    }


    document.getElementById("harmony").innerHTML = harmony;
}


/**
   * Generates a random melody of a specified length
   *
   * @param {number} n The desired length of the melody.
   * @return {Array} A random melody of length n.
   */
function generate_melody(n){ //create random melody line of length n
    let melody = [];
    for(let i = 0; i < n; i++){
        melody.push(Math.floor(Math.random() * 7)+1);
//        console.log(melody);
    }
    return melody;
}

function suggest_harmony(melody){ //suggest harmony given melody
    let harmonies = [[1, 4, 6], [2, 5, 7], [3, 6, 1], [4, 7, 2], [5, 1, 3], [6, 2, 4], [7, 3, 5]];
    let suggested = [];
    for(let note of melody){
        let idx = Math.floor(Math.random()*3);
//        console.log(idx, note, harmonies[note]);
        suggested.push(harmonies[note-1][idx]);
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
function update_weights(weights, harmony){ 
    //traverse melody with associated harmony - compute probability of next harmony given current
    // let weights = [[0, 0, 0, 0, 0, 0, 0],
    //                 [0, 0, 0, 0, 0, 0, 0],
    //                 [0, 0, 0, 0, 0, 0, 0],
    //                 [0, 0, 0, 0, 0, 0, 0],
    //                 [0, 0, 0, 0, 0, 0, 0],
    //                 [0, 0, 0, 0, 0, 0, 0],
    //                 [0, 0, 0, 0, 0, 0, 0]];

    for(let i = 0; i < harmony.length-1; i++){
        weights[i][i+1] += float(harmony[i]) / harmony.length;
    }


}
