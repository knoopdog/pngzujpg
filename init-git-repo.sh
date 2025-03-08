#!/bin/bash

# Farben für die Ausgabe
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Initialisiere Git Repository für pngzujpg.de ===${NC}\n"

# Prüfen, ob Git installiert ist
if ! command -v git &> /dev/null; then
    echo -e "${RED}Git ist nicht installiert. Bitte installieren Sie Git und versuchen Sie es erneut.${NC}"
    exit 1
fi

# Prüfen, ob bereits ein Git Repository existiert
if [ -d ".git" ]; then
    echo -e "${YELLOW}Ein Git Repository existiert bereits in diesem Verzeichnis.${NC}"
    read -p "Möchten Sie fortfahren und das Repository zurücksetzen? (j/n): " reset_repo
    if [ "$reset_repo" != "j" ]; then
        echo -e "${BLUE}Vorgang abgebrochen.${NC}"
        exit 0
    fi
    rm -rf .git
    echo -e "${GREEN}Bestehendes Repository wurde zurückgesetzt.${NC}"
fi

# Git Repository initialisieren
echo -e "\n${BLUE}Initialisiere Git Repository...${NC}"
git init
if [ $? -ne 0 ]; then
    echo -e "${RED}Fehler beim Initialisieren des Git Repositories.${NC}"
    exit 1
fi
echo -e "${GREEN}Git Repository erfolgreich initialisiert.${NC}"

# Dateien zum Staging-Bereich hinzufügen
echo -e "\n${BLUE}Füge Dateien zum Staging-Bereich hinzu...${NC}"
git add .
if [ $? -ne 0 ]; then
    echo -e "${RED}Fehler beim Hinzufügen der Dateien zum Staging-Bereich.${NC}"
    exit 1
fi
echo -e "${GREEN}Dateien erfolgreich zum Staging-Bereich hinzugefügt.${NC}"

# Initiales Commit erstellen
echo -e "\n${BLUE}Erstelle initiales Commit...${NC}"
git commit -m "Initiales Commit"
if [ $? -ne 0 ]; then
    echo -e "${RED}Fehler beim Erstellen des initialen Commits.${NC}"
    echo -e "${YELLOW}Hinweis: Wenn dies Ihr erstes Mal mit Git ist, müssen Sie möglicherweise Ihren Namen und Ihre E-Mail-Adresse konfigurieren:${NC}"
    echo -e "  git config --global user.name \"Ihr Name\""
    echo -e "  git config --global user.email \"ihre.email@beispiel.de\""
    echo -e "Führen Sie diese Befehle aus und versuchen Sie es erneut."
    exit 1
fi
echo -e "${GREEN}Initiales Commit erfolgreich erstellt.${NC}"

# Branch umbenennen
echo -e "\n${BLUE}Benenne den Hauptbranch in 'main' um...${NC}"
git branch -M main
if [ $? -ne 0 ]; then
    echo -e "${RED}Fehler beim Umbenennen des Branches.${NC}"
    exit 1
fi
echo -e "${GREEN}Branch erfolgreich in 'main' umbenannt.${NC}"

# Anleitung für die nächsten Schritte
echo -e "\n${BLUE}=== Nächste Schritte ===${NC}"
echo -e "${YELLOW}1. Erstellen Sie ein neues Repository auf GitHub (https://github.com/new)${NC}"
echo -e "${YELLOW}2. Verbinden Sie Ihr lokales Repository mit GitHub:${NC}"
echo -e "   git remote add origin https://github.com/IhrBenutzername/IhrRepository.git"
echo -e "   git push -u origin main"
echo -e "${YELLOW}3. Konfigurieren Sie die GitHub Secrets für das Deployment:${NC}"
echo -e "   - Gehen Sie zu Ihrem Repository auf GitHub"
echo -e "   - Navigieren Sie zu \"Settings\" > \"Secrets and variables\" > \"Actions\""
echo -e "   - Fügen Sie folgende Secrets hinzu:"
echo -e "     - FTP_SERVER: Ihre Hostinger FTP-Adresse (z.B. ftp.pngzujpg.de)"
echo -e "     - FTP_USERNAME: Ihr Hostinger FTP-Benutzername"
echo -e "     - FTP_PASSWORD: Ihr Hostinger FTP-Passwort"

echo -e "\n${GREEN}Git Repository wurde erfolgreich eingerichtet!${NC}"
