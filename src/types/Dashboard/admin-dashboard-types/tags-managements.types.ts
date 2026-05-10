export interface ITag {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ITagResponse {
  success: boolean;
  message: string;
  data: ITag[];
}
