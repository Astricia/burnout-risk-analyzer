# Burnout Risk Analyzer — Project Documentation

## 🚀 Overview
The **Burnout Risk Analyzer** is a responsive Next.js web application designed for developers to monitor their work-life balance. It allows users to log daily working hours and stress levels, calculates a burnout risk score based on a weighted algorithm, and provides data-driven mental health insights.

---

## 📁 Project Structure & File Explanations

### 1. State Management
#### `store/useBurnoutStore.ts`
*   **Purpose:** Manages the global state of the application using **Zustand**.
*   **Key Features:**
    *   Defines `WorkLog` and `StressLog` interfaces with unique `id` (using `crypto.randomUUID()`).
    *   `addWorkLog` / `addStressLog`: Appends new entries to the historical logs.
    *   `removeWorkLog` / `removeStressLog`: Deletes specific logs from the global state by ID.
    *   **Persistent Context:** Acts as the "source of truth" for all pages in the app.

### 2. Logic & Algorithms
#### `utils/burnoutLogic.ts`
*   **Purpose:** The "brain" of the application handling all mathematical calculations.
*   **Key Functions:**
    *   `calculateBurnoutScore`: Implements the weighted formula ($AverageHours \times 0.6 + StressScore \times 4$).
    *   `filterToLastNDays`: Uses JavaScript's `.filter()` to isolate logs from the last 7 days for "Weekly" analysis.
    *   `getAverageHours` & `getMostFrequentStress`: Derived data utilities for trends.
    *   `mergeLogsByDay`: Combines disparate work and stress logs into a unified view for the UI.

### 3. Application Pages (App Router)
#### `app/page.tsx` (Dashboard)
*   **Purpose:** The main hub of the application.
*   **Logic:** Uses `useEffect` to trigger recalculations of the burnout score and weekly stats whenever the global store changes.
*   **UI Sections:** Risk Score Badge, 4-stat Weekly Summary Grid, and a real-time list of all logs with a **Delete** feature.

#### `app/insights/page.tsx`
*   **Purpose:** Provides a deep-dive analysis of the user's data.
*   **Logic:** Generates **dynamic recommendations** based on the current risk level and average hours.
*   **UI Sections:** Weekly Trend grid, personalized advice, and a side-by-side view of work hours vs. stress per day.

#### `app/log-work/page.tsx`
*   **Purpose:** Data entry for daily hours.
*   **Features:** Controlled form input with validation (rejects empty inputs, non-numbers, and hours outside the 1–24 range).

#### `app/log-stress/page.tsx`
*   **Purpose:** Data entry for mental state.
*   **Features:** Replaces standard dropdowns with interactive, color-coded radio buttons (Green for Low, Yellow for Medium, Red for High) for a premium User Experience.

### 4. Reusable Components
*   **`components/Card.tsx`:** A container component with unified padding, shadows, and rounded corners.
*   **`components/RiskBadge.tsx`:** A dynamic badge that changes color (Green/Yellow/Red) based on the risk string.
*   **`components/Navbar.tsx`:** Handles navigation between the four main routes.

---

## 🛠️ Requirement Implementation Mapping

### 1. Modern JavaScript (ES6+)
| Requirement | Implementation |
| :--- | :--- |
| **`let` & `const`** | Used in every file for variable declaration. |
| **Arrow Functions** | Used for all functional components and utility logic in `burnoutLogic.ts`. |
| **Destructuring** | Extensively used in pages to extract methods/data from the Zustand store. |
| **Spread Operator** | Used in `useBurnoutStore.ts` to immutably update state arrays. |
| **Modules** | Full project structure relies on ES6 `import`/`export`. |
| **Array Methods** | Uses `.map()` for rendering lists, `.filter()` for weekly data, and `.reduce()` for score calculation. |

### 2. React Fundamentals
| Requirement | Implementation |
| :--- | :--- |
| **Functional Components** | 100% of the UI is built with functional components. |
| **Props** | Used in `Card`, `RiskBadge`, and `StatBox` to create reusable layouts. |
| **Conditional Rendering** | Used to show success messages (`message && ...`) and alternate empty states. |
| **List Rendering + Keys** | All log lists in the Dashboard and Insights use `.map()` with unique `log.id` as keys. |

### 3. State Management
| Requirement | Implementation |
| :--- | :--- |
| **`useState`** | Manages form inputs and local message states in logging pages. |
| **`useEffect`** | Located in `app/page.tsx` and `app/insights/page.tsx` to compute derived stats whenever logs update. |
| **Derived State** | The burnout score and weekly trends are calculated on-the-fly from the raw logs. |
| **Zustand** | Implemented in `store/useBurnoutStore.ts` to persist data across page navigations. |

### 4. Data Handling Logic
| Requirement | Implementation |
| :--- | :--- |
| **Burnout Formula** | Implemented as a weighted calculation in `utils/burnoutLogic.ts`. |
| **Weekly Aggregation** | Logs are filtered by the last 7 days using `filterToLastNDays`. |
| **Score Categories** | Categorized into Low, Moderate, and High risks in `calculateBurnoutScore`. |
| **Dynamic Recommendations** | Logic in `insights/page.tsx` varies the advice text based on specific data thresholds. |

### 5. Next.js & Styling
| Requirement | Implementation |
| :--- | :--- |
| **App Router** | Folder-based structure in the `app/` directory with `layout.tsx` and `page.tsx`. |
| **Client Components** | Interaction points are marked with `"use client"` where state/effects are needed. |
| **Tailwind CSS** | Used for the entire UI, including responsive utility classes (e.g., `md:p-10`). |
| **Responsive Design** | Dashboard and Insights columns collapse for mobile screens and expand for desktop. |

### 6. Forms & Interaction
| Requirement | Implementation |
| :--- | :--- |
| **Controlled Forms** | All inputs (number and radio) are managed via React state. |
| **Validation** | Range checking (1–24 hrs) and data type validation (number vs string) in `log-work`. |
| **Delete Feature** | Users can remove individual entries via the Trash icon on the Dashboard. |

---

## 📊 Summary of Functions
*   **Create:** Logging hours and stress.
*   **Read:** Viewing scores, trends, and individual log entries.
*   **Update:** Recalculating scores locally via state updates.
*   **Delete:** Removing mistaken entries via the Dashboard.
