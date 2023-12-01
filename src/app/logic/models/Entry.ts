export interface Entry {
  entryId?: number;
  entryName?: string;
  entryDescription?: string;
  entryAmount: number;
  entryCreationTime?: string;
  entryTimeOfExpense: string;
  entryAttachment?: string;
  subcategoryId: number;
  userId?: number;
}
