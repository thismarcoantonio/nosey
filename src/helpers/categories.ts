import { CategoryTypes } from '@/types/categories'

const categoryKeywords = {
  [CategoryTypes.BILLS]: ['hydro', 'rogers', 'monthly fees', 'telus pre-auth'],
  [CategoryTypes.CREDIT_CARD]: ['affirm canada', 'card bill payment'],
  [CategoryTypes.EAT_OUT]: ['doordash', 'sushi'],
  [CategoryTypes.ENTERTAINMENT]: ['steam', 'globoplay', 'spotify', 'youtube'],
  [CategoryTypes.GROCERIES]: ['quality foods'],
  [CategoryTypes.HEALTH]: [],
  [CategoryTypes.PERSONAL]: [],
  [CategoryTypes.PETS]: ['bosley', 'pet valu', 'veterinary'],
  [CategoryTypes.RENTING]: ['blueprint'],
  [CategoryTypes.SHOPPING]: [],
  [CategoryTypes.SUBSCRIPTIONS]: [],
  [CategoryTypes.TRANSPORTATION]: ['bc transit', 'ubertrip'],
}

export function autoCategorise(description: string) {
  return Object.entries(categoryKeywords).find(([_, keywords]) =>
    keywords.some((keyword) => description.toLowerCase().includes(keyword)),
  )?.[0] as CategoryTypes | undefined
}
