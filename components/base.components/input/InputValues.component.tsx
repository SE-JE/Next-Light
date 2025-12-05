import { CSSProperties } from 'react';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { cn } from '@utils';

export function InputValues({
  value,
  className,
  onDelete,
  isFocus,
  onFocus,
  style,
} : {
  value?: string[] | number[];
  className?: string;
  onDelete?: (val: string | number, index: string | number) => void;
  isFocus?: boolean,
  onFocus?: () => void;
  style?: CSSProperties
}) {
  if(isFocus) {
    return (
      <>
        {!!value?.length && (
          <div className={cn(`p-2 rounded-sm absolute left-0 w-full bg-background border-b border-x z-30 overflow-hidden ease-in-out max-h-[200px] overflow-y-auto flex gap-2 flex-wrap`, className)} onClick={() => onFocus?.()}>
            {value?.map((item, key) => {
              return (
                <div key={key} className={`input-values-item`}>
                  <span className="">{item}</span>
                  <FontAwesomeIcon
                    icon={faTimes}
                    className={`input-values-delete`}
                    onClick={() =>  onDelete?.(item, key)}
                  />
                </div>
              );
            })}
          </div>
        )}
      </>
    )
  } else {
    return (
      <>
        <div 
          className={cn(`absolute top-1/2 -translate-y-1/2 overflow-x-hidden py-1.5 input-scroll w-max`, className)}
          style={style}
          onClick={() => onFocus?.()}
        >
          <div className={`input-values-container`}>
            {value?.map((item, key) => {
              return (
                <div key={key} className={`input-values-item`}>
                  <span>{item}</span>
                  <FontAwesomeIcon
                    icon={faTimes}
                    className={`input-values-delete`}
                    onClick={() =>  onDelete?.(item, key)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </>
    )
  }
}
