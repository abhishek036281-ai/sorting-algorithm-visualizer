/**
 * ============================================================================
 * Sorting Algorithm Visualizer
 * Core Application Logic & DSA Implementations
 * Pure Vanilla JavaScript (ES6+)
 * ============================================================================
 */

// Application State Object
const state = {
  array: [],
  originalArray: [],
  size: 25,
  speed: 50, // Range 1 (slow, 400ms) to 100 (fast, 5ms)
  selectedAlgo: 'bubble',
  
  // Execution flags
  isRunning: false,
  isPaused: false,
  isAborted: false,
  resumeResolve: null,
  stepResolve: null,
  stepTimeout: null,

  // Counters & Metrics
  comparisons: 0,
  swaps: 0,
  stepCount: 0,
  timerInterval: null,
  startTime: null,
  elapsedTime: 0,

  // Audio feedback
  soundEnabled: false,
  audioCtx: null
};

// Algorithm Metadata & Complexity Information
const ALGO_DETAILS = {
  bubble: {
    name: "Bubble Sort",
    desc: "Comparison-based algorithm repeatedly swapping adjacent elements if out of order.",
    bestTime: "Ω(N)",
    bestNote: "Already sorted",
    avgTime: "θ(N²)",
    avgNote: "Random order",
    worstTime: "O(N²)",
    worstNote: "Reverse sorted",
    space: "O(1)",
    spaceNote: "In-place memory",
    stability: "Stable",
    mechanism: "Bubble Sort steps through the array, comparing adjacent pairs and swapping them if the left element is greater than the right. Each full pass bubbles the largest unsorted element to its correct final position at the end.",
    swapLabel: "Swaps"
  },
  selection: {
    name: "Selection Sort",
    desc: "Repeatedly finds the minimum element from the unsorted segment and places it at the beginning.",
    bestTime: "Ω(N²)",
    bestNote: "Always scans rest of array",
    avgTime: "θ(N²)",
    avgNote: "Always scans rest of array",
    worstTime: "O(N²)",
    worstNote: "Reverse or random order",
    space: "O(1)",
    spaceNote: "In-place memory",
    stability: "Unstable",
    mechanism: "Selection Sort divides the array into sorted (left) and unsorted (right) segments. In each pass, it linearly scans the unsorted segment to find the absolute minimum value, then swaps it into the first unsorted position.",
    swapLabel: "Swaps"
  },
  merge: {
    name: "Merge Sort",
    desc: "Classic Divide-and-Conquer algorithm splitting the array into halves, sorting, and merging.",
    bestTime: "Ω(N log N)",
    bestNote: "Even splits every time",
    avgTime: "θ(N log N)",
    avgNote: "Even splits every time",
    worstTime: "O(N log N)",
    worstNote: "Guaranteed upper bound",
    space: "O(N)",
    spaceNote: "Auxiliary buffer required",
    stability: "Stable",
    mechanism: "Merge Sort recursively breaks the array in half until single-element subarrays remain. It then merges adjacent sorted halves in order by comparing the smallest remaining items, writing them back into the main array.",
    swapLabel: "Array Writes"
  }
};

// DOM Elements
const DOM = {
  barsWrapper: document.getElementById('barsWrapper'),
  visualizerContainer: document.getElementById('visualizerContainer'),
  startBtn: document.getElementById('startBtn'),
  pauseBtn: document.getElementById('pauseBtn'),
  resumeBtn: document.getElementById('resumeBtn'),
  resetBtn: document.getElementById('resetBtn'),
  randomizeBtn: document.getElementById('randomizeBtn'),
  speedRange: document.getElementById('speedRange'),
  speedValue: document.getElementById('speedValue'),
  sizeRange: document.getElementById('sizeRange'),
  sizeValue: document.getElementById('sizeValue'),
  customInput: document.getElementById('customInput'),
  applyCustomBtn: document.getElementById('applyCustomBtn'),
  customError: document.getElementById('customError'),
  compCounter: document.getElementById('compCounter'),
  swapCounter: document.getElementById('swapCounter'),
  swapOrWriteLabel: document.getElementById('swapOrWriteLabel'),
  arraySizeDisplay: document.getElementById('arraySizeDisplay'),
  timeCounter: document.getElementById('timeCounter'),
  statusBadge: document.getElementById('statusBadge'),
  statusText: document.getElementById('statusText'),
  stepCounter: document.getElementById('stepCounter'),
  narrationText: document.getElementById('narrationText'),
  soundToggleBtn: document.getElementById('soundToggleBtn'),
  soundOnIcon: document.getElementById('soundOnIcon'),
  soundOffIcon: document.getElementById('soundOffIcon'),
  algoButtons: document.querySelectorAll('.algo-btn'),
  algoTitle: document.getElementById('algoTitle'),
  algoSubtitle: document.getElementById('algoSubtitle'),
  algoStability: document.getElementById('algoStability'),
  bestTime: document.getElementById('bestTime'),
  avgTime: document.getElementById('avgTime'),
  worstTime: document.getElementById('worstTime'),
  spaceComplexity: document.getElementById('spaceComplexity'),
  algoMechanismText: document.getElementById('algoMechanismText'),

  // Navigation Tabs
  navVisualizerBtn: document.getElementById('navVisualizerBtn'),
  navLearningBtn: document.getElementById('navLearningBtn'),
  navComparisonBtn: document.getElementById('navComparisonBtn'),
  navEducationalBtn: document.getElementById('navEducationalBtn'),

  // Learning Mode Elements
  learnAlgoButtons: document.querySelectorAll('#learnAlgoButtons .algo-btn'),
  learnPrevBtn: document.getElementById('learnPrevBtn'),
  learnNextBtn: document.getElementById('learnNextBtn'),
  learnPlayBtn: document.getElementById('learnPlayBtn'),
  learnPlayIcon: document.getElementById('learnPlayIcon'),
  learnPauseIcon: document.getElementById('learnPauseIcon'),
  learnPlayText: document.getElementById('learnPlayText'),
  learnResetBtn: document.getElementById('learnResetBtn'),
  learnCurrentStep: document.getElementById('learnCurrentStep'),
  learnTotalSteps: document.getElementById('learnTotalSteps'),
  learnProgressPercent: document.getElementById('learnProgressPercent'),
  learnStepRange: document.getElementById('learnStepRange'),
  learnDatasetSelect: document.getElementById('learnDatasetSelect'),
  learnAlgoBadge: document.getElementById('learnAlgoBadge'),
  learnBarsWrapper: document.getElementById('learnBarsWrapper'),
  learnActionBadge: document.getElementById('learnActionBadge'),
  learnPhaseText: document.getElementById('learnPhaseText'),
  learnDetailHeading: document.getElementById('learnDetailHeading'),
  learnDetailText: document.getElementById('learnDetailText'),
  learnReasonText: document.getElementById('learnReasonText'),
  pseudocodeViewport: document.getElementById('pseudocodeViewport'),
  theoryTitle: document.getElementById('theoryTitle'),
  theorySubtitle: document.getElementById('theorySubtitle'),
  theoryStability: document.getElementById('theoryStability'),
  theoryIntroText: document.getElementById('theoryIntroText'),
  theoryBest: document.getElementById('theoryBest'),
  theoryAvg: document.getElementById('theoryAvg'),
  theoryWorst: document.getElementById('theoryWorst'),
  theorySpace: document.getElementById('theorySpace'),
  theoryProsList: document.getElementById('theoryProsList'),
  theoryConsList: document.getElementById('theoryConsList'),
  theoryAppsText: document.getElementById('theoryAppsText'),

  // Comparison Dashboard Elements
  runBenchmarkBtn: document.getElementById('runBenchmarkBtn'),
  benchmarkDataset: document.getElementById('benchmarkDataset'),
  benchmarkArrayInfo: document.getElementById('benchmarkArrayInfo'),
  verificationBanner: document.getElementById('verificationBanner'),
  verificationDetails: document.getElementById('verificationDetails'),
  comparisonTableBody: document.getElementById('comparisonTableBody'),
  operationsChartContainer: document.getElementById('operationsChartContainer'),
  timeChartContainer: document.getElementById('timeChartContainer')
};

// ============================================================================
// Audio Feedback (Web Audio API)
// ============================================================================
function playTone(val, maxVal = 350) {
  if (!state.soundEnabled) return;
  try {
    if (!state.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      state.audioCtx = new AudioContext();
    }
    if (state.audioCtx.state === 'suspended') {
      state.audioCtx.resume();
    }
    const osc = state.audioCtx.createOscillator();
    const gain = state.audioCtx.createGain();

    // Map array values (5 to 350) to frequencies (150Hz to 850Hz)
    const minFreq = 150;
    const maxFreq = 850;
    const freq = minFreq + ((val / maxVal) * (maxFreq - minFreq));

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, state.audioCtx.currentTime);

    gain.gain.setValueAtTime(0.04, state.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, state.audioCtx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(state.audioCtx.destination);

    osc.start();
    osc.stop(state.audioCtx.currentTime + 0.05);
  } catch (err) {
    console.warn("Audio Context error:", err);
  }
}

// ============================================================================
// Delay & Animation Control
// ============================================================================
/**
 * Calculates current delay in milliseconds based on speed slider (1 to 100)
 */
function getDelayMs() {
  const minDelay = 6;    // at speed 100
  const maxDelay = 420;  // at speed 1
  // Exponential mapping for smooth responsiveness
  const factor = (100 - state.speed) / 99;
  return Math.round(minDelay + Math.pow(factor, 2) * (maxDelay - minDelay));
}

/**
 * Halts execution for the calculated delay, respecting Pause and Reset (Abort)
 */
async function waitStep() {
  if (state.isAborted) {
    throw new Error("ABORTED");
  }

  // Handle Paused state: wait until resumeResolve is called
  while (state.isPaused) {
    if (state.isAborted) throw new Error("ABORTED");
    await new Promise(resolve => {
      state.resumeResolve = resolve;
    });
  }

  if (state.isAborted) throw new Error("ABORTED");

  // Normal step delay
  const delay = getDelayMs();
  await new Promise(resolve => {
    state.stepResolve = resolve;
    state.stepTimeout = setTimeout(() => {
      state.stepResolve = null;
      state.stepTimeout = null;
      resolve();
    }, delay);
  });

  if (state.isAborted) throw new Error("ABORTED");
}

// ============================================================================
// Timer Functions
// ============================================================================
function startTimer() {
  state.startTime = Date.now() - state.elapsedTime;
  clearInterval(state.timerInterval);
  state.timerInterval = setInterval(() => {
    if (!state.isPaused) {
      state.elapsedTime = Date.now() - state.startTime;
      updateTimerDisplay();
    }
  }, 50);
}

function pauseTimer() {
  clearInterval(state.timerInterval);
}

function resetTimer() {
  clearInterval(state.timerInterval);
  state.elapsedTime = 0;
  state.startTime = null;
  updateTimerDisplay();
}

function updateTimerDisplay() {
  const totalSeconds = Math.floor(state.elapsedTime / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const tenths = Math.floor((state.elapsedTime % 1000) / 100);
  DOM.timeCounter.textContent = 
    `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${tenths}`;
}

// ============================================================================
// UI & Bar Rendering
// ============================================================================
/**
 * Renders the array as vertical bars in the visualizer container
 */
function renderBars() {
  DOM.barsWrapper.innerHTML = '';
  const maxVal = Math.max(...state.array, 100);
  const showValues = state.array.length <= 35;

  state.array.forEach((val, idx) => {
    const col = document.createElement('div');
    col.className = 'bar-column';
    col.id = `bar-col-${idx}`;

    if (showValues) {
      const valLabel = document.createElement('span');
      valLabel.className = 'bar-value';
      valLabel.id = `bar-val-${idx}`;
      valLabel.textContent = val;
      col.appendChild(valLabel);
    }

    const bar = document.createElement('div');
    bar.className = 'bar-element';
    bar.id = `bar-${idx}`;
    // Scale height with padding room (min 8%, max 88%)
    const heightPercent = Math.max(8, (val / maxVal) * 88);
    bar.style.height = `${heightPercent}%`;
    col.appendChild(bar);

    // Optional index under bar for smaller arrays
    if (state.array.length <= 25) {
      const idxSpan = document.createElement('span');
      idxSpan.className = 'bar-index';
      idxSpan.textContent = idx;
      col.appendChild(idxSpan);
    }

    DOM.barsWrapper.appendChild(col);
  });

  DOM.arraySizeDisplay.textContent = state.array.length;
}

/**
 * Updates a specific bar's height and text value
 */
function updateBarHeight(idx, val) {
  const bar = document.getElementById(`bar-${idx}`);
  if (!bar) return;
  const maxVal = Math.max(...state.array, 100);
  const heightPercent = Math.max(8, (val / maxVal) * 88);
  bar.style.height = `${heightPercent}%`;
  
  const valLabel = document.getElementById(`bar-val-${idx}`);
  if (valLabel) {
    valLabel.textContent = val;
  }
}

/**
 * Applies a visual state to a bar element (state-comparing, state-swapping, state-active, state-sorted)
 */
function setBarState(idx, stateName) {
  const bar = document.getElementById(`bar-${idx}`);
  if (!bar) return;
  clearBarStates(idx);
  if (stateName) {
    bar.classList.add(`state-${stateName}`);
  }
}

/**
 * Clears active state classes from a bar element
 */
function clearBarStates(idx) {
  const bar = document.getElementById(`bar-${idx}`);
  if (!bar) return;
  bar.classList.remove('state-comparing', 'state-swapping', 'state-active', 'state-sorted');
}

/**
 * Clears all states from all bars
 */
function clearAllBarStates() {
  for (let i = 0; i < state.array.length; i++) {
    clearBarStates(i);
  }
}

/**
 * Mark a single bar as sorted
 */
function markBarSorted(idx) {
  const bar = document.getElementById(`bar-${idx}`);
  if (!bar) return;
  bar.className = 'bar-element state-sorted';
}

/**
 * Victory sweep animation when sorting completes
 */
async function celebrationAnimation() {
  for (let i = 0; i < state.array.length; i++) {
    if (state.isAborted) return;
    markBarSorted(i);
    playTone(state.array[i]);
    await new Promise(r => setTimeout(r, Math.max(12, 250 / state.array.length)));
  }
}

// ============================================================================
// Metrics & Narration Updates
// ============================================================================
function updateMetrics() {
  DOM.compCounter.textContent = state.comparisons;
  DOM.swapCounter.textContent = state.swaps;
  DOM.stepCounter.textContent = `Step ${state.stepCount}`;
}

function resetMetrics() {
  state.comparisons = 0;
  state.swaps = 0;
  state.stepCount = 0;
  updateMetrics();
  resetTimer();
}

function setNarration(msg) {
  DOM.narrationText.textContent = msg;
}

function updateStatus(status) {
  DOM.statusBadge.className = 'status-badge';
  if (status === 'running') {
    DOM.statusBadge.classList.add('running');
    DOM.statusText.textContent = 'Sorting...';
  } else if (status === 'paused') {
    DOM.statusBadge.classList.add('paused');
    DOM.statusText.textContent = 'Paused';
  } else if (status === 'completed') {
    DOM.statusText.textContent = 'Sorted';
  } else {
    DOM.statusText.textContent = 'Ready';
  }
}

// ============================================================================
// Array Generation & Custom Input
// ============================================================================
function generateRandomArray(size = state.size) {
  const arr = [];
  const min = 15;
  const max = 320;
  for (let i = 0; i < size; i++) {
    arr.push(Math.floor(Math.random() * (max - min + 1)) + min);
  }
  state.array = [...arr];
  state.originalArray = [...arr];
  renderBars();
  resetMetrics();
  updateStatus('ready');
  setNarration(`Generated new random array of ${size} elements.`);
}

function applyCustomArray() {
  const rawInput = DOM.customInput.value.trim();
  DOM.customError.classList.add('hidden');
  DOM.customError.textContent = '';

  if (!rawInput) {
    showCustomError("Please enter numbers separated by commas.");
    return;
  }

  // Parse comma or whitespace separated values
  const parts = rawInput.split(/[\s,]+/).filter(Boolean);
  if (parts.length < 3) {
    showCustomError("Please enter at least 3 numbers for visualization.");
    return;
  }
  if (parts.length > 50) {
    showCustomError("Maximum limit is 50 numbers to fit screen properly.");
    return;
  }

  const parsed = [];
  for (const part of parts) {
    const num = Number(part);
    if (isNaN(num) || !Number.isInteger(num)) {
      showCustomError(`Invalid entry: "${part}" is not an integer.`);
      return;
    }
    if (num < 5 || num > 500) {
      showCustomError(`Number ${num} out of bounds. Please keep numbers between 5 and 500.`);
      return;
    }
    parsed.push(num);
  }

  // Applied successfully
  state.array = [...parsed];
  state.originalArray = [...parsed];
  state.size = parsed.length;
  DOM.sizeRange.value = parsed.length;
  DOM.sizeValue.textContent = `${parsed.length} items`;
  
  renderBars();
  resetMetrics();
  updateStatus('ready');
  setNarration(`Custom array of ${parsed.length} elements loaded successfully.`);
}

function showCustomError(msg) {
  DOM.customError.textContent = msg;
  DOM.customError.classList.remove('hidden');
}

// ============================================================================
// DSA Implementations (Bubble, Selection, Merge)
// ============================================================================

/**
 * Bubble Sort Implementation
 * Time Complexity: O(N^2) | Space Complexity: O(1)
 */
async function runBubbleSort() {
  const arr = state.array;
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let hasSwapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      state.stepCount++;
      state.comparisons++;
      updateMetrics();

      setBarState(j, 'comparing');
      setBarState(j + 1, 'comparing');
      setNarration(`Comparing index ${j} (${arr[j]}) and index ${j + 1} (${arr[j + 1]})`);
      playTone(arr[j]);
      await waitStep();

      if (arr[j] > arr[j + 1]) {
        // Swap elements
        state.swaps++;
        updateMetrics();
        setBarState(j, 'swapping');
        setBarState(j + 1, 'swapping');
        setNarration(`Swap required: ${arr[j]} > ${arr[j + 1]}`);
        playTone(arr[j + 1]);

        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;

        updateBarHeight(j, arr[j]);
        updateBarHeight(j + 1, arr[j + 1]);
        hasSwapped = true;
        await waitStep();
      }

      clearBarStates(j);
      clearBarStates(j + 1);
    }

    // Mark the bubbled element as sorted
    markBarSorted(n - 1 - i);

    // Optimization: if no two elements were swapped by inner loop, array is sorted
    if (!hasSwapped) {
      setNarration("No swaps made in this pass! Early exit optimization triggered.");
      break;
    }
  }

  // Mark all remaining sorted
  for (let k = 0; k < n; k++) {
    markBarSorted(k);
  }
}

/**
 * Selection Sort Implementation
 * Time Complexity: O(N^2) | Space Complexity: O(1)
 */
async function runSelectionSort() {
  const arr = state.array;
  const n = arr.length;

  for (let i = 0; i < n; i++) {
    let minIdx = i;
    setBarState(minIdx, 'active');
    setNarration(`Pass ${i + 1}: Assuming minimum is at index ${i} (value: ${arr[i]})`);
    await waitStep();

    for (let j = i + 1; j < n; j++) {
      state.stepCount++;
      state.comparisons++;
      updateMetrics();

      setBarState(j, 'comparing');
      setNarration(`Comparing candidate index ${j} (${arr[j]}) with current min at index ${minIdx} (${arr[minIdx]})`);
      playTone(arr[j]);
      await waitStep();

      if (arr[j] < arr[minIdx]) {
        // Reset previous min visual if it wasn't the starting i
        if (minIdx !== i) {
          clearBarStates(minIdx);
        }
        minIdx = j;
        setBarState(minIdx, 'active');
        setNarration(`New minimum found! Index ${minIdx} with value ${arr[minIdx]}`);
      } else {
        clearBarStates(j);
      }
    }

    // Swap found minimum with current position i
    if (minIdx !== i) {
      state.swaps++;
      updateMetrics();
      setBarState(i, 'swapping');
      setBarState(minIdx, 'swapping');
      setNarration(`Swapping minimum (${arr[minIdx]}) into position ${i} (was ${arr[i]})`);
      playTone(arr[minIdx]);

      const temp = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = temp;

      updateBarHeight(i, arr[i]);
      updateBarHeight(minIdx, arr[minIdx]);
      await waitStep();

      clearBarStates(minIdx);
    }

    markBarSorted(i);
  }
}

/**
 * Merge Sort Implementation
 * Divide and Conquer Algorithm
 * Time Complexity: O(N log N) | Space Complexity: O(N)
 */
async function runMergeSort() {
  await mergeSortRecursive(0, state.array.length - 1);
  for (let k = 0; k < state.array.length; k++) {
    markBarSorted(k);
  }
}

async function mergeSortRecursive(left, right) {
  if (state.isAborted) return;
  if (left >= right) return;

  const mid = Math.floor((left + right) / 2);

  // Divide step narration
  setNarration(`Divide: Splitting range [${left}..${right}] at midpoint ${mid}`);
  for (let i = left; i <= right; i++) {
    const bar = document.getElementById(`bar-${i}`);
    if (bar && !bar.classList.contains('state-sorted')) {
      bar.classList.add('state-active');
    }
  }
  await waitStep();

  // Recursively sort left and right halves
  await mergeSortRecursive(left, mid);
  await mergeSortRecursive(mid + 1, right);

  // Conquer/Merge step
  await merge(left, mid, right);
}

async function merge(left, mid, right) {
  if (state.isAborted) return;

  const arr = state.array;
  const temp = [];
  let i = left;
  let j = mid + 1;

  setNarration(`Merge: Combining sorted subarrays [${left}..${mid}] and [${mid + 1}..${right}]`);

  // Compare elements from left and right halves
  while (i <= mid && j <= right) {
    if (state.isAborted) return;

    state.stepCount++;
    state.comparisons++;
    updateMetrics();

    setBarState(i, 'comparing');
    setBarState(j, 'comparing');
    setNarration(`Comparing left half arr[${i}] (${arr[i]}) and right half arr[${j}] (${arr[j]})`);
    playTone(arr[i]);
    await waitStep();

    if (arr[i] <= arr[j]) {
      temp.push(arr[i]);
      clearBarStates(i);
      i++;
    } else {
      temp.push(arr[j]);
      clearBarStates(j);
      j++;
    }
  }

  // Copy remaining elements
  while (i <= mid) {
    if (state.isAborted) return;
    temp.push(arr[i]);
    clearBarStates(i);
    i++;
  }

  while (j <= right) {
    if (state.isAborted) return;
    temp.push(arr[j]);
    clearBarStates(j);
    j++;
  }

  // Write merged values back into state.array and reflect visually
  for (let k = 0; k < temp.length; k++) {
    if (state.isAborted) return;

    const targetIdx = left + k;
    arr[targetIdx] = temp[k];
    state.swaps++; // Counts as array write operation
    updateMetrics();

    setBarState(targetIdx, 'swapping');
    updateBarHeight(targetIdx, arr[targetIdx]);
    setNarration(`Writing merged value ${arr[targetIdx]} to index ${targetIdx}`);
    playTone(arr[targetIdx]);
    await waitStep();

    // If whole array is merged, mark sorted
    if (left === 0 && right === arr.length - 1) {
      markBarSorted(targetIdx);
    } else {
      setBarState(targetIdx, 'active');
    }
  }
}

// ============================================================================
// Execution Lifecycle (Start, Pause, Resume, Reset)
// ============================================================================
async function startSort() {
  if (state.isRunning) return;

  // Initialize execution state
  state.isRunning = true;
  state.isPaused = false;
  state.isAborted = false;
  resetMetrics();
  clearAllBarStates();

  updateStatus('running');
  setControlButtonsState('running');
  startTimer();

  try {
    if (state.selectedAlgo === 'bubble') {
      await runBubbleSort();
    } else if (state.selectedAlgo === 'selection') {
      await runSelectionSort();
    } else if (state.selectedAlgo === 'merge') {
      await runMergeSort();
    }

    if (!state.isAborted) {
      updateStatus('completed');
      setNarration(`Visualization complete! Array successfully sorted with ${state.selectedAlgo.toUpperCase()} sort.`);
      await celebrationAnimation();
    }
  } catch (err) {
    if (err.message === 'ABORTED') {
      setNarration("Sorting was reset.");
    } else {
      console.error("Sorting error:", err);
      setNarration("An unexpected error occurred during sorting.");
    }
  } finally {
    state.isRunning = false;
    state.isPaused = false;
    pauseTimer();
    setControlButtonsState('idle');
  }
}

function pauseSort() {
  if (!state.isRunning || state.isPaused) return;
  state.isPaused = true;
  updateStatus('paused');
  pauseTimer();
  setNarration("Execution paused. Click 'Resume' to continue.");
  
  DOM.pauseBtn.style.display = 'none';
  DOM.resumeBtn.style.display = 'inline-flex';
  DOM.resumeBtn.disabled = false;
}

function resumeSort() {
  if (!state.isRunning || !state.isPaused) return;
  state.isPaused = false;
  updateStatus('running');
  startTimer();
  setNarration("Resuming sorting visualization...");

  DOM.resumeBtn.style.display = 'none';
  DOM.pauseBtn.style.display = 'inline-flex';
  DOM.pauseBtn.disabled = false;

  // Wake up paused promise
  if (state.resumeResolve) {
    const resolve = state.resumeResolve;
    state.resumeResolve = null;
    resolve();
  }
}

function resetSort() {
  state.isAborted = true;
  state.isRunning = false;
  state.isPaused = false;

  if (state.stepTimeout) {
    clearTimeout(state.stepTimeout);
    state.stepTimeout = null;
  }
  if (state.stepResolve) {
    const resolve = state.stepResolve;
    state.stepResolve = null;
    resolve();
  }
  if (state.resumeResolve) {
    const resolve = state.resumeResolve;
    state.resumeResolve = null;
    resolve();
  }

  pauseTimer();
  resetMetrics();
  updateStatus('ready');
  setControlButtonsState('idle');

  // Restore initial array state
  state.array = [...state.originalArray];
  renderBars();
  setNarration("Visualizer reset to initial array.");
}

function setControlButtonsState(mode) {
  if (mode === 'running') {
    DOM.startBtn.disabled = true;
    DOM.pauseBtn.disabled = false;
    DOM.pauseBtn.style.display = 'inline-flex';
    DOM.resumeBtn.style.display = 'none';
    DOM.resumeBtn.disabled = true;
    DOM.resetBtn.disabled = false;
    DOM.randomizeBtn.disabled = true;
    DOM.applyCustomBtn.disabled = true;
    DOM.sizeRange.disabled = true;
    DOM.algoButtons.forEach(btn => btn.disabled = true);
  } else {
    DOM.startBtn.disabled = false;
    DOM.pauseBtn.disabled = true;
    DOM.pauseBtn.style.display = 'inline-flex';
    DOM.resumeBtn.style.display = 'none';
    DOM.resumeBtn.disabled = true;
    DOM.resetBtn.disabled = false;
    DOM.randomizeBtn.disabled = false;
    DOM.applyCustomBtn.disabled = false;
    DOM.sizeRange.disabled = false;
    DOM.algoButtons.forEach(btn => btn.disabled = false);
  }
}

// ============================================================================
// Algorithm Selection & Complexity Info Updates
// ============================================================================
function selectAlgorithm(algoKey) {
  if (state.isRunning) return;
  state.selectedAlgo = algoKey;

  // Update button active states
  DOM.algoButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.algo === algoKey);
  });

  const details = ALGO_DETAILS[algoKey];
  DOM.algoTitle.textContent = details.name;
  DOM.algoSubtitle.textContent = details.desc;
  DOM.algoStability.textContent = details.stability;
  DOM.bestTime.textContent = details.bestTime;
  DOM.avgTime.textContent = details.avgTime;
  DOM.worstTime.textContent = details.worstTime;
  DOM.spaceComplexity.textContent = details.space;
  DOM.algoMechanismText.textContent = details.mechanism;
  DOM.swapOrWriteLabel.textContent = details.swapLabel;

  setNarration(`Selected ${details.name}. Ready to visualize.`);
}

// ============================================================================
// Event Listeners Initialization
// ============================================================================
function initEventListeners() {
  // Execution buttons
  DOM.startBtn.addEventListener('click', startSort);
  DOM.pauseBtn.addEventListener('click', pauseSort);
  DOM.resumeBtn.addEventListener('click', resumeSort);
  DOM.resetBtn.addEventListener('click', resetSort);
  DOM.randomizeBtn.addEventListener('click', () => generateRandomArray());

  // Algorithm pills
  DOM.algoButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const algo = e.currentTarget.dataset.algo;
      selectAlgorithm(algo);
    });
  });

  // Animation speed slider
  DOM.speedRange.addEventListener('input', (e) => {
    state.speed = Number(e.target.value);
    const ms = getDelayMs();
    let speedLabel = "Normal";
    if (state.speed < 30) speedLabel = "Slow";
    else if (state.speed > 75) speedLabel = "Fast";
    DOM.speedValue.textContent = `${speedLabel} (${ms}ms)`;
  });

  // Array size slider
  DOM.sizeRange.addEventListener('input', (e) => {
    state.size = Number(e.target.value);
    DOM.sizeValue.textContent = `${state.size} items`;
    if (!state.isRunning) {
      generateRandomArray(state.size);
    }
  });

  // Custom array input
  DOM.applyCustomBtn.addEventListener('click', applyCustomArray);
  DOM.customInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      applyCustomArray();
    }
  });

  // Audio feedback toggle
  DOM.soundToggleBtn.addEventListener('click', () => {
    state.soundEnabled = !state.soundEnabled;
    DOM.soundToggleBtn.classList.toggle('active', state.soundEnabled);
    DOM.soundOnIcon.classList.toggle('hidden', !state.soundEnabled);
    DOM.soundOffIcon.classList.toggle('hidden', state.soundEnabled);

    if (state.soundEnabled) {
      playTone(250);
      setNarration("Sound feedback enabled.");
    } else {
      setNarration("Sound feedback muted.");
    }
  });

  // Window resize: re-render bars cleanly if needed
  window.addEventListener('resize', () => {
    if (!state.isRunning) {
      renderBars();
    }
  });

  // Navigation Tabs Sync across all 4 sections
  const navMap = [
    { btn: DOM.navVisualizerBtn, targetId: 'visualizerSection' },
    { btn: DOM.navLearningBtn, targetId: 'learningSection' },
    { btn: DOM.navComparisonBtn, targetId: 'comparisonDashboard' },
    { btn: DOM.navEducationalBtn, targetId: 'educationalSection' }
  ];

  navMap.forEach(item => {
    if (item.btn) {
      item.btn.addEventListener('click', (e) => {
        e.preventDefault();
        navMap.forEach(nav => {
          if (nav.btn) nav.btn.classList.remove('active');
        });
        item.btn.classList.add('active');
        const target = document.getElementById(item.targetId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  });

  // Learning Mode Event Listeners
  if (DOM.learnAlgoButtons) {
    DOM.learnAlgoButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const algo = e.currentTarget.dataset.algo;
        selectLearningAlgo(algo);
      });
    });
  }

  if (DOM.learnPrevBtn) {
    DOM.learnPrevBtn.addEventListener('click', () => stepLearning(-1));
  }

  if (DOM.learnNextBtn) {
    DOM.learnNextBtn.addEventListener('click', () => stepLearning(1));
  }

  if (DOM.learnPlayBtn) {
    DOM.learnPlayBtn.addEventListener('click', toggleLearningAutoPlay);
  }

  if (DOM.learnResetBtn) {
    DOM.learnResetBtn.addEventListener('click', resetLearningStepper);
  }

  if (DOM.learnStepRange) {
    DOM.learnStepRange.addEventListener('input', (e) => {
      setLearningStep(Number(e.target.value));
    });
  }

  if (DOM.learnDatasetSelect) {
    DOM.learnDatasetSelect.addEventListener('change', (e) => {
      setLearningDataset(e.target.value);
    });
  }

  // Benchmark Trigger Buttons & Selects
  if (DOM.runBenchmarkBtn) {
    DOM.runBenchmarkBtn.addEventListener('click', runComparisonBenchmark);
  }

  if (DOM.benchmarkDataset) {
    DOM.benchmarkDataset.addEventListener('change', () => {
      getBenchmarkDataset();
      runComparisonBenchmark();
    });
  }
}

// ============================================================================
// PHASE 1: DSA LEARNING MODE ENGINE & TRACE GENERATORS
// ============================================================================

const LEARNING_PSEUDOCODE = {
  bubble: [
    { line: 1, text: "procedure BubbleSort(arr):" },
    { line: 2, text: "  n = length(arr)" },
    { line: 3, text: "  for i from 0 to n - 1 do" },
    { line: 4, text: "    swapped = false" },
    { line: 5, text: "    for j from 0 to n - i - 2 do" },
    { line: 6, text: "      if arr[j] > arr[j + 1] then" },
    { line: 7, text: "        swap(arr[j], arr[j + 1])" },
    { line: 8, text: "        swapped = true" },
    { line: 9, text: "    mark arr[n - 1 - i] as sorted" },
    { line: 10, text: "    if not swapped then break  // early exit" },
    { line: 11, text: "  end procedure" }
  ],
  selection: [
    { line: 1, text: "procedure SelectionSort(arr):" },
    { line: 2, text: "  n = length(arr)" },
    { line: 3, text: "  for i from 0 to n - 1 do" },
    { line: 4, text: "    minIdx = i  // assume current index is min" },
    { line: 5, text: "    for j from i + 1 to n - 1 do" },
    { line: 6, text: "      if arr[j] < arr[minIdx] then" },
    { line: 7, text: "        minIdx = j  // record new minimum index" },
    { line: 8, text: "    if minIdx != i then" },
    { line: 9, text: "      swap(arr[i], arr[minIdx])" },
    { line: 10, text: "    mark arr[i] as sorted" },
    { line: 11, text: "  end procedure" }
  ],
  merge: [
    { line: 1, text: "procedure MergeSort(arr, left, right):" },
    { line: 2, text: "  if left >= right then return" },
    { line: 3, text: "  mid = floor((left + right) / 2)" },
    { line: 4, text: "  MergeSort(arr, left, mid)" },
    { line: 5, text: "  MergeSort(arr, mid + 1, right)" },
    { line: 6, text: "  Merge(arr, left, mid, right)" },
    { line: 7, text: "procedure Merge(arr, left, mid, right):" },
    { line: 8, text: "  temp = [], i = left, j = mid + 1" },
    { line: 9, text: "  while i <= mid and j <= right do" },
    { line: 10, text: "    if arr[i] <= arr[j] then temp.push(arr[i++])" },
    { line: 11, text: "    else temp.push(arr[j++])" },
    { line: 12, text: "  copy remaining elements to temp" },
    { line: 13, text: "  copy temp back to arr[left..right]" }
  ]
};

const LEARNING_THEORY = {
  bubble: {
    title: "Bubble Sort Theory",
    subtitle: "Adjacent comparison and swapping algorithm",
    stability: "Stable",
    intro: "Bubble Sort steps through the array sequentially, comparing adjacent pairs and swapping them if the left element is greater than the right. Each full pass bubbles the largest unsorted element to its permanent final position at the end of the array.",
    best: "Ω(N)",
    avg: "θ(N²)",
    worst: "O(N²)",
    space: "O(1)",
    pros: [
      "Simple to comprehend, program, and visualize for beginners.",
      "In-place sorting requiring strictly O(1) auxiliary space.",
      "Stable: preserves the relative ordering of equal keys.",
      "Linear time Ω(N) on already sorted arrays using early exit optimization."
    ],
    cons: [
      "Highly inefficient on large collections due to O(N²) quadratic scaling.",
      "Performs excessive swaps (up to N(N-1)/2), causing heavy cache write penalties."
    ],
    apps: "Ideal for educational demonstrations, small lists (N < 30), and environments like computer graphics when polygon vertices are nearly sorted frame-to-frame."
  },
  selection: {
    title: "Selection Sort Theory",
    subtitle: "In-place prefix selection algorithm",
    stability: "Unstable",
    intro: "Selection Sort partitions the array into a sorted subarray at the front and an unsorted subarray at the rear. In each pass, it linearly scans the unsorted segment to locate the absolute minimum element and swaps it into the first unsorted position.",
    best: "Ω(N²)",
    avg: "θ(N²)",
    worst: "O(N²)",
    space: "O(1)",
    pros: [
      "Performs at most N - 1 swaps across the entire sorting process (O(N) memory writes).",
      "In-place memory usage requiring strictly O(1) auxiliary space.",
      "Consistent, predictable behavior regardless of initial array ordering."
    ],
    cons: [
      "Always requires θ(N²) comparisons even if the array is already sorted.",
      "Unstable: long-distance swaps can reorder identical elements."
    ],
    apps: "Preferred in systems with flash memory or EEPROM where memory write operations (swaps) are physically expensive or wear out hardware storage."
  },
  merge: {
    title: "Merge Sort Theory",
    subtitle: "Divide-and-Conquer recursive algorithm",
    stability: "Stable",
    intro: "Merge Sort recursively bisects the array into two halves until single-element subarrays remain. It then merges adjacent sorted halves in order by comparing the fronts, writing elements monotonically into a temporary buffer and copying them back.",
    best: "Ω(N log N)",
    avg: "θ(N log N)",
    worst: "O(N log N)",
    space: "O(N)",
    pros: [
      "Guaranteed O(N log N) time complexity across best, average, and worst cases.",
      "Highly stable sorting algorithm preserving relative order of equal keys.",
      "Naturally excels at sorting linked lists without needing extra contiguous memory.",
      "Can easily be adapted for parallel processing and external sorting of terabyte-scale datasets."
    ],
    cons: [
      "Requires O(N) auxiliary memory buffer to merge two array halves.",
      "Recursion introduces call stack overhead of O(log N) depth."
    ],
    apps: "Standard algorithm for external sorting (databases, map-reduce), Linux kernel linked list sorting, Java's Arrays.sort() for reference types (TimSort variant), and Python's sorted()."
  }
};

const learnState = {
  algo: 'bubble',
  array: [45, 12, 85, 32, 8],
  trace: [],
  currentStep: 0,
  isPlaying: false,
  playTimer: null,
  playSpeedMs: 650
};

/**
 * Bubble Sort Trace Generator
 */
function generateBubbleTrace(inputArr) {
  const arr = [...inputArr];
  const n = arr.length;
  const trace = [];
  const sorted = [];

  trace.push({
    array: [...arr],
    comparing: [],
    swapped: [],
    sorted: [...sorted],
    active: -1,
    line: 1,
    action: "INITIALIZE",
    actionClass: "tag-locked",
    phase: "Setup",
    heading: `Starting Bubble Sort on ${n} Elements`,
    detail: `Input array: [${arr.join(', ')}]. The algorithm will compare adjacent pairs and bubble the largest unsorted values to the right.`,
    reason: "Initial array state prepared before passes commence."
  });

  for (let i = 0; i < n - 1; i++) {
    let hasSwapped = false;
    trace.push({
      array: [...arr],
      comparing: [],
      swapped: [],
      sorted: [...sorted],
      active: -1,
      line: 3,
      action: "PASS START",
      actionClass: "tag-compare",
      phase: `Pass ${i + 1} of ${n - 1}`,
      heading: `Beginning Pass ${i + 1}`,
      detail: `Scanning unsorted portion [index 0 to ${n - i - 1}]. Currently sorted elements at indices: [${sorted.join(', ') || 'None'}].`,
      reason: `Outer loop iteration i = ${i}. Setting swapped flag to false.`
    });

    for (let j = 0; j < n - i - 1; j++) {
      trace.push({
        array: [...arr],
        comparing: [j, j + 1],
        swapped: [],
        sorted: [...sorted],
        active: -1,
        line: 6,
        action: "COMPARE",
        actionClass: "tag-compare",
        phase: `Pass ${i + 1} | Pair (${j}, ${j + 1})`,
        heading: `Comparing arr[${j}] (${arr[j]}) and arr[${j + 1}] (${arr[j + 1]})`,
        detail: `Evaluating condition: is ${arr[j]} > ${arr[j + 1]}?`,
        reason: arr[j] > arr[j + 1]
          ? `Because ${arr[j]} > ${arr[j + 1]}, the elements are in inverted order and require swapping.`
          : `Because ${arr[j]} ≤ ${arr[j + 1]}, the elements are already in non-decreasing order. No swap needed.`
      });

      if (arr[j] > arr[j + 1]) {
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        hasSwapped = true;

        trace.push({
          array: [...arr],
          comparing: [],
          swapped: [j, j + 1],
          sorted: [...sorted],
          active: -1,
          line: 7,
          action: "SWAP",
          actionClass: "tag-swap",
          phase: `Pass ${i + 1} | Swapped (${j}, ${j + 1})`,
          heading: `Swapped arr[${j}] and arr[${j + 1}]`,
          detail: `Moved value ${arr[j + 1]} to index ${j + 1} and ${arr[j]} to index ${j}.`,
          reason: "Swapping ensures the heavier (larger) value bubbles one step rightward toward its correct location."
        });
      }
    }

    sorted.push(n - 1 - i);
    trace.push({
      array: [...arr],
      comparing: [],
      swapped: [],
      sorted: [...sorted],
      active: -1,
      line: 9,
      action: "LOCK POSITION",
      actionClass: "tag-locked",
      phase: `Pass ${i + 1} Complete`,
      heading: `Element ${arr[n - 1 - i]} Locked at Index ${n - 1 - i}`,
      detail: `Value ${arr[n - 1 - i]} has fully bubbled to the end of the unsorted segment. It will never move again.`,
      reason: `After pass ${i + 1}, the (i + 1)-th largest element is guaranteed to reside in index ${n - 1 - i}.`
    });

    if (!hasSwapped) {
      trace.push({
        array: [...arr],
        comparing: [],
        swapped: [],
        sorted: Array.from({ length: n }, (_, k) => k),
        active: -1,
        line: 10,
        action: "EARLY EXIT",
        actionClass: "tag-locked",
        phase: "Optimization Triggered",
        heading: "Early Termination: Array Already Sorted!",
        detail: "Zero swaps were made during this pass. The array is verified to be completely sorted.",
        reason: "Best-case Ω(N) optimization avoids unnecessary remaining quadratic passes."
      });
      break;
    }
  }

  trace.push({
    array: [...arr],
    comparing: [],
    swapped: [],
    sorted: Array.from({ length: n }, (_, k) => k),
    active: -1,
    line: 11,
    action: "SORT COMPLETE",
    actionClass: "tag-locked",
    phase: "Finished",
    heading: "Bubble Sort Completed Successfully",
    detail: `Final ascending array: [${arr.join(', ')}].`,
    reason: "All elements are in non-decreasing order."
  });

  return trace;
}

/**
 * Selection Sort Trace Generator
 */
function generateSelectionTrace(inputArr) {
  const arr = [...inputArr];
  const n = arr.length;
  const trace = [];
  const sorted = [];

  trace.push({
    array: [...arr],
    comparing: [],
    swapped: [],
    sorted: [...sorted],
    active: -1,
    line: 1,
    action: "INITIALIZE",
    actionClass: "tag-locked",
    phase: "Setup",
    heading: `Starting Selection Sort on ${n} Elements`,
    detail: `Input array: [${arr.join(', ')}]. Selection Sort iteratively finds the minimum of the unsorted segment and moves it to the front.`,
    reason: "Array initially divided into empty sorted prefix and full unsorted suffix [0..n-1]."
  });

  for (let i = 0; i < n; i++) {
    let minIdx = i;
    trace.push({
      array: [...arr],
      comparing: [],
      swapped: [],
      sorted: [...sorted],
      active: minIdx,
      line: 4,
      action: "ASSUME MIN",
      actionClass: "tag-compare",
      phase: `Pass ${i + 1} of ${n}`,
      heading: `Assuming Minimum at Index ${i} (Value: ${arr[i]})`,
      detail: `Scanning unsorted suffix [index ${i + 1} to ${n - 1}] to test if any element is smaller than ${arr[i]}.`,
      reason: `minIdx initialized to ${i}.`
    });

    for (let j = i + 1; j < n; j++) {
      trace.push({
        array: [...arr],
        comparing: [j, minIdx],
        swapped: [],
        sorted: [...sorted],
        active: minIdx,
        line: 6,
        action: "COMPARE",
        actionClass: "tag-compare",
        phase: `Pass ${i + 1} | Candidate Index ${j}`,
        heading: `Comparing Candidate arr[${j}] (${arr[j]}) with Current Min arr[${minIdx}] (${arr[minIdx]})`,
        detail: `Evaluating: is ${arr[j]} < ${arr[minIdx]}?`,
        reason: arr[j] < arr[minIdx]
          ? `Found smaller value: ${arr[j]} is strictly less than ${arr[minIdx]}. Updating minimum.`
          : `Candidate ${arr[j]} is not smaller than current minimum ${arr[minIdx]}. Keeping current min.`
      });

      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        trace.push({
          array: [...arr],
          comparing: [],
          swapped: [],
          sorted: [...sorted],
          active: minIdx,
          line: 7,
          action: "UPDATE MIN",
          actionClass: "tag-compare",
          phase: `Pass ${i + 1} | New Minimum Found`,
          heading: `New Minimum at Index ${minIdx} (Value: ${arr[minIdx]})`,
          detail: `Recorded index ${minIdx} as the lowest value discovered so far in this pass.`,
          reason: "Candidate was strictly smaller than previous candidate."
        });
      }
    }

    if (minIdx !== i) {
      const temp = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = temp;

      trace.push({
        array: [...arr],
        comparing: [],
        swapped: [i, minIdx],
        sorted: [...sorted],
        active: -1,
        line: 9,
        action: "SWAP MIN",
        actionClass: "tag-swap",
        phase: `Pass ${i + 1} | Placement`,
        heading: `Swapping Minimum (${arr[i]}) into Position Index ${i}`,
        detail: `Swapped found minimum arr[${minIdx}] with arr[${i}] (was ${arr[minIdx]}).`,
        reason: `Selection Sort guarantees at most one swap per pass, placing the absolute minimum at index ${i}.`
      });
    } else {
      trace.push({
        array: [...arr],
        comparing: [],
        swapped: [],
        sorted: [...sorted],
        active: -1,
        line: 8,
        action: "NO SWAP",
        actionClass: "tag-locked",
        phase: `Pass ${i + 1} | Placement`,
        heading: `No Swap Needed for Index ${i}`,
        detail: `Element ${arr[i]} was already the absolute minimum in the remaining unsorted suffix.`,
        reason: "minIdx remained equal to i."
      });
    }

    sorted.push(i);
    trace.push({
      array: [...arr],
      comparing: [],
      swapped: [],
      sorted: [...sorted],
      active: -1,
      line: 10,
      action: "LOCK POSITION",
      actionClass: "tag-locked",
      phase: `Pass ${i + 1} Complete`,
      heading: `Element ${arr[i]} Locked at Index ${i}`,
      detail: `Sorted prefix expanded to [0..${i}].`,
      reason: `Index ${i} now holds the (i + 1)-th smallest element in the array.`
    });
  }

  trace.push({
    array: [...arr],
    comparing: [],
    swapped: [],
    sorted: Array.from({ length: n }, (_, k) => k),
    active: -1,
    line: 11,
    action: "SORT COMPLETE",
    actionClass: "tag-locked",
    phase: "Finished",
    heading: "Selection Sort Completed Successfully",
    detail: `Final ascending array: [${arr.join(', ')}]. Total swaps performed: at most ${n - 1}.`,
    reason: "Entire array partitioned into sorted segment."
  });

  return trace;
}

/**
 * Merge Sort Trace Generator
 */
function generateMergeTrace(inputArr) {
  const arr = [...inputArr];
  const n = arr.length;
  const trace = [];

  trace.push({
    array: [...arr],
    comparing: [],
    swapped: [],
    sorted: [],
    range: [0, n - 1],
    line: 1,
    action: "INITIALIZE",
    actionClass: "tag-locked",
    phase: "Setup",
    heading: `Starting Merge Sort on ${n} Elements`,
    detail: `Input array: [${arr.join(', ')}]. Merge Sort uses Divide-and-Conquer to bisect the array, sort halves, and merge them in monotonic order.`,
    reason: "Beginning recursion at root range [0.." + (n - 1) + "]."
  });

  function merge(left, mid, right) {
    trace.push({
      array: [...arr],
      comparing: [],
      swapped: [],
      sorted: [],
      range: [left, right],
      line: 7,
      action: "MERGE PHASE",
      actionClass: "tag-divide",
      phase: `Merging Subarrays [${left}..${mid}] and [${mid + 1}..${right}]`,
      heading: `Combining Sorted Halves`,
      detail: `Left half: [${arr.slice(left, mid + 1).join(', ')}] | Right half: [${arr.slice(mid + 1, right + 1).join(', ')}].`,
      reason: "Both halves are individually sorted. Now combining them using two pointers i and j."
    });

    const temp = [];
    let i = left;
    let j = mid + 1;

    while (i <= mid && j <= right) {
      trace.push({
        array: [...arr],
        comparing: [i, j],
        swapped: [],
        sorted: [],
        range: [left, right],
        line: 9,
        action: "COMPARE",
        actionClass: "tag-compare",
        phase: `Subarray Merge Pointers (i=${i}, j=${j})`,
        heading: `Comparing Left Pointer arr[${i}] (${arr[i]}) vs Right Pointer arr[${j}] (${arr[j]})`,
        detail: `Evaluating: is ${arr[i]} <= ${arr[j]}?`,
        reason: arr[i] <= arr[j]
          ? `Because ${arr[i]} <= ${arr[j]}, we take ${arr[i]} from the left half to preserve stability.`
          : `Because ${arr[j]} < ${arr[i]}, we take smaller element ${arr[j]} from the right half.`
      });

      if (arr[i] <= arr[j]) {
        temp.push(arr[i]);
        i++;
      } else {
        temp.push(arr[j]);
        j++;
      }
    }

    while (i <= mid) {
      trace.push({
        array: [...arr],
        comparing: [i],
        swapped: [],
        sorted: [],
        range: [left, right],
        line: 12,
        action: "COPY REMAINING",
        actionClass: "tag-divide",
        phase: "Left Buffer Drain",
        heading: `Copying Remaining Left Element arr[${i}] (${arr[i]})`,
        detail: `Right half exhausted. Element ${arr[i]} is copied directly to the merge buffer.`,
        reason: "Remaining elements are already sorted."
      });
      temp.push(arr[i++]);
    }

    while (j <= right) {
      trace.push({
        array: [...arr],
        comparing: [j],
        swapped: [],
        sorted: [],
        range: [left, right],
        line: 12,
        action: "COPY REMAINING",
        actionClass: "tag-divide",
        phase: "Right Buffer Drain",
        heading: `Copying Remaining Right Element arr[${j}] (${arr[j]})`,
        detail: `Left half exhausted. Element ${arr[j]} is copied directly to the merge buffer.`,
        reason: "Remaining elements are already sorted."
      });
      temp.push(arr[j++]);
    }

    // Write back into arr
    for (let k = 0; k < temp.length; k++) {
      const targetIdx = left + k;
      arr[targetIdx] = temp[k];
      trace.push({
        array: [...arr],
        comparing: [],
        swapped: [targetIdx],
        sorted: (left === 0 && right === n - 1) ? Array.from({ length: targetIdx + 1 }, (_, x) => x) : [],
        range: [left, right],
        line: 13,
        action: "WRITE BUFFER",
        actionClass: "tag-swap",
        phase: `Writing Merged Buffer to arr[${targetIdx}]`,
        heading: `Writing Sorted Value ${temp[k]} to Main Array Index ${targetIdx}`,
        detail: `Overwriting main array with sorted item from auxiliary buffer.`,
        reason: "Conquering step writes merged subproblems back into contiguous memory."
      });
    }
  }

  function sort(left, right) {
    if (left >= right) return;
    const mid = Math.floor((left + right) / 2);

    trace.push({
      array: [...arr],
      comparing: [],
      swapped: [],
      sorted: [],
      range: [left, right],
      line: 3,
      action: "DIVIDE",
      actionClass: "tag-divide",
      phase: `Divide Range [${left}..${right}]`,
      heading: `Bisecting Range [${left}..${right}] at Midpoint ${mid}`,
      detail: `Splitting problem into Left Subproblem [${left}..${mid}] and Right Subproblem [${mid + 1}..${right}].`,
      reason: "Recursion depth increases. Dividing until base case (subarrays of size 1)."
    });

    sort(left, mid);
    sort(mid + 1, right);
    merge(left, mid, right);
  }

  sort(0, n - 1);

  trace.push({
    array: [...arr],
    comparing: [],
    swapped: [],
    sorted: Array.from({ length: n }, (_, k) => k),
    range: [0, n - 1],
    line: 6,
    action: "SORT COMPLETE",
    actionClass: "tag-locked",
    phase: "Finished",
    heading: "Merge Sort Completed Successfully",
    detail: `Final ascending array: [${arr.join(', ')}]. Total divisions & merges resolved in O(N log N) time.`,
    reason: "All recursive branches merged in sorted sequence."
  });

  return trace;
}

/**
 * Initialize Learning Mode UI & Stepper
 */
function initLearningMode() {
  selectLearningAlgo(learnState.algo);
}

function selectLearningAlgo(algoKey) {
  learnState.algo = algoKey;
  stopLearningAutoPlay();

  if (DOM.learnAlgoButtons) {
    DOM.learnAlgoButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.algo === algoKey);
    });
  }

  const titles = { bubble: "Bubble Sort", selection: "Selection Sort", merge: "Merge Sort" };
  if (DOM.learnAlgoBadge) {
    DOM.learnAlgoBadge.textContent = `${titles[algoKey]} • Learning Mode`;
  }

  renderLearningPseudocode(algoKey, 1);
  renderLearningTheory(algoKey);
  regenerateLearningTrace();
}

function setLearningDataset(presetKey) {
  stopLearningAutoPlay();
  if (presetKey === 'default') {
    learnState.array = [45, 12, 85, 32, 8];
  } else if (presetKey === 'small') {
    learnState.array = [30, 10, 50, 20];
  } else if (presetKey === 'reversed') {
    learnState.array = [50, 40, 30, 20, 10];
  } else if (presetKey === 'sorted') {
    learnState.array = [10, 20, 30, 40, 50];
  } else if (presetKey === 'duplicates') {
    learnState.array = [25, 10, 25, 10, 5];
  } else if (presetKey === 'current') {
    learnState.array = [...state.array];
  }
  regenerateLearningTrace();
}

function regenerateLearningTrace() {
  if (learnState.algo === 'bubble') {
    learnState.trace = generateBubbleTrace(learnState.array);
  } else if (learnState.algo === 'selection') {
    learnState.trace = generateSelectionTrace(learnState.array);
  } else if (learnState.algo === 'merge') {
    learnState.trace = generateMergeTrace(learnState.array);
  }

  learnState.currentStep = 0;
  if (DOM.learnStepRange) {
    DOM.learnStepRange.max = Math.max(0, learnState.trace.length - 1);
    DOM.learnStepRange.value = 0;
  }
  if (DOM.learnTotalSteps) {
    DOM.learnTotalSteps.textContent = Math.max(0, learnState.trace.length - 1);
  }

  renderLearningStep(0);
}

function setLearningStep(index) {
  if (index < 0) index = 0;
  if (index >= learnState.trace.length) index = learnState.trace.length - 1;
  learnState.currentStep = index;
  renderLearningStep(index);
}

function stepLearning(delta) {
  setLearningStep(learnState.currentStep + delta);
}

function toggleLearningAutoPlay() {
  if (learnState.isPlaying) {
    stopLearningAutoPlay();
  } else {
    startLearningAutoPlay();
  }
}

function startLearningAutoPlay() {
  if (learnState.currentStep >= learnState.trace.length - 1) {
    setLearningStep(0);
  }
  learnState.isPlaying = true;
  if (DOM.learnPlayText) DOM.learnPlayText.textContent = "Pause";
  if (DOM.learnPlayIcon) DOM.learnPlayIcon.classList.add('hidden');
  if (DOM.learnPauseIcon) DOM.learnPauseIcon.classList.remove('hidden');

  clearInterval(learnState.playTimer);
  learnState.playTimer = setInterval(() => {
    if (learnState.currentStep < learnState.trace.length - 1) {
      stepLearning(1);
    } else {
      stopLearningAutoPlay();
    }
  }, learnState.playSpeedMs);
}

function stopLearningAutoPlay() {
  learnState.isPlaying = false;
  clearInterval(learnState.playTimer);
  learnState.playTimer = null;
  if (DOM.learnPlayText) DOM.learnPlayText.textContent = "Auto Play";
  if (DOM.learnPlayIcon) DOM.learnPlayIcon.classList.remove('hidden');
  if (DOM.learnPauseIcon) DOM.learnPauseIcon.classList.add('hidden');
}

function resetLearningStepper() {
  stopLearningAutoPlay();
  setLearningStep(0);
}

function renderLearningStep(index) {
  const step = learnState.trace[index];
  if (!step) return;

  // Step Counter & Slider Update
  if (DOM.learnCurrentStep) DOM.learnCurrentStep.textContent = index;
  if (DOM.learnStepRange) DOM.learnStepRange.value = index;
  const pct = Math.round((index / Math.max(1, learnState.trace.length - 1)) * 100);
  if (DOM.learnProgressPercent) DOM.learnProgressPercent.textContent = `${pct}%`;

  // Button Disabled States
  if (DOM.learnPrevBtn) DOM.learnPrevBtn.disabled = (index === 0);
  if (DOM.learnNextBtn) DOM.learnNextBtn.disabled = (index >= learnState.trace.length - 1);

  // Render Bars
  renderLearningBars(step);

  // Update Narration Box
  if (DOM.learnActionBadge) {
    DOM.learnActionBadge.textContent = step.action;
    DOM.learnActionBadge.className = `action-tag ${step.actionClass || ''}`;
  }
  if (DOM.learnPhaseText) DOM.learnPhaseText.textContent = step.phase;
  if (DOM.learnDetailHeading) DOM.learnDetailHeading.textContent = step.heading;
  if (DOM.learnDetailText) DOM.learnDetailText.textContent = step.detail;
  if (DOM.learnReasonText) DOM.learnReasonText.textContent = step.reason;

  // Update Pseudocode Highlight
  highlightPseudocodeLine(step.line);
}

function renderLearningBars(step) {
  if (!DOM.learnBarsWrapper) return;
  DOM.learnBarsWrapper.innerHTML = '';
  const arr = step.array;
  const maxVal = Math.max(...arr, 60);

  arr.forEach((val, idx) => {
    const col = document.createElement('div');
    col.className = 'bar-column';

    const valLabel = document.createElement('span');
    valLabel.className = 'bar-value';
    valLabel.textContent = val;
    col.appendChild(valLabel);

    const bar = document.createElement('div');
    bar.className = 'bar-element';
    const heightPercent = Math.max(10, (val / maxVal) * 85);
    bar.style.height = `${heightPercent}%`;

    // State Classes
    if (step.comparing && step.comparing.includes(idx)) {
      bar.classList.add('state-comparing');
      valLabel.style.color = '#fbbf24';
      valLabel.style.fontWeight = '800';
    } else if (step.swapped && step.swapped.includes(idx)) {
      bar.classList.add('state-swapping');
      valLabel.style.color = '#f87171';
      valLabel.style.fontWeight = '800';
    } else if (step.active === idx || (step.range && idx >= step.range[0] && idx <= step.range[1])) {
      bar.classList.add('state-active');
      valLabel.style.color = '#c084fc';
    } else if (step.sorted && step.sorted.includes(idx)) {
      bar.classList.add('state-sorted');
      valLabel.style.color = '#34d399';
    }

    col.appendChild(bar);

    const idxSpan = document.createElement('span');
    idxSpan.className = 'bar-index';
    idxSpan.textContent = `[${idx}]`;
    col.appendChild(idxSpan);

    DOM.learnBarsWrapper.appendChild(col);
  });
}

function renderLearningPseudocode(algoKey, activeLine = 1) {
  if (!DOM.pseudocodeViewport) return;
  DOM.pseudocodeViewport.innerHTML = '';
  const lines = LEARNING_PSEUDOCODE[algoKey] || [];

  lines.forEach(item => {
    const div = document.createElement('div');
    div.className = `code-line ${item.line === activeLine ? 'active' : ''}`;
    div.dataset.line = item.line;
    div.innerHTML = `
      <span class="line-num">${item.line}</span>
      <span class="line-text">${item.text}</span>
    `;
    DOM.pseudocodeViewport.appendChild(div);
  });
}

function highlightPseudocodeLine(lineNumber) {
  if (!DOM.pseudocodeViewport) return;
  const lines = DOM.pseudocodeViewport.querySelectorAll('.code-line');
  lines.forEach(lineEl => {
    const isTarget = Number(lineEl.dataset.line) === lineNumber;
    lineEl.classList.toggle('active', isTarget);
    if (isTarget) {
      lineEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  });
}

function renderLearningTheory(algoKey) {
  const theory = LEARNING_THEORY[algoKey];
  if (!theory) return;

  if (DOM.theoryTitle) DOM.theoryTitle.textContent = theory.title;
  if (DOM.theorySubtitle) DOM.theorySubtitle.textContent = theory.subtitle;
  if (DOM.theoryStability) DOM.theoryStability.textContent = theory.stability;
  if (DOM.theoryIntroText) DOM.theoryIntroText.textContent = theory.intro;
  if (DOM.theoryBest) DOM.theoryBest.textContent = theory.best;
  if (DOM.theoryAvg) DOM.theoryAvg.textContent = theory.avg;
  if (DOM.theoryWorst) DOM.theoryWorst.textContent = theory.worst;
  if (DOM.theorySpace) DOM.theorySpace.textContent = theory.space;
  if (DOM.theoryAppsText) DOM.theoryAppsText.textContent = theory.apps;

  if (DOM.theoryProsList) {
    DOM.theoryProsList.innerHTML = theory.pros.map(p => `<li>${p}</li>`).join('');
  }
  if (DOM.theoryConsList) {
    DOM.theoryConsList.innerHTML = theory.cons.map(c => `<li>${c}</li>`).join('');
  }
}

function benchmarkBubbleSort(inputArr) {
  const arr = [...inputArr];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;

  const t0 = performance.now();
  for (let i = 0; i < n - 1; i++) {
    let hasSwapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      comparisons++;
      if (arr[j] > arr[j + 1]) {
        swaps++;
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        hasSwapped = true;
      }
    }
    if (!hasSwapped) break;
  }
  const t1 = performance.now();
  const timeMs = Math.max(0.001, Number((t1 - t0).toFixed(4)));

  return {
    id: 'bubble',
    name: "Bubble Sort",
    colorClass: "tag-bubble",
    fillClass: "chart-fill-bubble",
    sortedArray: arr,
    comparisons,
    swaps,
    swapLabel: "Swaps",
    timeMs,
    bestTime: "Ω(N)",
    avgTime: "θ(N²)",
    worstTime: "O(N²)",
    space: "O(1)",
    stability: "Stable"
  };
}

function benchmarkSelectionSort(inputArr) {
  const arr = [...inputArr];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;

  const t0 = performance.now();
  for (let i = 0; i < n; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      comparisons++;
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      swaps++;
      const temp = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = temp;
    }
  }
  const t1 = performance.now();
  const timeMs = Math.max(0.001, Number((t1 - t0).toFixed(4)));

  return {
    id: 'selection',
    name: "Selection Sort",
    colorClass: "tag-selection",
    fillClass: "chart-fill-selection",
    sortedArray: arr,
    comparisons,
    swaps,
    swapLabel: "Swaps",
    timeMs,
    bestTime: "Ω(N²)",
    avgTime: "θ(N²)",
    worstTime: "O(N²)",
    space: "O(1)",
    stability: "Unstable"
  };
}

function benchmarkMergeSort(inputArr) {
  const arr = [...inputArr];
  let comparisons = 0;
  let writes = 0;

  function merge(left, mid, right) {
    const temp = [];
    let i = left;
    let j = mid + 1;

    while (i <= mid && j <= right) {
      comparisons++;
      if (arr[i] <= arr[j]) {
        temp.push(arr[i++]);
      } else {
        temp.push(arr[j++]);
      }
    }
    while (i <= mid) temp.push(arr[i++]);
    while (j <= right) temp.push(arr[j++]);

    for (let k = 0; k < temp.length; k++) {
      writes++;
      arr[left + k] = temp[k];
    }
  }

  function mergeSort(left, right) {
    if (left >= right) return;
    const mid = Math.floor((left + right) / 2);
    mergeSort(left, mid);
    mergeSort(mid + 1, right);
    merge(left, mid, right);
  }

  const t0 = performance.now();
  mergeSort(0, arr.length - 1);
  const t1 = performance.now();
  const timeMs = Math.max(0.001, Number((t1 - t0).toFixed(4)));

  return {
    id: 'merge',
    name: "Merge Sort",
    colorClass: "tag-merge",
    fillClass: "chart-fill-merge",
    sortedArray: arr,
    comparisons,
    swaps: writes, // writes to main array
    swapLabel: "Writes",
    timeMs,
    bestTime: "Ω(N log N)",
    avgTime: "θ(N log N)",
    worstTime: "O(N log N)",
    space: "O(N)",
    stability: "Stable"
  };
}

function getBenchmarkDataset() {
  if (!DOM.benchmarkDataset) return { data: [...state.array], description: "Visualizer Array" };
  const selection = DOM.benchmarkDataset.value;
  let arr = [];
  let description = "";

  if (selection === 'current') {
    arr = [...state.array];
    description = `Visualizer Array (${arr.length} elements)`;
  } else if (selection === 'random100') {
    arr = Array.from({ length: 100 }, () => Math.floor(Math.random() * 950) + 10);
    description = "Random Array (100 elements)";
  } else if (selection === 'random300') {
    arr = Array.from({ length: 300 }, () => Math.floor(Math.random() * 950) + 10);
    description = "Random Array (300 elements)";
  } else if (selection === 'random600') {
    arr = Array.from({ length: 600 }, () => Math.floor(Math.random() * 950) + 10);
    description = "Random Array (600 elements)";
  } else if (selection === 'sorted200') {
    arr = Array.from({ length: 200 }, (_, i) => (i + 1) * 3);
    description = "Already Sorted (200 elements)";
  } else if (selection === 'reverse200') {
    arr = Array.from({ length: 200 }, (_, i) => (200 - i) * 3);
    description = "Reverse Sorted (200 elements)";
  } else if (selection === 'duplicates200') {
    arr = Array.from({ length: 200 }, () => Math.floor(Math.random() * 8) + 1);
    description = "Duplicate Values (200 elements)";
  }

  if (DOM.benchmarkArrayInfo) {
    DOM.benchmarkArrayInfo.textContent = `Dataset: ${description}`;
  }
  return { data: arr, description };
}

function verifySortedAndIdentical(resList) {
  if (resList.length < 2) return true;
  const first = resList[0].sortedArray;
  const len = first.length;

  for (let i = 0; i < len; i++) {
    if (i > 0 && first[i] < first[i - 1]) return false; // not sorted
    for (let r = 1; r < resList.length; r++) {
      if (resList[r].sortedArray[i] !== first[i]) return false; // not identical
    }
  }
  return true;
}

function runComparisonBenchmark() {
  const { data, description } = getBenchmarkDataset();
  if (data.length === 0) return;

  // Run all 3 on independent copies
  const bRes = benchmarkBubbleSort(data);
  const sRes = benchmarkSelectionSort(data);
  const mRes = benchmarkMergeSort(data);

  const results = [bRes, sRes, mRes];

  // Identify fastest
  const minTime = Math.min(...results.map(r => r.timeMs));
  results.forEach(r => {
    r.isFastest = (r.timeMs === minTime);
  });

  // Verify correctness
  const isIdentical = verifySortedAndIdentical(results);
  if (DOM.verificationBanner) {
    DOM.verificationBanner.classList.remove('hidden');
    if (DOM.verificationDetails) {
      if (isIdentical) {
        DOM.verificationDetails.textContent = 
          `All 3 algorithms independently produced 100% identical and correctly sorted outputs (${data.length} items verified).`;
      } else {
        DOM.verificationDetails.textContent = "Warning: Outputs did not match identically.";
      }
    }
  }

  // Render Table & Charts
  renderBenchmarkTable(results);
  renderBenchmarkCharts(results);
}

function renderBenchmarkTable(results) {
  if (!DOM.comparisonTableBody) return;
  DOM.comparisonTableBody.innerHTML = '';

  results.forEach(res => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <div class="algo-col-name">
          <span class="algo-color-tag ${res.colorClass}"></span>
          <span>${res.name}</span>
        </div>
      </td>
      <td class="mono-num">${res.comparisons.toLocaleString()}</td>
      <td class="mono-num">${res.swaps.toLocaleString()} <span style="font-size: 0.72rem; color: var(--text-dim);">(${res.swapLabel})</span></td>
      <td>
        <div class="time-cell">
          <span>${res.timeMs < 0.001 ? '< 0.001' : res.timeMs.toFixed(3)} ms</span>
          ${res.isFastest ? '<span class="fastest-pill">⚡ Fastest</span>' : ''}
        </div>
      </td>
      <td class="complexity-code">${res.bestTime}</td>
      <td class="complexity-code">${res.avgTime}</td>
      <td class="complexity-code">${res.worstTime}</td>
      <td class="complexity-code">${res.space}</td>
      <td>
        <span class="stability-tag" style="padding: 0.15rem 0.5rem; font-size: 0.7rem;">${res.stability}</span>
      </td>
    `;
    DOM.comparisonTableBody.appendChild(tr);
  });
}

function renderBenchmarkCharts(results) {
  if (!DOM.operationsChartContainer || !DOM.timeChartContainer) return;

  // Chart 1: Operations Count
  const maxOps = Math.max(...results.map(r => r.comparisons + r.swaps), 1);
  DOM.operationsChartContainer.innerHTML = '';

  results.forEach(res => {
    const totalOps = res.comparisons + res.swaps;
    const pct = Math.max(4, Math.round((totalOps / maxOps) * 100));

    const group = document.createElement('div');
    group.className = 'chart-group';
    group.innerHTML = `
      <div class="chart-group-label">
        <span>${res.name}</span>
        <span class="mono-num">${res.comparisons.toLocaleString()} comps + ${res.swaps.toLocaleString()} ${res.swapLabel.toLowerCase()} (${totalOps.toLocaleString()} total)</span>
      </div>
      <div class="chart-track">
        <div class="chart-fill ${res.fillClass}" style="width: ${pct}%;">
          <span class="chart-value-overlay">${totalOps.toLocaleString()} ops</span>
        </div>
      </div>
    `;
    DOM.operationsChartContainer.appendChild(group);
  });

  // Chart 2: Execution Time (ms)
  const maxTime = Math.max(...results.map(r => r.timeMs), 0.001);
  DOM.timeChartContainer.innerHTML = '';

  results.forEach(res => {
    const pct = Math.max(4, Math.round((res.timeMs / maxTime) * 100));

    const group = document.createElement('div');
    group.className = 'chart-group';
    group.innerHTML = `
      <div class="chart-group-label">
        <span>${res.name} ${res.isFastest ? '<span class="fastest-pill">⚡ Fastest</span>' : ''}</span>
        <span class="mono-num">${res.timeMs < 0.001 ? '< 0.001' : res.timeMs.toFixed(3)} ms</span>
      </div>
      <div class="chart-track">
        <div class="chart-fill ${res.fillClass}" style="width: ${pct}%;">
          <span class="chart-value-overlay">${res.timeMs < 0.001 ? '< 0.001' : res.timeMs.toFixed(3)} ms</span>
        </div>
      </div>
    `;
    DOM.timeChartContainer.appendChild(group);
  });
}

// ============================================================================
// Initial Launch
// ============================================================================
function initApp() {
  initEventListeners();
  selectAlgorithm('bubble');
  generateRandomArray(25);
  updateTimerDisplay();
  // Run initial benchmark on launch
  runComparisonBenchmark();
  // Initialize DSA Learning Mode
  initLearningMode();
}

// Start application when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
