export type sidebarItem = {
  label: string;
  key?: number;
  left_content?: any;
  right_content?: any;
  path?: string;
  items?: sidebarItem[];
};

export type sidebarHeadItem = {
  label: string;
  collapse?: boolean;
  items?: sidebarItem[];
};

export type sidebarProps = {
  head?: any;
  items?: sidebarHeadItem[];
  basePath?: string;
  show?: boolean;
  toggle?: boolean;
  children?: any;
  hasAccess?: number[];
  onChange?: () => void;
  className?: {
    container?: string;
    headList?: string;
    menuList?: string;
    childList?: string;
  };
};
