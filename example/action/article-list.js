import { uiModel, dataModel } from '../model'

export async function loadProps() {
  const { pageInfo } = uiModel.get('articleList')
  const { pageNum, pageSize } = pageInfo
  const articles = await dataModel.get('articles')
  return {
    articles: articles.slice((pageNum - 1) * pageSize, pageNum * pageSize),
    pageInfo,
    totalSize: articles.length,
  }
}

export function changePageInfo(newPageInfo) {
  const pageInfo = uiModel.get(['articleList', 'pageInfo'])
  uiModel.set(['articleList', 'pageInfo'], { ...pageInfo, ...newPageInfo })
}
