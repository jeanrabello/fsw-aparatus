import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Header from "@/app/_components/header";
import Footer from "@/app/_components/footer";
import BookingItem from "@/app/_components/booking-item";

const BookingsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/");
  }

  const bookings = await prisma.booking.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      service: true,
      barbershop: true,
    },
    orderBy: {
      date: "desc",
    },
  });

  const now = new Date();

  const confirmedBookings = bookings.filter(
    (booking) => booking.date > now && !booking.cancelled,
  );

  const finishedBookings = bookings.filter(
    (booking) => booking.date <= now || booking.cancelled,
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <div className="flex-1">
        <div className="px-5 pt-6">
          <h1 className="text-[20px] font-bold">Agendamentos</h1>
        </div>

        <div className="flex flex-col gap-3 px-5 pt-6">
          <h2 className="text-xs font-bold uppercase">CONFIRMADOS</h2>
          {confirmedBookings.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Nenhum agendamento confirmado.
            </p>
          ) : (
            confirmedBookings.map((booking) => (
              <BookingItem
                key={booking.id}
                serviceName={booking.service.name}
                barbershopName={booking.barbershop.name}
                barbershopImageUrl={booking.barbershop.imageUrl}
                status="CONFIRMADO"
                date={booking.date}
              />
            ))
          )}
        </div>

        <div className="flex flex-col gap-3 px-5 pt-6">
          <h2 className="text-xs font-bold uppercase">FINALIZADOS</h2>
          {finishedBookings.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Nenhum agendamento finalizado.
            </p>
          ) : (
            finishedBookings.map((booking) => (
              <BookingItem
                key={booking.id}
                serviceName={booking.service.name}
                barbershopName={booking.barbershop.name}
                barbershopImageUrl={booking.barbershop.imageUrl}
                status="FINALIZADO"
                date={booking.date}
              />
            ))
          )}
        </div>
      </div>

      <div className="pt-[60px]">
        <Footer />
      </div>
    </div>
  );
};

export default BookingsPage;
