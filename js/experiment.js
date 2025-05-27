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
  stimulus: `
    <div style="font-size:30px;font-weight: bold;">
      Welcome to the experiment
    </div>
  `,
  choices: "NO_KEYS", 
  trial_duration: 2000

};


// -------------------------------
// ID
// -------------------------------
const enter_id_screen = {
  type: jsPsychSurveyText,
  questions: [
    {
      prompt: "Thank you for your willingness to participate in our experiment. Please enter your prolific ID.",
      name: 'participant_id',
      required: true
    }
  ],
  button_label: "Proceed to the experiment"
};

// -------------------------------
// CONSENT
// -------------------------------
const consent_screen = {
  // Use the HTML + button response plugin
  type: jsPsychHtmlButtonResponse,

  // HTML content displayed to the participant
  stimulus: `
    <!-- Wrapper div with overall font size, spacing, and left alignment -->
    <div style="font-size:22px; margin-bottom:30px; text-align: left;">

      <!-- Centered and bold title -->
      <div style="text-align: center; font-weight: bold; font-size: 26px; margin-bottom: 20px;">
        Consent to Participate in Research
      </div>

      <!-- Main body text with bold section headers using <strong> -->
      You are invited to participate in a research study.<br><br>

      <strong>Duration:</strong> The study should last about 5 minutes.<br>
      <strong>Risks:</strong> There are no physical or emotional risks involved.<br>
      <strong>Confidentiality:</strong> Your data will be recorded, analyzed, and kept on file for the sake of possible future analysis.<br>
      We will do our best to maintain confidentiality by keeping your data under lock, and by separating your identity from the data when coding and analyzing them so that others will not be able to connect you with your data.<br>
      <strong>Your rights:</strong> Your participation is voluntary and you have the right to withdraw your consent or discontinue participation at any time. Your privacy will be maintained in all published and written data resulting from this study.<br><br>

      <!-- Final instruction -->
      For more information, you can email tom.mushkat@mail.huji.ac.il.<br>
      Click on the "I agree" button to participate.
    </div>
  `,

  // Button options — single choice: "I agree"
  choices: ['I agree'],

  // Custom button appearance (padding, font size)
  button_html: (choice) =>
    `<button class="jspsych-btn" style="font-size:20px; padding:12px 24px;">${choice}</button>`
};

// -------------------------------
// Instructions
// -------------------------------
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
const total_trials = 6;

// Define three conditions: ambiguous, full_risky, part_risky
let conditions = Array(total_trials / 3).fill('ambiguous')
  .concat(Array(total_trials / 3).fill('full_risky'))
  .concat(Array(total_trials / 3).fill('part_risky'));
conditions = jsPsych.randomization.shuffle(conditions);

let priming_colors = Array(total_trials / 3).fill('red')
  .concat(Array(total_trials / 3).fill('blue'))
  .concat(Array(total_trials / 3).fill('gray'));
priming_colors = jsPsych.randomization.shuffle(priming_colors);

for (let i = 0; i < total_trials; i++) {
  const condition = conditions[i];
  const primingColor = priming_colors[i];

  // Define top labels based on condition
  let blueLabel = '?';
  let redLabel = '?';

  if (condition === 'full_risky') {
    blueLabel = '50%';
    redLabel = '50%';
  }

  if (condition === 'part_risky') {
    const options = [10, 20, 30, 40, 60, 70, 80, 90];
    const sampled = jsPsych.randomization.sampleWithoutReplacement(options, 1)[0];
    blueLabel = `${sampled}%`;
    redLabel = `${100 - sampled}%`;
  }

  // Fixation cross
  trials.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: '<div style="width:100vw; height:100vh; background-color:black; display:flex; align-items:center; justify-content:center;"><div style="color:white; font-size:48px;">+</div></div>',
    choices: "NO_KEYS",
    trial_duration: 500
  });

 // Color priming screen
  trials.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<div style="width:100vw; height:100vh; background-color:${primingColor};"></div>`,
    choices: "NO_KEYS",
    trial_duration: 500,
    data: { priming_color: primingColor }
  });

  // Decision screen
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
            <div style="border: 2px solid blue; width: 80px; height: 80px; font-size: 26px; line-height: 80px; border-radius: 10px;">${blueLabel}</div>
            <div style="border: 2px solid red; width: 80px; height: 80px; font-size: 26px; line-height: 80px; border-radius: 10px;">${redLabel}</div>
          </div>
        </div>
        <div style="display: flex; justify-content: center; gap: 160px;">
          <div>
            <div class="decision-label">I bet 1.5 Pound</div>
            <div style="display: flex; gap: 15px; justify-content: center;">
              <div id="bet_blue" class="option-square" style="background-color: blue;"></div>
              <div id="bet_red" class="option-square" style="background-color: red;"></div>
            </div>
          </div>
          <div>
            <div class="decision-label">I receive 0.5 Pound</div>
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
      priming_color: primingColor,
      blueLabel: blueLabel,
      redLabel: redLabel

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
              priming_color: primingColor,
              blueLabel: blueLabel,
              redLabel: redLabel
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
// answer qeustions screen
// -------------------------------
const answer_questions = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<div style="font-size:30px;">Please answer the following questions</div>',
  choices: "NO_KEYS", 
  trial_duration: 2000

};

// -------------------------------
// Honesty Check
// -------------------------------
const Honesty = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `
    <div style="font-size:22px; margin-bottom:30px;">
      In your honest opinion, should we use your data in our analysis?<br> This is not related to how well you performed, and will not affect your payment for participation, but whether you put in a reasonable effort.
    </div>
  `,
  choices: ['Yes, I put in a reasonable effort', 'Maybe, I was a little distracted', "No, I really wasn't paying attention"],
  button_html: (choice) =>
    `<button class="jspsych-btn" style="font-size:20px; padding:12px 24px; margin: 6px;">${choice}</button>`,
  on_finish: function(data) {
    // You can use data.response to handle branching logic later if needed
    console.log('Consent choice:', data.response); // 0, 1, or 2
  }
};

// -------------------------------
// Consecutively Check
// -------------------------------
const Consecutively = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `
    <div style="font-size:22px; margin-bottom:30px;">
      Did you complete the experiment consecutively?
    </div>
  `,
  choices: ['Yes', "No"],
  button_html: (choice) =>
    `<button class="jspsych-btn" style="font-size:20px; padding:12px 24px; margin: 6px;">${choice}</button>`,
  on_finish: function(data) {
    // You can use data.response to handle branching logic later if needed
    console.log('Consent choice:', data.response); // 0, 1, or 2
  }
};

// -------------------------------
// Disturbances Check
// -------------------------------
const Disturbances = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `
    <div style="font-size:22px; margin-bottom:30px;">
      While completing the experiment, did you experience any external disturbances?
    </div>
  `,
  choices: ['Yes', "No"],
  button_html: (choice) =>
    `<button class="jspsych-btn" style="font-size:20px; padding:12px 24px; margin: 6px;">${choice}</button>`,
  on_finish: function(data) {
    // You can use data.response to handle branching logic later if needed
    console.log('Consent choice:', data.response); // 0, 1, or 2
  }
};

// -------------------------------
// Alone Check
// -------------------------------
const Alone = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `
    <div style="font-size:22px; margin-bottom:30px;">
      Did you fill in this experiment alone or with someone else?
    </div>
  `,
  choices: ['Alone', "With someone else"],
  button_html: (choice) =>
    `<button class="jspsych-btn" style="font-size:20px; padding:12px 24px; margin: 6px;">${choice}</button>`,
  on_finish: function(data) {
    // You can use data.response to handle branching logic later if needed
    console.log('Consent choice:', data.response); // 0, 1, or 2
  }
};

// -------------------------------
// Purpose
// -------------------------------
const Purpose = {
  type: jsPsychSurveyText,
  questions: [
    {
      prompt: "What do you think was the purpose of the study?",
      name: 'study_purpose',
      required: true
    }
  ],
  button_label: "Proceed to the experiment"
};


// -------------------------------
// demographics
// -------------------------------
// -------------------------------
// Gender
// -------------------------------
const gender = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `
    <div style="font-size:22px; margin-bottom:30px;">
      Please enter your gender:
    </div>
  `,
  choices: ['Man', 'Woman', 'Prefer not to say'],
  button_html: (choice) =>
    `<button class="jspsych-btn" style="font-size:20px; padding:12px 24px; margin: 6px;">${choice}</button>`,
  on_finish: function(data) {
    // You can use data.response to handle branching logic later if needed
    console.log('Consent choice:', data.response); // 0, 1, or 2
  }
};

// -------------------------------
// Attention Check
// -------------------------------
const Attention = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `
    <div style="font-size:22px; margin-bottom:30px;">
      Please mark "Maybe":
    </div>
  `,
  choices: ['Yes', 'No', 'Maybe'],
  button_html: (choice) =>
    `<button class="jspsych-btn" style="font-size:20px; padding:12px 24px; margin: 6px;">${choice}</button>`,
  on_finish: function(data) {
    // You can use data.response to handle branching logic later if needed
    console.log('Consent choice:', data.response); // 0, 1, or 2
  }
};


// -------------------------------
// Age
// -------------------------------
let valid_age = false;

const enter_age_screen = {
  type: jsPsychSurveyText,
  questions: [
    {
      prompt: "Please enter your age:",
      name: "age",
      required: true,
      input_type: "number",
      textbox_columns: 5,
      placeholder: "e.g. 25"
    }
  ],
  button_label: "Proceed",
  on_finish: function(data) {
    const response = data.response.age;
    const numericAge = Number(response);
    valid_age = !isNaN(numericAge) && numericAge >= 0 && numericAge <= 100;
  }
};

const retry_age_screen = {
  timeline: [enter_age_screen],
  loop_function: function() {
    if (!valid_age) {
      alert("Please enter your in a valid number.");
      return true; // repeat screen
    }
    return false; // proceed
  }
};

// -------------------------------
// Start the experiment
// -------------------------------
jsPsych.run([welcome_screen, enter_id_screen, consent_screen, instructions
  , ...trials
  , answer_questions, Honesty, Consecutively, Disturbances, Alone, Purpose
  , gender, Attention, retry_age_screen]);
