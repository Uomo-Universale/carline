# CarLine Parent Intake Form — Google Form Questions
# Copy each section below into a new Google Form

============================================================
FORM TITLE: Rambam Day School — CarLine Registration
FORM DESCRIPTION:
Please complete this form for each family. Your information will be used
to set up your account in the CarLine dismissal app. All data is kept
private and is only accessible to school staff.
============================================================


── SECTION 1: Your Children ────────────────────────────────

[Short answer] Child 1 — First Name *
[Short answer] Child 1 — Last Name *
[Dropdown]    Child 1 — Grade *
  - Kindergarten
  - 1st grade
  - 2nd grade
  - 3rd grade
  - 4th grade
  - 5th grade

[Short answer] Child 1 — Homeroom / Class *
  (Example: K-A, 3-B)

[Short answer] Child 2 — First Name
  (Leave blank if only one child)
[Short answer] Child 2 — Last Name
[Dropdown]    Child 2 — Grade
  (Same options as above)
[Short answer] Child 2 — Homeroom / Class

[Short answer] Child 3 — First Name
[Short answer] Child 3 — Last Name
[Dropdown]    Child 3 — Grade
[Short answer] Child 3 — Homeroom / Class


── SECTION 2: Parent / Guardian 1 ──────────────────────────

[Short answer] First Name *
[Short answer] Last Name *
[Short answer] Cell Phone *
  (Example: +1 (917) 555-0142)
[Short answer] Email Address *
  IMPORTANT: This email will be your CarLine login username.
  Use an address you check regularly.
[Multiple choice] Is this the primary contact? *
  - Yes
  - No


── SECTION 3: Parent / Guardian 2 ──────────────────────────
(Complete if a second parent/guardian also needs app access)

[Short answer] First Name
[Short answer] Last Name
[Short answer] Cell Phone
[Short answer] Email Address
  This email will also be a CarLine login.
[Multiple choice] Is this the primary contact?
  - Yes
  - No


── SECTION 4: Vehicle(s) ───────────────────────────────────

Vehicle 1 (Primary)
[Short answer] Year *
  (Example: 2022)
[Short answer] Make *
  (Example: Toyota)
[Short answer] Model *
  (Example: Highlander)
[Short answer] Color *
  (Example: Silver, Dark Blue, White)
[Short answer] License Plate Number *
  (Example: ABC 1234)
[Dropdown]    State *
  - NY
  - NJ
  - CT
  - PA
  - Other

Vehicle 2 (if applicable)
[Short answer] Year
[Short answer] Make
[Short answer] Model
[Short answer] Color
[Short answer] License Plate Number
[Dropdown]    State
  (Same options as above)

Vehicle 3 (if applicable)
[Short answer] Year
[Short answer] Make
[Short answer] Model
[Short answer] Color
[Short answer] License Plate Number
[Dropdown]    State


── SECTION 5: Authorized Pickups ───────────────────────────
(People OTHER than the parents above who are approved to pick up your child)
Leave blank if no additional authorized pickups.

Authorized Person 1
[Short answer] Full Name
  (Example: Rachel Adler)
[Short answer] Relationship to Child
  (Example: Grandmother, Aunt, Babysitter, Neighbor)
[Short answer] Email Address
  (Leave blank if they do not need their own CarLine app login)
  NOTE: If this person picks up regularly or on a set schedule, they
  should have their own login so they can check in and track their
  place in the queue themselves. Staff can always look up a student
  and initiate pickup on behalf of someone without a login.
[Multiple choice] How often does this person pick up?
  - Regularly / on a set schedule (give them a login)
  - Occasionally / in emergencies only (no login needed)
[Checkboxes]  Approved to pick up: (select all that apply)
  - Child 1
  - Child 2
  - Child 3

Authorized Person 2
[Short answer] Full Name
[Short answer] Relationship to Child
[Short answer] Email Address
  (Leave blank if login not needed)
[Multiple choice] How often does this person pick up?
  - Regularly / on a set schedule (give them a login)
  - Occasionally / in emergencies only (no login needed)
[Checkboxes]  Approved to pick up:
  - Child 1
  - Child 2
  - Child 3

Authorized Person 3
[Short answer] Full Name
[Short answer] Relationship to Child
[Short answer] Email Address
  (Leave blank if login not needed)
[Multiple choice] How often does this person pick up?
  - Regularly / on a set schedule (give them a login)
  - Occasionally / in emergencies only (no login needed)
[Checkboxes]  Approved to pick up:
  - Child 1
  - Child 2
  - Child 3


── SECTION 6: Dismissal Notes ──────────────────────────────

[Paragraph] Any standing dismissal instructions we should know about?
  (Example: "Emma always goes to aftercare on Tuesdays",
   "Noah is a bus rider on Mondays only", "Grandma picks up every Friday")

[Multiple choice] How does your child typically get home? *
  - Car (carline)
  - Bus
  - Walk / parent walks up
  - Aftercare
  - Mixed (varies by day)


── HOW TO USE THIS FORM ────────────────────────────────────

1. Go to forms.google.com → Blank form
2. Set title and description from the top of this file
3. Add each question in order, using the [type] shown:
     [Short answer]   → Short answer question
     [Paragraph]      → Paragraph question
     [Dropdown]       → Dropdown question
     [Multiple choice]→ Multiple choice question
     [Checkboxes]     → Checkboxes question
4. Mark questions with * as Required
5. Add section headers by clicking the = icon (Add section)
6. Share the form link with all families

── HOW TO PROCESS RESPONSES ────────────────────────────────

1. In Google Forms → Responses → View in Sheets
2. Use the spreadsheet to fill in the CSV templates:
     - Each child row → 01-students.csv
     - Each parent row → 02-guardians.csv
     - Guardian + child combinations → 03-guardian-student-links.csv
     - Each vehicle row → 04-vehicles.csv
     - Each authorized pickup → 05-authorized-pickups.csv
3. Import each CSV into Supabase:
     Table Editor → select table → Import data → Upload CSV
