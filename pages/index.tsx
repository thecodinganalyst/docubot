import Layout from "../components/layout";
import {Content} from "../lib/content";

const content = Content.getInstance(process.env.GITHUB_API_PERSONAL_ACCESS_TOKEN, process.env.GITHUB_REPO);

export default function Home({categories}) {
  return (
      <Layout title="Next Sample" categories={categories}>
        Hello World!
      </Layout>
  )
}

export async function getStaticProps(context){
    const categories = await content.getNavigation()
    return {
        props: {categories}
    }
}