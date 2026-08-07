import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-mauve-fonce focus-visible:ring-mauve-fonce/50 focus-visible:ring-[3px] aria-invalid:ring-mauve-fonce/20 aria-invalid:border-mauve-fonce",
  {
    variants: {
      variant: {
        default: "bg-mauve-fonce text-blanc hover:bg-mauve-fonce/90",
        destructive:
          "bg-mauve-fonce text-blanc hover:bg-mauve-fonce/90 focus-visible:ring-mauve-fonce/20",
        outline:
          "border border-mauve-fonce bg-blanc shadow-xs hover:bg-mauve-fonce hover:text-blanc",
        secondary:
          "bg-mauve-clair text-mauve-fonce hover:bg-mauve-fonce hover:text-blanc",
        ghost:
          "hover:bg-mauve-clair hover:text-mauve-fonce",
        link: "text-mauve-fonce underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
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
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props} />
  );
}

export { Button, buttonVariants }
