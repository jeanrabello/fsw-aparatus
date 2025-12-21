import { prisma } from "@/lib/prisma";
import BarbershopItem from "@/app/_components/barbershop-item";
import Header from "@/app/_components/header";
import Footer from "@/app/_components/footer";
import SearchInput from "@/app/_components/search-input";
import {
  PageContainer,
  PageSection,
  PageSectionTitle,
} from "@/app/_components/ui/page";
import Link from "next/link";
import { Button } from "@/app/_components/ui/button";
import { SearchX } from "lucide-react";

interface BarbershopsPageProps {
  searchParams: Promise<{
    search?: string;
  }>;
}

const BarbershopsPage = async (props: BarbershopsPageProps) => {
  const searchParams = await props.searchParams;
  const searchTerm = searchParams.search || "";

  // Query: busca barbearias com serviços que contenham o termo
  const barbershops = searchTerm
    ? await prisma.barbershop.findMany({
        where: {
          services: {
            some: {
              name: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
          },
        },
        orderBy: {
          name: "asc",
        },
      })
    : [];

  const hasResults = barbershops.length > 0;

  return (
    <main className="flex min-h-screen flex-col">
      <Header />

      <div className="flex-1">
        <PageContainer>
          <SearchInput />

          {searchTerm && (
            <PageSection>
              <PageSectionTitle>
                {hasResults
                  ? `Resultados para "${searchTerm}"`
                  : "Nenhum resultado encontrado"}
              </PageSectionTitle>

              {hasResults ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {barbershops.map((barbershop) => (
                    <BarbershopItem key={barbershop.id} barbershop={barbershop} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 py-12 text-center">
                  <SearchX className="text-muted-foreground size-12" />
                  <p className="text-muted-foreground text-sm">
                    Nenhuma barbearia encontrada para "{searchTerm}"
                  </p>
                  <Button variant="outline" className="rounded-full" asChild>
                    <Link href="/">Voltar para o início</Link>
                  </Button>
                </div>
              )}
            </PageSection>
          )}

          {!searchTerm && (
            <PageSection>
              <p className="text-muted-foreground text-center text-sm">
                Digite um serviço ou clique em um dos botões acima para buscar
                barbearias
              </p>
            </PageSection>
          )}
        </PageContainer>
      </div>

      <Footer />
    </main>
  );
};

export default BarbershopsPage;
