Borgia Teams — Google Published CSV version
===========================================

This build reads your published CSV directly:
https://docs.google.com/spreadsheets/d/e/2PACX-1vSgj_XcnDHDe51Ddm5n2egn_ic8K19z8ZDA8z6bmLFcCTF0GLiEKIWiSQ-kNEF4Ss4aS1EHk63nFSfx/pub?gid=1575260612&single=true&output=csv

Expected columns (header row): Team, Season, Gender, Type, ICS, ScheduleURL, MessageURL

- Chips are generated from Season/Gender/Type (hides "All Year" button, but includes those rows in filtering).
- Each card shows:
  - Subscribe (always) → subscribe.html (Apple/Google/Outlook handoff)
  - View Schedule (if ScheduleURL present)
  - Message (if MessageURL present; only icon retained)

Just host the folder and open index.html.
