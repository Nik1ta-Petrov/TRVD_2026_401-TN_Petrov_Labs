import { BackgroundPaths } from "@/components/home/background-paths";
import { NewsSection } from "@/components/NewsSection/news-sectiont";

export default function Home() {
    return (
        <div className="flex flex-col gap-10 pb-20 relative">
            {/* HERO SECTION */}
            <BackgroundPaths title={"Вся Полтава.\nВ одному місці."} />
            {/* SECTION NEWS */}
            <NewsSection />
        </div>
    );
}
