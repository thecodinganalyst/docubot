import Layout from "../components/layout";
import {getNavigation} from "../lib/content";

export default function Home({categories}) {
  return (
      <Layout title="Next Sample" categories={categories}>
        Hello World!
      </Layout>
  )
}

export async function getStaticProps(context){
    const categories = await getNavigation()
    return {
        props: {categories}
    }
}