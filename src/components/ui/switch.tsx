import type { Component, ParentProps } from "solid-js";
import { splitProps } from "solid-js";
import { Switch as SwitchPrimitive } from "@kobalte/core/switch";
import type { SwitchControlProps, SwitchThumbProps, SwitchLabelProps } from "@kobalte/core/switch";

import { cn } from "@/lib/utils";

const Switch = SwitchPrimitive;

const SwitchControl: Component<ParentProps<SwitchControlProps & { class?: string }>> = (props) => {
    const [local, others] = splitProps(props, ["class", "children"]);
    return (
        <>
            <SwitchPrimitive.Input class="[&:focus-visible+div]:outline-none [&:focus-visible+div]:ring-2 [&:focus-visible+div]:ring-ring [&:focus-visible+div]:ring-offset-2 [&:focus-visible+div]:ring-offset-background" />
            <SwitchPrimitive.Control
                class={cn(
                    "inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors disabled:cursor-not-allowed disabled:opacity-50 data-[checked]:bg-primary data-[unchecked]:bg-input",
                    local.class,
                )}
                {...others}
            >
                {local.children}
            </SwitchPrimitive.Control>
        </>
    );
};

const SwitchThumb: Component<ParentProps<SwitchThumbProps & { class?: string }>> = (props) => {
    const [local, others] = splitProps(props, ["class"]);
    return (
        <SwitchPrimitive.Thumb
            class={cn(
                "pointer-events-none block h-5 w-5 translate-x-0 rounded-full bg-background shadow-lg ring-0 transition-transform data-[checked]:translate-x-5",
                local.class,
            )}
            {...others}
        />
    );
};

const SwitchLabel: Component<ParentProps<SwitchLabelProps & { class?: string }>> = (props) => {
    const [local, others] = splitProps(props, ["class"]);
    return (
        <SwitchPrimitive.Label
            class={cn("text-sm font-medium leading-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-70", local.class)}
            {...others}
        />
    );
};

export { Switch, SwitchControl, SwitchThumb, SwitchLabel };
