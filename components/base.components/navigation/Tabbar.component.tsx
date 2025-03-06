import { cn, pcn } from "@/helpers";

type CT = "item" | "active" | "base";

export type TabbarItem = {
  label: string;
  value: string | number;
};

export function TabbarComponent({
  items,
  onChange,
  active,

  /** Use custom class with: "item::", "active::". */
  className = "",
}: {
  items: string[] | TabbarItem[];
  onChange?: (item: string | number) => void;
  active?: string | number;
  className?: string;
}) {
  return (
    <>
      <div
        className={cn(
          "grid grid-flow-col grid-cols-auto rounded-[6px] border",
          pcn<CT>(className, "base"),
        )}
      >
        {items?.map((item, i) => {
          return (
            <div
              key={i}
              className={cn(
                "text-center px-2 py-2 rounded-64px",
                active == (typeof item != "string" ? item?.value : item)
                  ? "bg-white/60 text-primary font-semibold"
                  : "hover:bg-white/60 cursor-pointer",
                pcn<CT>(className, "item"),
                pcn<CT>(className, "active"),
              )}
              onClick={() =>
                onChange?.(typeof item != "string" ? item?.value : item)
              }
            >
              {typeof item != "string" ? item?.label : item}
            </div>
          );
        })}
      </div>
    </>
  );
}
