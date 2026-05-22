import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-bold tracking-wide transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pd-primary disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-pd-primary text-pd-cream border-2 border-pd-ink shadow-[0_3px_0_#29261b] hover:-translate-y-0.5 hover:shadow-[0_4px_0_#29261b] active:translate-y-[3px] active:shadow-none",
        secondary:
          "bg-pd-cream text-pd-ink border-2 border-pd-ink shadow-[0_3px_0_#29261b] hover:-translate-y-0.5 hover:shadow-[0_4px_0_#29261b] active:translate-y-[3px] active:shadow-none",
        ghost:
          "bg-transparent text-pd-ink border border-pd-ink/20 hover:bg-pd-cream",
        outline:
          "bg-white text-pd-ink border border-pd-ink/20 hover:bg-pd-cream",
        link: "text-pd-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "px-5 py-2.5 text-sm",
        sm: "px-3.5 py-2 text-xs rounded-lg",
        lg: "px-7 py-4 text-base rounded-2xl",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  full?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, full, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }), full && "w-full")}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
