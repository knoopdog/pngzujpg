# GitHub-basiertes Deployment für pngzujpg.de

Diese Anleitung erklärt, wie Sie Ihre pngzujpg.de-Website mit GitHub und GitHub Actions automatisch auf Ihren Hostinger-Server deployen können.

## Vorteile des GitHub-basierten Deployments

- **Versionskontrolle**: Vollständiger Verlauf aller Änderungen
- **Einfache Zusammenarbeit**: Mehrere Personen können am Code arbeiten
- **Automatisierung**: Automatisches Deployment bei jedem Push
- **Sicherheit**: Keine Passwörter in lokalen Konfigurationsdateien
- **Rollback-Möglichkeit**: Einfaches Zurücksetzen auf frühere Versionen

## Voraussetzungen

- [Git](https://git-scm.com/downloads) auf Ihrem Computer installiert
- Ein [GitHub-Konto](https://github.com/join) (kostenlos)
- FTP-Zugangsdaten für Ihren Hostinger-Server

## Ersteinrichtung

### 1. Git-Repository initialisieren

Verwenden Sie eines der mitgelieferten Skripte, um ein Git-Repository für Ihr Projekt zu initialisieren:

- **Für macOS/Linux**: Führen Sie `./init-git-repo.sh` im Terminal aus
- **Für Windows**: Doppelklicken Sie auf `init-git-repo.bat`

Alternativ können Sie die Befehle auch manuell ausführen:

```bash
git init
git add .
git commit -m "Initiales Commit"
git branch -M main
```

### 2. GitHub-Repository erstellen

1. Gehen Sie zu [GitHub](https://github.com/) und melden Sie sich an
2. Klicken Sie auf das "+" Symbol in der oberen rechten Ecke und wählen Sie "New repository"
3. Geben Sie einen Namen für Ihr Repository ein (z.B. "pngzujpg")
4. Lassen Sie die Option "Initialize this repository with a README" deaktiviert
5. Klicken Sie auf "Create repository"
6. Folgen Sie den Anweisungen unter "…or push an existing repository from the command line":

```bash
git remote add origin https://github.com/IhrBenutzername/IhrRepository.git
git push -u origin main
```

### 3. GitHub Secrets für FTP-Zugang konfigurieren

1. Gehen Sie zu Ihrem Repository auf GitHub
2. Klicken Sie auf "Settings" > "Secrets and variables" > "Actions"
3. Klicken Sie auf "New repository secret"
4. Fügen Sie die folgenden Secrets hinzu:

| Name | Wert | Beschreibung |
|------|------|-------------|
| `FTP_SERVER` | `ftp.pngzujpg.de` | Ihre Hostinger FTP-Adresse |
| `FTP_USERNAME` | `ihr_benutzername` | Ihr Hostinger FTP-Benutzername |
| `FTP_PASSWORD` | `ihr_passwort` | Ihr Hostinger FTP-Passwort |

### 4. Deployment-Verzeichnis anpassen (optional)

Wenn Sie in ein bestimmtes Unterverzeichnis auf Ihrem Hostinger-Server deployen möchten:

1. Öffnen Sie die Datei `.github/workflows/deploy.yml`
2. Suchen Sie die Zeile mit `server-dir: /public_html/`
3. Ändern Sie den Pfad entsprechend, z.B. `server-dir: /public_html/pngzujpg.de/`
4. Committen und pushen Sie die Änderung:

```bash
git add .github/workflows/deploy.yml
git commit -m "Deployment-Pfad angepasst"
git push
```

## Tägliche Nutzung

### Änderungen vornehmen und deployen

1. Nehmen Sie Änderungen an Ihren Dateien vor
2. Fügen Sie die Änderungen zum Staging-Bereich hinzu:
   ```bash
   git add .
   ```
3. Committen Sie die Änderungen:
   ```bash
   git commit -m "Beschreibung Ihrer Änderungen"
   ```
4. Pushen Sie die Änderungen zu GitHub:
   ```bash
   git push
   ```
5. GitHub Actions wird automatisch ausgelöst und Ihre Änderungen auf Hostinger deployen

### Deployment-Status überprüfen

1. Gehen Sie zu Ihrem Repository auf GitHub
2. Klicken Sie auf den "Actions"-Tab
3. Sie sehen den aktuellen und vergangene Workflow-Ausführungen
4. Klicken Sie auf eine Ausführung, um Details zu sehen

### Manuelles Deployment auslösen

Wenn Sie das Deployment manuell auslösen möchten:

1. Gehen Sie zum "Actions"-Tab in Ihrem GitHub-Repository
2. Wählen Sie den "Deploy to Hostinger" Workflow
3. Klicken Sie auf "Run workflow"
4. Wählen Sie den Branch aus (normalerweise "main")
5. Klicken Sie auf "Run workflow"

## Fortgeschrittene Funktionen

### Branches für Entwicklung nutzen

Für größere Änderungen können Sie Feature-Branches verwenden:

1. Erstellen Sie einen neuen Branch:
   ```bash
   git checkout -b feature/neue-funktion
   ```
2. Nehmen Sie Ihre Änderungen vor und committen Sie sie
3. Pushen Sie den Branch zu GitHub:
   ```bash
   git push -u origin feature/neue-funktion
   ```
4. Erstellen Sie einen Pull Request auf GitHub
5. Nach dem Review und Merge wird das Deployment automatisch ausgelöst

### Deployment nur für bestimmte Branches

Standardmäßig wird das Deployment nur für den `main`-Branch ausgelöst. Sie können dies in der `.github/workflows/deploy.yml` Datei anpassen:

```yaml
on:
  push:
    branches: [ main, production ]  # Fügen Sie weitere Branches hinzu
```

### Rollback zu einer früheren Version

Um zu einer früheren Version zurückzukehren:

1. Finden Sie den Commit-Hash der gewünschten Version:
   ```bash
   git log --oneline
   ```
2. Erstellen Sie einen neuen Branch von diesem Commit:
   ```bash
   git checkout -b rollback-branch <commit-hash>
   ```
3. Pushen Sie diesen Branch:
   ```bash
   git push -u origin rollback-branch
   ```
4. Erstellen Sie einen Pull Request und mergen Sie in den main-Branch

## Fehlerbehebung

### Deployment schlägt fehl

1. Überprüfen Sie die Workflow-Logs im "Actions"-Tab
2. Stellen Sie sicher, dass Ihre FTP-Zugangsdaten korrekt sind
3. Überprüfen Sie, ob der Zielordner auf dem Server existiert und Schreibrechte hat

### Lokale Git-Probleme

- **Änderungen können nicht gepusht werden**:
  ```bash
  git pull --rebase
  git push
  ```

- **Konflikte bei der Zusammenarbeit**:
  ```bash
  git pull
  # Konflikte lösen
  git add .
  git commit -m "Konflikte gelöst"
  git push
  ```

## Weitere Ressourcen

- [GitHub Actions Dokumentation](https://docs.github.com/en/actions)
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)
- [FTP Deploy Action](https://github.com/SamKirkland/FTP-Deploy-Action)
