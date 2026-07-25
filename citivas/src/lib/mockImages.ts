const MOCK_IMAGES: Record<string, string> = {
  Restaurant: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
  Hotel: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
  Shopping: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
  Attraction: 'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?w=800&q=80',
  'Fun Places': 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
  Lifestyle: 'https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=800&q=80',
  Event: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80',
  Events: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80',
  Airbnb: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
  Property: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
  Other: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
  default: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80',
};

export function getMockImage(category?: string): string {
  if (!category) return MOCK_IMAGES.default;
  return MOCK_IMAGES[category] || MOCK_IMAGES.default;
}
