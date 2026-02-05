"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

type ActionItem = {
  label: string;
  onClick: () => void;
  variant?: "default" | "danger";
  icon?: React.ReactNode;
  separator?: boolean;
};

type ActionMenuProps = {
  actions: ActionItem[];
};

export default function ActionMenu({ actions }: ActionMenuProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button type="button" className="menu-trigger" aria-label="Actions">
          ...
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="menu-dropdown" align="end" sideOffset={8}>
          {actions.map((action, index) => (
            <div key={index}>
              {action.separator ? <DropdownMenu.Separator className="menu-separator" /> : null}
              <DropdownMenu.Item
                asChild
                data-variant={action.variant ?? "default"}
                onSelect={() => action.onClick()}
              >
                <button type="button" className="menu-item">
                  {action.icon ? <span className="menu-icon">{action.icon}</span> : null}
                  {action.label}
                </button>
              </DropdownMenu.Item>
            </div>
          ))}
          <DropdownMenu.Arrow className="menu-arrow" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
