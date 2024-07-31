export class EditTransactionType {
  id!: string;
  name!: string;
  isPositive: boolean = false;
  sourceParameter?: string;
  destinationParameter?: string;
  inUse: boolean = false;
  isActive: boolean = false;
}
