import Layout from "../../components/layout";
import {Content} from "../../lib/content";
import { ThemeProvider } from '@material-ui/core/styles';
import theme from "../../styles/theme";

const content = Content.getInstance(process.env.GITHUB_API_PERSONAL_ACCESS_TOKEN, process.env.GITHUB_REPO);

export default function Item({contentData, categories}) {
    return (
        <ThemeProvider theme={theme}>
            <Layout title="Next Sample" categories={categories}>
                <div dangerouslySetInnerHTML={{__html: contentData}} />
            </Layout>
        </ThemeProvider>
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