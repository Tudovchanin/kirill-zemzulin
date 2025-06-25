

export type CategoryName = 'Портреты' | 'Свадебные' | 'Пейзажи'
export type Slug = 'portraits' | 'weddings' | 'landscapes'


export type Image = {
  _id: string
  url: string
  title?: string
  description?: string
  width?: number
  height?: number
}

export type ImagesByCategory = {
  [key in Slug]?: Image[];
}


export type Package = {
  _id: string
  title: string,
  price: string,
  features?: string[]
}

export type Category = {
  _id: string
  title: CategoryName
  description?: string
  titleImageUrl:string
  images: Image[],
  packages: Package[],
}

export type SocialLink = {
  platform: 'Telegram' | 'WhatsApp' | 'Instagram' | 'VK'
  url: string
}

export type Contact = {
  _id: string
  fullName: string
  email?: string
  phone?: string
  socialLinks?: SocialLink[]
}


export type SeoMeta = {
  title: string
  description: string
  imageUrl: string
  ogType?: 'website' | 'article' | 'book' | 'profile' | 'music.song' | 'music.album' | 'music.playlist' | 'music.radio_status' | 'video.movie' | 'video.episode' | 'video.tv_show' | 'video.other'

  twitterCard?: 'summary_large_image' | 'summary' | 'app' | 'player'
}


