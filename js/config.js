// -------------------------------
// Set environment variables
// -------------------------------
const sw_pavlovia = false;  // true = deploy mode, false = local test
const prolific_redirect_url = "example.com";

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
const total_trials = 6;           // Total number of trials
const part_risky_options = [10, 20, 30, 40, 60, 70, 80, 90];

// -------------------------------
// Duration settings
// -------------------------------
const FIXATION_DURATION = 500;     // Duration of fixation screen (in ms)
const PRIMING_DURATION = 200;      // Duration of priming screen (in ms)
const Trial_DURATION = 10000;      // Duration of a trial (in ms)
const answer_qeustions_screen_duration = 2000;
const welcome_screen_duration = 1000

// -------------------------------
// Demographic settings
// -------------------------------
const age_min = 0;                // Minimum age
const age_max = 100;               //   Maximum age





