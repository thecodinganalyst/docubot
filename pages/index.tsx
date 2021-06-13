import Layout from "../components/layout";
import {Content} from "../lib/content";
import { ThemeProvider } from '@material-ui/core/styles';
import theme from "../styles/theme"

const content = Content.getInstance(process.env.GITHUB_API_PERSONAL_ACCESS_TOKEN, process.env.GITHUB_REPO);

export default function Home({categories, title, indexContent}) {
  return (
      <ThemeProvider theme={theme}>
          <Layout title={title} categories={categories}>
              <div dangerouslySetInnerHTML={{__html: indexContent}} />
          </Layout>
      </ThemeProvider>
  )
}

export async function getStaticProps(context){
    const categories = await content.getNavigation()
    const title = content.getTitle()
    const indexContent = await content.getIndexPageContent()
    return {
        props: {categories, title, indexContent}
    }
}