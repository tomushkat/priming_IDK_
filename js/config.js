// -------------------------------
// Set environment variables
// -------------------------------
const sw_pavlovia = false;  // true = deploy mode, false = local test
const prolific_redirect_url = "https://app.prolific.com/submissions/complete?cc=C1N8TMYO";

function handleExperimentFinish() {
  jsPsych.data.get().addToLast({ completed: true });

  if (sw_pavlovia) {
    window.location.href = prolific_redirect_url;
  } else {
    jsPsych.data.displayData();
    const csv = jsPsych.data.get().csv();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'experiment_data.csv';
    a.click();
  }
};

// -------------------------------
// Experiment Settings
// -------------------------------
let total_trials = 6;           // Total number of trials
const pavlovia_trials = 6 * 20; // Total number of trials in Pavlovia (6 condition, 15 per condition)
//const part_risky_options = [1, 2, 3, 4, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17, 18, 19]; // Options for risky part
const part_risky_options = Array.from({length: 19}, (_, i) => i + 1);

// -------------------------------
// Duration settings
// -------------------------------
const FIXATION_DURATION = 500;     // Duration of fixation screen (in ms)
const PRIMING_DURATION = 300;      // Duration of priming screen (in ms)
const Trial_DURATION = 6000;      // Duration of a trial (in ms)
const answer_qeustions_screen_duration = 2000;
const welcome_screen_duration = 1000;
const break_duration_seconds_string = 30;
const preparation_seconds = 2
let break_seconds = break_duration_seconds_string - preparation_seconds; 
// -------------------------------
// Demographic settings
// -------------------------------
const age_min = 0;                // Minimum age
const age_max = 100;               //   Maximum age








