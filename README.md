# Image Cropper & Converter

Eine einfache Web-Anwendung zum Zuschneiden von Bildern, Konvertieren von PNG zu JPG und Komprimieren für das Web.

## Funktionen

- **Bild-Upload**: 
  - Drag & Drop oder Dateiauswahl
  - Unterstützung für Mehrfachauswahl von Bildern für Stapelverarbeitung
- **Bild-Zuschneiden**: 
  - Interaktives Zuschneiden mit verschiedenen Seitenverhältnissen (frei, 1:1, 4:3, 16:9)
  - Zuschneiden auf spezifische Pixelmaße (z.B. 1500px x 1500px)
  - Skalierung der Arbeitsfläche mit zentriertem Bild
  - Zuschneiden über Bildgrenzen hinaus mit anpassbarer Hintergrundfarbe
- **Formatkonvertierung**: 
  - PNG zu JPG Konvertierung (nur für PNG-Bilder)
  - Beibehaltung des Originalformats für andere Bildtypen
- **Dateinamen-Formatierung**:
  - Beibehaltung des Originalnamens mit angepasster Formatierung
  - Umwandlung aller Buchstaben in Kleinbuchstaben
  - Ersetzung von Leerzeichen und Unterstrichen durch Bindestriche
- **Komprimierung**: Optimierung für Web-Nutzung mit einstellbarer Qualität
- **Größenvergleich**: Anzeige der Originalgröße, neuen Größe und Reduktion in Prozent
- **Stapelverarbeitung**:
  - Verarbeitung mehrerer Bilder mit denselben Einstellungen
  - Fortschrittsanzeige während der Verarbeitung
  - Sammeldownload aller bearbeiteten Bilder als ZIP-Datei

## Technologien

- HTML5, CSS3, JavaScript
- [Cropper.js](https://fengyuanchen.github.io/cropperjs/) für die Crop-Funktionalität
- [browser-image-compression](https://github.com/Donaldcwl/browser-image-compression) für die Bildkomprimierung
- [JSZip](https://stuk.github.io/jszip/) für das Erstellen von ZIP-Dateien für den Sammeldownload
- [FileSaver.js](https://github.com/eligrey/FileSaver.js/) für das Speichern von Dateien im Browser

## Installation

### Manuelle Installation

1. Laden Sie alle Dateien auf Ihren Webserver hoch (z.B. Hostinger)
2. Stellen Sie sicher, dass die Verzeichnisstruktur beibehalten wird:
   ```
   image-cropper/
   ├── index.html
   ├── css/
   │   └── styles.css
   ├── js/
   │   ├── upload.js
   │   ├── cropper.js
   │   ├── converter.js
   │   ├── landing.js
   │   └── main.js
   └── README.md
   ```
3. Öffnen Sie die `index.html` in einem Webbrowser

### Automatische Deployment mit GitHub (empfohlen)

Dieses Projekt ist mit einem GitHub Actions Workflow für automatisches Deployment auf Hostinger konfiguriert.

#### Ersteinrichtung:

1. **GitHub Repository erstellen**:
   - Erstellen Sie ein neues Repository auf GitHub
   - Pushen Sie Ihren Code zum Repository:
     ```bash
     git init
     git add .
     git commit -m "Initiales Commit"
     git branch -M main
     git remote add origin https://github.com/IhrBenutzername/IhrRepository.git
     git push -u origin main
     ```

2. **GitHub Secrets konfigurieren**:
   - Gehen Sie zu Ihrem Repository auf GitHub
   - Navigieren Sie zu "Settings" > "Secrets and variables" > "Actions"
   - Fügen Sie folgende Secrets hinzu:
     - `FTP_SERVER`: Ihre Hostinger FTP-Adresse (z.B. ftp.pngzujpg.de)
     - `FTP_USERNAME`: Ihr Hostinger FTP-Benutzername
     - `FTP_PASSWORD`: Ihr Hostinger FTP-Passwort

3. **Deployment-Verzeichnis anpassen (optional)**:
   - Öffnen Sie die Datei `.github/workflows/deploy.yml`
   - Passen Sie den `server-dir` Parameter an, falls Sie in ein Unterverzeichnis deployen möchten

#### Verwendung:

Nach der Einrichtung wird jeder Push zum `main`-Branch automatisch auf Ihren Hostinger-Server deployt:

1. Nehmen Sie Änderungen an Ihren Dateien vor
2. Committen und pushen Sie die Änderungen:
   ```bash
   git add .
   git commit -m "Beschreibung Ihrer Änderungen"
   git push
   ```
3. GitHub Actions wird automatisch ausgelöst und Ihre Änderungen auf Hostinger deployen
4. Sie können den Fortschritt unter dem "Actions"-Tab in Ihrem GitHub-Repository verfolgen

#### Manuelles Deployment auslösen:

Sie können das Deployment auch manuell auslösen:
1. Gehen Sie zum "Actions"-Tab in Ihrem GitHub-Repository
2. Wählen Sie den "Deploy to Hostinger" Workflow
3. Klicken Sie auf "Run workflow"

## Lokale Entwicklung

Um die Anwendung lokal zu testen:

1. Klonen Sie das Repository oder laden Sie die Dateien herunter
2. Öffnen Sie die `index.html` direkt in einem modernen Webbrowser
3. Alternativ können Sie einen lokalen Webserver verwenden:
   - Mit Python: `python -m http.server` (im Projektverzeichnis)
   - Mit Node.js: `npx serve` (im Projektverzeichnis, erfordert Node.js)

## Nutzung

### Einzelbildverarbeitung

1. **Bild hochladen**: Ziehen Sie ein Bild in den Upload-Bereich oder klicken Sie auf "Bilder auswählen"
2. **Bild zuschneiden**: Verwenden Sie die Crop-Werkzeuge, um den gewünschten Bildausschnitt auszuwählen
   - Wählen Sie ein Seitenverhältnis (frei, 1:1, 4:3, 16:9)
   - Ziehen Sie den Auswahlrahmen, um den Bildausschnitt anzupassen
   - **Spezifische Pixelmaße**: Geben Sie die gewünschte Breite und Höhe in Pixeln ein und klicken Sie auf "Anwenden"
   - **Arbeitsfläche skalieren**: Aktivieren Sie diese Option, um die Arbeitsfläche auf die angegebenen Pixelmaße zu skalieren
   - **Über Bildgrenzen hinaus croppen**: Aktivieren Sie diese Option, um über die Bildgrenzen hinaus zu croppen
   - **Hintergrundfarbe**: Wählen Sie eine Hintergrundfarbe für Bereiche außerhalb des Originalbildes
3. **Konvertierung und Komprimierung einstellen**:
   - Aktivieren/deaktivieren Sie die PNG zu JPG Konvertierung
   - Stellen Sie die Qualität mit dem Schieberegler ein (höhere Werte = bessere Qualität, größere Dateien)
4. **Bild verarbeiten**: Klicken Sie auf "Zuschneiden & Konvertieren"
5. **Ergebnis herunterladen**: Klicken Sie auf "Bild herunterladen"
6. **Neues Bild bearbeiten**: Klicken Sie auf "Neues Bild bearbeiten", um von vorne zu beginnen

### Stapelverarbeitung

1. **Mehrere Bilder hochladen**: Ziehen Sie mehrere Bilder in den Upload-Bereich oder klicken Sie auf "Bilder auswählen" und wählen Sie mehrere Dateien aus
2. **Einstellungen konfigurieren**: Stellen Sie die gewünschten Parameter für die Stapelverarbeitung ein
   - Wählen Sie ein Seitenverhältnis oder geben Sie spezifische Pixelmaße ein
   - Konfigurieren Sie die Konvertierungs- und Komprimierungsoptionen
3. **Stapelverarbeitung starten**: Klicken Sie auf "Alle verarbeiten"
4. **Fortschritt verfolgen**: Beobachten Sie den Fortschrittsbalken und die Ergebnisliste
5. **Alle Bilder herunterladen**: Klicken Sie auf "Alle herunterladen", um alle verarbeiteten Bilder als ZIP-Datei herunterzuladen
6. **Stapelverarbeitung abbrechen**: Klicken Sie auf "Abbrechen", um zur Startseite zurückzukehren

## Browser-Kompatibilität

Die Anwendung funktioniert in allen modernen Browsern:
- Chrome (empfohlen)
- Firefox
- Safari
- Edge

## Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert.
