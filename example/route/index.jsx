import React from 'react'
import { Route, IndexRedirect } from 'react-router'
import App from '../component/app'
import ArticleList from '../component/article-list'

const routes = (
  <Route path="/" component={App}>
    <IndexRedirect to="article-list/" />
    <Route path="article-list/" component={ArticleList} />
  </Route>
)

export default routes
