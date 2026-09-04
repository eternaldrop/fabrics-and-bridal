import { InputHTMLAttributes, LabelHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";

export const Label = ({ className = "", ...props }: LabelHTMLAttributes<HTMLLabelElement>) => (
  <label
    className={`block text-sm text-taupe mb-2 ${className}`}
    {...props}
  />
);

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className = "", ...props }, ref) => (
    <input
      ref={ref}
      className={`w-full bg-cream border border-taupe/50 rounded-brand px-4 py-3 text-ink placeholder:text-taupe focus:outline-none focus:border-ink transition-colors ${className}`}
      {...props}
    />
  )
);
Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className = "", ...props }, ref) => (
    <textarea
      ref={ref}
      className={`w-full bg-cream border border-taupe/50 rounded-brand px-4 py-3 text-ink placeholder:text-taupe focus:outline-none focus:border-ink transition-colors ${className}`}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";
