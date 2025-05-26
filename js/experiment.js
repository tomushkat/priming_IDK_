// === Full Experiment Code ===
// Author: ChatGPT
// Description: Card deck task with colored priming, decision screen, and reaction time measurement.

// -------------------------------
// Initialize jsPsych
// -------------------------------
const jsPsych = initJsPsych({
  show_progress_bar: false,
  on_finish: () => {
    jsPsych.data.displayData();
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
// Instruction screens
// -------------------------------
const welcome_screen = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<div style="font-size:30px;">Welcome to the experiment</div>',
  choices: "NO_KEYS", 
  trial_duration: 2000

};

const enter_id_screen = {
  type: jsPsychSurveyText,
  questions: [
    {
      prompt: "Please enter your ID:",
      name: 'participant_id',
      required: true
    }
  ],
  button_label: "Proceed to the experiment"
};

const consent_screen = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `
    <div style="font-size:22px; margin-bottom:30px;">
      Please read the participation rules and mark that you agree to continue.
    </div>
  `,
  choices: ['I agree'],
  button_html: (choice) => `<button class="jspsych-btn" style="font-size:20px; padding:12px 24px;">${choice}</button>`
};


const instructions = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `
    <div style="font-size:22px; margin-bottom:30px;">
      Those are the instructions
    </div>
  `,
  choices: ['Proceed to the experiment'],
  button_html: (choice) => `<button class="jspsych-btn" style="font-size:20px; padding:12px 24px;">${choice}</button>`
};



// -------------------------------
// Define global variables
// -------------------------------
const trials = [];
const total_trials = 12;

let conditions = Array(total_trials / 2).fill('ambiguous').concat(Array(total_trials / 2).fill('risky'));
conditions = jsPsych.randomization.shuffle(conditions);

let priming_colors = Array(total_trials / 3).fill('red')
  .concat(Array(total_trials / 3).fill('blue'))
  .concat(Array(total_trials / 3).fill('gray'));
priming_colors = jsPsych.randomization.shuffle(priming_colors);

for (let i = 0; i < total_trials; i++) {
  const condition = conditions[i];
  const primingColor = priming_colors[i];
  const topLabel = condition === 'ambiguous' ? '?' : '50%';

  trials.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: '<div style="width:100vw; height:100vh; background-color:black; display:flex; align-items:center; justify-content:center;"><div style="color:white; font-size:48px;">+</div></div>',
    choices: "NO_KEYS",
    trial_duration: 500
  });

  trials.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<div style="width:100vw; height:100vh; background-color:${primingColor};"></div>`,
    choices: "NO_KEYS",
    trial_duration: 500,
    data: { priming_color: primingColor }
  });

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
jsPsych.run([welcome_screen, enter_id_screen, consent_screen, instructions, ...trials]);
