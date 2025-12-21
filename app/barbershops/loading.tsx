import Header from "@/app/_components/header";
import Footer from "@/app/_components/footer";
import SearchInput from "@/app/_components/search-input";
import {
  PageContainer,
  PageSection,
} from "@/app/_components/ui/page";

export default function BarbershopsLoading() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />

      <div className="flex-1">
        <PageContainer>
          <SearchInput />

          <PageSection>
            <div className="bg-muted h-4 w-48 animate-pulse rounded" />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-muted h-[200px] w-full animate-pulse rounded-xl"
                />
              ))}
            </div>
          </PageSection>
        </PageContainer>
      </div>

      <Footer />
    </main>
  );
}
