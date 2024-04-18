// Aliases
declare type stringOrNum = string | number
declare type stringOrUndef = string | undefined
declare type arrayOrUndef = ObjectDefault[] | undefined
declare type objOrUndef = ObjectDefault | undefined

declare interface Form {
  [key: string]: any,
}

declare interface ObjectDefault {
  [key: string]: any,
}

declare interface ToastMeta {
  type: "error" | "success" | "warning" | "info" | undefined;
  variant?: "flat" | "text" | "elevated" | "tonal" | "outlined" | "plain" | undefined
  title?: string;
  text?: string;
  color?: string;
  icon: stringOrUndef;
  duration?: number
}