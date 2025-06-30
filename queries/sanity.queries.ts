

export const CATEGORIES_WITH_IMAGES_QUERY = groq`
  *[_type == "category"] | order(order asc) {
    _id,
    title,
    description,

    
    "titleImageUrl": titleImage.asset->url,
    "mobileTitleImageUrl" : mobileTitleImage.asset->url,

    "images": *[_type == "photo" && references(^._id)]{
      _id,
      "url": image.asset->url,
      "mobileUrl" : mobileImage.asset->url,
      title,
      description,
      "width": image.asset->metadata.dimensions.width,
      "height": image.asset->metadata.dimensions.height
    },
    "packages": *[_type == "package" && references(^._id)]{
      _id,
      title,
      price,
      features,
      category->{
        _id,
        title
      }
  }
}`


export const CONTACT_QUERY = groq`
  *[_type == "contact"][0]{
    _id,
    fullName,
    email,
    phone,
    socialLinks[]{
      platform,
      url
    }
  }
`