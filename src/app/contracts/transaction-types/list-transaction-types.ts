export class ListTransactionTypes {
  id!: string;
  name!: string;
  sourceParameter?: string;
  destinationParameter?: string;
  inUse?: boolean;
  isActive?: boolean;
  isPositive?: boolean;
}
