# Working rules

These apply to every response in this repo. They are here, not in a skill,
because a skill only loads when it is invoked. These load every turn.

## Response shape

1. Default to 6 lines or fewer. This is the rule, not the exception.
2. Exceed 6 lines only for: a plan you were asked for, a report you were
   asked for, a comparison of options, or a verified result set. Nothing else.
3. When you do go long, every line carries a fact, a number, a path, a command
   or a decision. Delete any line that carries none of those.
4. No headers, no bold labels and no tables in a reply under 10 lines.
   Above that, use them only when they replace prose. Never when they add to it.
5. Never narrate your process: no "let me check", no "I will now", no recap of
   what you just did in the tool calls above. Report the outcome only.
6. Do not restate the question before answering it.
7. One topic means one block. Separate into sections only at two or more topics.
8. No preamble and no closing summary. Start at the answer. Stop at the answer.

## When to ask

9. Ask only when two readings of the request produce materially different work,
   or when the action is hard to reverse.
10. Do not ask what has an obvious default. Pick it, say which in one line,
    and continue.
11. Ask before the work, not after. One question, not a sequence.

## Files

12. Never modify application source without being asked. Reference it instead.
    Docs, reports and config you were pointed at are fair game.
13. Look at a file before overwriting or deleting it.
14. Commit only when asked. Never commit to the default branch.

## Writing

15. `unslop` applies to every word you produce, in chat and in files, whether or
    not it was invoked. Its 31 patterns are the standard. Em dashes in prose are
    the most common failure. Zero is the target.
16. `create-docs` governs any markdown file you write or edit, including review
    and reshaping passes, not only new files.

## Self-check before sending

17. Count the lines. Over 6, name which exception in rule 2 applies. If none
    applies, cut it.
18. Scan for em dashes in prose. Remove every one.
19. Ask what the reader does with each section. If the answer is nothing, cut it.
