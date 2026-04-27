export enum CategoryTypes {
  BILLS = 'Bills',
  CREDIT_CARD = 'Credit Card',
  EAT_OUT = 'Eat Out',
  ENTERTAINMENT = 'Entertainment',
  GROCERIES = 'Groceries',
  HEALTH = 'Health',
  PERSONAL = 'Personal',
  PETS = 'Pets',
  RENTING = 'Renting',
  SHOPPING = 'Shopping',
  SUBSCRIPTIONS = 'Subscriptions',
  TRANSPORTATION = 'Transportation',
}

export const Categories = {
  [CategoryTypes.BILLS]: 'bg-blue-500',
  [CategoryTypes.CREDIT_CARD]: 'bg-orange-500',
  [CategoryTypes.EAT_OUT]: 'bg-green-500',
  [CategoryTypes.ENTERTAINMENT]: 'bg-purple-500',
  [CategoryTypes.GROCERIES]: 'bg-yellow-500',
  [CategoryTypes.HEALTH]: 'bg-red-500',
  [CategoryTypes.PERSONAL]: 'bg-pink-500',
  [CategoryTypes.PETS]: 'bg-lime-500',
  [CategoryTypes.RENTING]: 'bg-gray-500',
  [CategoryTypes.SHOPPING]: 'bg-indigo-500',
  [CategoryTypes.SUBSCRIPTIONS]: 'bg-teal-500',
  [CategoryTypes.TRANSPORTATION]: 'bg-cyan-500',
}
