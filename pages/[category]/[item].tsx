import Layout from "../../components/layout";
import {Content} from "../../lib/content";

const content = Content.getInstance(process.env.GITHUB_API_PERSONAL_ACCESS_TOKEN, process.env.GITHUB_REPO);

export default function Item({contentData, categories}) {
    return (
        <Layout title="Next Sample" categories={categories}>
            <div dangerouslySetInnerHTML={{__html: contentData}} />
        </Layout>
    );
}

export async function getStaticPaths(){
    const paths = await content.getPaths();
    return {
        paths,
        fallback: false
    }
}

export async function getStaticProps(context){
    const contentData = await content.getContentData(context.params.category, context.params.item);
    const categories = await content.getNavigation();
    return {
        props: {contentData, categories}
    }
}