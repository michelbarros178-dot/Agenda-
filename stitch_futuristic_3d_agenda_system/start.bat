@echo off
title CHRONO-CORE // MISSION CONTROL
cls
echo =====================================================================
echo    🌌 CHRONO-CORE : FUTURISTIC 3D AGENDA & DEFENSE-IN-DEPTH SYSTEM
echo =====================================================================
echo.
echo [1/2] Iniciando Servidor Node.js en http://localhost:3000 ...
echo [2/2] Abriendo interfaz en el navegador...
echo.
timeout /t 2 /nobreak >nul
start "" http://localhost:3000
node server.js
pause
