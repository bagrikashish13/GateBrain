import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

// Primary = the one main action: solid white with a cut corner. Outline = a sharp hairline box
// for the rest. No pills, no gradients (SPEC §7).
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 border text-sm whitespace-nowrap transition-[background-color,color,border-color,opacity] outline-none select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-act active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-45 aria-invalid:border-alert [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[16px] [&_svg]:stroke-[1.75]",
  {
    variants: {
      variant: {
        default: "cut-solid border-transparent bg-act font-semibold text-act-ink [--cut:10px] hover:bg-white",
        outline:
          "border-line-2 bg-transparent font-medium text-fg hover:border-muted-foreground hover:bg-raised aria-expanded:bg-raised",
        ghost:
          "border-transparent font-medium text-muted-foreground hover:bg-raised hover:text-fg aria-expanded:bg-raised",
        destructive:
          "border-alert/50 bg-transparent font-medium text-alert hover:bg-alert/10",
        link: "border-transparent font-medium text-fg underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-4",
        sm: "h-9 gap-1.5 px-3 text-[13px]",
        icon: "size-11",
        "icon-sm": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
