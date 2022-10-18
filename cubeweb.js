console.log("Test");


function generateNew(){
    var x = Number(document.getElementById("length").value);
    let newMelody = generate_melody(x);
    console.log(newMelody); 
    
    document.getElementById("melody").innerHTML = newMelody;
    document.getElementById("harmony").innerHTML = suggest_harmony(newMelody);
}

function generate_melody(length){
    let melody = [];
    for(let i = 0; i < length; i++){
        melody.push(Math.floor(Math.random() * 7)+1);
//        console.log(melody);
    }
    return melody;
}

function suggest_harmony(melody){
    let harmonies = [[1, 4, 6], [2, 5, 7], [3, 6, 1], [4, 7, 2], [5, 1, 3], [6, 2, 4], [7, 3, 5]];
    let suggested = [];
    for(let note of melody){
        let idx = Math.floor(Math.random()*3);
//        console.log(idx, note, harmonies[note]);
        suggested.push(harmonies[note-1][idx]);
    }
    return suggested;
    
}
