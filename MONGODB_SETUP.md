# How to Fix "Database Connection Failed"

The app needs a database (MongoDB) to save your data. Follow these steps to start it.

## Step 1: Start MongoDB
You need to get the "mongod" service running.

**Option A: Using MongoDB Compass (Easiest)**
1.  Open **MongoDB Compass** on your computer (search for it in the Start menu).
2.  Click **Connect** (using the default `mongodb://localhost:27017`).
3.  If it connects, the database is running! You can go to Step 2.
4.  If it fails, you likely need to install or run the server manually.

**Option B: Using Command Line (PowerShell)**
1.  Open a **New** Terminal window.
2.  Type `mongod` and press Enter.
3.  **Success:** If you see a lot of text logs and it stops at "Waiting for connections", keep this window OPEN. converting
4.  **Error:** If it says "The term 'mongod' is not recognized", you might not have MongoDB installed or it's not in your PATH.

**Option C: If You Don't Have MongoDB Installed**
1.  Download **MongoDB Community Server** from [mongodb.com](https://www.mongodb.com/try/download/community).
2.  Install it (Select "Run service as Network Service user" when asked).
3.  Once installed, it should run automatically in the background.

## Step 2: Start Your App
Once the database is running (or Compass is connected):

1.  Go back to your main project terminal (VS Code).
2.  Stop any failing command (Ctrl+C).
3.  Run the start command:
    ```powershell
    npm run dev
    ```
4.  You should see: `MongoDB Connected: localhost`.

## Step 3: Open the Website
*   **Link:** [http://localhost:5001](http://localhost:5001)

If you still have trouble, let me know if you see the "mongod not recognized" error.
