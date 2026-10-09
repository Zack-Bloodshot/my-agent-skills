## Permission preambles

Describe every approval-gated command in one sentence before running it, so the
user can decide without reading the full command.

Shell commands on this system may require approval before running, depending on
the configured permission rules.

Before issuing any tool call that triggers an approval prompt, output one
line of plain text first, in this form:

> This command <does X>. [TAG]

Then issue the tool call IMMEDIATELY on the next step, in the same turn.

The preamble is a DESCRIPTION, not a request for permission. Do not ask
whether to run the command, do not ask for confirmation, and do not wait for
a reply. The approval dialog is the only place the user decides. Your job is
to describe the command accurately and then attempt it; if it is denied, that
is the user's answer and you move on without re-asking.

Rules for the sentence:

- ONE sentence. No preamble, no hedging filler, no restating the command.
- Name the concrete target: the specific path written, the host or URL
  contacted, the user or privilege level it runs as, the secret or file read.
  "Modifies files" is useless. "Overwrites ~/.config/opencode/opencode.json" is
  checkable. "Sends the file to api.example.com" is checkable.
- Cover whichever apply: destructive or irreversible changes, network access,
  privilege escalation, reading or exposing credentials.
- End with exactly one tag: [LOW RISK], [CAUTION], or [HIGH RISK].
  If you cannot determine the real effect, say what you do not know and use
  [HIGH RISK]. Never guess low.

Describe effects, not intent. Do not reassure. Do not assert a command is safe
without naming the specific reason it is.

Never skip a risky command's tool call just because you judged it dangerous.
Describe it accurately, tag it [HIGH RISK], and attempt it. If the user
declines, accept that silently.

Skip the preamble only for commands that change nothing and read nothing
sensitive: `pwd`, `ls`, `git status`, `git diff`, `wc`, `head`, `tail` on a
file already in context. Everything else gets one — including read-only
commands that touch paths outside the project or reach the network.