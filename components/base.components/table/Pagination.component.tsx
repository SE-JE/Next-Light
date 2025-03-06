import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { InputRadioComponent } from "../input/InputRadio.component";
import { cn, pcn } from "@/helpers";

type CT = "item" | "active" | "base";

export type PaginationPropsType = {
  totalRow: number;
  paginate: number;
  page: number;
  onChange?: (totalRow: number, paginate: number, page: number) => void;
  className?: string;
};

export default function PaginationComponent({
  totalRow,
  paginate = 10,
  page = 1,
  onChange,
  className = "",
}: PaginationPropsType) {
  const [pages, setPages] = useState<number[]>([]);
  const lastPage = Math.ceil(totalRow / paginate);

  useEffect(() => {
    let newPages = [];
    if (totalRow > paginate) {
      const start = Math.max(1, page - 1);
      const end = Math.min(lastPage, page + 1);
      newPages = Array.from({ length: end - start + 1 }, (_, i) => start + i);
    } else {
      newPages = [1];
    }
    setPages(newPages);
  }, [totalRow, page, paginate]);

  const styles = {
    base: cn("flex items-center justify-between", pcn<CT>(className, "base")),
    item: cn(
      "w-12 h-8 text-sm flex justify-center items-center bg-white rounded-[6px] border cursor-pointer",
      pcn<CT>(className, "item")
    ),
    activeItem: cn(
      "bg-light-primary/50 text-primary",
      pcn<CT>(className, "active")
    ),
    overflow: "py-1.5 px-2 text-foreground text-sm",
  };

  return (
    <div className={styles.base}>
      <div className="flex items-center gap-6">
        <InputRadioComponent
          name="paginate"
          options={[10, 20, 50].map((val) => ({
            value: val,
            label: String(val),
          }))}
          value={paginate}
          onChange={(e) => onChange?.(totalRow, Number(e), 1)}
          className="py-1.5 text-sm bg-white"
        />
        <div className="flex items-center gap-2">
          {page > 1 && (
            <button
              className={styles.overflow}
              onClick={() => onChange?.(totalRow, paginate, page - 1)}
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
          )}

          {page > 2 && (
            <>
              <button
                className={styles.item}
                onClick={() => onChange?.(totalRow, paginate, 1)}
              >
                1
              </button>
              {page > 3 && <span className={styles.overflow}>...</span>}
            </>
          )}

          {pages.map((p) => (
            <button
              key={p}
              className={cn(styles.item, p === page && styles.activeItem)}
              onClick={() => onChange?.(totalRow, paginate, p)}
            >
              {p}
            </button>
          ))}

          {page < lastPage - 1 && (
            <>
              {page < lastPage - 2 && (
                <span className={styles.overflow}>...</span>
              )}
              <button
                className={styles.item}
                onClick={() => onChange?.(totalRow, paginate, lastPage)}
              >
                {lastPage}
              </button>
            </>
          )}

          {page < lastPage && (
            <button
              className={styles.overflow}
              onClick={() => onChange?.(totalRow, paginate, page + 1)}
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          )}
        </div>
      </div>
      <div className="text-sm text-foreground">
        {Math.min(totalRow, paginate * (page - 1) + 1)} -{" "}
        {Math.min(totalRow, paginate * page)} / {totalRow}
      </div>
    </div>
  );
}
