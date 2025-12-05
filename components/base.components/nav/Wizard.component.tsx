import { ReactNode } from "react";



export interface WizardProps {
  items   :  {label: string, circle_content: ReactNode}[];
  active  :  number;
};



export function WizardComponent({ 
  items, 
  active 
}: WizardProps) {
  return (
    <div>
      <div className="w-full py-4">
        <div className="flex">
          {items.map((item, key) => {
            return (
              <div
                key={key}
                style={{ width: `calc(100% * 1 / ${items.length})` }}
              >
                <div className="relative mb-2">
                  {key > 0 && (
                    <div
                      className="absolute flex align-center items-center align-middle content-center"
                      style={{
                        width: "calc(100% - 2.5rem - 1rem)",
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      <div className="w-full bg-light-primary rounded items-center align-middle align-center flex-1">
                        <div
                          className={`${
                            key == active + 1
                              ? "bg-gradient-to-r from-primary to-light-primary to-70%"
                              : key <= active + 1
                                ? "bg-primary"
                                : ""
                          } py-1 rounded w-full`}
                        ></div>
                      </div>
                    </div>
                  )}

                  <div
                    className={`${
                      key <= active
                        ? "bg-primary text-background"
                        : "bg-light-primary text-white"
                    } w-10 h-10 mx-auto rounded-full text-lg font-bold flex items-center`}
                  >
                    <span className="text-center w-full">
                      {item.circle_content}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-center md:text-sm  2xl:text-base font-medium">
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
