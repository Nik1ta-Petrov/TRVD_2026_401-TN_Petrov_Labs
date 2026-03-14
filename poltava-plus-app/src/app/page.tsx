import { BackgroundPaths } from "@/components/home/background-paths";
import { NewsSection } from "@/components/news/news-sectiont"; 

export default function Home() {
  return (
    <div className="flex flex-col gap-10 pb-20" >
      {/* HERO */}
      <BackgroundPaths title={"Вся Полтава.\nВ одному місці."} />
      {/* sECTIONT NEWS */}
      <NewsSection />
    </div>
  );
}