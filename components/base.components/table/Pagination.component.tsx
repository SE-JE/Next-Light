"use client"

import { useEffect, useState } from "react";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cn, pcn } from "@utils";
import { IconButtonComponent, InputRadioComponent } from "@components";



type CT = "item" | "active" | "base";

export interface PaginationProps {
  totalRow    :  number;
  paginate    :  number;
  page        :  number;
  onChange   ?:  (totalRow: number, paginate: number, page: number) => void;
  className  ?:  string;
};



export function PaginationComponent({
  paginate   =  10,
  page       =  1,
  totalRow   =  0,
  onChange,
  className  =  "",
}: PaginationProps) {
  const [pages, setPages]  =  useState<number[]>([]);
  const lastPage           =  Math.ceil(totalRow / paginate);

  useEffect(() => {
    let newPages      =  [];
    if (totalRow > paginate) {
      const start     =  Math.max(1, page - 1);
      const end       =  Math.min(lastPage, page + 1);
      newPages        =  Array.from({ length: end - start + 1 }, (_, i) => start + i);
    } else {
      newPages        =  [1];
    }
    setPages(newPages);
  }, [totalRow, page, paginate]);

  const styles = {
    base        :  cn("flex items-center justify-end md:justify-between gap-4 md:gap-6", pcn<CT>(className, "base")),
    item        :  cn("w-8 md:w-12 h-8 text-sm flex justify-center items-center bg-white rounded-[4px] border cursor-pointer",pcn<CT>(className, "item")),
    activeItem  :  cn("bg-light-primary/50 text-primary",pcn<CT>(className, "active")),
    overflow    :  "py-1.5 px-2 text-foreground text-sm",
  };

  if (!totalRow) return;

  return (
    <div className={styles.base}>
      <div className="hidden md:flex items-center gap-6">
        <InputRadioComponent
          name="paginate"
          options={[10, 20, 50].map((val) => ({
            value: val,
            label: String(val),
          }))}
          value={paginate}
          onChange={(e) => onChange?.(totalRow, Number(e), 1)}
          className="py-1.5 text-sm bg-white rounded-[4px]"
        />

        {totalRow > paginate && (
          <div className="flex items-center gap-2 mt-0.5">
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
        )}
      </div>
      
      <div className="hidden md:block text-sm text-foreground">
        {Math.min(totalRow, paginate * (page - 1) + 1)} - {Math.min(totalRow, paginate * page)} / {totalRow}
      </div>
      

      <div className="border rounded-sm flex md:hidden items-center">
        <div className="text-sm text-foreground px-4 py-2">
          {Math.min(totalRow, paginate * (page - 1) + 1)} - {Math.min(totalRow, paginate * page)} / {totalRow}
        </div>
        
        {totalRow > paginate && (
          <div className="flex items-center gap-2 bg-light-primary/50 text-primary p-2">
            {page > 1 && (
              <IconButtonComponent 
                icon={faChevronLeft}
                onClick={() => onChange?.(totalRow, paginate, page - 1)}
                size="sm"
              />
            )}
            {/* <div>{page}</div> */}
            {page < lastPage && (
              <IconButtonComponent 
                icon={faChevronRight}
                onClick={() => onChange?.(totalRow, paginate, page + 1)}
                size="sm"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
