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

var pavlovia_init = {
    type: "pavlovia",
    command: "init"
    }

 var pavlovia_finish = {
    type: "pavlovia",
    command: "finish"  
  }
// -------------------------------
// Welcome screens
// -------------------------------
const welcome_screen = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <div style="font-size:30px;font-weight: bold;">
      Welcome to the study
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
      prompt: "Thank you for your willingness to participate in our study. Please enter your prolific ID.",
      name: 'participant_id_manual',
      required: true
    }
  ],
  button_label: "Proceed to the study"
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

      <strong>Duration:</strong> The study should last about 10 minutes.<br>
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

      <p> In this study, you will make a series of choices between <strong>placing a bet</string> (with an uncertain payoff) and <string>receiving a fixed payoff</strong>.
          You will encounter different card decks, each containing 20 cards that are either blue or red.
          Below are two examples of how the screen might appear during the study:</p>

      <div style="display: flex; justify-content: center; gap: 40px; margin: 30px 0;">
        <!-- Full Risky Sample -->
        <div style="background-color:black; padding:20px; border-radius:10px;">
          <div style="text-align: center; color: white; font-size: 20px; margin-bottom: 20px;">20 cards</div>
          <!--<div style="display: flex; justify-content: center; gap: 40px; margin-bottom: 20px;"> -->
          <div style="display: flex; flex-direction: column; align-items: center; gap: 16px; margin-bottom: 20px;">
            <div style="border: 2px solid blue; width: 60px; height: 60px; color: white; font-size: 20px; line-height: 60px; text-align: center;">10</div>
            <div style="border: 2px solid red; width: 60px; height: 60px; color: white; font-size: 20px; line-height: 60px; text-align: center;">10</div> 
          </div>
          <div style="display: flex; justify-content: center; gap: 60px;">
            <div style="text-align: center;">
              <div style="font-size: 14px; margin-bottom: 8px;">I bet 1.25 Dollars</div>
              <div style="display: flex; justify-content: center; gap: 10px;">
                <div style="width: 30px; height: 30px; background-color: blue; border: 2px solid white;"></div>
                <div style="width: 30px; height: 30px; background-color: red; border: 2px solid white;"></div>
              </div>
            </div>
            <div style="text-align: center;">
              <div style="font-size: 14px; margin-bottom: 8px;">I receive 0.5 Dollars</div>
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
          <!--<<div style="display: flex; justify-content: center; gap: 40px; margin-bottom: 20px;" -->
          <div style="display: flex; flex-direction: column; align-items: center; gap: 16px; margin-bottom: 20px;">
            <div style="border: 2px solid blue; width: 60px; height: 60px; color: white; font-size: 20px; line-height: 60px; text-align: center;">?</div>
            <div style="border: 2px solid red; width: 60px; height: 60px; color: white; font-size: 20px; line-height: 60px; text-align: center;">?</div>
          </div>
          <div style="display: flex; justify-content: center; gap: 60px;">
            <div style="text-align: center;">
              <div style="font-size: 14px; margin-bottom: 8px;">I bet 1.25 Dollars</div>
               <div style="display: flex; justify-content: center; gap: 10px;">
                <div style="width: 30px; height: 30px; background-color: blue; border: 2px solid white;"></div>
                <div style="width: 30px; height: 30px; background-color: red; border: 2px solid white;"></div>
              </div>
            </div>
            <div style="text-align: center;">
              <div style="font-size: 14px; margin-bottom: 8px;">I receive 0.5 Dollars</div>
               <div style="display: flex; justify-content: center; gap: 10px;">
                <div style="width: 30px; height: 30px; background-color: white; border: 2px solid black;"></div>
                <div style="width: 30px; height: 30px; background-color: white; border: 2px solid black;"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p> As shown in the left example, sometimes you'll see an equal number of blue and red cards (e.g., 10 of each), indicating a known probability (e.g., a 50% chance for each color).
          In other cases, like the right example, a question mark (?) will appear on the cards, meaning that the probability of drawing a blue or red card is unknown.
          For each choice, you'll either select a color to bet on (this is "I bet") or choose to receive a guaranteed amount (this is "I receive").
          If you choose to bet, the dollar ($) amount shown above the matching color boxes is what you'll win if the card drawn matches your chosen color.
          If it doesn't match, you'll win nothing for that bet. At the end of the study, one of your choices from all the trials will be randomly selected to determine your final payment.
          In any case, you will receive your full payment for participation. The bonus will be decided based on the card drawn and the decision you have made in the selected trial. For an example, see the next screen.</p>

      <p style="margin-top: 30px;"><strong>When you are ready to begin, press “Proceed”.</strong></p>
    </div>
  `,
  choices: ['Proceed'],
  button_html: (choice) =>
    `<button class="jspsych-btn" style="font-size:20px; padding:12px 24px; margin-top:20px;">${choice}</button>`
};


// -------------------------------
// Example
// -------------------------------
const example = {
  type: jsPsychHtmlButtonResponse,
stimulus: `
    <div style="background-color:#222; color:white; padding:40px; font-size:18px; line-height:1.6; text-align:left;">

      <p> For example, in this screen, you can see an example of a decision to be made between making a bet and receiving a fixed amount when there are
          5 <span style="color:#1E90FF; font-weight:bold;">blue</span> cards
          and 15 <span style="color:#FF3030; font-weight:bold;">red</span> cards in the deck.
          Selecting "<span style="color:#1E90FF; font-weight:bold;">A</span>" means you choose to bet on drawing a <span style="color:#1E90FF; font-weight:bold;">blue</span> card,
          selecting "<span style="color:#FF3030; font-weight:bold;">S</span>" means that you choose to bet on the <span style="color:#FF3030; font-weight:bold;">red</span> card,
          and selecting "K" or "L" means that you choose to receive a fixed amount.</p>

        <!-- Figure -->
        <div style="background-color:black; padding:20px; border-radius:10px;">
          <div style="text-align: center; color: white; font-size: 20px; margin-bottom: 20px;">20 cards</div>
          <!-- <div style="display: flex; justify-content: center; gap: 40px; margin-bottom: 20px;">  -->
          <div style="display: flex; flex-direction: column; align-items: center; gap: 16px; margin-bottom: 20px;">
            <div style="border: 2px solid blue; width: 60px; height: 60px; color: white; font-size: 20px; line-height: 60px; text-align: center;">5</div>
            <div style="border: 2px solid red; width: 60px; height: 60px; color: white; font-size: 20px; line-height: 60px; text-align: center;">15</div>
          </div>
          <div style="display: flex; justify-content: center; gap: 60px;">
            <div style="text-align: center;">
              <div style="font-size: 14px; margin-bottom: 8px;">I bet 1.25 Dollars</div>
               <div style="display: flex; justify-content: center; gap: 10px;">
                <div style="width: 30px; height: 30px; background-color: blue; border: 2px solid white;"></div>
                <div style="width: 30px; height: 30px; background-color: red; border: 2px solid white;"></div>
              </div>
            </div>
            <div style="text-align: center;">
              <div style="font-size: 14px; margin-bottom: 8px;">I receive 0.5 Dollars</div>
               <div style="display: flex; justify-content: center; gap: 10px;">
                <div style="width: 30px; height: 30px; background-color: white; border: 2px solid black;"></div>
                <div style="width: 30px; height: 30px; background-color: white; border: 2px solid black;"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
    blueLabel = '10';
    redLabel = '10';
  }

  if (condition === 'part_risky') {
    const options = part_risky_options ;
    const sampled = jsPsych.randomization.sampleWithoutReplacement(options, 1)[0];
    blueLabel = `${sampled}`;
    redLabel = `${20 - sampled}`;
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
       <!-- <div style="display: flex; justify-content: center; gap: 80px;"> this is to show the stimuli squers side by side --> 
       <div style="display: flex; flex-direction: column; align-items: center; gap: 20px;"> <!-- this is to show the stimuli squers side by side -->
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
        <div class="decision-label">I bet 1.25 Dollars</div>
        <div style="display: flex; gap: 15px; justify-content: center;"> <!-- this is to show the push squers side by side -->
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
        <div class="decision-label">I receive 0.5 Dollars</div>
        <div style="display: flex; gap: 15px; justify-content: center;">  <!-- this is to show the push squers side by side -->
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
        <div class="decision-label">I receive 0.5 Dollars</div>
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
        <div class="decision-label">I bet 1.25 Dollars</div>
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
      Did you complete the study consecutively?
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
      While completing the study, did you study any external disturbances?
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
      Did you fill in this study alone or with someone else?
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
  button_label: "Proceed to the study"
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


// 1. Yellow screen
const yellowScreenTrial = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <div style="background-color:yellow; width:100vw; height:100vh;"></div>
  `,
  choices: "NO_KEYS",
  trial_duration: welcome_screen_duration,
};

// 2. Open question
const openQuestionTrial = {
  type: jsPsychSurveyText,
  questions: [
    {prompt: "What color did you just see?", rows: 1, columns: 40}
  ],
  required: true,
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
        Thank you for participating in the study!
      </div>
  `,
  choices: "NO_KEYS", 
  trial_duration: welcome_screen_duration
};
     

// -------------------------------
// Start the experiment
// -------------------------------

  if (sw_pavlovia) {

    jsPsych.run([pavlovia_init, welcome_screen, consent_screen, instructions, example
      , ...trials
      , answer_questions, Honesty, Consecutively, Disturbances, Alone, Purpose
      , gender, Attention, yellowScreenTrial, openQuestionTrial, retry_age_screen, pavlovia_finish, end_screen]);

  } else {

    jsPsych.run([welcome_screen, consent_screen, instructions, example
    , ...trials
    , answer_questions, Honesty, Consecutively, Disturbances, Alone, Purpose
    , gender, Attention, yellowScreenTrial, openQuestionTrial, retry_age_screen, end_screen]);

  };