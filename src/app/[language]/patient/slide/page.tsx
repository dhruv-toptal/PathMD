import type { Metadata } from "next";
import { getServerTranslation } from "@/services/i18n";
import Projects from "./page-content";

type Props = {
  params: { language: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { t } = await getServerTranslation(
    params.language,
    "admin-panel-users"
  );

  return {
    title: t("title"),
  };
}

export default Projects;

// export default (
//   <Annotorious>
//     <OpenSeadragonAnnotator>
//       <Projects />
//       {/* <OpenSeadragonViewer options={{
//     tileSources: {
//       type: 'image',
//       url: '/images/sample-image.jpg'
//     }
//   }} /> */}
//     </OpenSeadragonAnnotator>
//   </Annotorious>
// );
// export default ;
