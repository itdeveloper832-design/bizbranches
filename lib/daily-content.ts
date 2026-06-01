// Daily Content Calendar System for SEO Boost
// This system generates daily content links to improve SEO

export interface DailyContent {
  date: string
  title: string
  url: string
  category: string
  priority: number
}

// Generate daily business tips and guides
export function generateDailyContent(): DailyContent[] {
  const today = new Date()
  const currentYear = today.getFullYear()
  const currentMonth = today.getMonth() + 1
  const currentDay = today.getDate()
  
  const dailyContent: DailyContent[] = []
  
  // Generate 30 days of daily content (current month)
  for (let day = 1; day <= 30; day++) {
    const date = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
    
    // Rotate through different content categories
    const categories = ['business-tips', 'marketing', 'seo-guide', 'local-business', 'growth-strategies']
    const categoryIndex = (day - 1) % categories.length
    const category = categories[categoryIndex]
    
    let title = ''
    let url = ''
    
    switch (category) {
      case 'business-tips':
        title = `Business Tip of the Day - ${getDayName(day)}`
        url = `/daily/business-tip-${day}`
        break
      case 'marketing':
        title = `Daily Marketing Strategy - ${getDayName(day)}`
        url = `/daily/marketing-${day}`
        break
      case 'seo-guide':
        title = `SEO Guide for Pakistani Businesses - ${getDayName(day)}`
        url = `/daily/seo-${day}`
        break
      case 'local-business':
        title = `Local Business Success - ${getDayName(day)}`
        url = `/daily/local-business-${day}`
        break
      case 'growth-strategies':
        title = `Business Growth Strategy - ${getDayName(day)}`
        url = `/daily/growth-${day}`
        break
    }
    
    dailyContent.push({
      date,
      title,
      url,
      category,
      priority: day <= 7 ? 0.8 : day <= 15 ? 0.6 : 0.4
    })
  }
  
  return dailyContent
}

// Get day name for variety
function getDayName(day: number): string {
  const dayNames = [
    'Monday Focus', 'Tuesday Boost', 'Wednesday Wisdom', 'Thursday Tactics', 
    'Friday Focus', 'Saturday Strategy', 'Sunday Success'
  ]
  return dayNames[(day - 1) % 7]
}

// Get today's daily content
export function getTodayDailyContent(): DailyContent | null {
  const allContent = generateDailyContent()
  const today = new Date().toISOString().split('T')[0]
  
  return allContent.find(content => content.date === today) || null
}

// Get upcoming daily content (next 7 days)
export function getUpcomingDailyContent(): DailyContent[] {
  const allContent = generateDailyContent()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  return allContent
    .filter(content => new Date(content.date) >= today)
    .slice(0, 7)
}

// Generate sitemap entries for daily content
export function generateDailyContentSitemapEntries(): string {
  const dailyContent = generateDailyContent()
  
  return dailyContent.map(content => `
  <url>
    <loc>https://www.pakbizbranhces.online${content.url}</loc>
    <lastmod>${content.date}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${content.priority}</priority>
  </url>`).join('')
}
