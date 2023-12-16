export interface Entry {
  entryId?: number;
  entryName?: string;
  entryDescription?: string;
  entryAmount: number;
  entryCreationTime?: string;
  entryTimeOfTransaction: string;
  entryAttachment?: string;
  subcategoryId: number;
  userId?: number;
}
