# Fonts

Montserrat, repackaged so each weight registers as its own **family name** —
that is what `theme.js` refers to (`Montserrat Bold`, `Montserrat Semi-Bold`,
`Montserrat Ultra-Bold`).

| File | Family name |
|---|---|
| `Montserrat_Bold.ttf` | Montserrat Bold |
| `Montserrat_Semi-Bold.ttf` | Montserrat Semi-Bold |
| `Montserrat_Ultra-Bold.ttf` | Montserrat Ultra-Bold |

Montserrat is licensed under the **SIL Open Font License 1.1**.
Full licence text: https://openfontlicense.org/

## Install

```bash
cp fonts/*.ttf ~/.local/share/fonts/ && fc-cache -f
fc-list | grep Montserrat   # verify
```

Without these installed, PowerPoint substitutes a default face and the whole
deck reflows. Install before generating, not after.