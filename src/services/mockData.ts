export const generateMockData = (url: string, filters?: any) => {
  // Helper to apply mock filter variations
  const applyFilters = (data: any[]) => {
    if (!filters) return data;
    
    let filteredData = [...data];
    
    // Simulate region filter by scaling numbers
    if (filters.region) {
      const scale = filters.region === 'LATAM' ? 0.4 : 
                    filters.region === 'MENA' ? 0.3 : 
                    filters.region === 'APAC' ? 1.2 : 
                    filters.region === 'NA' ? 1.5 : 0.8;
      
      filteredData = filteredData.map(item => {
        const newItem = { ...item };
        Object.keys(newItem).forEach(key => {
          if (typeof newItem[key] === 'number') {
            newItem[key] = Math.round(newItem[key] * scale);
          }
        });
        return newItem;
      });
    }

    // Simulate product filter
    if (filters.product) {
      // If the data has a product field, actually filter it
      if (filteredData.length > 0 && 'product' in filteredData[0]) {
        filteredData = filteredData.filter(item => item.product === filters.product);
      } else {
        // Otherwise just scale it to simulate product-specific data
        const scale = filters.product === 'TTAM' ? 0.6 : 
                      filters.product === 'Starling' ? 0.8 : 
                      filters.product === 'LarkBase' ? 0.5 : 1.1;
        filteredData = filteredData.map(item => {
          const newItem = { ...item };
          Object.keys(newItem).forEach(key => {
            if (typeof newItem[key] === 'number') {
              newItem[key] = Math.round(newItem[key] * scale);
            }
          });
          return newItem;
        });
      }
    }

    // Simulate time filter by slicing data
    if (filters.time) {
      if (filters.time === '7') {
        filteredData = filteredData.slice(-2); // Just show last 2 points for 7 days
      } else if (filters.time === '30' || filters.time === '') {
        filteredData = filteredData.slice(-4);
      }
    }

    // Simulate language filter
    if (filters.language) {
      if (filteredData.length > 0 && 'language' in filteredData[0]) {
        filteredData = filteredData.filter(item => item.language === filters.language);
      } else {
        // Just scale to simulate language filter
        const scale = 0.7;
        filteredData = filteredData.map(item => {
          const newItem = { ...item };
          Object.keys(newItem).forEach(key => {
            if (typeof newItem[key] === 'number') {
              newItem[key] = Math.round(newItem[key] * scale);
            }
          });
          return newItem;
        });
      }
    }

    return filteredData;
  };

  if (url.includes('revenue_by_language')) {
    return applyFilters([
      { language: 'Spanish', revenue: 450000 },
      { language: 'Portuguese', revenue: 380000 },
      { language: 'Japanese', revenue: 320000 },
      { language: 'German', revenue: 290000 },
      { language: 'French', revenue: 250000 },
      { language: 'Korean', revenue: 180000 },
      { language: 'Italian', revenue: 150000 },
      { language: 'Arabic', revenue: 120000 },
      { language: 'Russian', revenue: 90000 },
      { language: 'Turkish', revenue: 75000 },
    ]);
  }
  if (url.includes('advertiser_distribution')) {
    return applyFilters([
      { market: 'Non-English', users: 68 },
      { market: 'English', users: 32 },
    ]);
  }
  if (url.includes('wordcount_vendor')) {
    return applyFilters([
      { month: 'Jan', 'Vendor A': 1200000, 'Vendor B': 800000, 'Vendor C': 400000 },
      { month: 'Feb', 'Vendor A': 1300000, 'Vendor B': 850000, 'Vendor C': 420000 },
      { month: 'Mar', 'Vendor A': 1100000, 'Vendor B': 900000, 'Vendor C': 450000 },
      { month: 'Apr', 'Vendor A': 1400000, 'Vendor B': 950000, 'Vendor C': 480000 },
      { month: 'May', 'Vendor A': 1500000, 'Vendor B': 1000000, 'Vendor C': 500000 },
      { month: 'Jun', 'Vendor A': 1600000, 'Vendor B': 1100000, 'Vendor C': 550000 },
    ]);
  }
  if (url.includes('task_types')) {
    return applyFilters([
      { type: 'Translation', volume: 75 },
      { type: 'Non-Translation', volume: 25 },
    ]);
  }
  if (url.includes('budget_data')) {
    return applyFilters([
      { month: 'Jan', budget: 50000, actual: 48000 },
      { month: 'Feb', budget: 50000, actual: 52000 },
      { month: 'Mar', budget: 50000, actual: 49000 },
      { month: 'Apr', budget: 50000, actual: 45000 },
      { month: 'May', budget: 50000, actual: 47000 },
      { month: 'Jun', budget: 50000, actual: 51000 },
    ]);
  }
  if (url.includes('cost_product')) {
    return applyFilters([
      { product: 'TTAM', cost: 12000 },
      { product: 'Starling', cost: 25000 },
      { product: 'Lark Base', cost: 8000 },
      { product: 'Ads', cost: 18000 },
    ]);
  }
  if (url.includes('mqm_scores')) {
    return applyFilters([
      { language: 'Spanish', score: 98.2, errorRate: 1.8 },
      { language: 'French', score: 97.5, errorRate: 2.5 },
      { language: 'German', score: 96.8, errorRate: 3.2 },
      { language: 'Japanese', score: 95.5, errorRate: 4.5 },
      { language: 'Korean', score: 94.2, errorRate: 5.8 },
      { language: 'Arabic', score: 92.5, errorRate: 7.5 },
      { language: 'Turkish', score: 91.0, errorRate: 9.0 },
      { language: 'Russian', score: 96.0, errorRate: 4.0 },
    ]);
  }
  if (url.includes('advertiser_distribution_3d')) {
    return applyFilters([
      { language: 'Spanish', TTAM: 120, TTO: 80, Promote: 45, SMB: 30, TTMS: 20, 'S++': 15 },
      { language: 'Japanese', TTAM: 150, TTO: 90, Promote: 60, SMB: 40, TTMS: 25, 'S++': 20 },
      { language: 'French', TTAM: 90, TTO: 60, Promote: 30, SMB: 20, TTMS: 15, 'S++': 10 },
      { language: 'German', TTAM: 110, TTO: 70, Promote: 40, SMB: 25, TTMS: 18, 'S++': 12 },
      { language: 'Arabic', TTAM: 80, TTO: 50, Promote: 25, SMB: 15, TTMS: 10, 'S++': 8 },
    ]);
  }
  if (url.includes('localized_ratio')) {
    return applyFilters([
      { product: 'TTAM', Localized: 85, English: 15 },
      { product: 'TTO', Localized: 70, English: 30 },
      { product: 'Promote', Localized: 60, English: 40 },
      { product: 'SMB', Localized: 90, English: 10 },
      { product: 'TTMS', Localized: 50, English: 50 },
      { product: 'S++', Localized: 40, English: 60 },
    ]);
  }
  if (url.includes('urgent_ratio')) {
    return applyFilters([
      { type: 'Urgent', volume: 35 },
      { type: 'Standard', volume: 65 },
    ]);
  }
  if (url.includes('query_types')) {
    return applyFilters([
      { type: 'Context', volume: 45 },
      { type: 'Grammar', volume: 30 },
      { type: 'Style', volume: 15 },
      { type: 'Terminology', volume: 10 },
    ]);
  }
  if (url.includes('query_vol_lang')) {
    return applyFilters([
      { language: 'Spanish', Context: 120, Grammar: 80, Style: 40 },
      { language: 'Japanese', Context: 150, Grammar: 90, Style: 60 },
      { language: 'French', Context: 90, Grammar: 60, Style: 30 },
      { language: 'German', Context: 110, Grammar: 70, Style: 40 },
      { language: 'Arabic', Context: 80, Grammar: 50, Style: 25 },
    ]);
  }
  if (url.includes('cost_vendor')) {
    return applyFilters([
      { vendor: 'Vendor A', cost: 45000 },
      { vendor: 'Vendor B', cost: 35000 },
      { vendor: 'Vendor C', cost: 25000 },
      { vendor: 'Vendor D', cost: 15000 },
    ]);
  }
  if (url.includes('_errors')) {
    return applyFilters([
      { language: 'Arabic', errorCount: Math.floor(Math.random() * 1000) + 200 },
      { language: 'Japanese', errorCount: Math.floor(Math.random() * 1000) + 200 },
      { language: 'German', errorCount: Math.floor(Math.random() * 1000) + 200 },
      { language: 'French', errorCount: Math.floor(Math.random() * 1000) + 200 },
      { language: 'Spanish', errorCount: Math.floor(Math.random() * 1000) + 200 },
      { language: 'Korean', errorCount: Math.floor(Math.random() * 1000) + 200 },
      { language: 'English', errorCount: Math.floor(Math.random() * 1000) + 200 },
    ]);
  }
  if (url.includes('_csat_negative_trend')) {
    return applyFilters([
      { month: 'Jan', complaints: Math.floor(Math.random() * 100) + 50 },
      { month: 'Feb', complaints: Math.floor(Math.random() * 100) + 50 },
      { month: 'Mar', complaints: Math.floor(Math.random() * 100) + 50 },
      { month: 'Apr', complaints: Math.floor(Math.random() * 100) + 50 },
      { month: 'May', complaints: Math.floor(Math.random() * 100) + 50 },
      { month: 'Jun', complaints: Math.floor(Math.random() * 100) + 50 },
    ]);
  }
  
  // Default random data
  return applyFilters([
    { name: 'A', value1: 400, value2: 240 },
    { name: 'B', value1: 300, value2: 139 },
    { name: 'C', value1: 200, value2: 980 },
    { name: 'D', value1: 278, value2: 390 },
    { name: 'E', value1: 189, value2: 480 },
  ]);
};
