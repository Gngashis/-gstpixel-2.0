import { Slot } from "@radix-ui/react-slot";
import { Link } from "@tanstack/react-router";
import { cva, type VariantProps } from "class-variance-authority";
import {
  type ButtonHTMLAttributes,
  type AnchorHTMLAttributes,
  useState,
  useRef,
  useEffect,
  isValidElement,
} from "react";
import { cn } from "@/lib/utils";
import { Loader2, Check, X, ArrowRight } from "lucide-react";

export const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-sm text-sm font-semibold transition-[background-color,color,border-color,transform,box-shadow] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-45",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.985] shadow-[var(--btn-shadow-rest)] hover:shadow-[var(--btn-shadow-hover)] focus-visible:shadow-[var(--btn-shadow-focus)]",
        primary:
          "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.985] shadow-[var(--btn-shadow-rest)] hover:shadow-[var(--btn-shadow-hover)] focus-visible:shadow-[var(--btn-shadow-focus)]",
        secondary:
          "border border-border bg-surface text-foreground hover:border-primary/60 hover:bg-surface-strong active:scale-[0.985] shadow-[var(--depth-shadow-xs)] hover:shadow-[var(--depth-shadow-sm)] focus-visible:shadow-[var(--btn-shadow-focus)]",
        outline:
          "border border-border bg-transparent text-foreground hover:bg-surface active:scale-[0.985] shadow-[var(--depth-shadow-xs)] hover:shadow-[var(--depth-shadow-sm)] focus-visible:shadow-[var(--btn-shadow-focus)]",
        ghost:
          "text-muted-foreground hover:bg-surface hover:text-foreground active:scale-[0.985]",
        quiet:
          "text-muted-foreground hover:bg-surface hover:text-foreground active:scale-[0.985]",
        destructive:
          "bg-destructive text-destructive-foreground hover:opacity-90 active:scale-[0.985] shadow-[var(--depth-shadow-sm)] hover:shadow-[var(--depth-shadow-md)] focus-visible:shadow-[0_0_0_3px_oklch(0.59_0.2_28_/_0.25)]",
        link: "text-primary underline-offset-4 hover:underline",
        glass:
          "bg-transparent text-foreground backdrop-blur-md border border-border/40 hover:border-primary/50 hover:bg-[color-mix(in_oklab,_var(--env-current-glass-tint)_50%,_transparent)] active:scale-[0.985] shadow-[var(--depth-shadow-sm)] hover:shadow-[var(--depth-shadow-md),_var(--depth-glow-primary)] focus-visible:shadow-[var(--btn-shadow-focus)]",
      },
      size: {
        default: "px-5 py-3",
        sm: "min-h-9 px-3 py-2 text-xs",
        lg: "min-h-12 px-7 py-3 text-base",
        icon: "size-11 p-0",
      },
      state: {
        default: "",
        loading: "relative text-transparent pointer-events-none",
        success: "bg-trust text-trust-foreground border-trust/30",
        error:
          "bg-destructive text-destructive-foreground border-destructive/30",
      },
    },
    defaultVariants: { variant: "default", size: "default", state: "default" },
  },
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    loading?: boolean;
    loadingText?: string;
    successText?: string;
    errorText?: string;
    autoResetMs?: number;
  };

export function Button({
  asChild,
  variant = "default",
  size = "default",
  className,
  loading = false,
  loadingText,
  successText,
  errorText,
  autoResetMs = 2000,
  state = "default",
  children,
  onClick,
  disabled,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  const [internalState, setInternalState] = useState<
    "default" | "loading" | "success" | "error"
  >(loading ? "loading" : state);
  const [ripple, setRipple] = useState<{
    x: number;
    y: number;
    size: number;
  } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const autoResetRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (loading) {
      setInternalState("loading");
    } else if (state !== "default") {
      setInternalState(state);
    } else {
      setInternalState("default");
    }
  }, [loading, state]);

  useEffect(() => {
    if (internalState === "loading" && onClick) {
      const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        const rect = buttonRef.current?.getBoundingClientRect();
        if (rect) {
          setRipple({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            size: Math.max(rect.width, rect.height) * 2,
          });
        }
        await onClick(e);
      };
      buttonRef.current?.addEventListener(
        "click",
        handleClick as EventListener,
      );
      return () =>
        buttonRef.current?.removeEventListener(
          "click",
          handleClick as EventListener,
        );
    }
  }, [internalState, onClick]);

  useEffect(() => {
    if (
      (internalState === "success" || internalState === "error") &&
      autoResetMs > 0
    ) {
      autoResetRef.current = setTimeout(() => {
        setInternalState("default");
      }, autoResetMs);
      return () => clearTimeout(autoResetRef.current);
    }
  }, [internalState, autoResetMs]);

  const triggerSuccess = () => {
    setInternalState("success");
    if (autoResetMs > 0) {
      autoResetRef.current = setTimeout(
        () => setInternalState("default"),
        autoResetMs,
      );
    }
  };

  const triggerError = () => {
    setInternalState("error");
    if (autoResetMs > 0) {
      autoResetRef.current = setTimeout(
        () => setInternalState("default"),
        autoResetMs,
      );
    }
  };

  const isLoading = internalState === "loading";
  const isSuccess = internalState === "success";
  const isError = internalState === "error";

  // When using asChild (Slot), we MUST render exactly ONE valid React element child.
  // Radix Slot does not accept fragments, multiple elements, or non-element children.
  // We ensure this by:
  // 1. Only rendering ripple when NOT using asChild
  // 2. For asChild, ensuring we only ever pass a single valid React element to Slot
  // 3. For loading/success/error states with asChild, we wrap in a single span
  // 4. Validating that children is a single valid element when asChild is true

  const getContent = () => {
    if (isLoading) {
      return (
        <span className="inline-flex items-center justify-center gap-2">
          <Loader2 className="size-5 animate-spin" aria-hidden="true" />
          <span className="sr-only">{loadingText ?? "Loading..."}</span>
        </span>
      );
    }
    if (isSuccess) {
      return (
        <span className="inline-flex items-center justify-center gap-2">
          <Check className="size-5" aria-hidden="true" />
          <span>{successText ?? "Success"}</span>
        </span>
      );
    }
    if (isError) {
      return (
        <span className="inline-flex items-center justify-center gap-2">
          <X className="size-5" aria-hidden="true" />
          <span>{errorText ?? "Error"}</span>
        </span>
      );
    }
    return children;
  };

  const content = getContent();

  // When using asChild, ensure we pass exactly one valid React element to Slot
  // If content is not a single valid element, wrap it
  let slotContent = content;
  if (asChild) {
    // Check if content is a single valid React element
    const isSingleValidElement = isValidElement(content);

    if (!isSingleValidElement) {
      // Wrap in a single span to satisfy Slot's requirement
      slotContent = <span>{content}</span>;
    }
  }

  return (
    <Comp
      ref={buttonRef}
      className={cn(
        buttonVariants({ variant, size, state: internalState }),
        className,
      )}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      aria-live={isLoading ? "polite" : undefined}
      {...props}
    >
      {/* Ripple effect only when NOT using asChild (Slot requires single child) */}
      {!asChild && ripple && (
        <span
          className="absolute rounded-full bg-primary/20 pointer-events-none"
          style={{
            left: ripple.x - ripple.size / 2,
            top: ripple.y - ripple.size / 2,
            width: ripple.size,
            height: ripple.size,
            animation: "ripple 400ms ease-out forwards",
          }}
        />
      )}
      {slotContent}
    </Comp>
  );
}

export type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> &
  VariantProps<typeof buttonVariants> & {
    to: string;
    loading?: boolean;
    loadingText?: string;
    successText?: string;
    errorText?: string;
    autoResetMs?: number;
    replace?: boolean;
    state?: "default" | "loading" | "success" | "error";
  };

export function ButtonLink({
  to,
  variant = "default",
  size = "default",
  className,
  loading = false,
  loadingText,
  successText,
  errorText,
  autoResetMs = 2000,
  state = "default",
  children,
  onClick,
  disabled,
  replace = false,
  ...props
}: ButtonLinkProps) {
  const [internalState, setInternalState] = useState<
    "default" | "loading" | "success" | "error"
  >(loading ? "loading" : state);
  const [ripple, setRipple] = useState<{
    x: number;
    y: number;
    size: number;
  } | null>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const autoResetRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (loading) {
      setInternalState("loading");
    } else if (state !== "default") {
      setInternalState(state);
    } else {
      setInternalState("default");
    }
  }, [loading, state]);

  useEffect(() => {
    if (internalState === "loading" && onClick) {
      const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
        const rect = linkRef.current?.getBoundingClientRect();
        if (rect) {
          setRipple({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            size: Math.max(rect.width, rect.height) * 2,
          });
        }
        await onClick(e);
      };
      linkRef.current?.addEventListener("click", handleClick as EventListener);
      return () =>
        linkRef.current?.removeEventListener(
          "click",
          handleClick as EventListener,
        );
    }
  }, [internalState, onClick]);

  useEffect(() => {
    if (
      (internalState === "success" || internalState === "error") &&
      autoResetMs > 0
    ) {
      autoResetRef.current = setTimeout(() => {
        setInternalState("default");
      }, autoResetMs);
      return () => clearTimeout(autoResetRef.current);
    }
  }, [internalState, autoResetMs]);

  const triggerSuccess = () => {
    setInternalState("success");
    if (autoResetMs > 0) {
      autoResetRef.current = setTimeout(
        () => setInternalState("default"),
        autoResetMs,
      );
    }
  };

  const triggerError = () => {
    setInternalState("error");
    if (autoResetMs > 0) {
      autoResetRef.current = setTimeout(
        () => setInternalState("default"),
        autoResetMs,
      );
    }
  };

  const isLoading = internalState === "loading";
  const isSuccess = internalState === "success";
  const isError = internalState === "error";
  const isDisabled = disabled || isLoading;

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isDisabled) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  const getContent = () => {
    if (isLoading) {
      return (
        <span className="inline-flex items-center justify-center gap-2">
          <Loader2 className="size-5 animate-spin" aria-hidden="true" />
          <span className="sr-only">{loadingText ?? "Loading..."}</span>
        </span>
      );
    }
    if (isSuccess) {
      return (
        <span className="inline-flex items-center justify-center gap-2">
          <Check className="size-5" aria-hidden="true" />
          <span>{successText ?? "Success"}</span>
        </span>
      );
    }
    if (isError) {
      return (
        <span className="inline-flex items-center justify-center gap-2">
          <X className="size-5" aria-hidden="true" />
          <span>{errorText ?? "Error"}</span>
        </span>
      );
    }
    return children;
  };

  return (
    <Link
      ref={linkRef}
      to={to}
      replace={replace}
      className={cn(
        buttonVariants({ variant, size, state: internalState }),
        className,
        isDisabled && "pointer-events-none opacity-45",
      )}
      aria-disabled={isDisabled}
      aria-busy={isLoading}
      aria-live={isLoading ? "polite" : undefined}
      onClick={handleLinkClick}
      {...props}
    >
      {ripple && (
        <span
          className="absolute rounded-full bg-primary/20 pointer-events-none"
          style={{
            left: ripple.x - ripple.size / 2,
            top: ripple.y - ripple.size / 2,
            width: ripple.size,
            height: ripple.size,
            animation: "ripple 400ms ease-out forwards",
          }}
        />
      )}
      {getContent()}
    </Link>
  );
}
