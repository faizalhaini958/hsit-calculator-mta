@echo off
echo Starting HSIT Calculator Development Server...
echo.
echo Server will be available at: http://localhost:3000
echo Press Ctrl+C to stop the server
echo.
node .\node_modules\next\dist\bin\next dev -p 3000
.\start-dev-server.bat
