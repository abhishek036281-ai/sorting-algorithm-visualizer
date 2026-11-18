# Sorting Algorithm Visualizer & DSA Learning Suite 📊

An educational Data Structures and Algorithms (DSA) web application that visually demonstrates and empirically compares fundamental sorting algorithms step-by-step.

Built purely with **HTML5**, **CSS3**, and **Vanilla JavaScript (ES6+)** — zero external frameworks, libraries, or backend required.

---

## 🌟 Key Application Modules

### 1. Interactive Sorting Visualizer
- **Algorithms**: Bubble Sort, Selection Sort, Merge Sort (all implemented with genuine algorithmic logic; no native `sort()` methods).
- **Execution Controls**: **Start**, **Pause**, **Resume**, and instant **Reset** without page freezing.
- **Dynamic Speed Controller**: Adjust animation delay on-the-fly from 400ms down to 6ms.
- **Array Generation & Custom Input**: Generates random arrays (10 to 60 elements) or parses custom comma-separated inputs with error validation.
- **Color-Coded Visual States**:
  - 🔵 **Blue/Cyan**: Default unsorted bars
  - 🟡 **Amber**: Elements currently being compared
  - 🔴 **Red**: Elements actively swapping or writing
  - 🟣 **Purple**: Active subarray or current minimum candidate
  - 🟢 **Emerald**: Locked in permanent sorted position
- **Web Audio Pitch Synthesizer**: Pitch-mapped auditory feedback matching element values (toggleable).

### 2. DSA Learning Mode (Step-by-Step Interactive Tutor)
- **Bidirectional Stepper**: **Previous Step (◀)**, **Next Step (▶)**, **Auto Play (▶▶)**, and **Reset (↺)**.
- **Scrubbable Progress Slider**: Instantly jump to any step in the algorithm's execution history.
- **Pedagogical Narration**:
  - Identifies which elements are compared.
  - Explains why a swap was required or skipped.
  - Highlights when elements reach their final sorted position.
  - Deconstructs Merge Sort's divide, conquer, and buffer write-back phases.
- **Synchronized Pseudocode Visualizer**: Active line of pseudocode dynamically illuminates in real-time matching the executing operation.
- **Algorithm Theory Panel**: In-depth explanations of principles, asymptotic complexities, advantages, disadvantages, and real-world applications.

### 3. Algorithm Comparison Dashboard
- **Empirical Benchmarking**: Executes Bubble Sort, Selection Sort, and Merge Sort on identical, independent array copies without animation latency.
- **Metrics Collected**: Exact comparisons count, swap/write counts, and measured CPU duration in milliseconds (`performance.now()`).
- **Graphical Bar Charts**: Visual comparison of operations count ($\text{comparisons} + \text{swaps}$) and execution times.
- **Fastest Algorithm Highlight**: Automatically awards a glowing `⚡ Fastest` badge to the winner.
- **Correctness Verifier**: Programmatically verifies that all outputs are 100% sorted and identical.

### 4. Educational Hub & DSA Glossary
- **Master Complexity Reference Matrix**: Comparative table featuring asymptotic classifications and ideal use cases.
- **Foundational Concepts**: Deep dives into memory representation of arrays, comparison theory, swap mechanics, and divide-and-conquer recurrences.
- **Comprehensive DSA Glossary**: Terminology reference covering In-place sorting, Stability, Auxiliary Space, Big-O notations, Inversions, and Recursion trees.

---

## 📸 Interface Preview & Architecture

```text
+-----------------------------------------------------------------------------------+
|  [Logo] SortVisualizer       [Visualizer] [Learning Mode] [Comparison] [Theory]   |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  [EXECUTION CONTROLS]     [LIVE STATS RIBBON: Comparisons | Swaps | Size | Time]  |
|  - Start / Pause / Reset                                                          |
|  - Speed Slider (6-420ms) +-----------------------------------------------------+  |
|  - Size Slider (10-60)    |               VISUALIZER CANVAS AREA                |  |
|  - Custom Array Input     |  |||  |||||  ||||||||||||||  |||||  |||||||||||||   |  |
|                           +-----------------------------------------------------+  |
|                           [STEP TRACKER: Live action narration & explanation]    |
+-----------------------------------------------------------------------------------+
|  DSA LEARNING MODE: [Prev Step] [Auto Play] [Next Step] [Step Slider: 4/28 (14%)]  |
|  +-------------------------------------+ +--------------------------------------+ |
|  |    SYNCHRONIZED PSEUDOCODE          | |       ALGORITHM THEORY PANEL         | |
|  | 4: swapped = false                  | | Best: Ω(N)  |  Worst: O(N²)          | |
|  | 5: for j from 0 to n-i-2 do         | | Advantages & Real-World Uses         | |
|  | 6: > if arr[j] > arr[j+1] then <    | | Working Principle Breakdown          | |
|  +-------------------------------------+ +--------------------------------------+ |
+-----------------------------------------------------------------------------------+
|  COMPARISON DASHBOARD: [Dataset Picker] [Run Benchmark] -> Results Table & Charts |
+-----------------------------------------------------------------------------------+
|  EDUCATIONAL HUB: Master Complexity Matrix & DSA Glossary                         |
+-----------------------------------------------------------------------------------+
```

---

## 📁 File Structure

```text
sorting-algorithm-visualizer/
├── index.html                  # Semantic UI layout, visualizer canvas, learning stepper & dashboards
├── style.css                   # Modern dark dashboard theme, responsive layouts & animations
├── script.js                   # Visualizer loop, deterministic step tracers, benchmarks & audio
├── README.md                   # Project overview, quickstart & architecture
├── vercel.json                 # Static deployment configuration for Vercel
├── .gitignore                  # Git ignore rules for clean repository state
├── test-full-audit.js          # Automated 57-test verification harness
└── documentation/
    ├── PROJECT_REPORT.md       # Comprehensive academic project report (10 chapters)
    ├── VIVA_QUESTIONS.md       # 35 project-related viva questions and simple answers
    └── ALGORITHM_NOTES.md      # Deep algorithm notes, dry runs & derivations
```

---

## 🚀 How to Run Locally

Because this project uses vanilla web standards, no compilation, npm install, or backend server is required.

### Option 1: Direct Browser Launch
1. Open the project folder in your file explorer.
2. Double-click `index.html` (or right-click $\rightarrow$ Open With Google Chrome / Edge / Firefox / Safari).

### Option 2: Local Python Server (Recommended)
Open a terminal in the project directory and run:
```bash
# Python 3
python -m http.server 5500
```
Then visit: **`http://localhost:5500`**

### Option 3: VS Code Live Server
1. Open the project folder in VS Code.
2. Click **Go Live** on the bottom status bar (or right-click `index.html` $\rightarrow$ "Open with Live Server").

---

## 🧪 Automated Testing Suite

Run the full 57-test automated verification suite:
```bash
node test-full-audit.js
```
Expected output:
```text
=================================================
AUDIT RESULTS: 57 / 57 TESTS PASSED (100%)
=================================================
```

---

## 🌐 Deployment Instructions

### Deploy to Vercel (Recommended)
1. Install Vercel CLI (optional) or connect your GitHub repository to [Vercel](https://vercel.com).
2. Because the project includes `vercel.json` configured for clean static file serving, simply import the repository and deploy with default settings.
3. No build command or output directory configuration is needed.

### Deploy to GitHub Pages
1. Push the repository to GitHub.
2. In your repository settings, go to **Pages**.
3. Under **Build and deployment**, select **Source: Deploy from a branch**.
4. Choose the `main` branch and `/ (root)` folder, then click **Save**.

---

## 📚 Complete Project Documentation Links
- [Academic Project Report](file:///documentation/PROJECT_REPORT.md)
- [Viva Questions & Answers](file:///documentation/VIVA_QUESTIONS.md)
- [Deep Algorithm Notes & Pseudocode](file:///documentation/ALGORITHM_NOTES.md)
