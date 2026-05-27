# Contributing to ChakriFill

Thank you for your interest in contributing! This guide covers the Git workflow, branching strategy, commit conventions, and general coding standards for this project.

---

## Git Workflow

ChakriFill follows a strict **trunk-based branching strategy** to keep the history clean and the codebase stable.

### Branch Structure

| Branch | Purpose |
|---|---|
| `main` | Stable, production-ready releases only |
| `develop` | Integration branch for completed features |
| `feature/*` | New features (branched from `develop`) |
| `fix/*` | Bug fixes (branched from `develop` or `main`) |
| `refactor/*` | Code improvements with no behavior change |
| `docs/*` | Documentation updates only |
| `test/*` | Testing infrastructure and test scripts |

### Workflow Steps

```bash
# 1. Start from develop
git checkout develop
git pull origin develop

# 2. Create a descriptive feature branch
git checkout -b feature/your-feature-name

# 3. Work, commit often with conventional commits
git add .
git commit -m "feat(scope): short description"

# 4. Keep your branch up to date
git rebase develop

# 5. Push and open a Pull Request into develop
git push origin feature/your-feature-name
```

---

## Commit Message Convention

This project follows the **Conventional Commits** specification:

```
<type>(<scope>): <short description>

[optional body]
[optional footer]
```

### Types

| Type | When to use |
|---|---|
| `feat` | A new feature |
| `fix` | A bug fix |
| `refactor` | Code change that doesn't fix a bug or add a feature |
| `docs` | Documentation changes only |
| `chore` | Build process, tooling, or dependency updates |
| `test` | Adding or updating tests |
| `style` | Formatting, whitespace (no logic change) |

### Scopes (for this project)

`autofill`, `matcher`, `helpers`, `popup`, `options`, `storage`, `manifest`, `profile`, `docs`

### Examples

```
feat(matcher): add smart captcha bypass via CAPTCHA_ACTUAL element
fix(helpers): prevent double-click on already-checked checkboxes
docs(readme): add full installation and usage guide
refactor(autofill): simplify async cascade wait logic
chore: add .gitignore for OS artifacts
```

---

## Code Style

- **No framework dependencies** — plain JavaScript only in content scripts
- **JSDoc comments** on all exported functions
- **Meaningful variable names** — avoid single letters except loop counters
- **Async/await** over raw Promises
- All selectors should be **`#id`-based** where possible for performance and clarity
- Always **dispatch native events** after setting values (`input`, `change`) — never assume the form will react to silent `.value =` assignments

---

## Pull Request Guidelines

1. Keep PRs **small and focused** — one feature or fix per PR
2. Write a clear description of **what** changed and **why**
3. Reference any related issues
4. Ensure the autofill engine still works against `form.html` before submitting
5. All PRs target `develop` — only maintainers merge `develop → main` for releases
