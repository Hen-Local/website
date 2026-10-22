import { pageMetadata } from "../../../i18n/metadata";
import { defaultLocale } from "../../../i18n/routing";
import ContactPage from "../../components/ContactPage";

export const metadata = pageMetadata(defaultLocale, "contact");
export default function Page() { return <ContactPage />; }
