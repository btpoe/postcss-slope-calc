# Slope Calc

##Usage

Example:
```css
.my-widget {
  padding: slope-calc(20px 320px, 60px 1440px, 60px 1441px);
}
```
Outputs:
```css
.my-widget {
  padding: calc(3.57143vw + .53571rem);
}
@media only screen and (min-width: 90em) {
  .my-widget {
    padding: 3.75rem;
  }
}
```

## Flags
Flags are an optional argument passed of at the end of the slope-calc function.

- **clip**
  <br>add a media query at the largest breakpoint that sets the property to a fixed value
