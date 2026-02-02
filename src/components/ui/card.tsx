import { type Component, type ParentProps, splitProps, type JSX } from "solid-js";
import { cn } from "@/lib/utils";

const Card: Component<ParentProps<JSX.HTMLAttributes<HTMLDivElement> & { class?: string }>> = (props) => {
    const [local, others] = splitProps(props, ["class"]);
    return <div class={cn("rounded-lg border bg-card text-card-foreground shadow-sm", local.class)} {...others} />;
};

const CardHeader: Component<ParentProps<{ class?: string }>> = (props) => {
    const [local, others] = splitProps(props, ["class"]);
    return <div class={cn("flex flex-col space-y-1.5 p-6", local.class)} {...others} />;
};

const CardTitle: Component<ParentProps<{ class?: string }>> = (props) => {
    const [local, others] = splitProps(props, ["class"]);
    return <h3 class={cn("text-2xl font-semibold leading-none tracking-tight", local.class)} {...others} />;
};

const CardDescription: Component<ParentProps<{ class?: string }>> = (props) => {
    const [local, others] = splitProps(props, ["class"]);
    return <p class={cn("text-sm text-muted-foreground", local.class)} {...others} />;
};

const CardContent: Component<ParentProps<{ class?: string }>> = (props) => {
    const [local, others] = splitProps(props, ["class"]);
    return <div class={cn("p-6 pt-0", local.class)} {...others} />;
};

const CardFooter: Component<ParentProps<{ class?: string }>> = (props) => {
    const [local, others] = splitProps(props, ["class"]);
    return <div class={cn("flex items-center p-6 pt-0", local.class)} {...others} />;
};

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
