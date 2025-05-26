// === Full Experiment Code ===
// Author: ChatGPT
// Description: Card deck task with colored priming, decision screen, and reaction time measurement.

// -------------------------------
// Initialize jsPsych
// -------------------------------
const jsPsych = initJsPsych({
  show_progress_bar: false, // Don't show progress bar to participants
  on_finish: () => {
    // Show the data at the end (for testing)
    jsPsych.data.displayData();

    // Save data as CSV automatically
    const csv = jsPsych.data.get().csv();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'experiment_data.csv';
    a.click();
  }
});

// -------------------------------
// Define global variables
// -------------------------------
const trials = []; // This array will hold the full experiment timeline
const total_trials = 12; // Updated to 60 trials

// Generate 30 ambiguous + 30 risky trials and shuffle
let conditions = Array(total_trials / 2).fill('ambiguous').concat(Array(total_trials / 2).fill('risky'));
conditions = jsPsych.randomization.shuffle(conditions);

// Generate 20 red, 20 blue, 20 gray priming screens and shuffle
let priming_colors = Array(total_trials / 3).fill('red')
  .concat(Array(total_trials / 3).fill('blue'))
  .concat(Array(total_trials / 3).fill('gray'));
priming_colors = jsPsych.randomization.shuffle(priming_colors);

// -------------------------------
// Define all full trials
// -------------------------------
for (let i = 0; i < total_trials; i++) {
  const condition = conditions[i];
  const primingColor = priming_colors[i];
  const topLabel = condition === 'ambiguous' ? '?' : '50%';

  // === 1. Black screen for 500ms ===
  console.log("Running black screen with fixation...");
  trials.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: '<div style="width:100vw; height:100vh; background-color:black; display:flex; align-items:center; justify-content:center;"><div style="color:white; font-size:48px;">+</div></div>',
    choices: "NO_KEYS",
    trial_duration: 500
  });

  // === 2. Colored screen for 1000ms ===
  trials.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<div style="width:100vw; height:100vh; background-color:${primingColor};"></div>`,
    choices: "NO_KEYS",
    trial_duration: 1000,
    data: { priming_color: primingColor } // Record which color was shown
  });

  // === 3. Decision screen using improved visuals ===
  trials.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
      <style>
        .option-square {
          width: 70px;
          height: 70px;
          border-radius: 10px;
          border: 2px solid white;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .option-square:hover {
          transform: scale(1.1);
          box-shadow: 0 0 10px white;
        }
        .decision-label {
          text-align: center;
          margin-bottom: 10px;
          font-size: 20px;
        }
      </style>
      <div style="color:white; background-color:black; height:100vh; padding-top:80px; font-size:22px;">
        <div style="margin-bottom: 50px; text-align: center; font-size: 26px;">
          <p>20 cards</p>
          <div style="display: flex; justify-content: center; gap: 80px;">
            <div style="border: 2px solid red; width: 80px; height: 80px; font-size: 26px; line-height: 80px; border-radius: 10px;">${topLabel}</div>
            <div style="border: 2px solid blue; width: 80px; height: 80px; font-size: 26px; line-height: 80px; border-radius: 10px;">${topLabel}</div>
          </div>
        </div>
        <div style="display: flex; justify-content: center; gap: 160px;">
          <div>
            <div class="decision-label">I bet 10 Euro</div>
            <div style="display: flex; gap: 15px; justify-content: center;">
              <div id="bet_blue" class="option-square" style="background-color: blue;"></div>
              <div id="bet_red" class="option-square" style="background-color: red;"></div>
            </div>
          </div>
          <div>
            <div class="decision-label">I receive 3 Euro</div>
            <div style="display: flex; gap: 15px; justify-content: center;">
              <div id="receive_white_1" class="option-square" style="background-color: white; border: 2px solid black;"></div>
              <div id="receive_white_2" class="option-square" style="background-color: white; border: 2px solid black;"></div>
            </div>
          </div>
        </div>
      </div>
    `,
    choices: "NO_KEYS",
    trial_duration: 10000,
    data: {
      trial_index: i + 1,
      task: 'decision_trial',
      condition: condition,
      priming_color: primingColor
    },
    on_start: function(trial) {
      trial.data.start_time = performance.now();
    },
    on_load: function() {
      const startTime = performance.now();
      const buttons = ['bet_blue', 'bet_red', 'receive_white_1', 'receive_white_2'];

      // Attach click listeners to all custom buttons
      buttons.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          el.addEventListener('click', () => {
            const rt = performance.now() - startTime;
            jsPsych.finishTrial({
              response: id,
              rt: rt,
              condition: condition,
              priming_color: primingColor
            });
          });
        }
      });
    },
    on_finish: function(data) {
      if (data.response == null) {
        data.rt = 10000;
        data.response = 'no_response';
      }
    }
  });
}

// -------------------------------
// Start the experiment
// -------------------------------
jsPsych.run(trials);

