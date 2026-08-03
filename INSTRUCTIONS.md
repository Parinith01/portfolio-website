# Restarting Your Application

Your server terminal shows it has been running for **over 4 hours**. This means it is still running the **OLD CODE** and does not know about the new backend, database, or API routes I just built.

You **MUST** restart it for the changes to work.

## Step 1: Stop the Old Server
1.  Click inside your terminal window where `npx tsx server/index.ts` is running.
2.  Press **`Ctrl` + `C`**. This sends a stop signal.
3.  If it asks `Terminate batch job (Y/N)?`, type `Y` and press **Enter**.
4.  The terminal should return to a prompt (e.g., `D:\Neon-Geometry\Neon-Geometry>`).

## Step 2: Start the New Server
1.  Run the full stack (Frontend + Backend) with this single command:
    ```powershell
    npm run dev
    ```
    *(Note: This runs `NODE_ENV=development tsx server/index.ts` as defined in your package.json)*

2.  Wait for the success messages:
    *   `MongoDB Connected: ...`
    *   `serving on port 5001`

## Step 3: Verify It Works
Go to your browser:
*   **Web App:** [http://localhost:5001](http://localhost:5001) (Should show your Portfolio Home)
*   **API Check:** [http://localhost:5001/api/projects](http://localhost:5001/api/projects) (Should return `[]` or JSON data, NOT a 404 page)
