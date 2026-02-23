export const Footer = ({ lastUpdate }: { lastUpdate?: Date | string }) => {
  return (
    <footer className="mt-12 text-center text-xs text-muted-foreground">
      Questo sito è un progetto indipendente e non ufficiale. I dati dei
      calendari sono di proprietà di PGS (Polisportive Giovanili Salesiane),
      recuperati tramite file excel reso disponbile dagli stessi. L&apos;autore
      non si assume responsabilità per eventuali inesattezze o cambiamenti di
      orario non riportati. Consultare sempre il portale ufficiale per le
      comunicazioni formali.
      <span className="block mt-2 font-bold">
        Last updated:{" "}
        {lastUpdate ? new Date(lastUpdate).toLocaleString("it-IT") : "N/A"}
      </span>
    </footer>
  );
};
