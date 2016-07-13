import { Model, HttpModel } from '../../src'
import uiRoute from './ui-route'
import dataRoute from './data-route'

const uiModel = new Model(uiRoute)
const dataModel = new HttpModel(dataRoute)

export { uiModel, dataModel }
