
import Image from "next/image";
import Header from "./_components/header";
import SearchInput from "./_components/search-input";
import banner from "../public/banner.png";
import BookingItem from "./_components/booking-item";

const Home = () => {
  return (
    <main>
      <Header />
      <div className="px-5 space-y-4">
        <SearchInput />
        <Image src={banner} alt="Agende agora!" sizes="100vw" className="h-auto w-full"/>
        <h2 className="text-xs text-foreground font-semibold uppercase">Agendamentos</h2>
        <BookingItem
          serviceName="Corte de cabelo"
          barbershopName="Barbearia XYZ"
          barbershopImageUrl="https://utfs.io/f/5832df58-cfd7-4b3f-b102-42b7e150ced2-16r.png"
          status="Agendado"
          date={new Date()}
        />
      </div>
    </main>
  );
}

export default Home;