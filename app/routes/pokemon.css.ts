import { style } from "@vanilla-extract/css"
import { sprinkles } from "~/styles/sprinkles.css"
import { vars } from "~/styles/theme.css"

export const container = style({
  margin: "0 auto",
  padding: vars.space[6],
})

export const title = style([
  sprinkles({
    fontSize: "3xl",
    marginBottom: 6,
  }),
  {
    fontWeight: "700",
    textTransform: "capitalize",
    textAlign: "center",
  },
])

export const card = style([
  sprinkles({
    padding: 6,
  }),
  {
    backgroundColor: vars.colors.white,
    border: `2px solid ${vars.colors.amber500}`,
  },
])

export const spriteContainer = style({
  display: "flex",
  justifyContent: "center",
  gap: vars.space[8],
  marginBottom: vars.space[6],
})

export const spriteWrapper = style({
  textAlign: "center",
})

export const spriteImage = style({
  width: vars.space[32],
  height: vars.space[32],
  objectFit: "contain",
  backgroundColor: vars.colors.gray50,
  borderRadius: vars.space[2],
  transition: "transform 0.2s",
  ":hover": {
    transform: "scale(1.1)",
  },
})

export const spriteLabel = style([
  sprinkles({
    marginTop: 2,
    fontSize: "small",
  }),
  {
    color: vars.colors.gray600,
  },
])

export const detailsSection = style({
  marginTop: vars.space[4],
})

export const detailsSummary = style({
  cursor: "pointer",
  fontSize: vars.fontSizes.small,
  color: vars.colors.gray600,
  ":hover": {
    color: vars.colors.gray800,
  },
})

export const jsonPreview = style({
  marginTop: vars.space[2],
  padding: vars.space[4],
  backgroundColor: vars.colors.gray50,
  borderRadius: vars.space[2],
  overflow: "auto",
  fontSize: vars.fontSizes.small,
})
