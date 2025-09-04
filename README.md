# Borgia Athletics Landing Page

This package contains a simple landing page that pulls team schedules and social/website links from a published Google Sheet.

## Contents
- `index.html` — main landing page
- `icons/` — folder with placeholder PNG icons (`facebook.png`, `instagram.png`, `x.png`, `hudl.png`, `link.png`). Replace with your actual graphics.

## Google Sheet Setup
The page is connected to this published Google Sheet:
- Sheet tab **Teams** — columns: `Season, Gender, Sport, Level, URL, MessageURL`
- Sheet tab **Websites-Social** — columns: `Platform, URL`

### Teams Tab
Use one row per team level (e.g., Boys Basketball Varsity).  
- `URL` = iCal feed or schedule link  
- `MessageURL` = optional (TeamSnap, Remind, GroupMe, etc.)

### Websites-Social Tab
- Include rows for `MSHSAA` and `Borgia Athletics` (these will appear as text links in the footer).  
- Social platforms (Facebook, Instagram, X (Twitter), Hudl) will render as icons from the `icons/` folder.

## Hosting Instructions
1. Upload `index.html` and the `icons/` folder to your web server.  
2. Replace placeholder icons in `/icons` with actual PNGs.  
3. Ensure your Google Sheet remains published to the web (File → Share → Publish to web).  
4. Families can visit the page, click team links, and subscribe to calendars or access social platforms.

## Updating
- Update the Google Sheet (Teams or Websites-Social tab).  
- Changes appear automatically on the landing page after refresh — no need to edit HTML.



## Optional: Icon column (Websites-Social)
If you add an `Icon` column to the **Websites-Social** sheet:
- If `Icon` has a filename (e.g., `facebook.png`), the page will show that icon from `/icons/`.
- If `Icon` is blank, the page will show the Platform name as a text link.

See `sample-sheets/Websites-Social.csv` for an example with icons specified.

## Sample CSVs
- `sample-sheets/Teams.csv` — copy into your Google Sheet tab named **Teams**.
- `sample-sheets/Websites-Social.csv` — copy into your tab named **Websites-Social**.


## Small Theme Option
Add the class `small` to the `<body>` tag in `index.html` to switch to a compact layout:

```html
<body class="small">
```

This reduces padding, font sizes, and button spacing for a denser view.
