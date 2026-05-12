// Category mapping to handle different ways categories might be stored in Firebase
export const CATEGORY_MAPPINGS = {
  // Main category mappings
  'retail': ['retail', 'shopping', 'retail & shopping', 'retail and shopping'],
  'restaurants': ['restaurants', 'restaurants & food', 'food', 'restaurant', 'food & dining'],
  'real-estate': ['real estate', 'property', 'real-estate', 'properties'],
  'technology': ['technology', 'tech', 'it', 'technology & it', 'information technology'],
  'healthcare': ['healthcare', 'medical', 'healthcare & medical', 'health', 'hospital'],
  'education': ['education', 'training', 'education & training', 'school', 'learning'],
  'automotive': ['automotive', 'cars', 'vehicles', 'auto', 'car services'],
  'finance': ['finance', 'banking', 'finance & banking', 'financial', 'bank'],
  'travel': ['travel', 'tourism', 'travel & tourism', 'tourism & travel'],
  'beauty': ['beauty', 'wellness', 'beauty & wellness', 'salon', 'spa'],
  'construction': ['construction', 'building', 'contractor', 'builder'],
  'logistics': ['logistics', 'transport', 'transportation', 'shipping', 'delivery'],
}

export const LIVE_STATUSES = new Set(['approved'])

// Function to get the main category ID from any category name
export function getCategoryIdFromName(categoryName: string): string | null {
  if (!categoryName) return null
  
  const normalizedCategory = categoryName.toLowerCase().trim()
  
  for (const [categoryId, possibleNames] of Object.entries(CATEGORY_MAPPINGS)) {
    if (possibleNames.some(name => 
      normalizedCategory === name || 
      normalizedCategory.includes(name) || 
      name.includes(normalizedCategory)
    )) {
      return categoryId
    }
  }
  
  return null
}

// Function to check if a business belongs to a category
export function isBusinessInCategory(businessCategory: string, targetCategoryId: string): boolean {
  if (!businessCategory || !targetCategoryId) return false
  
  const businessCategoryId = getCategoryIdFromName(businessCategory)
  return businessCategoryId === targetCategoryId
}

export function getPossibleCategoryValues(categoryId: string): string[] {
  const mapped = CATEGORY_MAPPINGS[categoryId as keyof typeof CATEGORY_MAPPINGS] ?? []
  return Array.from(new Set([categoryId, ...mapped]))
}

export function normalizeCategoryForStorage(categoryValue: string): string {
  const matched = getCategoryIdFromName(categoryValue)
  return matched ?? categoryValue.toLowerCase().trim()
}
