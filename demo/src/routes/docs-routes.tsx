import DocsCliPage from "@/pages/docs/CliPage";
import DocsConnectingApiPage from "@/pages/docs/ConnectingApiPage";
import DocsCustomizationPage from "@/pages/docs/CustomizationPage";
import DocsFrameworksPage from "@/pages/docs/FrameworksPage";
import DocsGettingStartedPage from "@/pages/docs/GettingStartedPage";
import DocsIntroductionPage from "@/pages/docs/IntroductionPage";
import DocsPublishingPage from "@/pages/docs/PublishingPage";
import DocsThemingPage from "@/pages/docs/ThemingPage";
import { DocsLayout } from "@/layouts/DocsLayout";
import { Route } from "react-router-dom";

export const zenPanelDocsRoute = (
  <Route path="/docs" element={<DocsLayout />}>
    <Route index element={<DocsIntroductionPage />} />
    <Route path="getting-started" element={<DocsGettingStartedPage />} />
    <Route path="cli" element={<DocsCliPage />} />
    <Route path="frameworks" element={<DocsFrameworksPage />} />
    <Route path="customization" element={<DocsCustomizationPage />} />
    <Route path="theming" element={<DocsThemingPage />} />
    <Route path="connecting-api" element={<DocsConnectingApiPage />} />
    <Route path="publishing" element={<DocsPublishingPage />} />
  </Route>
);
