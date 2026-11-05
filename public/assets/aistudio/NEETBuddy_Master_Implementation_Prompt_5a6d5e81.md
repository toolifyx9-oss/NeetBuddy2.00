# NEETBuddy --- Full-Stack Implementation Master Prompt

## Project objective

Transform the **existing NEETBuddy HTML website supplied by the user**
into a complete, production-ready, full-stack NEET preparation platform.

The supplied HTML file is the **single source of truth for the existing
product's design and current functionality**. This is an implementation
and engineering task---not a redesign task.

The target is a reliable, scalable platform with a student experience
comparable to leading NEET preparation platforms, backed by a
maintainable codebase, Supabase/PostgreSQL, and a complete admin
content-management system.

## 1. Non-negotiable rules

1.  **Preserve the existing UI/UX exactly.** Do not redesign,
    reinterpret, simplify, or replace the website.
2.  Preserve the existing:
    -   Page layouts and section order
    -   Header, navigation, menus, buttons, cards, tabs, forms and
        modals
    -   Typography, font sizes, weights, colours and backgrounds
    -   Spacing, alignment, widths, radii, shadows, borders and icon
        placement
    -   Existing wavy/curved section dividers and decorative details
    -   Logo, branding, copy, labels and visual hierarchy
    -   Desktop, tablet and mobile responsive behaviour
3.  Do not introduce a generic AI-generated template, a new visual
    system, unnecessary cards, boxy layouts, or a different colour
    palette.
4.  Do not remove existing sections or features merely because they are
    difficult to implement. If something is broken, repair it while
    retaining its intended appearance and behaviour.
5.  Do not replace the supplied design with screenshots or static
    images. Rebuild it as real, responsive, accessible interface
    components.
6.  Do not claim a feature is complete if it is only a mockup, toast,
    placeholder, hard-coded demo, or non-working button.
7.  Do not use `localStorage` or `sessionStorage` as the main database
    or source of truth. They may be used only for appropriate
    non-sensitive preferences or temporary client-side state.
8.  Never expose Supabase service-role keys, secrets, private API keys,
    or privileged credentials in browser code.
9.  Do not fabricate users, question counts, scores, analytics, test
    results, AI answers, or database records.
10. Before changing architecture, inspect the complete supplied HTML,
    including embedded/encoded pages, CSS, JavaScript, links, event
    handlers, forms and responsive rules.

## 2. Required first step: audit the supplied HTML

Before implementation:

-   Read the entire HTML file and all embedded CSS and JavaScript.
-   Decode and inspect embedded/Base64 or iframe content where present.
-   Inventory every page, section, route, component, form, button, menu,
    tab, modal and interactive element.
-   Trace each interaction to its current event handler and identify
    dead, incomplete or demo-only behaviour.
-   Identify existing design tokens, fonts, icons, breakpoints, spacing
    rules and reusable patterns.
-   Record which features already work, which partially work and which
    do not work.
-   Identify duplicated code, global state problems, navigation problems
    and security risks.
-   Create a page-and-feature checklist so no existing section is
    accidentally omitted.

Produce a short audit report and implementation checklist, then proceed
with implementation. Do not stop after the audit or merely return a
plan.

## 3. Recommended technical architecture

Use a maintainable modern architecture while reproducing the existing
design:

-   Frontend: React + TypeScript + Vite.
-   Routing: React Router.
-   Backend and database: Supabase + PostgreSQL.
-   Authentication: Supabase Auth.
-   File storage: Supabase Storage.
-   Server-side privileged logic: Supabase Edge Functions or a secure
    backend service.
-   Data fetching/state: a consistent query and cache strategy, with
    clear loading/error states.
-   Forms: validated schemas and accessible form controls.
-   Testing: Vitest, React Testing Library and Playwright where
    appropriate.

If the supplied project already has a sound framework or build system,
assess it before migrating. Do not perform a migration just for fashion.
Whichever architecture is selected must be modular, maintainable, secure
and faithful to the supplied interface.

Suggested structure:

``` text
src/
  app/
    router/
    providers/
  components/
    common/
    layout/
    navigation/
    forms/
  features/
    auth/
    dashboard/
    practice/
    questions/
    mock-tests/
    pyq/
    dpp/
    flashcards/
    notes/
    bookmarks/
    improvement-book/
    performance/
    study-plan/
    doubt-solver/
    resources/
    profile/
    settings/
    admin/
  hooks/
  lib/
    supabase/
    validation/
  services/
  styles/
  types/
supabase/
  migrations/
  functions/
tests/
```

Adjust names and boundaries to the actual supplied site. Avoid creating
empty modules or unnecessary abstraction.

## 4. Pages and routes

Preserve the existing page inventory and connect all pages through
working navigation. Implement the relevant routes from the supplied
HTML, including:

-   Landing/home page
-   Login, signup, forgot-password and reset-password
-   Student dashboard
-   Practice dashboard and subject/chapter/topic selection
-   Question practice and practice history
-   Mock tests and test instructions
-   Live test interface, result and analysis
-   Previous Year Questions (PYQ)
-   Daily Practice Problems (DPP)
-   Flashcards and review
-   Notes and bookmarks
-   Improvement Book
-   Performance and progress
-   Study plan, daily goals and tasks
-   Doubt solver
-   Study resources
-   Profile, settings and notifications
-   Admin dashboard and all admin management pages

Use the exact route names and page structure already present wherever
possible. Do not invent duplicate pages if an equivalent page already
exists.

## 5. Authentication and user accounts

Implement real Supabase authentication:

-   Signup with appropriate validation.
-   Login and logout.
-   Forgot-password and secure reset-password flow.
-   Session persistence and refresh.
-   Protected student routes.
-   Protected admin routes based on server-verified roles.
-   Profile creation and update.
-   User preferences and settings.
-   Proper loading, validation, success and error states.

Fix the current signup/login flow end-to-end. In particular, ensure that
after account creation the user reaches the correct next screen, the
account is actually created, session state is handled correctly and
errors are visible. Do not make a button appear functional without a
successful backend operation.

Never trust a role or admin flag supplied by the browser.

## 6. Database design --- Supabase/PostgreSQL

Design a relational schema with foreign keys, indexes, constraints,
timestamps and appropriate deletion behaviour. Create versioned SQL
migrations; do not rely on manual dashboard-only setup.

The schema should cover these domains as appropriate:

### Users and access

-   profiles
-   user_roles
-   user_preferences
-   user_settings
-   notification_preferences
-   subscriptions or entitlements, if required

### Academic structure

-   exams
-   subjects
-   chapters
-   topics
-   subtopics

### Question bank

-   questions
-   question_options
-   question_answers
-   question_explanations
-   question_topics
-   question_tags
-   question_sources
-   question_media
-   question_revisions
-   question_reports
-   import_batches

### Student learning activity

-   practice_sessions
-   question_attempts
-   practice_answers
-   bookmarks
-   improvement_book_items
-   chapter_progress
-   topic_progress
-   daily_activity
-   study_time_logs

### Tests

-   mock_tests
-   mock_test_sections
-   mock_test_questions
-   test_attempts
-   test_responses
-   test_results

### PYQ and DPP

-   pyq_sets
-   pyq_questions or a well-designed link to the shared question bank
-   dpp_sets
-   dpp_questions or a well-designed link to the shared question bank
-   assignments and submissions, if needed

### Learning tools

-   notes
-   flashcards
-   flashcard_decks
-   flashcard_reviews
-   study_plans
-   study_tasks
-   daily_goals

### Administration and operations

-   audit_logs
-   announcements
-   support_tickets
-   platform_settings
-   content_review_queue

Avoid duplicate copies of the same question for practice, PYQ, DPP and
tests. Prefer a canonical question record with relationship tables and
source/context metadata.

## 7. Question bank requirements

Build a question-bank system designed for **50,000 questions
initially**, with a data model and query strategy that can scale to
**100,000--200,000+ questions**.

Each question should support, where applicable:

-   Subject, chapter, topic and subtopic
-   Question statement and rich text
-   Question type: single-correct, multiple-correct, assertion-reason,
    match-the-following, statement-based, numerical and other required
    formats
-   Options and correct answer(s)
-   Explanation/solution
-   Difficulty: easy, medium, hard
-   Marks and negative marks
-   Exam/source name and year
-   Tags and concepts
-   Images, diagrams and other media
-   Publication/review status
-   Created/updated timestamps and revision history
-   Attribution, source reference and usage rights metadata

Required functionality:

-   Search, filters, sorting and pagination.
-   Fast chapter/topic filtering.
-   Bulk import and export with validation.
-   Duplicate detection using normalized text and suitable similarity
    checks.
-   Question revision/version history.
-   Report-question workflow.
-   Draft, review, approved, published and archived states.
-   Efficient indexes and query patterns.
-   Correct answer and explanation must never be exposed to students
    before the appropriate reveal/evaluation stage.

Use a canonical question bank shared by practice, tests, PYQ and DPP
wherever possible.

## 8. Automated PDF-to-question import pipeline

Build a reliable import workflow for authorised educational material. It
should support PDF and structured-file ingestion without silently
inventing missing information.

Suggested pipeline:

1.  Admin uploads a file to a private storage bucket.
2.  Create an import batch with source metadata and status.
3.  Extract text and page/layout information.
4.  Detect question boundaries.
5.  Extract question statements, options, answers and explanations when
    present.
6.  Extract images/diagrams and preserve page references.
7.  Map questions to subject, chapter, topic and difficulty.
8.  Normalize content and detect likely duplicates.
9.  Validate required fields and flag uncertainty.
10. Show a review queue with source-page evidence.
11. Admin approves, edits, rejects or bulk-approves validated records.
12. Publish approved questions to the canonical question bank.
13. Log import statistics, errors and audit history.

Rules: - Do not guess an answer key, explanation, topic or missing
option. - Mark uncertain fields for human review. - Preserve original
wording unless an editor explicitly changes it. - Preserve source
attribution, page references and rights/permission metadata. - Do not
bypass copyright or access restrictions. Only ingest material the
platform is authorised to use. - Make the pipeline resumable and safe to
retry; prevent duplicate imports.

## 9. Complete admin panel

Create a real, role-protected admin CMS that matches the existing
NEETBuddy design language.

Admins with the appropriate permissions should be able to:

-   View platform overview and operational metrics based on real
    database data.
-   Create, edit, reorder, publish, unpublish and archive subjects,
    chapters, topics and subtopics.
-   Create, edit, preview, review, publish and archive questions.
-   Manage options, answer keys, explanations, difficulty, tags, sources
    and media.
-   Upload PDFs and run the import pipeline.
-   Review extraction results and approve/reject/edit imported
    questions.
-   Bulk import/export question data.
-   Create and manage mock tests, sections, test duration, marks and
    question selection.
-   Create and manage PYQ sets and DPP sets.
-   Manage study resources and announcements.
-   View and manage user accounts within authorised permissions.
-   Handle question reports and support tickets.
-   View audit logs and content revision history.
-   Manage admin roles only if the acting user has a separately
    authorised super-admin permission.

Security: - Enforce permissions on the server/database using Supabase
RLS and secure functions. - Never allow students to promote themselves
or modify privileged content. - Log sensitive admin operations. -
Confirm destructive actions and support safe archiving/restore where
practical.

## 10. Student-facing functionality

### Dashboard

-   Display real user progress and activity.
-   Show actual practice totals, accuracy, study time and pending tasks.
-   Show goals and continue-learning links.
-   Do not use fabricated sample metrics in production.

### Practice

-   Subject → chapter → topic selection.
-   Filters for difficulty, question type and source.
-   Smooth question navigation.
-   Save/bookmark questions.
-   Submit answers and reveal explanations according to the selected
    practice mode.
-   Record attempts and update progress.
-   Resume sessions where appropriate.

### Mock test engine

-   Configurable test duration, marks and negative marking.
-   Question palette and question navigation.
-   Mark for review, clear response and save response.
-   Timer with reliable server-aware expiry.
-   Autosave responses.
-   Handle refresh/reconnection safely.
-   Auto-submit on expiry.
-   Server-side scoring and result calculation.
-   Detailed result and analysis views.
-   Never rely only on a client-side timer or client-supplied correct
    answers.

### PYQ and DPP

-   Real question sets connected to the canonical question bank.
-   Filters by subject, chapter, year, exam and difficulty as
    appropriate.
-   Track attempts, completion and performance.

### Flashcards

-   Create and manage decks/cards.
-   Review scheduling and progress.
-   Store user-created content securely.

### Notes and bookmarks

-   Create, edit, delete and search personal notes.
-   Bookmark/unbookmark questions.
-   Sync across signed-in devices.

### Improvement Book

-   Add questions based on mistakes or user selection.
-   Store mistake reason, revision status and review history.
-   Allow practice/revision from the book.

### Performance

-   Calculate metrics from actual attempts.
-   Subject/chapter/topic accuracy and progress.
-   Time and trend analysis.
-   Clearly distinguish unavailable data from zero performance.

### Study plan and goals

-   Daily goals and tasks.
-   Mark tasks complete.
-   Track streaks and completion history.
-   Make all displayed progress persistent.

### Doubt solver

-   Implement through a secure server-side AI integration.
-   Keep provider API keys out of frontend code.
-   Support question/context input and useful responses.
-   Show loading, error and retry states.
-   Do not present canned demo text as real AI output.
-   If no AI provider key is configured, show a clear setup state rather
    than pretending it works.

## 11. Storage

Create private/public storage buckets according to access needs, for
example:

-   avatars
-   question-media
-   educational-pdfs
-   study-resources
-   flashcard-media

Use signed URLs for private assets. Validate file types and sizes. Apply
appropriate storage policies. Do not make source PDFs or answer-key
files public by default.

## 12. Security and data integrity

-   Enable and test Row Level Security on every table containing user or
    protected content.
-   Students may access only their own private records.
-   Students may read only published educational content.
-   Correct answers and protected test content must be secured
    appropriately.
-   Admin permissions must be checked in trusted database/server logic.
-   Validate all input on both client and server.
-   Use parameterized queries and safe storage access.
-   Add rate limits or abuse controls to sensitive endpoints where
    appropriate.
-   Protect AI endpoints against abuse and excessive usage.
-   Add audit logs for privileged operations.
-   Provide database constraints to prevent invalid relationships and
    duplicate records.
-   Do not store passwords yourself; use Supabase Auth.

## 13. UX and reliability requirements

The design must remain faithful to the supplied HTML while every feature
becomes genuinely usable.

Implement: - Loading states and skeletons that fit the existing visual
language. - Empty states with helpful next actions. - Clear validation
and error messages. - Success feedback after real operations. -
Disabled/loading states to prevent duplicate submissions. - Responsive
layouts for phone, tablet and desktop. - Keyboard accessibility and
semantic controls. - Appropriate focus states and accessible labels. -
Graceful network failure and retry behaviour. - No dead buttons, fake
links or unexplained "Coming soon" placeholders for features that are in
scope.

Do not change the visual design merely to add these states. Reuse
existing styles and patterns.

## 14. Testing and acceptance criteria

Write and run tests for:

-   Signup, login, logout and password reset.
-   Protected routes and role permissions.
-   Admin/student access separation.
-   Subject/chapter/topic management.
-   Question creation, editing, publishing and retrieval.
-   Import validation, duplicate detection and approval.
-   Practice answer submission and progress updates.
-   Mock test timer, autosave, submission and scoring.
-   PYQ and DPP flows.
-   Notes, bookmarks, flashcards and Improvement Book.
-   Dashboard and performance calculations.
-   Mobile and desktop navigation.
-   Every visible button, form and interactive element.

Use automated tests where practical and perform a manual browser
walkthrough of all major routes. Fix console errors, failed network
requests, broken routes and layout regressions.

A feature is complete only when: 1. Its UI is present and faithful to
the supplied design. 2. Its interaction works. 3. Its data is persisted
and retrieved correctly where persistence is required. 4. Its
permissions are enforced. 5. Its loading, empty and error states work.
6. Its core workflow has been tested.

## 15. Implementation phases

Work in this order, but continue through all phases rather than stopping
after planning:

1.  **Audit:** inspect the full HTML and create a page/feature/design
    inventory.
2.  **Foundation:** set up or refine the app architecture, routing,
    design tokens and shared components without visual redesign.
3.  **Backend foundation:** configure Supabase, migrations, schema, RLS
    and storage policies.
4.  **Authentication:** implement and test complete account flows.
5.  **Core question bank:** implement academic structure, question
    schema, CRUD and retrieval.
6.  **Student learning:** implement practice, PYQ, DPP, bookmarks,
    notes, flashcards and Improvement Book.
7.  **Testing engine:** implement mock tests, autosave, submission,
    scoring and analysis.
8.  **Admin CMS:** implement content management, user management and
    permissions.
9.  **Import automation:** implement PDF/structured imports, validation
    and admin review.
10. **Analytics and AI:** implement real performance metrics, study
    plans and secure doubt solver.
11. **QA and release readiness:** test all routes, responsive behaviour,
    security and failure cases; document deployment.

## 16. Required deliverables

Deliver working project files, not just explanations:

-   Complete source code with modular structure.
-   Supabase SQL migrations.
-   RLS policies and storage policies.
-   Edge Functions/server-side code where required.
-   `.env.example` with variable names only---never real secrets.
-   Setup instructions and local development commands.
-   Database setup and migration instructions.
-   Admin setup/role assignment instructions.
-   PDF import workflow instructions.
-   Test suite and test instructions.
-   Deployment instructions.
-   A feature checklist showing implemented, tested, blocked and pending
    items.

If credentials, API keys, permissions or external services are missing,
identify exactly what is needed and provide a safe configuration path.
Do not invent credentials or claim deployment has happened.

## 17. Final instruction

Use the supplied NEETBuddy HTML as the design and product reference.
Build the actual working platform around it. **Do not redesign the
website. Do not stop at a prototype. Do not return only a plan.**

First inspect the files, then implement the complete application in
manageable phases, run tests, fix failures and report honestly what is
complete and what still requires configuration.
