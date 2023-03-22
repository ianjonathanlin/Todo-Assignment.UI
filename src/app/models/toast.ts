export interface IToast {
  id: number;
  message: string;
  classname: string;
  delay?: number;
  autohide?: boolean;
}
