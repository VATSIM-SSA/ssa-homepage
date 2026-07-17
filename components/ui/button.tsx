"use client";

import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

type Variant = "filled" | "outline" | "ghost" | "menu" | "danger" | "feedback";

type ButtonBaseProps = {
  variant?: Variant;
  children: ReactNode;
  className?: string;
};

type LinkButtonProps = ButtonBaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

type NativeButtonProps = ButtonBaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonProps = LinkButtonProps | NativeButtonProps;

const baseClasses =
  "inline-flex cursor-pointer gap-2 whitespace-nowrap transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50";

const variantClasses: Record<Variant, string> = {
  filled:
    "items-center justify-center rounded-full bg-primary px-6 py-3 font-semibold text-zinc-950 hover:bg-primary/80",
  outline:
    "items-center justify-center cursor-pointer rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-white/15",
  ghost: "items-center justify-center h-full text-zinc-300 hover:text-white",
  feedback:
    "items-center justify-center rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary hover:bg-primary hover:text-zinc-950",
  menu: "text-sm px-4 py-2 hover:bg-zinc-700 rounded-lg w-full text-left transition-all duration-200 cursor-pointer text-white",
  danger:
    "items-center justify-center rounded-full bg-red-500 px-6 py-3 font-semibold text-zinc-950 hover:bg-red-500/80",
};

export function Button(buttonProps: LinkButtonProps): ReactNode;
export function Button(buttonProps: NativeButtonProps): ReactNode;
export function Button(buttonProps: ButtonProps) {
  const { variant = "filled", children, className = "" } = buttonProps;
  const isDisabled = "disabled" in buttonProps && buttonProps.disabled;
  const classes = `${isDisabled ? "opacity-50 cursor-not-allowed" : ""} ${baseClasses} ${variantClasses[variant]} ${className}`.trim();

  if ("href" in buttonProps && buttonProps.href) {
    const {
      variant: _variant,
      children: _children,
      className: _className,
      ...anchorProps
    } = buttonProps;

    return (
      <a className={classes} {...anchorProps}>
        {children}
      </a>
    );
  }

  const {
    variant: _variant,
    children: _children,
    className: _className,
    type = "button",
    ...props
  } = buttonProps as NativeButtonProps;

  return (
    <button
      type={type}
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
