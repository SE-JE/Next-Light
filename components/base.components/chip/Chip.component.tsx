import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cn } from "@utils";

export function ChipComponent({ 
  items, 
  onClick,
  onDelete, 
  className, 
} : { 
  items      :  Record<string, any>,
  onClick    ?:  (item: any, index: number) => void,
  onDelete   ?:  (item: any, index: number) => void,
  className  ?:  string,
}) {
  return (
    <div className={cn(`overflow-hidden flex gap-2 flex-wrap`, className)}>
      {items?.map((item: any, key: number) => {
        return (
          <div 
            key={key} 
            className={`flex text-xs py-0.5 px-2 justify-between text-foreground border items-center rounded-md cursor-pointer`} 
            onClick={() => onClick?.(item, key)}
          >
            <span>{item}</span>
            
            {onDelete && (
              <FontAwesomeIcon
                icon={faTimes}
                className={`text-xs cursor-pointer text-light-foreground pl-2 py-1 hover:text-danger`}
                onClick={() =>  onDelete?.(item, key)}
              />
            )}
          </div>
        );
      })}
    </div>
  )
}
