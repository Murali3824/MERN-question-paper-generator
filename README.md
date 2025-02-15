# Question Paper Generator

## Overview
This project is a **Question Paper Generator** that dynamically generates question papers based on **branch, regulation, year, semester, month, and subject**. It selects **short and long answer questions** based on Bloom's Taxonomy (BT) levels and ensures that the questions exist in the database (Excel file). If data is missing, it provides an appropriate message indicating which data is unavailable.

## Features
- Generate question papers with a mix of **short and long questions**.
- Filter questions by **branch, regulation, year, semester, month, and unit**.
- Validate missing data and display errors if required questions are not found.
- Uses **MongoDB** for question storage.
- Provides an API for generating question papers dynamically.
- Includes a frontend for user interaction.

## Technologies Used
### Backend:
- **Node.js** with **Express.js**
- **MongoDB** (Mongoose ORM)
- **JavaScript (ES6)**

### Frontend:
- **React.js** (Components: `GeneratePaper.jsx`, `DisplayPaper.jsx`)
- **Tailwind CSS** (for styling)

### Other Tools:
- **Excel (CSV) Processing** for importing/exporting questions
- **Git & GitHub** for version control

## Installation
### Prerequisites:
Ensure you have the following installed:
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/try/download/community)

### Steps:
1. **Clone the Repository:**
   ```sh
   git clone https://github.com/Murali3824/MERN-question-paper-generator.git
   cd MERN-question-paper-generator
   ```
2. **Install Dependencies:**
   ```sh
   npm install
   ```
3. **Setup Environment Variables:**
   - Create a `.env` file in the root directory and configure the following:
     ```env
     MONGO_URI=your_mongodb_connection_string
     PORT=5000
     ```
4. **Run the Server:**
   ```sh
   npm run dev
   ```
5. **Run the Frontend:**
   ```sh
   cd client
   npm run dev
   ```


