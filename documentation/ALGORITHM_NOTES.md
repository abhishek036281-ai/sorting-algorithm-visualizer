# COMPREHENSIVE SORTING ALGORITHM NOTES & REFERENCE

This technical reference provides deep algorithmic derivations, step-by-step traces, pseudocode, asymptotic analysis, and real-world considerations for **Bubble Sort**, **Selection Sort**, and **Merge Sort**.

---

## 1. BUBBLE SORT

### 1.1 Overview & Intuition
Bubble Sort is an elementary comparison-based algorithm. It models a physical process where lighter elements rise to the surface (left/front) while heavier elements sink to the bottom (right/rear) through repeated pairwise adjacent swaps.

### 1.2 Step-by-Step Working Principle
1. Traverse the array from index `0` to `n - 2`.
2. For every adjacent pair `(arr[j], arr[j + 1])`:
   - Compare `arr[j]` and `arr[j + 1]`.
   - If `arr[j] > arr[j + 1]`, swap them.
3. At the end of the first pass, the largest element is guaranteed to be at index `n - 1`.
4. Repeat for the remaining unsorted subarray of length `n - 1`, `n - 2`, etc.
5. **Optimization**: If a complete pass finishes without a single swap, terminate early (the array is already sorted).

### 1.3 Pseudocode
```text
procedure BubbleSort(arr: Array of Numbers):
    n = length(arr)
    for i from 0 to n - 1 do:
        swapped = false
        for j from 0 to n - i - 2 do:
            if arr[j] > arr[j + 1] then:
                swap(arr[j], arr[j + 1])
                swapped = true
        mark arr[n - 1 - i] as sorted
        if not swapped then:
            break // Early termination optimization
    end for
end procedure
```

### 1.4 Dry Run Example
**Input**: `[5, 1, 4, 2, 8]`
- **Pass 1 ($i = 0$)**:
  - Compare $(5, 1) \rightarrow 5 > 1 \implies$ Swap: `[1, 5, 4, 2, 8]`
  - Compare $(5, 4) \rightarrow 5 > 4 \implies$ Swap: `[1, 4, 5, 2, 8]`
  - Compare $(5, 2) \rightarrow 5 > 2 \implies$ Swap: `[1, 4, 2, 5, 8]`
  - Compare $(5, 8) \rightarrow 5 < 8 \implies$ No swap: `[1, 4, 2, 5, 8]`
  - *Result of Pass 1*: 8 is in its permanent position.
- **Pass 2 ($i = 1$)**:
  - Compare $(1, 4) \rightarrow 1 < 4 \implies$ No swap.
  - Compare $(4, 2) \rightarrow 4 > 2 \implies$ Swap: `[1, 2, 4, 5, 8]`
  - Compare $(4, 5) \rightarrow 4 < 5 \implies$ No swap.
  - *Result of Pass 2*: 5 is in its permanent position.
- **Pass 3 ($i = 2$)**:
  - Compare $(1, 2) \implies$ No swap.
  - Compare $(2, 4) \implies$ No swap.
  - *No swaps occurred* $\implies$ Early termination triggered!
**Final Array**: `[1, 2, 4, 5, 8]`

### 1.5 Complexity Analysis
- **Best Case Time**: $\Omega(N)$ (Already sorted list, 1 pass, $N - 1$ comparisons, 0 swaps).
- **Average Case Time**: $\theta(N^2)$ (Random permutations, $\approx N^2/4$ swaps).
- **Worst Case Time**: $O(N^2)$ (Reverse sorted, $\frac{N(N-1)}{2}$ comparisons and swaps).
- **Auxiliary Space**: $O(1)$ (In-place; only one temporary swap variable).
- **Stability**: **Stable** (strictly adjacent swaps do not invert identical keys).

---

## 2. SELECTION SORT

### 2.1 Overview & Intuition
Selection Sort divides the array into a sorted prefix on the left and an unsorted suffix on the right. In each pass, it selects the smallest element from the unsorted suffix and swaps it with the leftmost unsorted element.

### 2.2 Step-by-Step Working Principle
1. Set the boundary between sorted and unsorted portions at index `i = 0`.
2. Find the index `minIdx` of the smallest value in the range `[i ... n - 1]`.
3. Swap `arr[i]` with `arr[minIdx]`.
4. Advance the boundary `i++` and repeat until the array is fully sorted.

### 2.3 Pseudocode
```text
procedure SelectionSort(arr: Array of Numbers):
    n = length(arr)
    for i from 0 to n - 1 do:
        minIdx = i
        for j from i + 1 to n - 1 do:
            if arr[j] < arr[minIdx] then:
                minIdx = j
        end for
        if minIdx != i then:
            swap(arr[i], arr[minIdx])
        mark arr[i] as sorted
    end for
end procedure
```

### 2.4 Dry Run Example
**Input**: `[64, 25, 12, 22, 11]`
- **Pass 1 ($i = 0$)**:
  - Scan unsorted `[64, 25, 12, 22, 11]`. Smallest is `11` at index 4.
  - Swap `arr[0]` (64) with `arr[4]` (11) $\implies$ `[11, 25, 12, 22, 64]`.
- **Pass 2 ($i = 1$)**:
  - Scan unsorted `[25, 12, 22, 64]`. Smallest is `12` at index 2.
  - Swap `arr[1]` (25) with `arr[2]` (12) $\implies$ `[11, 12, 25, 22, 64]`.
- **Pass 3 ($i = 2$)**:
  - Scan unsorted `[25, 22, 64]`. Smallest is `22` at index 3.
  - Swap `arr[2]` (25) with `arr[3]` (22) $\implies$ `[11, 12, 22, 25, 64]`.
- **Pass 4 ($i = 3$)**:
  - Scan unsorted `[25, 64]`. Smallest is `25` at index 3 (`minIdx == i`).
  - No swap needed $\implies$ `[11, 12, 22, 25, 64]`.
**Final Array**: `[11, 12, 22, 25, 64]`

### 2.5 Complexity Analysis
- **Best Case Time**: $\Omega(N^2)$ (Must always scan suffix to confirm minimum).
- **Average Case Time**: $\theta(N^2)$.
- **Worst Case Time**: $O(N^2)$.
- **Auxiliary Space**: $O(1)$ (In-place).
- **Swap Efficiency**: At most $N - 1$ total swaps ($O(N)$ writes).
- **Stability**: **Unstable** (Long-distance swaps can reorder equal elements).

---

## 3. MERGE SORT

### 3.1 Overview & Intuition
Merge Sort is a classic Divide-and-Conquer algorithm based on the observation that merging two already-sorted arrays into one larger sorted array can be done in linear $O(N)$ time.

### 3.2 Step-by-Step Working Principle
1. **Divide**: Find the midpoint $mid = \lfloor(left + right) / 2\rfloor$.
2. **Conquer**: Recursively call `MergeSort` on the left half `[left ... mid]` and the right half `[mid + 1 ... right]`.
3. **Combine**: Merge the two sorted halves into a temporary buffer and copy the sorted values back into the primary array.

### 3.3 Pseudocode
```text
procedure MergeSort(arr, left, right):
    if left >= right then:
        return // Base case: subarray of size 1 is already sorted
    mid = floor((left + right) / 2)
    MergeSort(arr, left, mid)
    MergeSort(arr, mid + 1, right)
    Merge(arr, left, mid, right)
end procedure

procedure Merge(arr, left, mid, right):
    temp = []
    i = left
    j = mid + 1
    
    // Compare elements from left and right halves
    while i <= mid and j <= right do:
        if arr[i] <= arr[j] then:
            temp.push(arr[i])
            i = i + 1
        else:
            temp.push(arr[j])
            j = j + 1
    end while
    
    // Copy remaining elements
    while i <= mid do:
        temp.push(arr[i])
        i = i + 1
    while j <= right do:
        temp.push(arr[j])
        j = j + 1
        
    // Copy merged buffer back into original array
    for k from 0 to length(temp) - 1 do:
        arr[left + k] = temp[k]
    end for
end procedure
```

### 3.4 Dry Run Example
**Input**: `[38, 27, 43, 3, 9, 82, 10]`

1. **Division Tree**:
   - `[38, 27, 43, 3, 9, 82, 10]` $\rightarrow$ Left: `[38, 27, 43, 3]`, Right: `[9, 82, 10]`
   - Split `[38, 27, 43, 3]` $\rightarrow$ `[38, 27]` and `[43, 3]`
   - Split `[38, 27]` $\rightarrow$ `[38]` and `[27]`

2. **Merge Steps**:
   - Merge `[38]` and `[27]` $\implies$ `[27, 38]`
   - Merge `[43]` and `[3]` $\implies$ `[3, 43]`
   - Merge `[27, 38]` and `[3, 43]` $\implies$ `[3, 27, 38, 43]`
   - Subtree `[9, 82, 10]` divides and merges $\implies$ `[9, 10, 82]`
   - Final Merge: `[3, 27, 38, 43]` and `[9, 10, 82]`:
     - Compare $3 \le 9 \rightarrow$ pick 3
     - Compare $27 > 9 \rightarrow$ pick 9
     - Compare $27 > 10 \rightarrow$ pick 10
     - Compare $27 \le 82 \rightarrow$ pick 27
     - Compare $38 \le 82 \rightarrow$ pick 38
     - Compare $43 \le 82 \rightarrow$ pick 43
     - Copy remaining 82.
**Final Array**: `[3, 9, 10, 27, 38, 43, 82]`

### 3.5 Complexity Analysis
- **Recurrence**: $T(N) = 2T(N/2) + O(N)$.
- **Time Complexity**: $\theta(N \log N)$ in best, average, and worst cases.
- **Auxiliary Space**: $O(N)$ auxiliary memory for merge buffer $+ O(\log N)$ recursive stack frames.
- **Stability**: **Stable** (when `arr[i] <= arr[j]`, taking from the left half preserves relative order).

---

## 4. COMPARISON SUMMARY TABLE

| Feature | Bubble Sort | Selection Sort | Merge Sort |
| :--- | :--- | :--- | :--- |
| **Best Case Time** | $\Omega(N)$ | $\Omega(N^2)$ | $\Omega(N \log N)$ |
| **Average Case Time** | $\theta(N^2)$ | $\theta(N^2)$ | $\theta(N \log N)$ |
| **Worst Case Time** | $O(N^2)$ | $O(N^2)$ | $O(N \log N)$ |
| **Auxiliary Memory** | $O(1)$ | $O(1)$ | $O(N)$ |
| **Stability** | Stable | Unstable | Stable |
| **Max Swaps / Writes** | $\approx N^2 / 2$ | $N - 1$ | $N \log_2 N$ |
| **Adaptive?** | Yes (early exit) | No | No |
| **Key Advantage** | Simplest logic; linear on sorted data | Minimal memory writes ($O(N)$) | Guaranteed $O(N \log N)$; parallelizable |
