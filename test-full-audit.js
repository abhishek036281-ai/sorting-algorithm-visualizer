const fs = require('fs');
const vm = require('vm');

// Mock DOM
const elements = new Map();
function mockElement(id) {
  return {
    id,
    classList: {
      add: () => {},
      remove: () => {},
      toggle: () => {},
      contains: () => false
    },
    style: {},
    textContent: '',
    appendChild: () => {},
    innerHTML: '',
    addEventListener: () => {},
    scrollIntoView: () => {},
    dataset: {}
  };
}

const sandbox = {
  document: {
    getElementById: (id) => {
      if (!elements.has(id)) elements.set(id, mockElement(id));
      return elements.get(id);
    },
    querySelectorAll: () => [],
    createElement: (tag) => mockElement(tag),
    addEventListener: () => {}
  },
  window: {
    addEventListener: () => {}
  },
  performance: {
    now: () => Date.now()
  },
  console,
  setTimeout,
  clearTimeout,
  setInterval,
  clearInterval,
  Date,
  Math,
  Number,
  String,
  Boolean,
  Array,
  Promise
};

vm.createContext(sandbox);

let scriptCode = fs.readFileSync('C:\\Users\\Divyanshu RAI\\.gemini\\antigravity\\scratch\\sorting-algorithm-visualizer\\script.js', 'utf8');
scriptCode += `
globalThis.state = state;
globalThis.learnState = learnState;
globalThis.runBubbleSort = runBubbleSort;
globalThis.runSelectionSort = runSelectionSort;
globalThis.runMergeSort = runMergeSort;
globalThis.benchmarkBubbleSort = benchmarkBubbleSort;
globalThis.benchmarkSelectionSort = benchmarkSelectionSort;
globalThis.benchmarkMergeSort = benchmarkMergeSort;
globalThis.generateBubbleTrace = generateBubbleTrace;
globalThis.generateSelectionTrace = generateSelectionTrace;
globalThis.generateMergeTrace = generateMergeTrace;
globalThis.LEARNING_PSEUDOCODE = LEARNING_PSEUDOCODE;
globalThis.LEARNING_THEORY = LEARNING_THEORY;
`;

vm.runInContext(scriptCode, sandbox);

// Instantaneous waitStep
sandbox.waitStep = async () => {};
sandbox.playTone = () => {};

async function runVisualizerTest(algoName, inputArr) {
  sandbox.state.array = [...inputArr];
  sandbox.state.originalArray = [...inputArr];
  sandbox.state.selectedAlgo = algoName;
  sandbox.state.isRunning = true;
  sandbox.state.isAborted = false;
  sandbox.state.isPaused = false;
  sandbox.state.comparisons = 0;
  sandbox.state.swaps = 0;

  if (algoName === 'bubble') await sandbox.runBubbleSort();
  else if (algoName === 'selection') await sandbox.runSelectionSort();
  else if (algoName === 'merge') await sandbox.runMergeSort();

  const isSorted = sandbox.state.array.every((v, i, a) => i === 0 || a[i - 1] <= v);
  return { isSorted, comps: sandbox.state.comparisons, swaps: sandbox.state.swaps, output: [...sandbox.state.array] };
}

function runBenchmarkTest(algoName, inputArr) {
  let res;
  if (algoName === 'bubble') res = sandbox.benchmarkBubbleSort(inputArr);
  else if (algoName === 'selection') res = sandbox.benchmarkSelectionSort(inputArr);
  else if (algoName === 'merge') res = sandbox.benchmarkMergeSort(inputArr);

  const isSorted = res.sortedArray.every((v, i, a) => i === 0 || a[i - 1] <= v);
  const preserved = inputArr.length === res.sortedArray.length;
  return { isSorted, preserved, comps: res.comparisons, swaps: res.swaps, timeMs: res.timeMs };
}

function runTraceTest(algoName, inputArr) {
  let trace;
  if (algoName === 'bubble') trace = sandbox.generateBubbleTrace(inputArr);
  else if (algoName === 'selection') trace = sandbox.generateSelectionTrace(inputArr);
  else if (algoName === 'merge') trace = sandbox.generateMergeTrace(inputArr);

  const finalStep = trace[trace.length - 1];
  const isSorted = finalStep.array.every((v, i, a) => i === 0 || a[i - 1] <= v);
  const allStepsHaveDetail = trace.every(s => s.action && s.detail && s.reason && s.line >= 1);
  return { isSorted, allStepsHaveDetail, totalSteps: trace.length, finalArray: finalStep.array };
}

async function runCompleteAudit() {
  console.log("=================================================");
  console.log("PHASE 5: COMPREHENSIVE FUNCTIONALITY & DSA AUDIT");
  console.log("=================================================");

  const testDatasets = [
    { name: "Random Array (15 elements)", data: [45, 12, 89, 34, 2, 77, 50, 23, 105, 18, 6, 92, 41, 63, 28] },
    { name: "Already Sorted Array (10 elements)", data: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50] },
    { name: "Reverse Sorted Array (10 elements)", data: [50, 45, 40, 35, 30, 25, 20, 15, 10, 5] },
    { name: "Duplicate Values Array", data: [25, 10, 25, 5, 10, 25, 5, 10, 5] },
    { name: "Two Elements Array", data: [99, 12] },
    { name: "Minimum Size Array (3 elements)", data: [8, 3, 5] },
    { name: "Maximum Visualizer Size (60 elements)", data: Array.from({length: 60}, () => Math.floor(Math.random() * 300) + 10) }
  ];

  let totalTests = 0;
  let passedTests = 0;

  // 1. Audit Visualizer Sorting Engines
  console.log("\n--- PART 1: VISUALIZER ENGINE TESTS ---");
  for (const algo of ['bubble', 'selection', 'merge']) {
    console.log(`\nTesting Visualizer ${algo.toUpperCase()}:`);
    for (const ds of testDatasets) {
      totalTests++;
      const res = await runVisualizerTest(algo, ds.data);
      if (res.isSorted && res.output.length === ds.data.length) {
        passedTests++;
        console.log(`  [PASS] ${ds.name} -> comps: ${res.comps}, swaps/writes: ${res.swaps}`);
      } else {
        console.error(`  [FAIL] ${ds.name} -> output:`, res.output);
      }
    }
  }

  // 2. Audit Benchmark Engines
  console.log("\n--- PART 2: BENCHMARK ENGINE TESTS (INDEPENDENT COPIES) ---");
  for (const algo of ['bubble', 'selection', 'merge']) {
    console.log(`\nTesting Benchmark ${algo.toUpperCase()}:`);
    for (const ds of testDatasets) {
      totalTests++;
      const originalCopy = [...ds.data];
      const res = runBenchmarkTest(algo, ds.data);
      const notMutated = JSON.stringify(ds.data) === JSON.stringify(originalCopy);
      if (res.isSorted && res.preserved && notMutated) {
        passedTests++;
        console.log(`  [PASS] ${ds.name} -> notMutated: ${notMutated}, comps: ${res.comps}, swaps/writes: ${res.swaps}`);
      } else {
        console.error(`  [FAIL] ${ds.name}`);
      }
    }
  }

  // 3. Audit Learning Mode Deterministic Step Tracers
  console.log("\n--- PART 3: LEARNING MODE TRACE GENERATOR TESTS ---");
  const learningSamples = [
    { name: "Sample Array [45, 12, 85, 32, 8]", data: [45, 12, 85, 32, 8] },
    { name: "Small Array [30, 10, 50, 20]", data: [30, 10, 50, 20] },
    { name: "Reversed Array [50, 40, 30, 20, 10]", data: [50, 40, 30, 20, 10] },
    { name: "Duplicates Array [25, 10, 25, 10, 5]", data: [25, 10, 25, 10, 5] }
  ];

  for (const algo of ['bubble', 'selection', 'merge']) {
    console.log(`\nTesting Learning Mode ${algo.toUpperCase()}:`);
    for (const ls of learningSamples) {
      totalTests++;
      const res = runTraceTest(algo, ls.data);
      if (res.isSorted && res.allStepsHaveDetail) {
        passedTests++;
        console.log(`  [PASS] ${ls.name} -> totalSteps: ${res.totalSteps}, final: [${res.finalArray.join(', ')}]`);
      } else {
        console.error(`  [FAIL] ${ls.name}`);
      }
    }
  }

  // 4. Audit Pseudocode Line Synchronization Metadata
  console.log("\n--- PART 4: PSEUDOCODE SYNCHRONIZATION AUDIT ---");
  for (const algo of ['bubble', 'selection', 'merge']) {
    totalTests++;
    const code = sandbox.LEARNING_PSEUDOCODE[algo];
    const theory = sandbox.LEARNING_THEORY[algo];
    const valid = code && code.length >= 10 && theory && theory.best && theory.pros.length >= 2;
    if (valid) {
      passedTests++;
      console.log(`  [PASS] ${algo.toUpperCase()} -> ${code.length} pseudocode lines mapped, Theory complete.`);
    } else {
      console.error(`  [FAIL] ${algo.toUpperCase()} pseudocode/theory incomplete.`);
    }
  }

  console.log("\n=================================================");
  console.log(`AUDIT RESULTS: ${passedTests} / ${totalTests} TESTS PASSED (${Math.round((passedTests/totalTests)*100)}%)`);
  console.log("=================================================");
}

runCompleteAudit();
