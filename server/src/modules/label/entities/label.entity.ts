export class Label {
  id: number;
  labelNo: string;
  foodName: string | null;
  foodType: string | null;
  imageUrl: string;
  ocrText: string | null;
  ocrStatus: string;
  uploadUserId: number;
  createdAt: Date;
  updatedAt: Date;
}