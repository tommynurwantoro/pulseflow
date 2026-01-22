# Software Requirements Specification: Pulseflow

**Version:** 1.0
**Project Name:** Pulseflow
**Type:** Monthly Financial Tracker Application

## 1. Introduction
**Pulseflow** is a modern monthly financial recording application designed for individuals and families. The application utilizes a unique "heartbeat" visual concept to represent the user's financial health. The core metaphor is that financial transactions act as the pulse: income increases the heart rate/score (improving health), while expenses decrease it.

## 2. Target Audience
*   **Primary:** Individuals seeking to monitor personal financial health.
*   **Secondary:** Families managing household finances together.

## 3. Functional Requirements

### 3.1. Dashboard (Home Page)
*   **REQ-DASH-01:** The home page shall display a dashboard summarizing the current month's financial status.
*   **REQ-DASH-02:** The application shall display a visual "Pulse" or heartbeat animation indicating the current financial health score.
    *   *Logic:* Income entries increase the score/pulse; Expense entries decrease the score/pulse.
*   **REQ-DASH-03:** The dashboard shall provide financial suggestions to the user.
    *   *Note:* These suggestions shall be rule-based (hardcoded logic) and **not** AI-generated for the current version.
*   **REQ-DASH-04:** The dashboard must provide a navigation button labeled "History" to access past data.

### 3.2. History and Navigation
*   **REQ-HIST-01:** The History page shall display a list of financial records grouped by previous months.
*   **REQ-HIST-02:** Users must be able to select a previous month to view the detailed data.
*   **REQ-HIST-03:** Users must be able to open and edit data from previous months (no read-only lock on past data).

### 3.3. Monthly Edit / Detail Page
*   **REQ-EDIT-01:** The detail/edit page shall be a single, consolidated view containing all financial data for the selected month.
*   **REQ-EDIT-02:** The page must support **Inline Editing**, allowing users to modify text fields directly without navigating to a separate form for every item.
*   **REQ-EDIT-03:** A prominent "Save All Changes" button must be available to commit all inline modifications at once.
*   **REQ-EDIT-04:** The page must automatically calculate and display:
    *   Total Expenses.
    *   Total Income.
*   **REQ-EDIT-05:** The layout must display the following sections:
    *   Fixed Expenses (Pengeluaran Tetap).
    *   Variable Expenses (Pengeluaran Tidak Tetap).
    *   Additional Expenses (Pengeluaran Tambahan).
    *   Asset List (List Assets).
    *   Totals per Category.

### 3.4. Transaction Recording
*   **REQ-TRANS-01:** Users shall be able to input income and expenses at any time (beginning of the month or mid-month).
*   **REQ-TRANS-02:** The system must support various types of Income, specifically including Salary and other income sources.
*   **REQ-TRANS-03:** Expenses must be categorized into three specific types:
    1.  Fixed Expenses.
    2.  Variable/Non-fixed Expenses.
    3.  Additional Expenses.
*   **REQ-TRANS-04:** Every transaction must be associated with a specific category.

### 3.5. Settings and Categories
*   **REQ-SET-01:** Users shall be able to access a Settings menu.
*   **REQ-SET-02:** Users must be able to add custom categories to be used when recording transactions.

## 4. Non-Functional Requirements

### 4.1. User Interface (UI)
*   **REQ-UI-01:** The application shall feature a modern and aesthetic design.
*   **REQ-UI-02:** The "Heartbeat" visualization must be smooth and responsive to data changes.

### 4.2. Usability
*   **REQ-US-01:** The inline edit feature must be intuitive, clearly indicating which fields are editable.
*   **REQ-US-02:** Data entry must be flexible enough to accommodate users who log data daily or monthly.

---

## 5. Data Structure Summary

| Data Entity | Description | Examples |
| :--- | :--- | :--- |
| **Income Types** | Sources of money entering the account. | Salary, Freelance, Bonus, Gift. |
| **Expense Types** | Classification of money outflow. | Fixed (Rent, Internet), Variable (Food, Transport), Additional (Emergency, Gifts). |
| **Categories** | User-defined tags for better organization. | Groceries, Utilities, Entertainment. |
| **Assets** | Items of value owned by the user/family. | House, Car, Laptop, Savings Account. |