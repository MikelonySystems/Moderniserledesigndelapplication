import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface InfoCardProps {
  title: string;
  mainAmount?: string;
  items: {
    label: string;
    value: string;
  }[];
}

export function InfoCard({ title, mainAmount, items }: InfoCardProps) {
  return (
    <Card className="border-0 shadow-sm h-full flex flex-col">
      <CardHeader className="pb-0">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between pt-0">
        {mainAmount && (
          <>
            <div>
              <p className="text-2xl text-primary mb-4">{mainAmount}</p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              {items.map((item, index) => (
                <div key={index} className="space-y-1">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-sm">{item.value}</p>
                </div>
              ))}
            </div>
          </>
        )}
        {!mainAmount && (
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <span className="text-sm">{item.value}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
