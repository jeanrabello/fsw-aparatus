import Image from "next/image";
import { headers } from "next/headers";
import Header from "./_components/header";
import SearchInput from "./_components/search-input";
import banner from "../public/banner.png";
import BookingItem from "./_components/booking-item";
import { BookingInfoSheet } from "./_components/booking-info-sheet";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import BarbershopItem from "./_components/barbershop-item";
import Footer from "./_components/footer";
import {
  PageContainer,
  PageSection,
  PageSectionScroller,
  PageSectionTitle,
} from "./_components/ui/page";

const Home = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const recommendedBarbershops = await prisma.barbershop.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const popularBarbershops = await prisma.barbershop.findMany({
    orderBy: {
      name: "desc",
    },
  });

  // Buscar agendamentos confirmados apenas se o usuário estiver logado
  const now = new Date();
  const confirmedBookings = session?.user
    ? await prisma.booking.findMany({
        where: {
          userId: session.user.id,
          date: { gt: now },
          cancelled: false,
        },
        include: {
          service: true,
          barbershop: true,
        },
        orderBy: {
          date: "asc",
        },
      })
    : [];

  return (
    <main>
      <Header />
      <PageContainer>
        <SearchInput />
        <Image
          src={banner}
          alt="Agende agora!"
          sizes="100vw"
          className="h-auto w-full"
        />
        {confirmedBookings.length > 0 && (
          <PageSection>
            <PageSectionTitle>Agendamentos</PageSectionTitle>
            <PageSectionScroller>
              {confirmedBookings.map((booking) => (
                <BookingInfoSheet key={booking.id} booking={booking}>
                  <BookingItem
                    serviceName={booking.service.name}
                    barbershopName={booking.barbershop.name}
                    barbershopImageUrl={booking.barbershop.imageUrl}
                    status="CONFIRMADO"
                    date={booking.date}
                  />
                </BookingInfoSheet>
              ))}
            </PageSectionScroller>
          </PageSection>
        )}

        <PageSection>
          <PageSectionTitle>Recomendados</PageSectionTitle>
          <PageSectionScroller>
            {recommendedBarbershops.map((barbershop) => (
              <BarbershopItem key={barbershop.id} barbershop={barbershop} />
            ))}
          </PageSectionScroller>
        </PageSection>

        <PageSection>
          <PageSectionTitle>Populares</PageSectionTitle>
          <PageSectionScroller>
            {popularBarbershops.map((barbershop) => (
              <BarbershopItem key={barbershop.id} barbershop={barbershop} />
            ))}
          </PageSectionScroller>
        </PageSection>
      </PageContainer>
      <Footer />
    </main>
  );
};

export default Home;
