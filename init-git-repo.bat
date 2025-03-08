@echo off
setlocal enabledelayedexpansion

echo === Initialisiere Git Repository fuer pngzujpg.de ===
echo.

REM Prüfen, ob Git installiert ist
where git >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Git ist nicht installiert. Bitte installieren Sie Git und versuchen Sie es erneut.
    exit /b 1
)

REM Prüfen, ob bereits ein Git Repository existiert
if exist ".git" (
    echo Ein Git Repository existiert bereits in diesem Verzeichnis.
    set /p reset_repo="Moechten Sie fortfahren und das Repository zuruecksetzen? (j/n): "
    if /i "!reset_repo!" neq "j" (
        echo Vorgang abgebrochen.
        exit /b 0
    )
    rmdir /s /q .git
    echo Bestehendes Repository wurde zurueckgesetzt.
)

REM Git Repository initialisieren
echo.
echo Initialisiere Git Repository...
git init
if %ERRORLEVEL% neq 0 (
    echo Fehler beim Initialisieren des Git Repositories.
    exit /b 1
)
echo Git Repository erfolgreich initialisiert.

REM Dateien zum Staging-Bereich hinzufügen
echo.
echo Fuege Dateien zum Staging-Bereich hinzu...
git add .
if %ERRORLEVEL% neq 0 (
    echo Fehler beim Hinzufuegen der Dateien zum Staging-Bereich.
    exit /b 1
)
echo Dateien erfolgreich zum Staging-Bereich hinzugefuegt.

REM Initiales Commit erstellen
echo.
echo Erstelle initiales Commit...
git commit -m "Initiales Commit"
if %ERRORLEVEL% neq 0 (
    echo Fehler beim Erstellen des initialen Commits.
    echo Hinweis: Wenn dies Ihr erstes Mal mit Git ist, muessen Sie moeglicherweise Ihren Namen und Ihre E-Mail-Adresse konfigurieren:
    echo   git config --global user.name "Ihr Name"
    echo   git config --global user.email "ihre.email@beispiel.de"
    echo Fuehren Sie diese Befehle aus und versuchen Sie es erneut.
    exit /b 1
)
echo Initiales Commit erfolgreich erstellt.

REM Branch umbenennen
echo.
echo Benenne den Hauptbranch in 'main' um...
git branch -M main
if %ERRORLEVEL% neq 0 (
    echo Fehler beim Umbenennen des Branches.
    exit /b 1
)
echo Branch erfolgreich in 'main' umbenannt.

REM Anleitung für die nächsten Schritte
echo.
echo === Naechste Schritte ===
echo 1. Erstellen Sie ein neues Repository auf GitHub (https://github.com/new)
echo 2. Verbinden Sie Ihr lokales Repository mit GitHub:
echo    git remote add origin https://github.com/IhrBenutzername/IhrRepository.git
echo    git push -u origin main
echo 3. Konfigurieren Sie die GitHub Secrets fuer das Deployment:
echo    - Gehen Sie zu Ihrem Repository auf GitHub
echo    - Navigieren Sie zu "Settings" ^> "Secrets and variables" ^> "Actions"
echo    - Fuegen Sie folgende Secrets hinzu:
echo      - FTP_SERVER: Ihre Hostinger FTP-Adresse (z.B. ftp.pngzujpg.de)
echo      - FTP_USERNAME: Ihr Hostinger FTP-Benutzername
echo      - FTP_PASSWORD: Ihr Hostinger FTP-Passwort

echo.
echo Git Repository wurde erfolgreich eingerichtet!

pause
