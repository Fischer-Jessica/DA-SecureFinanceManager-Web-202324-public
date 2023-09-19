export interface Entry {
  entryId?: number;
  entryName: string;
  entryDescription: string;
  // TODO: Datentyp für Kommazahlen
  entryAmount: number;
  // TODO: Datentyp für Date-Time-Objekte
  entryCreationTime: string;
  entryTimeOfExpense: string;
  // TODO: Datentyp für Bilder
  entryAttachment?: string;
  subcategoryId: number;
  userId: number;
}
