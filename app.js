// NOTE: ONLY WORKS WITH A SERVER, CANNOT JUST OPEN THE INDEX FILE/HOST LOCALLY DUE THE NATURE OF GETFILE

let firstGesture = true;

let BPM = 154;
let BPMCALC = (60/BPM)/4;
let swing = -BPMCALC*0;
const selectedCol = "pink";
const unselectedCol = "grey";
const numButtons = 32;

let path = "sounds/1539/";

// will be filled later when we load the sounds
let hatSound, snareSound, kickSound, openhatSound, percSound, clapSound, extraSound = null;

// THE POSITION ON THE TRACK
let pos = 0;

// WHETHER THE TRACK IS PAUSED OR NOT
let paused = true;

/*

---- PAUSE BUTTON ----

*/

let pause = document.getElementById("pausebutton");

onkeydown = (e) => {
    if(e.code === "Space" || e.key === " " || e.keyCode === 32) {
        pauseFunction();
    }
}

pause.addEventListener("mousedown", function() {
    pauseFunction()
});

function pauseFunction() {
    // we need the user to make a gesture before the audio can play, so we start the page paused. the user will unpause and then we are allowed to load the audiocontext and all the samples and the rest of the website
    if(firstGesture) {
        firstGesture = false;
        audioCtx = new AudioContext();
        setupSamples().then((samples) => {
            hatSound = samples[0];
            snareSound = samples[1];
            kickSound = samples[2];
            openhatSound = samples[3];
            percSound = samples[4];
            clapSound = samples[5];
            extraSound = samples[6];
            start();
        });
    }

    pause.style.backgroundImage = paused ? "url('images/pause.png')" : "url('images/play.png')";
    paused = !paused;
}

/*

---- SET UP ALL THE DRUM BUTTONS ----

*/

// PLACE THEM ON THE PAGE -----------
function placeDrumButton(name) {
    for(var i = 0; i < numButtons; i++) {
        var div = document.createElement("div");
        div.id = name + i;
        div.className = name + "button drumbutton";
        document.getElementById(name + "row").appendChild(div);
        div.style.setProperty("outline-offset", "-4px");
        if(i%4 === 0 && i>0) { // place grid lines
            div.style.borderLeftColor = "white";
        }
        else if((i+1)%4 === 0 && i+1<numButtons) { // place grid lines
            div.style.borderRightColor = "white";
        }
    }
}

placeDrumButton("count");
placeDrumButton("hat");
placeDrumButton("snare");
placeDrumButton("kick");
placeDrumButton("openhat");
placeDrumButton("perc");
placeDrumButton("clap");
placeDrumButton("extra");

// ADD THE EVENTS -----------

function changeVisualState(btn) {
    if(btn.style.backgroundColor === selectedCol) {
        visualDeselect(btn);
    }
    else {
        visualSelect(btn);
    }
}

function visualSelect(btn) {
    btn.style.setProperty("outline", "2px dashed rgba(0,0,0,0.3)");
    btn.style.backgroundColor = selectedCol;
}

function visualDeselect(btn) {
    btn.style.setProperty("outline", "none");
    btn.style.backgroundColor = unselectedCol;
}

const counts = document.querySelectorAll(".countbutton");

counts.forEach(function(count) {
    count.addEventListener("mousedown", function(event) {

        // clears the entire countrow
        counts.forEach(function(count) {
            visualDeselect(count);
        });

        // selects the countrow button that was clicked
        pos = Array.from(counts).indexOf(event.target);
        let btn = document.getElementById("count" + pos);
        visualSelect(btn);
    });
});

// do this function for each row of drum buttons
function drumButtonEventAdder(buttonRow, name) {
    buttonRow.forEach(function(button) {
        // for dragging
        button.addEventListener("mouseover", function(event) {
            if(event.buttons == 1) {
                let i = Array.from(buttonRow).indexOf(event.target);
                let btn = document.getElementById(name + i);
        
                changeVisualState(btn);
            }
        });
        // for just clicking
        button.addEventListener("mousedown", function(event) {
            let i = Array.from(buttonRow).indexOf(event.target);
            let btn = document.getElementById(name + i);
        
            changeVisualState(btn);
        });
    });
}

const hats = document.querySelectorAll(".hatbutton");
drumButtonEventAdder(hats,"hat");

const snares = document.querySelectorAll(".snarebutton");
drumButtonEventAdder(snares,"snare");

const kicks = document.querySelectorAll(".kickbutton");
drumButtonEventAdder(kicks, "kick");

const openhats = document.querySelectorAll(".openhatbutton");
drumButtonEventAdder(openhats, "openhat");

const percs = document.querySelectorAll(".percbutton");
drumButtonEventAdder(percs, "perc");

const claps = document.querySelectorAll(".clapbutton");
drumButtonEventAdder(claps, "clap");

const extras = document.querySelectorAll(".extrabutton");
drumButtonEventAdder(extras, "extra");

/*

---- SET UP ALL THE SHORTCUT/OPTION BUTTONS ----

*/

function optionButtonEventAdder(fillButton, eraseButton, buttonRow) {
    fillButton.addEventListener("mousedown", function() {
        buttonRow.forEach(function(button) {
            visualSelect(button);
        });
    });
    fillButton.addEventListener("mouseover", function(event) {
        if(event.buttons == 1) {
            buttonRow.forEach(function(button) {
                visualSelect(button);
            });
        }
    });
    eraseButton.addEventListener("mousedown", function() {
        buttonRow.forEach(function(button) {
            visualDeselect(button);
        });
    });
    eraseButton.addEventListener("mouseover", function(event) {
        if(event.buttons == 1) {
            buttonRow.forEach(function(button) {
                visualDeselect(button);
            });
        }
    });
}

const hatFill = document.getElementById("hatfill");
const hatErase = document.getElementById("haterase");
optionButtonEventAdder(hatFill, hatErase, hats);

const snareFill = document.getElementById("snarefill");
const snareErase = document.getElementById("snareerase");
optionButtonEventAdder(snareFill, snareErase, snares);

const kickFill = document.getElementById("kickfill");
const kickErase = document.getElementById("kickerase");
optionButtonEventAdder(kickFill, kickErase, kicks);

const openhatFill = document.getElementById("openhatfill");
const openhatErase = document.getElementById("openhaterase");
optionButtonEventAdder(openhatFill, openhatErase, openhats);

const percFill = document.getElementById("percfill");
const percErase = document.getElementById("percerase");
optionButtonEventAdder(percFill, percErase, percs);

const clapFill = document.getElementById("clapfill");
const clapErase = document.getElementById("claperase");
optionButtonEventAdder(clapFill, clapErase, claps);

const extraFill = document.getElementById("extrafill");
const extraErase = document.getElementById("extraerase");
optionButtonEventAdder(extraFill, extraErase, extras);

/*

---- SET UP ALL THE SOUND STUFF ----

*/

// LARGELY ADAPTED FROM https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Advanced_techniques

let audioCtx = null;
let soundBuffer = null;

async function getFile(audioContext, filepath) {
    const response = await fetch(filepath);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    return audioBuffer;
}

async function setupSamples() {
    let paths = [];
    paths[0] = path + "hat.mp3";
    paths[1] = path + "snare.mp3";
    paths[2] = path + "kick.mp3";
    paths[3] = path + "openhat.mp3";
    paths[4] = path + "perc.mp3";
    paths[5] = path + "clap.mp3";
    paths[6] = path + "extra.mp3";

    let samples = [];

    for(let i=0; i<7; i++) {
        samples[i] = await getFile(audioCtx, paths[i]);
    }
    return samples;
}

function playSample(audioContext, audioBuffer, time) {
    const sampleSource = new AudioBufferSourceNode(audioContext, {buffer: audioBuffer});
    sampleSource.connect(audioContext.destination);
    sampleSource.start(time);
    return sampleSource;
}

// plays the audio for the column at that after delay milliseconds
function playSoundCol(num, delay) {
    if(document.getElementById("hat" + num).style.backgroundColor == selectedCol) {
        playSample(audioCtx,hatSound,delay);
    }
    if(document.getElementById("snare" + num).style.backgroundColor == selectedCol) {
        playSample(audioCtx,snareSound,delay);
    }
    if(document.getElementById("kick" + num).style.backgroundColor == selectedCol) {
        playSample(audioCtx,kickSound,delay);
    }
    if(document.getElementById("openhat" + num).style.backgroundColor == selectedCol) {
        playSample(audioCtx,openhatSound,delay);
    }
    if(document.getElementById("perc" + num).style.backgroundColor == selectedCol) {
        playSample(audioCtx,percSound,delay);
    }
    if(document.getElementById("clap" + num).style.backgroundColor == selectedCol) {
        playSample(audioCtx,clapSound,delay);
    }
    if(document.getElementById("extra" + num).style.backgroundColor == selectedCol) {
        playSample(audioCtx,extraSound,delay);
    }
}

// DONE SOUND STUFF

// THE DRUM LOOP ------

// LARGELY ADAPTED FROM https://web.dev/audio-scheduling/
// basically: roughly every 'lookahead' milliseconds, call the scheduler. the scheduler will update the page and call to play the sound at roughly the right delay so it has the right timing (lined up with the grid). this means that the overall timer will not have any delays or lag (compared to if we just used setInterval() by itself)

let interval = null; // for using setInterval(), clearInerval(), etc
let lookahead = 25.0; // how often the interval will be called (ms)

let nextHitTime = 0; // the time (since we opened the page) that we need to play the sounds at the current column

function start() {
    clearInterval(interval);
    interval = setInterval(() => {
        scheduler();
    }, lookahead);
}

function scheduler() {
    // we'll update based on the very precise timer in audioCtx
    while(nextHitTime < audioCtx.currentTime) {
        update();
    }
}

function scheduleHit(time) {
    playSoundCol(pos, time);
}

function update() {
    nextHitTime += BPMCALC + swing;
    swing = pos % 2 === 0 ? Math.abs(swing):-Math.abs(swing);

    if(paused == false) {

        if(pos >= numButtons) {
            pos = 0;
        }
        visualSelect(document.getElementById("count" + pos));
        
        let prev;
        if(pos > 0) {
            prev = pos - 1;
        }
        else {
            prev = numButtons - 1;
        }
        visualDeselect(document.getElementById("count" + prev));

        scheduleHit(nextHitTime);
        pos++;
    }
}

/*

---- SLIDERS ----

*/

let bpmslider = document.getElementById("bpmslider");
let bpmlabel = document.getElementById("bpmlabel");

bpmslider.oninput = function() {
    BPM = bpmslider.value;
    BPMCALC = (60/BPM)/4;
    swing = (swingslider.value/100)*-BPMCALC;
    bpmlabel.innerHTML = BPM + " BPM";
    start();
}

let swingslider = document.getElementById("swingslider");
let swinglabel = document.getElementById("swinglabel");

swingslider.oninput = function() {
    swing = (swingslider.value/100)*-BPMCALC;
    swinglabel.innerHTML = swingslider.value + "% swing";
    start();
}

/*

---- DROPDOWN ----

*/

let kitmenu = document.getElementById("kitmenu");

// change all the sound paths to whatevers in the dropdown menu
kitmenu.onchange = function() {

    path = "sounds/" + kitmenu.value + "/";

    // reload the samples
    setupSamples().then((samples) => {
        hatSound = samples[0];
        snareSound = samples[1];
        kickSound = samples[2];
        openhatSound = samples[3];
        percSound = samples[4];
        clapSound = samples[5];
        extraSound = samples[6];
        start();
    });
}

// TODO add volume slider