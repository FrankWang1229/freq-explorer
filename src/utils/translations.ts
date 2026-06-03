// ITU service name to Chinese translation
// Based on ITU Radio Regulations service definitions

const serviceTranslations: Record<string, string> = {
  // 固定业务
  'Fixed': '固定业务',
  'Fixed Satellite': '固定卫星业务',
  'Fixed-satellite': '固定卫星业务',

  // 移动业务
  'Mobile': '移动业务',
  'Mobile except aeronautical mobile': '移动业务（航空移动除外）',
  'Mobile except aeronautical mobile (R)': '移动业务（航空移动(R)除外）',
  'Mobile Satellite': '移动卫星业务',
  'Mobile-satellite': '移动卫星业务',
  'Land Mobile': '陆地移动业务',
  'Land mobile': '陆地移动业务',
  'Maritime Mobile': '水上移动业务',
  'Maritime mobile': '水上移动业务',
  'Maritime Mobile Satellite': '水上移动卫星业务',
  'Maritime mobile-satellite': '水上移动卫星业务',
  'Aeronautical Mobile': '航空移动业务',
  'Aeronautical mobile': '航空移动业务',
  'Aeronautical Mobile (R)': '航空移动(R)业务',
  'Aeronautical mobile (R)': '航空移动(R)业务',
  'Aeronautical Mobile (OR)': '航空移动(OR)业务',
  'Aeronautical mobile (OR)': '航空移动(OR)业务',
  'Aeronautical Mobile Satellite': '航空移动卫星业务',
  'Aeronautical mobile-satellite': '航空移动卫星业务',
  'Aeronautical Mobile-satellite (R)': '航空移动卫星(R)业务',
  'Aeronautical Mobile-satellite (OR)': '航空移动卫星(OR)业务',
  'Aeronautical mobile-satellite (R)': '航空移动卫星(R)业务',
  'Aeronautical mobile-satellite (OR)': '航空移动卫星(OR)业务',

  // 广播业务
  'Broadcasting': '广播业务',
  'Broadcasting Satellite': '广播卫星业务',
  'Broadcasting-satellite': '广播卫星业务',

  // 无线电导航/定位
  'Radionavigation': '无线电导航业务',
  'Radionavigation Satellite': '无线电导航卫星业务',
  'Radionavigation-satellite': '无线电导航卫星业务',
  'Radio Location': '无线电定位业务',
  'Radiolocation': '无线电定位业务',
  'Radiolocation Satellite': '无线电定位卫星业务',
  'Radiolocation-satellite': '无线电定位卫星业务',
  'Radio Astronomy': '射电天文业务',
  'Radio astronomy': '射电天文业务',

  // 标准频率/时间信号
  'Standard Frequency and Time Signal': '标准频率和时间信号业务',
  'Standard Frequency and Time Signal Satellite': '标准频率和时间信号卫星业务',
  'Standard frequency and time signal': '标准频率和时间信号业务',
  'Standard frequency and time signal-satellite': '标准频率和时间信号卫星业务',

  // 气象/地球探测
  'Meteorological Aids': '气象辅助业务',
  'Meteorological aids': '气象辅助业务',
  'Meteorological Satellite': '气象卫星业务',
  'Meteorological-satellite': '气象卫星业务',
  'Earth Exploration Satellite': '地球探测卫星业务',
  'Earth exploration-satellite': '地球探测卫星业务',
  'Earth Exploration-satellite': '地球探测卫星业务',

  // 业余业务
  'Amateur': '业余业务',
  'Amateur Satellite': '业余卫星业务',
  'Amateur-satellite': '业余卫星业务',

  // 安全/遇险
  'Maritime Radionavigation': '水上无线电导航业务',
  'Maritime radionavigation': '水上无线电导航业务',
  'Maritime Radionavigation Satellite': '水上无线电导航卫星业务',
  'Maritime radionavigation-satellite': '水上无线电导航卫星业务',
  'Aeronautical Radionavigation': '航空无线电导航业务',
  'Aeronautical radionavigation': '航空无线电导航业务',
  'Aeronautical Radionavigation Satellite': '航空无线电导航卫星业务',
  'Aeronautical radionavigation-satellite': '航空无线电导航卫星业务',

  // 空间相关
  'Space Operation': '空间操作业务',
  'Space operation': '空间操作业务',
  'Space Research': '空间研究业务',
  'Space research': '空间研究业务',
  'Inter-satellite': '星间业务',
  'Inter-Satellite': '星间业务',

  // 其他
  'ISM': '工业、科学和医疗',
  'Non-specific': '未指定',
};

// Region/country name translations
const regionTranslations: Record<string, { name: string; region: string }> = {
  'itu1': { name: 'ITU 区域 1（欧洲、非洲）', region: 'ITU-1' },
  'itu2': { name: 'ITU 区域 2（美洲）', region: 'ITU-2' },
  'itu3': { name: 'ITU 区域 3（亚太）', region: 'ITU-3' },
  'eu': { name: '欧盟', region: 'ITU-1' },
  'us': { name: '美国', region: 'ITU-2' },
  'ca': { name: '加拿大', region: 'ITU-2' },
  'gb': { name: '英国', region: 'ITU-1' },
  'de': { name: '德国', region: 'ITU-1' },
  'fr': { name: '法国', region: 'ITU-1' },
  'it': { name: '意大利', region: 'ITU-1' },
  'es': { name: '西班牙', region: 'ITU-1' },
  'pt': { name: '葡萄牙', region: 'ITU-1' },
  'nl': { name: '荷兰', region: 'ITU-1' },
  'be': { name: '比利时', region: 'ITU-1' },
  'lu': { name: '卢森堡', region: 'ITU-1' },
  'dk': { name: '丹麦', region: 'ITU-1' },
  'se': { name: '瑞典', region: 'ITU-1' },
  'fi': { name: '芬兰', region: 'ITU-1' },
  'no': { name: '挪威', region: 'ITU-1' },
  'is': { name: '冰岛', region: 'ITU-1' },
  'ie': { name: '爱尔兰', region: 'ITU-1' },
  'at': { name: '奥地利', region: 'ITU-1' },
  'ch': { name: '瑞士', region: 'ITU-1' },
  'pl': { name: '波兰', region: 'ITU-1' },
  'cz': { name: '捷克', region: 'ITU-1' },
  'sk': { name: '斯洛伐克', region: 'ITU-1' },
  'hu': { name: '匈牙利', region: 'ITU-1' },
  'ro': { name: '罗马尼亚', region: 'ITU-1' },
  'bg': { name: '保加利亚', region: 'ITU-1' },
  'hr': { name: '克罗地亚', region: 'ITU-1' },
  'si': { name: '斯洛文尼亚', region: 'ITU-1' },
  'rs': { name: '塞尔维亚', region: 'ITU-1' },
  'me': { name: '黑山', region: 'ITU-1' },
  'ba': { name: '波黑', region: 'ITU-1' },
  'mk': { name: '北马其顿', region: 'ITU-1' },
  'al': { name: '阿尔巴尼亚', region: 'ITU-1' },
  'gr': { name: '希腊', region: 'ITU-1' },
  'tr': { name: '土耳其', region: 'ITU-1' },
  'cy': { name: '塞浦路斯', region: 'ITU-1' },
  'mt': { name: '马耳他', region: 'ITU-1' },
  'ee': { name: '爱沙尼亚', region: 'ITU-1' },
  'lv': { name: '拉脱维亚', region: 'ITU-1' },
  'lt': { name: '立陶宛', region: 'ITU-1' },
  'ua': { name: '乌克兰', region: 'ITU-1' },
  'md': { name: '摩尔多瓦', region: 'ITU-1' },
  'ru': { name: '俄罗斯', region: 'ITU-1' },
  'by': { name: '白俄罗斯', region: 'ITU-1' },
  'az': { name: '阿塞拜疆', region: 'ITU-1' },
  'ge': { name: '格鲁吉亚', region: 'ITU-1' },
  'li': { name: '列支敦士登', region: 'ITU-1' },
  'xk': { name: '科索沃', region: 'ITU-1' },
  'ad': { name: '安道尔', region: 'ITU-1' },
  'bo': { name: '波黑', region: 'ITU-1' },
  'ci': { name: '科特迪瓦', region: 'ITU-1' },
  'fm': { name: '密克罗尼西亚', region: 'ITU-3' },
  'kr': { name: '韩国', region: 'ITU-3' },
  'mo': { name: '中国澳门', region: 'ITU-3' },
  'mn': { name: '蒙古', region: 'ITU-3' },
  'sg': { name: '新加坡', region: 'ITU-3' },
  'sn': { name: '塞内加尔', region: 'ITU-1' },
};

export function translateService(name: string): string {
  // Try exact match first
  if (serviceTranslations[name]) return serviceTranslations[name];
  // Try case-insensitive
  const key = Object.keys(serviceTranslations).find(
    k => k.toLowerCase() === name.toLowerCase()
  );
  if (key) return serviceTranslations[key];
  return name;
}

export function translateRegion(code: string): { name: string; region: string } {
  return regionTranslations[code.toLowerCase()] ?? { name: code.toUpperCase(), region: '' };
}
