---
description: Start the HSIT Calculator development server
---

# How to Run the Development Server

Follow these steps to start the HSIT Calculator application:

## Steps

1. Open PowerShell or Terminal in the project folder
   ```
   cd c:\xampp\htdocs\hsit-calculator\hsit-calculator
   ```

// turbo
2. Run the development server
   ```
   node .\node_modules\next\dist\bin\next dev -p 3000
   ```

3. Wait for the server to start (usually takes 2-5 seconds)
   - You should see: `✓ Ready in X.Xs`
   - Server will be available at: http://localhost:3000

4. Open your browser and go to http://localhost:3000

## To Stop the Server

Press `Ctrl + C` in the terminal where the server is running.

## Notes

- You do NOT need to run XAMPP for this project
- The database is SQLite (file-based), not MySQL
- If you see hydration warnings in the browser console, you can ignore them - they're caused by browser extensions and don't affect functionality
