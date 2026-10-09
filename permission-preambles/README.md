# Permission Preambles

A drop-in instruction block that makes an agent describe any approval-gated
command in one sentence before running it, so you can approve or reject
without reading the full command.

## What it produces

```
  ▸ This command overwrites ~/.config/opencode/opencode.json, replacing your
    permission rules. [HIGH RISK]

  Allow once / Always / Reject
```

One sentence, a concrete target, and one risk tag. That is the whole output.

## Why the wording is so insistent

The paragraph beginning *"The preamble is a DESCRIPTION, not a request for
permission"* is load-bearing, and it exists because of an observed failure.

Without it, models read "output one line first" as **propose, then wait for
consent**. The result: the agent narrates the command, asks you in prose
whether to run it, and never triggers the real approval dialog. You get a
paragraph of prose instead of a dialog you can act on.

The companion rule — *never skip a risky command's tool call just because you
judged it dangerous* — fixes the same class of problem from the other side.
Left alone, a model asked to run `curl … | sh` will often just refuse, describe
why, and offer a safer alternative. That is a reasonable instinct and the
exact opposite of what you want here: the user, not the agent, decides. So the
instruction is to describe it, tag it `[HIGH RISK]`, and attempt it anyway.

If you fork this, keep both paragraphs. They are the difference between a rule
that works and one that gets politely ignored.

## Install

### OpenCode (global)

Append `AGENTS.snippet.md` to your global instructions file:

```bash
mkdir -p ~/.config/opencode
cat AGENTS.snippet.md >> ~/.config/opencode/AGENTS.md
```

The file is watched live, so edits apply without a restart. A new session is
still the safest way to confirm a change took effect.

### OpenCode (per project)

Append it to `AGENTS.md` at the project root instead.

### Any other agent harness

Paste the section into whichever global instruction file your tool reads. It is
plain Markdown with no OpenCode-specific syntax.

## Prerequisites

The preamble only has anything to attach to if commands actually stop for
approval. In OpenCode that means an `ask` rule in `opencode.json`:

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "permissions": [{ "action": "shell", "resource": "*", "effect": "ask" }],
}
```

Without it, commands run silently and this rule never fires.

## Customising

- **Tags** — `[LOW RISK]`, `[CAUTION]`, `[HIGH RISK]` are just text in the
  output. Change them freely; the model follows the prompt, not a schema.
- **Exemptions** — the `pwd` / `ls` / `git status` list is deliberately narrow.
  Widening it is how agents start skipping preambles on things like
  `curl | sh`, so treat additions as a security decision.
- **Uncertainty** — the *"never guess low"* rule is the main guard against quiet
  overconfidence. Keep it if you change anything else.

## Limitations

Read these before trusting it as a safety control.

- **It is advisory, not enforced.** Nothing verifies the preamble appeared, or
  that the sentence is accurate. An agent under pressure to be terse will skip
  it. A missing preamble is not evidence of a safe command.
- **It is self-reported.** The agent describing the command is the same agent
  that chose to run it. This is not an independent second opinion, and a model
  that misunderstood a substitution will write a confident wrong sentence.
- **Substitutions hide real behaviour.** With `$(…)`, backticks, and pipes,
  the agent describes a command whose expanded form it never evaluated.
- **No working-directory context.** A command that `cd`s somewhere unexpected
  may be misdescribed.
- **Compliance is prompt-tuning, not configuration.** If a model skips
  preambles on risky commands, the fix is wording, not reinstalling. Loosen the
  emphasis and it will quietly stop working.

A genuinely independent check needs a plugin that summarises the command in a
separate stateless model call, so the describing model has never seen the
conversation that produced the command. That is a stronger design with more
moving parts; this instruction is the cheap version that costs nothing to run.

## Licence

Yours. Do what you want with it.