import { createSprinkles, defineProperties } from "@vanilla-extract/sprinkles"
import { vars } from "./theme.css"

const responsiveProperties = defineProperties({
  conditions: {
    mobile: {},
    tablet: { "@media": "screen and (min-width: 768px)" },
    desktop: { "@media": "screen and (min-width: 1024px)" },
  },
  defaultCondition: "mobile",
  properties: {
    display: ["none", "flex", "block", "inline", "grid"],
    flexDirection: ["row", "column"],
    justifyContent: ["stretch", "flex-start", "center", "flex-end", "space-around", "space-between"],
    alignItems: ["stretch", "flex-start", "center", "flex-end"],
    gap: vars.space,
    padding: vars.space,
    paddingTop: vars.space,
    paddingBottom: vars.space,
    paddingLeft: vars.space,
    paddingRight: vars.space,
    margin: vars.space,
    marginTop: vars.space,
    marginBottom: vars.space,
    marginLeft: vars.space,
    marginRight: vars.space,
    width: vars.space,
    height: vars.space,
    borderRadius: vars.space,
    fontSize: vars.fontSizes,
  },
})

const colorProperties = defineProperties({
  conditions: {
    base: {},
    hover: { selector: "&:hover" },
    active: { selector: "&:active" },
    focus: { selector: "&:focus" },
  },
  defaultCondition: "base",
  properties: {
    color: vars.colors,
    backgroundColor: vars.colors,
    borderColor: vars.colors,
  },
})

const interactiveProperties = defineProperties({
  conditions: {
    base: {},
    hover: { selector: "&:hover" },
    active: { selector: "&:active" },
  },
  defaultCondition: "base",
  properties: {
    transform: ["scale(1.1)", "scale(1)"],
  },
})

export const sprinkles = createSprinkles(responsiveProperties, colorProperties, interactiveProperties)
