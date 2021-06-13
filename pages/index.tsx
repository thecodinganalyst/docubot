import Layout from "../components/layout";
import {Content} from "../lib/content";
import { ThemeProvider } from '@material-ui/core/styles';
import theme from "../styles/theme"

const content = Content.getInstance(process.env.GITHUB_API_PERSONAL_ACCESS_TOKEN, process.env.GITHUB_REPO);

export default function Home({categories, title}) {
  return (
      <ThemeProvider theme={theme}>
          <Layout title={title} categories={categories}>
            Hello World!
          </Layout>
      </ThemeProvider>
  )
}

export async function getStaticProps(context){
    const categories = await content.getNavigation()
    const title = content.getTitle()
    return {
        props: {categories, title}
    }
}