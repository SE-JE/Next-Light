import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { SelectComponent } from "../input";
import { InputRadioComponent } from "../input/InputRadio.component";

export type PaginationProps = {
  totalRow: number;
  paginate: number;
  page: number;
  onChange?: (totalRow: number, paginate: number, page: number) => void;
};

export default function PaginationComponent({
  totalRow,
  paginate,
  page,
  onChange,
}: PaginationProps) {
  const [pagination, setPagination] = useState<{
    first: boolean;
    pages: number[];
    last: boolean;
    lastPage?: number;
  }>({
    first: false,
    pages: [],
    last: false,
  });

  useEffect(() => {
    if (totalRow > paginate) {
      let newPages = [];
      const lastPage = Math.ceil(totalRow / paginate);

      if (page > 1 && page < lastPage) {
        if (page > 2) {
          newPages = [page - 1, page, page + 1];
        } else {
          newPages = [1, page, page + 1];
        }
      } else if (page <= 1 && lastPage > 2) {
        newPages = [page, page + 1, page + 2];
      } else if (lastPage == 2) {
        if (page == 2) {
          newPages = [1, page];
        } else {
          newPages = [page, 2];
        }
      } else {
        newPages = [page - 2, page - 1, page];
      }

      setPagination({
        first: page > 3,
        pages: newPages,
        last: page + 1 < lastPage && lastPage > 3,
        lastPage: lastPage,
      });
    } else {
      setPagination({
        first: false,
        pages: [1],
        last: false,
        lastPage: 1,
      });
    }
  }, [totalRow, page, paginate]);

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="w-50">
            <InputRadioComponent
              name="paginate"
              options={[
                {
                  value: 10,
                  label: "10",
                },
                {
                  value: 20,
                  label: "20",
                },
                {
                  value: 50,
                  label: "50",
                },
              ]}
              value={paginate}
              onChange={(e) => {
                onChange?.(totalRow, Number(e), page);
              }}
              className="py-2 text-sm bg-white border-0"
            />
          </div>
          <div className="flex items-center gap-3">
            {page > 1 && (
              <div
                className="p-3 hover:scale-105 text-sm text-foreground cursor-pointer"
                onClick={() => onChange?.(totalRow, paginate, page - 1)}
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </div>
            )}

            {pagination.first && (
              <>
                <div
                  className="w-12 h-8 text-sm flex justify-center items-center bg-white rounded-md cursor-pointer hover:scale-105"
                  onClick={() => onChange?.(totalRow, paginate, 1)}
                >
                  1
                </div>
                <div className="px-2 py-1.5 text-foreground rounded-md">
                  ...
                </div>
              </>
            )}
            {pagination.pages &&
              pagination.pages.map((itemPage, key) => {
                return (
                  <div
                    key={key}
                    className={`w-12 h-8 text-sm flex justify-center items-center rounded-md ${
                      itemPage == page
                        ? "bg-light-primary text-primary"
                        : "bg-white cursor-pointer"
                    } hover:scale-105`}
                    onClick={() => onChange?.(totalRow, paginate, itemPage)}
                  >
                    {itemPage}
                  </div>
                );
              })}
            {pagination.last && (
              <>
                <div className="px-2 py-1.5 text-foreground rounded-md">
                  ...
                </div>
                <div
                  className="w-12 h-8 text-sm flex justify-center items-center bg-white rounded-md cursor-pointer hover:scale-105"
                  onClick={() =>
                    onChange?.(totalRow, paginate, pagination.lastPage ?? 1)
                  }
                >
                  {pagination.lastPage}
                </div>
              </>
            )}
            {pagination.lastPage && page < pagination.lastPage && (
              <div
                className="p-3 hover:scale-105 text-sm text-foreground cursor-pointer"
                onClick={() => onChange?.(totalRow, paginate, page + 1)}
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </div>
            )}
          </div>
        </div>
        <div className="relative flex items-center gap-5 px-2 text-sm">
          <div className="text-foreground">
            {paginate * page - paginate + 1} -{" "}
            {pagination.lastPage && page < pagination.lastPage
              ? paginate * page
              : totalRow}{" "}
            dari {totalRow}
          </div>
        </div>
      </div>
    </>
  );
}
