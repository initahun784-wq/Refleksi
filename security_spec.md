# Security Specification for PPKn Democracy & Reflection App

## 1. Data Invariants
- `journals`: A journal must have a valid `id`, `studentId`, `studentName`, `classGroup`, `topicTitle`, `reflection`, and valid `status` ('draft', 'submitted', 'graded').
- When a student creates or updates a journal, they cannot arbitrarily set a teacher-graded score or modify teacher feedback unless authorized.
- When teacher grades a journal, score must be numeric between 0 and 100, and rubric criteria values must be bounded (1-4).
- `forum_topics`: Topic IDs must be sanitized, comments must contain required fields and bounded text length to avoid denial of wallet / payload explosion.

## 2. The "Dirty Dozen" Payloads
1. **Oversized Reflection Injection**: Payload with `reflection.facts` exceeding 50,000 characters to crash clients.
2. **Score Spoofing on Creation**: Student creates journal setting `status: 'graded'` and `score: 100` without teacher grading.
3. **Ghost Field Mutation**: Updating journal with undeclared shadow keys (e.g. `isAdmin: true`, `bypassLock: true`).
4. **Invalid Sila Enum**: `relatedSila` containing invalid numbers like `999` or negative numbers.
5. **Path Traversal in Journal ID**: Document ID containing illegal characters like `../../admin`.
6. **Student Impersonation**: Modifying another student's `studentId` or submitting under empty student name.
7. **Negative Score Exploit**: Setting `score: -50` in teacher evaluation.
8. **Rubric Score Overflow**: Setting `rubric.memprosesInformasi: 99` exceeding maximum criteria score 4.
9. **Topic Hijack**: Deleting or rewriting core curriculum forum topics without authorization.
10. **Poll Vote Poisoning**: Submitting non-existent option ID to trigger application crash.
11. **Null Payload**: Creating a document with empty body or non-object primitive.
12. **Comment Flood Attack**: Injecting array of 10,000 fake replies to trigger runaway bandwidth cost.

## 3. Test Runner Specification
Tests verify that all unauthorized writes, corrupt payloads, and oversized submissions are strictly rejected with PERMISSION_DENIED.
