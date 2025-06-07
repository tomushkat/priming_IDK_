// === Full Experiment Code ===
// Author: Tom Mushkat & ChatGPT 4o
// Description: Card deck task with colored priming, decision screen, and reaction time measurement.


// -------------------------------
// Initialize jsPsych with dynamic on_finish
// -------------------------------
const jsPsych = initJsPsych({
  show_progress_bar: false,
  on_finish: handleExperimentFinish
});

if (sw_pavlovia) {

  var pavlovia_init = {
      type: "pavlovia",
      command: "init"
    }

  var pavlovia_finish = {
      type: "pavlovia",
      command: "finish"  
  }

  };
// -------------------------------
// Welcome screens
// -------------------------------
const welcome_screen = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <div style="font-size:30px;font-weight: bold;">
      Welcome to the experiment
    </div>
  `,
  choices: "NO_KEYS", 
  trial_duration: welcome_screen_duration
};


// -------------------------------
// ID test tes test
// -------------------------------

if (sw_pavlovia) {
      // Deployment mode: redirect to Prolific
    const participant_id = jsPsych.data.getURLVariable('participant');
    total_trials = pavlovia_trials
    jsPsych.data.addProperties({ participant_id });
}; 

const enter_id_screen = {
  type: jsPsychSurveyText,
  questions: [
    {
      prompt: "Thank you for your willingness to participate in our experiment. Please enter your prolific ID.",
      name: 'participant_id_manual',
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

const colorOnLeft = jsPsych.randomization.sampleWithoutReplacement([true, false], 1)[0];
jsPsych.data.addProperties({ colorOnLeft: colorOnLeft });
let key_map;

if (colorOnLeft) {
  // Colorful on LEFT
  key_map = {
    'a': 'bet_blue',
    's': 'bet_red',
    'k': 'receive_white_1',
    'l': 'receive_white_2'
  };
} else {
  // Colorful on RIGHT
  key_map = {
    'a': 'receive_white_1',
    's': 'receive_white_2',
    'k': 'bet_blue',
    'l': 'bet_red'
  };
}



if (!sw_pavlovia) {
  // If in deployment mode, add participant ID from URL
  console.log("Colorful squares are on the " + (colorOnLeft ? "left" : "right") + " side for THIS participant.");
}


// -------------------------------
// Instructions
// -------------------------------
const instructions = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `
    <div style="background-color:#222; color:white; padding:40px; font-size:18px; line-height:1.6; text-align:left;">

      <p><strong>The experiment will last about 5 minutes.</strong></p>

      <p>In this experiment, you will make a series of choices between a gamble with an uncertain payoff and a certain payoff. A sample screen is as follows:</p>

      <div style="display: flex; justify-content: center; gap: 40px; margin: 30px 0;">
        <!-- Full Risky Sample -->
        <div style="background-color:black; padding:20px; border-radius:10px;">
          <div style="text-align: center; color: white; font-size: 20px; margin-bottom: 20px;">20 cards</div>
          <div style="display: flex; justify-content: center; gap: 40px; margin-bottom: 20px;">
            <div style="border: 2px solid blue; width: 60px; height: 60px; color: white; font-size: 20px; line-height: 60px; text-align: center;">50%</div>
            <div style="border: 2px solid red; width: 60px; height: 60px; color: white; font-size: 20px; line-height: 60px; text-align: center;">50%</div>
          </div>
          <div style="display: flex; justify-content: center; gap: 60px;">
            <div style="text-align: center;">
              <div style="font-size: 14px; margin-bottom: 8px;">I bet 1.5 Pound</div>
              <div style="display: flex; justify-content: center; gap: 10px;">
                <div style="width: 30px; height: 30px; background-color: blue; border: 2px solid white;"></div>
                <div style="width: 30px; height: 30px; background-color: red; border: 2px solid white;"></div>
              </div>
            </div>
            <div style="text-align: center;">
              <div style="font-size: 14px; margin-bottom: 8px;">I receive 0.5 Pound</div>
               <div style="display: flex; justify-content: center; gap: 10px;">
                <div style="width: 30px; height: 30px; background-color: white; border: 2px solid black;"></div>
                <div style="width: 30px; height: 30px; background-color: white; border: 2px solid black;"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Ambiguous Sample -->
        <div style="background-color:black; padding:20px; border-radius:10px;">
          <div style="text-align: center; color: white; font-size: 20px; margin-bottom: 20px;">20 cards</div>
          <div style="display: flex; justify-content: center; gap: 40px; margin-bottom: 20px;">
            <div style="border: 2px solid blue; width: 60px; height: 60px; color: white; font-size: 20px; line-height: 60px; text-align: center;">?</div>
            <div style="border: 2px solid red; width: 60px; height: 60px; color: white; font-size: 20px; line-height: 60px; text-align: center;">?</div>
          </div>
          <div style="display: flex; justify-content: center; gap: 60px;">
            <div style="text-align: center;">
              <div style="font-size: 14px; margin-bottom: 8px;">I bet 1.5 Pound</div>
               <div style="display: flex; justify-content: center; gap: 10px;">
                <div style="width: 30px; height: 30px; background-color: blue; border: 2px solid white;"></div>
                <div style="width: 30px; height: 30px; background-color: red; border: 2px solid white;"></div>
              </div>
            </div>
            <div style="text-align: center;">
              <div style="font-size: 14px; margin-bottom: 8px;">I receive 0.5 Pound</div>
               <div style="display: flex; justify-content: center; gap: 10px;">
                <div style="width: 30px; height: 30px; background-color: white; border: 2px solid black;"></div>
                <div style="width: 30px; height: 30px; background-color: white; border: 2px solid black;"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p>In each card deck, there are 20 cards. The symbol on each card indicates the probability of drawing each type of card (blue or red) from the deck. In the left example, there is a 50% chance of drawing a blue card and a 50% chance of drawing a red card. In the right example, the probability of drawing a blue (or red) card is unknown.</p>

      <p>You will be asked to choose a color to bet on or to receive a guaranteed amount. The pound amount above the lower cards shows the amount you will earn if the selected color matches the card that is drawn. At the end of the experiment, one of your trials will be randomly selected, and you will be rewarded accordingly.</p>

      <p style="margin-top: 30px;"><strong>When you are ready to begin, press “Proceed”.</strong></p>
    </div>
  `,
  choices: ['Proceed'],
  button_html: (choice) =>
    `<button class="jspsych-btn" style="font-size:20px; padding:12px 24px; margin-top:20px;">${choice}</button>`
};



// -------------------------------
// Define global variables
// -------------------------------
const trials = [];

// Define three conditions: ambiguous, full_risky, part_risky
let conditions = Array(total_trials / 3).fill('ambiguous')
  .concat(Array(total_trials / 3).fill('full_risky'))
  .concat(Array(total_trials / 3).fill('part_risky'));
conditions = jsPsych.randomization.shuffle(conditions);

let priming_colors = Array(total_trials / 3).fill('red')
  .concat(Array(total_trials / 3).fill('blue'))
  .concat(Array(total_trials / 3).fill('black'));
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
    const options = part_risky_options ;
    const sampled = jsPsych.randomization.sampleWithoutReplacement(options, 1)[0];
    blueLabel = `${sampled}%`;
    redLabel = `${100 - sampled}%`;
  }

  // Fixation cross
  trials.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: '<div style="width:100vw; height:100vh; background-color:black; display:flex; align-items:center; justify-content:center;"><div style="color:white; font-size:48px;">+</div></div>',
    choices: "NO_KEYS",
    trial_duration: FIXATION_DURATION
  });

 // Color priming screen
  trials.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<div style="width:100vw; height:100vh; background-color:${primingColor};"></div>`,
    choices: "NO_KEYS",
    trial_duration: PRIMING_DURATION,
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

      ${
      colorOnLeft
      // Colorful on LEFT, White on RIGHT
      ? `
         <div style="display: flex; justify-content: center; gap: 160px;">
      <!-- Colorful LEFT -->
      <div>
        <div class="decision-label">I bet 1.5 Pound</div>
        <div style="display: flex; gap: 15px; justify-content: center;">
          <div style="display: flex; flex-direction: column; align-items: center;">
            <div class="option-square" style="background-color: blue;"></div>
            <div style="color:white; margin-top:6px; font-size:24px;">A</div>
          </div>
          <div style="display: flex; flex-direction: column; align-items: center;">
            <div class="option-square" style="background-color: red;"></div>
            <div style="color:white; margin-top:6px; font-size:24px;">S</div>
          </div>
        </div>
      </div>
      <!-- White RIGHT -->
      <div>
        <div class="decision-label">I receive 0.5 Pound</div>
        <div style="display: flex; gap: 15px; justify-content: center;">
          <div style="display: flex; flex-direction: column; align-items: center;">
            <div class="option-square" style="background-color: white; border: 2px solid black;"></div>
            <div style="color:white; margin-top:6px; font-size:24px;">K</div>
          </div>
          <div style="display: flex; flex-direction: column; align-items: center;">
            <div class="option-square" style="background-color: white; border: 2px solid black;"></div>
            <div style="color:white; margin-top:6px; font-size:24px;">L</div>
          </div>
        </div>
      </div>
    </div>
    `
    // White LEFT, Colorful RIGHT
    : `
    <div style="display: flex; justify-content: center; gap: 160px;">
      <!-- White LEFT -->
      <div>
        <div class="decision-label">I receive 0.5 Pound</div>
        <div style="display: flex; gap: 15px; justify-content: center;">
          <div style="display: flex; flex-direction: column; align-items: center;">
            <div class="option-square" style="background-color: white; border: 2px solid black;"></div>
            <div style="color:white; margin-top:6px; font-size:24px;">A</div>
          </div>
          <div style="display: flex; flex-direction: column; align-items: center;">
            <div class="option-square" style="background-color: white; border: 2px solid black;"></div>
            <div style="color:white; margin-top:6px; font-size:24px;">S</div>
          </div>
        </div>
      </div>
      <!-- Colorful RIGHT -->
      <div>
        <div class="decision-label">I bet 1.5 Pound</div>
        <div style="display: flex; gap: 15px; justify-content: center;">
          <div style="display: flex; flex-direction: column; align-items: center;">
            <div class="option-square" style="background-color: blue;"></div>
            <div style="color:white; margin-top:6px; font-size:24px;">K</div>
          </div>
          <div style="display: flex; flex-direction: column; align-items: center;">
            <div class="option-square" style="background-color: red;"></div>
            <div style="color:white; margin-top:6px; font-size:24px;">L</div>
          </div>
        </div>
      </div>
    </div>
    `
      }  
        </div>
    </div>
    `,
    choices: ['a', 's', 'k', 'l'],
    trial_duration: Trial_DURATION,
    data: {
      trial_index: i + 1,
      task: 'decision_trial',
      condition: condition,
      priming_color: primingColor,
      blueLabel: blueLabel,
      redLabel: redLabel,
      colorOnLeft: colorOnLeft // Save mapping in trial data

    },
    on_start: function(trial) {
      trial.data.start_time = performance.now();
    },
    on_finish: function(data) {
      const key = data.response;
      data.choice = key_map[key];
      data.key_pressed = key;
      if (!data.choice) data.choice = 'no_response';
      if (!data.rt) data.rt = Trial_DURATION;
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
  trial_duration: answer_qeustions_screen_duration

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
    valid_age = !isNaN(numericAge) && numericAge >= age_min && numericAge <= age_max;
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

const end_screen = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
      <div style="text-align: center; font-weight: bold; font-size: 26px; margin-bottom: 20px;">
        Than you for participating in the experiment!
      </div>
  `,
  choices: "NO_KEYS", 
  trial_duration: welcome_screen_duration
};
     

// -------------------------------
// Start the experiment
// -------------------------------

  if (sw_pavlovia) {

    jsPsych.run([pavlovia_init, welcome_screen, consent_screen, instructions
      , ...trials
      , answer_questions, Honesty, Consecutively, Disturbances, Alone, Purpose
      , gender, Attention, retry_age_screen, pavlovia_finish, end_screen]);
  } else {

    jsPsych.run([welcome_screen, consent_screen, instructions
    , ...trials
    , answer_questions, Honesty, Consecutively, Disturbances, Alone, Purpose
    , gender, Attention, retry_age_screen, end_screen]);

  };