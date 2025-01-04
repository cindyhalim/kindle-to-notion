import fetch from 'node-fetch'
import { config } from 'src/environment'

const PRIORITY_DISPLAY_LINKS = [
  'vk.com',
  'vdoc.pub',
  'z-epub.com',
  'www.5epub.com',
]

type SearchResponse = {
  items: {
    link: string
    displayLink: string
  }[]
}
export default async function getEpubLink({
  title,
  author,
}: {
  title: string
  author: string
}): Promise<string | null> {
  if (!title || !author) {
    throw new Error('Missing arguments')
  }

  const searchInputText = `${title} ${author} "epub" free`.toLowerCase()
  const queryParam = encodeURIComponent(searchInputText)
  const apiKey = config.googleSearch.apiKey
  const customSearchEngineId = config.googleSearch.customSearchEngineId
  const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${customSearchEngineId}&q=${queryParam}`

  try {
    const response = await fetch(searchUrl)
    const searchResponse = (await response.json()) as SearchResponse

    return sortSearchResults(searchResponse.items, PRIORITY_DISPLAY_LINKS).map(
      (item) => item.link
    )[0]
  } catch (e) {
    throw Error('Error retrieving epub link', e)
  }
}

function sortSearchResults(
  searchResults: SearchResponse['items'],
  orderedDisplayLinks: string[]
) {
  const orderMap = new Map<string, number>()
  orderedDisplayLinks.forEach((link, idx) => orderMap.set(link, idx))

  return searchResults.sort((a, b) => {
    const aRank = orderMap.get(a.displayLink) ?? Infinity // Use Infinity for missing values
    const bRank = orderMap.get(b.displayLink) ?? Infinity // Use Infinity for missing values
    return aRank - bRank
  })
}
