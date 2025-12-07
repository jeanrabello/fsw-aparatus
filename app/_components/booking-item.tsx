import { Avatar, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";

interface BookingItemProps {
  // Define any props needed for the BookingItem component
  serviceName: string;
  barbershopName: string;
  barbershopImageUrl: string;
  status: string;
  date: Date;
}

const BookingItem: React.FC<BookingItemProps> = ({
  serviceName,
  barbershopName,
  barbershopImageUrl,
  status,
  date,
}) => {
  const badgeClassName =
    status === "CONFIRMADO"
      ? "bg-primary/10 text-primary border-transparent"
      : "bg-muted-foreground/10 text-muted-foreground border-transparent";

  return (
    <Card className="flex w-full min-w-full flex-row items-center justify-between p-0">
      {/* LEFT */}
      <div className="flex flex-1 flex-col gap-4 p-4">
        <Badge className={badgeClassName}>{status}</Badge>
        <div className="flex flex-col gap-2">
          <p className="font-bold">{serviceName}</p>
          <div className="5 flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={barbershopImageUrl} alt={barbershopName} />
            </Avatar>
            <p className="text-muted-foreground text-sm">{barbershopName}</p>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="border-left flex h-full flex-col items-center justify-center border-l p-4 py-3">
        <p className="text-xs capitalize">
          {date.toLocaleDateString("pt-BR", { month: "long" })}
        </p>
        <p>{date.toLocaleDateString("pt-BR", { day: "2-digit" })}</p>
        <p className="cap text-xs">
          {date.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </Card>
  );
};

export default BookingItem;
