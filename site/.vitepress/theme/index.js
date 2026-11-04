import DefaultTheme from 'vitepress/theme'
import ReadingTools from './components/ReadingTools.vue'
import Layout from './Layout.vue'
import HomePage from './components/HomePage.vue'
import LearningPaths from './components/LearningPaths.vue'
import LibraryPage from './components/LibraryPage.vue'
import NotebookPage from './components/NotebookPage.vue'
import BookshelfPage from './components/BookshelfPage.vue'
import './style.css'
import './editorial.css'
export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('ReadingTools', ReadingTools)
    for (const [name, component] of Object.entries({
      HomePage,
      LearningPaths,
      LibraryPage,
      NotebookPage,
      BookshelfPage
    }))
      app.component(name, component)
  }
}
